from datetime import datetime, timezone

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


def sanitize_datetime(value):
    if not value:
        return None
    if isinstance(value, (int, float)):
        return datetime.fromtimestamp(float(value), tz=timezone.utc)
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc)

    try:
        string_value = str(value)
        if string_value.endswith("Z"):
            string_value = string_value[:-1] + "+00:00"
        return datetime.fromisoformat(string_value).astimezone(timezone.utc)
    except ValueError:
        return None


def hours_until_due(value):
    due = sanitize_datetime(value)
    if not due:
        return 72.0
    now = datetime.now(timezone.utc)
    delta = due - now
    return max(-240.0, min(delta.total_seconds() / 3600.0, 720.0))


def prepare_training_data():
    records = [
      {
          "text": "Livraison client fonctionnalité critique client livraison",
          "due_hours": 6,
          "estimated_minutes": 240,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Corriger bug production client incident urgent panne",
          "due_hours": 1,
          "estimated_minutes": 90,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Réparer bug mineur interface cosmétique UI faible impact",
          "due_hours": 8,
          "estimated_minutes": 30,
          "urgency": 1,
          "importance": 0,
      },
      {
          "text": "Répondre email équipe question mineure support interne",
          "due_hours": 48,
          "estimated_minutes": 20,
          "urgency": 0,
          "importance": 0,
      },
      {
          "text": "Documentation interne mise à jour procédure low priority",
          "due_hours": 180,
          "estimated_minutes": 60,
          "urgency": 0,
          "importance": 0,
      },
      {
          "text": "Plan stratégique réunion direction vision long terme",
          "due_hours": 72,
          "estimated_minutes": 180,
          "urgency": 0,
          "importance": 1,
      },
      {
          "text": "Préparation facture client paiement relance finance",
          "due_hours": 24,
          "estimated_minutes": 45,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Analyser feedback client satisfaction rapport trimestriel",
          "due_hours": 96,
          "estimated_minutes": 120,
          "urgency": 0,
          "importance": 1,
      },
      {
          "text": "Nettoyer backlog tickets maintenance routine technique",
          "due_hours": 336,
          "estimated_minutes": 180,
          "urgency": 0,
          "importance": 0,
      },
      {
          "text": "Déployer patch sécurité CVE critique urgence sécurité",
          "due_hours": 12,
          "estimated_minutes": 120,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Gérer incident critique infrastructure panne production",
          "due_hours": -1,
          "estimated_minutes": 150,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Atelier innovation brainstorming produit futur",
          "due_hours": 240,
          "estimated_minutes": 200,
          "urgency": 0,
          "importance": 1,
      },
      {
          "text": "Suivi commercial prospect relance opportunité",
          "due_hours": 36,
          "estimated_minutes": 60,
          "urgency": 1,
          "importance": 1,
      },
      {
          "text": "Refactoring code base dette technique amélioration",
          "due_hours": 168,
          "estimated_minutes": 300,
          "urgency": 0,
          "importance": 1,
      },
      {
          "text": "Configurer sauvegardes système maintenance sécurité",
          "due_hours": 120,
          "estimated_minutes": 90,
          "urgency": 0,
          "importance": 1,
      },
      {
          "text": "Organiser team building activité morale équipe",
          "due_hours": 200,
          "estimated_minutes": 240,
          "urgency": 0,
          "importance": 0,
      },
    ]
    return pd.DataFrame.from_records(records)


def _numeric_pipeline():
    return Pipeline(
        steps=[
            ("scaler", StandardScaler())
        ]
    )


def _text_pipeline():
    return Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(min_df=1, ngram_range=(1, 2)))
        ]
    )


def _preprocessor():
    return ColumnTransformer(
        transformers=[
            ("text", _text_pipeline(), "text"),
            ("num", _numeric_pipeline(), ["due_hours", "estimated_minutes"]),
        ]
    )


def build_models():
    df = prepare_training_data()
    preprocessor = _preprocessor()

    urgency_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=400, class_weight="balanced")),
        ]
    )

    importance_model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=400, class_weight="balanced")),
        ]
    )

    X = df[["text", "due_hours", "estimated_minutes"]]
    urgency_model.fit(X, df["urgency"])
    importance_model.fit(X, df["importance"])

    return urgency_model, importance_model


def prepare_input(payload):
    title = payload.get("title", "") or ""
    description = payload.get("description", "") or ""
    tags = payload.get("tags") or []
    if isinstance(tags, list):
        tags_text = " ".join(tags)
    else:
        tags_text = str(tags)

    text = " ".join([title, description, tags_text]).strip()
    due_hours = hours_until_due(payload.get("dueDate"))
    estimated_minutes = float(payload.get("estimatedMinutes") or 30.0)
    estimated_minutes = max(5.0, min(estimated_minutes, 720.0))

    frame = pd.DataFrame.from_records(
        [
            {
                "text": text,
                "due_hours": due_hours,
                "estimated_minutes": estimated_minutes,
            }
        ]
    )
    return frame


def priority_label(urgency, importance):
    if urgency >= 0.75 and importance >= 0.75:
        return "critical"
    if urgency >= 0.75:
        return "urgent"
    if importance >= 0.75:
        return "important"
    if urgency <= 0.35 and importance <= 0.35:
        return "low"
    return "normal"
