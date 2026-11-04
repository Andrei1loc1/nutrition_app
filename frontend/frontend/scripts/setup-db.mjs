import { randomUUID } from "node:crypto";
import { closeSync, existsSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const root = fileURLToPath(new URL("../", import.meta.url));

function readEnv(path) {
  return existsSync(path) ? parseEnv(readFileSync(path, "utf8")) : {};
}

function validateUrl(value, key, protocols) {
  try {
    const url = new URL(value);
    if (!url.hostname || !protocols.includes(url.protocol)) throw new Error();
  } catch {
    throw new Error(`${key} nu este un URL de baza de date valid.`);
  }
}

function save(path, value) {
  writeFileSync(`${path}.tmp`, value, { mode: 0o600 });
  renameSync(`${path}.tmp`, path);
}

function updateEnv(text, values) {
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${JSON.stringify(value)}`;
    const pattern = new RegExp(`^(?:export\\s+)?\\s*${key}\\s*=.*$`, "gm");
    text = pattern.test(text)
      ? text.replace(pattern, () => line)
      : `${text}${text && !text.endsWith("\n") ? "\n" : ""}${line}\n`;
  }
  return text;
}

function runPrisma(args, env, directory) {
  const cli = join(directory, "node_modules/prisma/build/index.js");
  if (!existsSync(cli)) throw new Error("Lipsesc dependentele. Ruleaza npm.cmd ci mai intai.");
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: directory, env, encoding: "utf8", timeout: 180_000,
  });
  // Do not echo CLI output: connection errors can contain credentials.
  if (result.error || result.status !== 0) {
    throw new Error(`prisma ${args.join(" ")} a esuat. Conexiunea ramane salvata; verifica accesul la baza si reincearca. Pentru diagnostic local: npx.cmd prisma ${args.join(" ")}.`);
  }
}

export async function setupDatabase({
  directory = root, create = false, environment = process.env,
  fetchImpl = fetch, runPrisma: run = runPrisma, log = console.log,
} = {}) {
  const lockPath = join(directory, ".env.db-setup.lock");
  let lock;
  try {
    lock = openSync(lockPath, "wx", 0o600);
  } catch {
    throw new Error("Setup blocat: verifica daca alt setup ruleaza. Daca nu, elimina manual .env.db-setup.lock si reincearca.");
  }
  try {
    const envPath = join(directory, ".env");
    const statePath = join(directory, ".env.db-setup.json");
    const text = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
    const current = parseEnv(text);
    const settings = {
      ...readEnv(join(directory, "env.setup")),
      ...readEnv(join(directory, ".env.setup")),
      ...environment,
    };
    // Next.js overrides .env with these files; don't silently configure a different database.
    for (const name of [".env.local", ".env.development", ".env.development.local"]) {
      const overrides = readEnv(join(directory, name));
      if (overrides.DATABASE_URL || overrides.DIRECT_URL) {
        throw new Error(`Muta DATABASE_URL/DIRECT_URL din ${name} in .env inainte de setup.`);
      }
    }
    if ((environment.DATABASE_URL && environment.DATABASE_URL !== current.DATABASE_URL) ||
        (environment.DIRECT_URL && environment.DIRECT_URL !== current.DIRECT_URL)) {
      throw new Error("DATABASE_URL/DIRECT_URL din mediul terminalului difera de .env; elimina suprascrierea inainte de setup.");
    }

    let urls = { DATABASE_URL: current.DATABASE_URL, DIRECT_URL: current.DIRECT_URL };
    if (create || !urls.DATABASE_URL) {
      let state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : null;
      if (!state) {
        if (current.DATABASE_URL && existsSync(join(directory, ".env.before-db-setup"))) {
          throw new Error("Exista deja .env.before-db-setup. Pastreaza-l in alta locatie sigura inainte de a inlocui din nou conexiunea.");
        }
        if (!settings.PRISMA_SERVICE_TOKEN?.trim()) {
          throw new Error("Lipseste PRISMA_SERVICE_TOKEN din .env.setup (sau env.setup).");
        }
        const logicalId = `nutritrack-${randomUUID()}`;
        save(statePath, JSON.stringify({ logicalId, status: "creating" }));
        let response;
        try {
          response = await fetchImpl("https://api.prisma.io/v1/projects", {
            method: "POST", redirect: "error", signal: AbortSignal.timeout(60_000),
            headers: { Authorization: `Bearer ${settings.PRISMA_SERVICE_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: "NeuroSnap Vision", region: "eu-west-3", createDatabase: true, logicalId }),
          });
        } catch {
          throw new Error("Cererea Prisma nu a putut fi confirmata. Verifica Prisma Console inainte de alta creare; starea a fost pastrata pentru a evita duplicatele.");
        }
        if (!response.ok) {
          if ([400, 401, 403, 422, 429].includes(response.status)) unlinkSync(statePath);
          throw new Error(`Prisma API: HTTP ${response.status}. Verifica tokenul, permisiunile si limitele contului in Prisma Console.`);
        }
        try {
          state = { logicalId, status: "created", project: await response.json() };
          save(statePath, JSON.stringify(state));
        } catch {
          throw new Error("Raspunsul crearii nu a putut fi salvat. Verifica Prisma Console; nu repeta crearea fara verificare.");
        }
      }
      if (state.status !== "created") {
        throw new Error("Exista o creare neconfirmata. Verifica Prisma Console folosind logicalId din .env.db-setup.json; nu cream o baza duplicata.");
      }
      const project = state.project?.data;
      const db = project?.database;
      const connection = db?.connections?.find((item) => item.endpoints?.pooled?.connectionString);
      urls = {
        DATABASE_URL: connection?.endpoints?.pooled?.connectionString,
        DIRECT_URL: connection?.endpoints?.direct?.connectionString,
      };
      if (!urls.DATABASE_URL || !urls.DIRECT_URL) {
        throw new Error("Prisma a creat proiectul, dar nu a returnat conexiunile asteptate. Verifica Prisma Console; raspunsul este pastrat privat in .env.db-setup.json.");
      }
      validateUrl(urls.DATABASE_URL, "DATABASE_URL", ["postgres:", "postgresql:"]);
      validateUrl(urls.DIRECT_URL, "DIRECT_URL", ["postgres:", "postgresql:"]);
      if (current.DATABASE_URL && current.DATABASE_URL !== urls.DATABASE_URL) {
        writeFileSync(join(directory, ".env.before-db-setup"), text, { flag: "wx", mode: 0o600 });
      }
      save(envPath, updateEnv(text, urls));
      log("Conexiunea Prisma Postgres a fost salvata in .env. Conexiunea veche, daca exista, are backup in .env.before-db-setup.");
    } else {
      log("Reutilizam baza din .env; nu cream alta baza online.");
    }

    validateUrl(urls.DATABASE_URL, "DATABASE_URL", ["postgres:", "postgresql:", "prisma:", "prisma+postgres:"]);
    if (urls.DIRECT_URL) validateUrl(urls.DIRECT_URL, "DIRECT_URL", ["postgres:", "postgresql:"]);
    const env = { ...environment, ...current, ...urls };
    if (!env.DIRECT_URL) delete env.DIRECT_URL;
    delete env.PRISMA_SERVICE_TOKEN;
    log("Aplicam migrarile existente (fara resetarea bazei)...");
    await run(["migrate", "deploy"], env, directory);
    await run(["generate"], env, directory);
    log("Baza este pregatita. Reporneste frontendul daca era deja deschis. Prisma Postgres nu necesita un server local separat.");
  } finally {
    closeSync(lock);
    unlinkSync(lockPath);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.slice(2).some((arg) => arg !== "--create")) {
    console.error("Utilizare: node scripts/setup-db.mjs [--create]");
    process.exitCode = 1;
  } else {
    setupDatabase({ create: process.argv.includes("--create") }).catch((error) => {
      // Unexpected filesystem/JSON errors must not echo file contents or secrets.
      console.error(error instanceof SyntaxError ? "Fisier de stare invalid; verifica .env.db-setup.json local." : error.message);
      process.exitCode = 1;
    });
  }
}
