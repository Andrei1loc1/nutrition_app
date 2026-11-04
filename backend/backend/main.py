from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.nutrition_service import calculate_healthy_score
from services.prediction_service import predict_food
from agents.multi_agent_service import get_multi_agent_recommendation
from services.mind_score_service import calculate_mind_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "NeuroSnap Vision backend is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...), portion: str = "medium"):
    image_bytes = await file.read()
    return predict_food(image_bytes, portion)


@app.post("/recommendation")
async def recommendation(data: dict):
    return get_multi_agent_recommendation(data)


@app.post("/healthy-score")
async def healthy_score(data: dict):
    return calculate_healthy_score(data)

@app.post("/mind-score")
async def mind_score(data: dict):
    return calculate_mind_score(data["meals"])