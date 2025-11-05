from pathlib import Path
from typing import Union

from joblib import dump

from model_utils import build_models


def train(output_path: Union[str, Path] = "model.joblib") -> Path:
    urgency_model, importance_model = build_models()
    payload = {"urgency": urgency_model, "importance": importance_model}
    output_path = Path(output_path)
    dump(payload, output_path)
    return output_path


if __name__ == "__main__":
    location = train()
    print(f"Models saved to {location}")
