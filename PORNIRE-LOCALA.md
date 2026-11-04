# Cum pornești aplicația local

Ghid pentru **Windows și PowerShell**. Ai nevoie de **două terminale**: unul pentru backend și unul pentru frontend.

Aplicația și backendul rulează pe calculatorul tău. Baza de date rămâne online, pe Prisma, deci ai nevoie de internet. Nu trebuie să instalezi PostgreSQL sau Docker.

## A. Prima pornire pe un calculator nou

### 1. Instalează programele necesare

- **Node.js 24 LTS**, de pe https://nodejs.org/ — include npm.
- **Python 3.11, 64-bit**, de pe https://www.python.org/downloads/windows/ — include pip și instalează și Python Launcher (`py`).

După instalare, deschide un PowerShell nou și verifică:

```powershell
node --version
npm.cmd --version
py -3.11 --version
```

Dacă sunt afișate versiunile, poți continua.

### 2. Deschide folderul proiectului

Dezarhivează proiectul și deschide folderul principal: cel în care se află acest fișier și directoarele `frontend` și `backend`.

În File Explorer, scrie `powershell` în bara de adresă și apasă **Enter**. Astfel, terminalul se deschide direct în folderul proiectului.

**Important:** proiectul are directoare duble: `backend/backend` și `frontend/frontend`. Folosește comenzile exact cum sunt scrise.

### 3. Terminalul 1 — instalează și pornește backendul

Rulează comenzile pe rând:

```powershell
cd .\backend\backend
py -3.11 -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Instalarea poate dura câteva minute. La pornire, backendul încarcă modelele AI; așteaptă mesajul `Application startup complete`.

**Lasă acest terminal deschis.**

Poți verifica backendul în browser:

http://127.0.0.1:8000/

Trebuie să vezi mesajul `NeuroSnap Vision backend is running`.

> Păstrează toate fișierele din `backend/backend/models/`: instalarea dependențelor nu descarcă modelele. Dacă ai primit proiectul de pe alt calculator, recreează mediul `venv`; nu te baza pe cel copiat în arhivă.

### 4. Terminalul 2 — instalează frontendul

Deschide **încă un PowerShell din folderul principal al proiectului**, la fel ca la pasul 2. Nu folosi terminalul în care rulează backendul.

```powershell
cd .\frontend\frontend
npm.cmd ci
```

Așteaptă să se termine instalarea.

### 5. Configurează adresa backendului local

În terminalul 2, deschide fișierul `.env`:

```powershell
notepad .env
```

Dacă fișierul nu există, acceptă crearea lui. Adaugă sau actualizează aceste două linii:

```dotenv
BACKEND_URL="http://127.0.0.1:8000"
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
```

**Nu lăsa aici adresa Hugging Face** dacă vrei să folosești backendul local. Dacă liniile există deja, modifică-le, nu le dubla.

Dacă ai deja `DATABASE_URL` și `DIRECT_URL`, păstrează-le. Nu șterge restul fișierului. Salvează și închide Notepad.

Nu trebuie să configurezi stocare externă pentru imagini: local, acestea sunt salvate în `frontend/frontend/public/uploads/scans/` dacă nu ai configurat un serviciu de upload.

### 6. Pregătește baza de date Prisma

**Dacă ai deja o conexiune validă în `.env`**, treci direct la comanda `db:setup` de mai jos. Tokenul de administrare este necesar numai pentru crearea unei baze noi.

**Dacă nu ai o bază de date**, creează un cont pe https://console.prisma.io/, selectează workspace-ul și mergi la **Settings → Service Tokens → New Service Token**. Copiază tokenul.

În terminalul 2:

```powershell
notepad .env.setup
```

Pune tokenul în acest fișier, fără să folosești textul demonstrativ:

```dotenv
PRISMA_SERVICE_TOKEN="TOKENUL_TAU"
```

Dacă ai pus deja tokenul, nu trebuie introdus din nou. Salvează și închide Notepad.

Apoi rulează:

```powershell
npm.cmd run db:setup
```

Comanda creează automat baza online **dacă lipsește `DATABASE_URL`**, salvează conexiunile în `.env`, creează tabelele și generează clientul Prisma. Dacă există deja conexiunea, reutilizează baza și aplică migrările lipsă.

**Ai o conexiune veche în `.env`, dar vrei o bază nouă în contul tău?** Rulează în schimb:

```powershell
npm.cmd run db:create
```

Aceasta păstrează vechiul `.env` în `.env.before-db-setup` și configurează baza nouă. Nu șterge baza veche, dar nici nu îi copiază datele. Nu este o comandă de rulat la fiecare pornire.

> Nu trimite altcuiva fișierele `.env*` cu tokenuri sau parole. Baza nouă este creată în contul tokenului și respectă limitele și eventualele costuri ale planului Prisma.

### 7. Pornește frontendul și deschide aplicația

Tot în terminalul 2:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1
```

Așteaptă mesajul `Ready`, apoi deschide:

**http://127.0.0.1:3000/**

La intrarea pe pagina camerei, permite accesul la cameră în browser.

**Ambele terminale trebuie să rămână deschise cât timp folosești aplicația.**

## B. Pornirile următoare — doar două comenzi de pornire

Nu reinstala dependențele și nu crea baza din nou.

Deschide două terminale din folderul principal al proiectului.

**Terminalul 1 — backend:**

```powershell
cd .\backend\backend
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

**Terminalul 2 — frontend:**

```powershell
cd .\frontend\frontend
npm.cmd run dev -- --hostname 127.0.0.1
```

Deschide **http://127.0.0.1:3000/**. Baza online este reutilizată automat; nu are nevoie de un terminal separat.

## C. Cum oprești aplicația

Apasă **Ctrl+C** în fiecare dintre cele două terminale. Datele salvate în baza online rămân acolo.

## Dacă ceva nu merge

- **Ai modificat `.env`?** Oprește frontendul cu Ctrl+C și pornește-l din nou.
- **Scanarea nu merge?** Verifică dacă backendul răspunde la http://127.0.0.1:8000/ și dacă ambele adrese din `.env` sunt locale.
- **Baza nouă încă se pregătește sau migrarea a eșuat temporar?** Reexecută `npm.cmd run db:setup` din directorul frontendului; conexiunea salvată este reutilizată.
- **Scriptul spune că o creare nu a putut fi confirmată?** Verifică Prisma Console înainte să ștergi fișierele de stare sau să încerci altă creare. Explicațiile sunt în README-ul principal.
- **Lipsește clientul Prisma?** Rulează `npx.cmd prisma generate` din `frontend/frontend`, apoi repornește frontendul.
- **Portul este ocupat?** Verifică dacă ai deja un server pornit. Nu porni mai multe copii; folosește adresa afișată în terminal.

Pentru detalii suplimentare, vezi [README.md](README.md).
