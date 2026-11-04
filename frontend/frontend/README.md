# NeuroSnap Vision — Frontend

Acest director conține implementarea componentei frontend a aplicației **NeuroSnap Vision**, o platformă de monitorizare nutrițională bazată pe viziune artificială. Frontend-ul este dezvoltat în **Next.js 16** cu suport PWA și funcționează conform arhitecturii **Backend-for-Frontend (BFF)**, gestionând atât interfața utilizator, cât și rutele API interne de proxy către serviciul de inteligență artificială.

## Tehnologii de bază

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** și **Shadcn UI** pentru stilizare
- **Prisma** + **PostgreSQL** pentru persistența datelor
- **Recharts** pentru vizualizarea datelor nutriționale

## Functionalitati principale

- **Scanare AI alimentara** — captura foto si clasificare automată a preparatelor (proxy către backend Python)
- **Jurnal zilnic** — evidența meselor cu totaluri calorice și macronutrienți
- **Dashboard** — inel caloric, distribuție macro, scoruri AI
- **Rapoarte lunare** — agregare vizuală cu export CSV
- **Onboarding** — calcul automat BMR/TDEE și targeturi personalizate

## Cum rulezi

Ghidul complet pentru instalare de la zero și pornirea ambelor servicii se află în [README-ul principal](../../README.md). Comenzile de mai jos se execută din acest director, în PowerShell.

**Cerințe:** Node.js 24 LTS, cont Prisma cu Service Token pentru crearea bazei online sau o conexiune PostgreSQL/Accelerate existentă.

```powershell
npm.cmd ci
npx.cmd prisma generate
# Configurează .env conform secțiunii de mai jos înainte de pornire.
npm.cmd run db:setup
npm.cmd run dev -- --hostname 127.0.0.1
```

Serverul de dezvoltare pornește la `http://localhost:3000`.

## Variabile de mediu

```env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=CHEIA_TA"
BACKEND_URL="http://127.0.0.1:8000"
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
# Opțional local, necesar pentru upload pe Vercel:
# BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

`DATABASE_URL` din exemplu este pentru o bază Accelerate existentă; nu copia cheia demonstrativă. Clientul suportă și PostgreSQL direct. Pentru crearea automată prin prisma.io, lasă `DATABASE_URL` absent și pune `PRISMA_SERVICE_TOKEN` în `.env.setup`, apoi rulează `npm.cmd run db:setup`. Dacă ai deja o conexiune, dar vrei explicit o bază nouă, folosește `npm.cmd run db:create`: vechiul `.env` primește backup, iar datele vechi nu sunt mutate. Scriptul completează automat `DATABASE_URL` și `DIRECT_URL` și aplică migrările. Vezi [ghidul complet și recuperarea după erori](../../README.md#4-crearea-sau-pregătirea-automată-a-bazei-online).

Nu distribui fișierele `.env*` sau `env.setup`: inclusiv backupul și starea scriptului pot conține credențiale. La rulări ulterioare, pornește doar `npm.cmd run dev`; nu se creează baze la fiecare pornire.

Local, fără `BLOB_READ_WRITE_TOKEN`, imaginile sunt salvate în `public/uploads/scans/`. Adresa Hugging Face nu este necesară pentru backendul Python local: ambele variabile de backend trebuie să indice `http://127.0.0.1:8000`.

## Structura proiectului

```
frontend/
├── app/               # Next.js App Router + rute API interne (BFF)
├── components/      # Componente React organizate pe functionalitati
├── hooks/           # Custom React hooks
├── lib/             # API clients, logică business, utilități
├── prisma/          # Schema și migrări bază de date
└── public/          # Asset-uri statice, manifest PWA
```

## Rute API interne

| Ruta | Metoda | Scop |
|------|--------|------|
| `/api/auth/login` | POST | Autentificare (header-based) |
| `/api/journal` | GET / POST | Listare / adăugare mese |
| `/api/journal/[id]` | DELETE | Ștergere masă |
| `/api/reports` | GET / POST | Rapoarte lunare |
| `/api/predict` | POST | Proxy clasificare imagine AI |
| `/api/scans` | POST | Salvare scanări |
| `/api/healthy-score` | POST | Proxy scor sănătate |
| `/api/mind-score` | POST | Proxy scor nutriție cerebrală |
| `/api/recommendation` | POST | Proxy recomandări AI |
| `/api/uploads/scans` | POST | Upload imagini Vercel Blob |

## Autentificare

Flux lightweight header-based: utilizatorul se înregistrează cu un nume, identificatorul este persistat în `localStorage`, iar toate cererile API includ header-ul `X-User-ID`. Prisma filtrează datele per-utilizator la nivel de interogare.
