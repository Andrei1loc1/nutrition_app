import json
import io
import numpy as np
import tensorflow as tf
from PIL import Image

from services.nutrition_service import get_nutrition, format_food_name

MODEL_PATH = "models/model_final.keras"
CLASS_NAMES_PATH = "models/class_names_101.json"

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)


def predict_food(image_bytes: bytes, portion: str = "medium"):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((240, 240))

    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

    predictions = model.predict(img_array, verbose=0)[0]
    top_indices = predictions.argsort()[-3:][::-1]

    top_predictions = []

    for index in top_indices:
        food_class = class_names[int(index)]
        confidence = float(predictions[index]) * 100

        top_predictions.append({
            "food_class": food_class,
            "display_name": format_food_name(food_class),
            "confidence": round(confidence, 2),
            "nutrition": get_nutrition(food_class, portion)
        })

    best_prediction = top_predictions[0]

    return {
        "food_class": best_prediction["food_class"],
        "display_name": best_prediction["display_name"],
        "confidence": best_prediction["confidence"],
        "portion": portion,
        "nutrition": best_prediction["nutrition"],
        "top_predictions": top_predictions
    }