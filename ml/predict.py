import json
import sys

from model_utils import build_models, prepare_input, priority_label


def main():
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        payload = {}

    urgency_model, importance_model = build_models()
    features = prepare_input(payload)

    urgency_prob = float(urgency_model.predict_proba(features)[0][1])
    importance_prob = float(importance_model.predict_proba(features)[0][1])

    urgency_score = round(urgency_prob, 2)
    importance_score = round(importance_prob, 2)
    label = priority_label(urgency_score, importance_score)

    result = {
        "urgency": urgency_score,
        "importance": importance_score,
        "priorityLabel": label,
    }

    json.dump(result, sys.stdout)


if __name__ == "__main__":
    main()
