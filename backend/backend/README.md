# NeuroSnap Vision — Backend

Acest director conține implementarea serviciului de inteligență artificială al aplicației **NeuroSnap Vision**. Este un API **Python FastAPI stateless**, responsabil exclusiv de inferență: clasificarea imaginilor alimentare, estimarea nutrițională, scorarea sănătății și generarea de recomandări prin învățare prin consolidare.

## Tehnologii de bază

- **FastAPI** + **Uvicorn**
- **TensorFlow / Keras** (CNN EfficientNet)
- **scikit-learn** (clasificator pattern MIND)
- **Pillow** + **NumPy** (procesare imagini)

## Functionalitati principale

- **Clasificare alimentară** — 101 clase de preparate, model CNN EfficientNet
- **Estimare nutrițională** — lookup JSON + scalare după porție
- **Scor sănătate** — scor compozit 0-100 bazat pe deviații față de target
- **Analiză MIND** — scor nutriție cerebrală și clasificare pattern dietetic
- **Recomandări multi-agent** — 5 agenți Q-learning (proteină, calorii, timing, grăsimi, consistență)

## Cum rulezi

Ghidul complet pentru instalare de la zero și pornirea ambelor servicii se află în [README-ul principal](../../README.md).

**Cerințe recomandate:** Python 3.11, 64-bit, cu pip. Comenzile se execută din acest director, în PowerShell.

```powershell
py -3.11 -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

La pornirile ulterioare, execută doar ultima comandă. Nu este necesară activarea mediului virtual. Oprire: **Ctrl+C**; pentru reîncărcare automată în dezvoltare, adaugă `--reload`.

Nu copia `venv` între calculatoare; recreează-l. Trimite toate fișierele din `models/`, deoarece nu sunt descărcate automat. Dependențele Python nu au versiuni fixate; compatibilitatea lor cu modelele salvate trebuie verificată la o instalare nouă.

Serverul pornește la `http://127.0.0.1:8000`

## Structura proiectului

```
backend/
├── main.py                    # Entry point FastAPI + rute
├── requirements.txt           # Dependențe Python
├── run_backend.ps1          # Script lansare
├── agents/                  # Sistem multi-agent Q-learning + coordonator
├── models/                  # Modele pre-antrenate și date statice
└── services/                # Servicii de predicție, nutriție și scoring MIND
```

## API endpoints

| Endpoint | Metoda | Scop |
|----------|--------|------|
| `/` | GET | Health check |
| `/predict` | POST | clasificare imagine + estimare nutriție |
| `/healthy-score` | POST | scor compozit sănătate |
| `/mind-score` | POST | analiză MIND + scor cerebral |
| `/recommendation` | POST | recomandare multi-agent RL |

## Modele utilizate

| Model | Fișier | Scop |
|-------|--------|------|
| CNN EfficientNet | `models/model_final.keras` | clasificare 101 clase alimentare |
| MIND Classifier | `models/mind_pattern_model.pkl` | clasificare pattern dietetic |
| Q-Tables | `models/multi_agent_q_tables.json` | tabele Q-learning pentru agenți |

## Notă de arhitectură

Toate modelele sunt încărcate **o singură dată la import** (zero cold-start). Backend-ul este complet stateless: nu gestionează sesiuni sau bază de date — starea utilizatorului se află în frontend și PostgreSQL.
