# NeuroSnap Vision — instalare și pornire locală

Instrucțiuni pentru un calculator fără dependențele proiectului, folosind **Windows și PowerShell**. Frontendul și backendul rulează local; baza de date și stocarea imaginilor pot fi servicii externe.

## 1. Programe necesare

- **Node.js 24 LTS**, cu npm: https://nodejs.org/
- **Python 3.11, 64-bit**, cu pip și Python Launcher (`py`): https://www.python.org/downloads/windows/
- Un cont **Prisma** și un **Service Token** pentru crearea automată a bazei Prisma Postgres online; alternativ, o conexiune PostgreSQL sau Accelerate existentă.
- Un token **Vercel Blob** dacă dorești încărcarea imaginilor în acest serviciu.

După instalare, redeschide PowerShell și verifică:

```powershell
node --version
npm.cmd --version
py -3.11 --version
```

Comenzile de mai jos pornesc din directorul principal al proiectului, cu structura:

```text
README.md
backend/
  backend/
    main.py
    requirements.txt
    models/
frontend/
  frontend/
    package.json
    package-lock.json
    prisma/
```

Nu elimina nivelurile duble de directoare fără să adaptezi comenzile.

## 2. Backend — prima instalare și pornire

Deschide **primul terminal** în directorul principal:

```powershell
cd .\backend\backend
py -3.11 -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Lasă terminalul deschis. Nu este necesară activarea mediului virtual; comenzile folosesc direct Python din `venv`, evitând restricțiile PowerShell pentru scriptul de activare.

- Verificare: http://127.0.0.1:8000/
- Documentație API: http://127.0.0.1:8000/docs

TensorFlow și modelul AI pot necesita timp la instalare și la prima pornire. Backendul trebuie pornit din `backend/backend`, deoarece încarcă fișierele din `models/` folosind căi relative.

Directorul `models/` trebuie să conțină toate cele șase fișiere livrate:

```text
class_names_101.json
mind_pattern_model.pkl
mind_score_config.json
model_final.keras
multi_agent_q_tables.json
nutrition_data.json
```

Fișierele modelului nu sunt descărcate automat de `pip`. Lista Python nu fixează versiunile dependențelor; o instalare nouă poate necesita verificarea compatibilității TensorFlow/Keras și scikit-learn cu modelele salvate.

## 3. Frontend — prima instalare și configurare

Deschide **al doilea terminal** în directorul principal:

```powershell
cd .\frontend\frontend
npm.cmd ci
npx.cmd prisma generate
notepad .env
```

Creează sau actualizează `frontend/frontend/.env` cu valorile tale, nu cu textele demonstrative:

```dotenv
BACKEND_URL="http://127.0.0.1:8000"
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
# Opțional, numai dacă folosești Vercel Blob:
# BLOB_READ_WRITE_TOKEN="TOKENUL_TAU_VERCEL_BLOB"
```

- `DATABASE_URL` și `DIRECT_URL`: sunt completate automat de scriptul din secțiunea 4. Dacă ai deja o bază, păstrează conexiunea existentă. Clientul suportă atât PostgreSQL direct (`postgres://` / `postgresql://`), cât și Accelerate (`prisma://` / `prisma+postgres://`).
- `BACKEND_URL`: adresa backendului Python. Aceasta are prioritate față de `NEXT_PUBLIC_BACKEND_URL` în rutele proxy.
- `NEXT_PUBLIC_BACKEND_URL`: setează aceeași adresă locală, nu adresa vechiului backend găzduit.
- `BLOB_READ_WRITE_TOKEN`: opțional local; dacă lipsește, imaginile sunt salvate în `frontend/frontend/public/uploads/scans/`. Este necesar pentru uploadurile Vercel Blob și pentru rularea pe Vercel. Nu folosi valoarea demonstrativă ca token real.

Înainte de prima utilizare, pregătește baza folosind secțiunea 4. Nu trebuie reinstalată la fiecare pornire.

Pornește frontendul:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1
```

Deschide http://127.0.0.1:3000/ și lasă ambele terminale deschise. După modificarea `.env`, repornește frontendul.

## 4. Crearea sau pregătirea automată a bazei online

În [Prisma Console](https://console.prisma.io/), selectează workspace-ul și deschide **Settings → Service Tokens → New Service Token**. Ai nevoie de permisiuni pentru crearea proiectelor în workspace. Tokenul nu este parola contului și nici cheia de conexiune Accelerate.

Din `frontend/frontend`, creează fișierul privat `.env.setup`:

```dotenv
PRISMA_SERVICE_TOKEN="TOKENUL_TAU_DE_ADMINISTRARE"
```

Apoi rulează:

```powershell
npm.cmd run db:setup
```

Comanda:

1. Reutilizează `DATABASE_URL` dacă este deja configurat în `.env`, fără să creeze altă bază.
2. Dacă lipsește conexiunea, creează un proiect Prisma Postgres în workspace-ul tokenului, în regiunea `eu-west-3`.
3. Salvează automat conexiunile pooled (`DATABASE_URL`) și directă (`DIRECT_URL`) în `.env`, păstrând celelalte setări.
4. Aplică migrările, inclusiv tabela utilizatorilor, și generează clientul Prisma.

**În copia actuală există deja o conexiune veche.** Dacă vrei explicit o bază nouă în contul tokenului, rulează în schimb:

```powershell
npm.cmd run db:create
```

Această comandă creează o bază goală și comută `.env` pe ea. Salvează mai întâi vechiul `.env` în `.env.before-db-setup`; nu șterge baza veche și nu copiază datele ei. Dacă backupul există deja și ar trebui înlocuit, scriptul se oprește în loc să-l suprascrie.

Crearea prin token este asociată direct contului, nu folosește baza temporară de 24 de ore de la `create-db`. Se aplică limitele și eventualele costuri ale planului Prisma. Baza este online/serverless: nu există o comandă locală separată de „pornire”; accesarea ei se face prin conexiunea salvată.

Scriptul acceptă și numele `env.setup` fără punct; `.env.setup` are prioritate. Nu expune tokenul în variabile `NEXT_PUBLIC_*`. Tokenul nu este transmis proceselor de migrare și nu este folosit de frontend la rulare.

`prisma.config.ts` este inclus în proiect și încarcă `.env`. Pentru o bază existentă poți introduce manual `DATABASE_URL` și, dacă ai o conexiune TCP directă pentru migrări, `DIRECT_URL`. Nu pune aceste variabile în `.env.local` sau alte fișiere Next.js care ar suprascrie `.env`: scriptul refuză configurațiile ambigue.

### Repornire și recuperare după erori

- La următoarele rulări, `db:setup` reutilizează baza. Chiar și repetarea `db:create` reutilizează proiectul deja înregistrat în fișierul de stare.
- Starea privată este salvată în `.env.db-setup.json` înainte de migrare. Dacă migrarea eșuează pentru că baza încă se pregătește sau există o problemă de rețea, reexecută `npm.cmd run db:setup`; nu se creează o bază nouă.
- Dacă cererea de creare are un rezultat neconfirmat, scriptul blochează o nouă creare pentru a evita duplicate și costuri. Verifică Prisma Console folosind `logicalId` din fișierul de stare. Dacă baza există, configurează manual conexiunile în `.env` și rulează `db:setup`. Elimină fișierul de stare numai după ce ai confirmat că proiectul nu a fost creat.
- Un lock `.env.db-setup.lock` împiedică două instalări simultane. Dacă procesul a fost închis forțat, elimină acel lock numai după ce ai verificat că nu mai rulează alt setup.
- O bază veche cu tabele create manual, fără istoricul corect Prisma, poate necesita baselining manual. Scriptul nu resetează și nu repară automat istoricul migrărilor.
- După schimbarea conexiunii, repornește frontendul.

Opțional, adaugă alimentele demonstrative:

```powershell
npm.cmd run db:seed
```

Nu rula migrări pe baza altcuiva fără acord și backup. Nu folosi `prisma migrate reset`: poate șterge datele.

**Securitate:** auditul npm din 4 noiembrie 2026 a raportat 39 de vulnerabilități în arborele de dependențe, dintre care 19 high și 2 critical (inclusiv Next.js). Nu au fost remediate prin această schimbare; necesită triere și actualizări separate înainte de publicarea aplicației.

## 5. Porniri ulterioare — fără reinstalare

**Terminal 1**, din directorul principal:

```powershell
cd .\backend\backend
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

**Terminal 2**, din directorul principal:

```powershell
cd .\frontend\frontend
npm.cmd run dev -- --hostname 127.0.0.1
```

Oprire: apasă **Ctrl+C** în fiecare terminal. Pentru reîncărcarea automată a backendului în timpul dezvoltării, poți adăuga `--reload` la comanda Uvicorn.

Verificare rapidă, într-un alt terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
(Invoke-WebRequest http://127.0.0.1:3000/ -UseBasicParsing).StatusCode
```

Backendul trebuie să returneze mesajul `NeuroSnap Vision backend is running`, iar frontendul codul `200`. Aceste verificări nu testează conexiunea la baza de date, scanarea AI sau uploadul imaginilor.

## 6. Ce trimiți împreună cu proiectul

- Trimite sursele, `package.json`, `package-lock.json`, `requirements.txt`, directorul `prisma/`, toate modelele din `models/` și acest README.
- Nu este necesar să trimiți `node_modules/`, `.next/`, `venv/` sau `__pycache__/`: se refac pe calculatorul destinatarului. Mediul Python `venv` nu este portabil.
- **Nu trimite fișierele private `.env*` sau `env.setup` într-o arhivă publică.** Acestea includ tokenul, conexiunile, backupul și starea creării, care poate conține credențiale. Git le ignoră, dar un program de arhivare nu le exclude automat. Destinatarul folosește propriul token; nu distribui tokenul tău de administrare.
- Datele din baza externă și imaginile din Vercel Blob nu sunt incluse automat în arhiva proiectului.
- Prima instalare necesită internet. Chiar dacă cele două servere sunt locale, funcțiile care folosesc baza externă sau Vercel Blob au nevoie în continuare de internet și credențiale valide.

## Probleme frecvente

- **`npm.ps1 cannot be loaded`**: folosește `npm.cmd` și `npx.cmd`, exact ca în exemple; nu trebuie schimbată politica PowerShell.
- **`No module named ...`**: rulează din nou instalarea `requirements.txt` cu `.\venv\Scripts\python.exe -m pip`, nu cu un alt Python.
- **Eroare la modelul AI**: verifică fișierele din `models/`, directorul curent și compatibilitatea versiunilor dependențelor Python.
- **`@prisma/client did not initialize`**: rulează `npx.cmd prisma generate` din directorul frontendului.
- **Interfața se deschide, dar jurnalul/autentificarea eșuează**: verifică conexiunea și rulează `npm.cmd run db:setup` pentru aplicarea migrărilor lipsă.
- **Scanarea nu poate contacta backendul**: verifică http://127.0.0.1:8000/ și ambele variabile de adresă din `.env`.
- **Uploadul imaginilor eșuează**: verifică tokenul Vercel Blob și conexiunea la internet.
- **Port ocupat**: oprește instanța veche. Dacă Next.js alege alt port, folosește adresa afișată în terminal.
