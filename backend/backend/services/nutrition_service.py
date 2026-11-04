import json

NUTRITION_PATH = "models/nutrition_data.json"

with open(NUTRITION_PATH, "r") as f:
    nutrition_data = json.load(f)


def format_food_name(name: str) -> str:
    return name.replace("_", " ").title()


def get_nutrition(food_class: str, portion: str):
    default_nutrition = {
        "calories": 500,
        "protein": 20,
        "carbs": 55,
        "fats": 20,
    }

    nutrition = nutrition_data.get(food_class, default_nutrition)

    portion_multiplier = {
        "small": 0.7,
        "medium": 1.0,
        "large": 1.3,
    }.get(portion, 1.0)

    return {
        key: round(value * portion_multiplier, 2)
        for key, value in nutrition.items()
    }


def calculate_score(value, target):
    if target <= 0:
        return 0

    ratio = value / target
    score = 100 - abs(1 - ratio) * 100

    return max(0, min(100, round(score, 2)))


def calculate_healthy_score(data: dict):
    calories_score = calculate_score(data["calories"], data["target_calories"])
    protein_score = calculate_score(data["protein"], data["target_protein"])
    fats_score = calculate_score(data["fats"], data["target_fats"])

    timing_score = 100 if data["late_meals_count"] < 3 else 60
    consistency_score = round((data["days_on_target"] / 7) * 100, 2)

    healthy_score = round(
        calories_score * 0.25 +
        protein_score * 0.25 +
        fats_score * 0.20 +
        timing_score * 0.15 +
        consistency_score * 0.15,
        2
    )

    return {
        "healthy_score": healthy_score,
        "sub_scores": {
            "calories": calories_score,
            "protein": protein_score,
            "fats": fats_score,
            "meal_timing": timing_score,
            "consistency": consistency_score
        }
    }