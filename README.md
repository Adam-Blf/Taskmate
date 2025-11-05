# TaskMate – Gestionnaire de tâches intelligent

TaskMate est une application complète (React + Node.js + MongoDB + scikit-learn) qui combine gestion de tâches, priorisation automatisée et statistiques d'efficacité. Elle met en avant une architecture prête pour GitHub démontrant un front moderne, un backend Express structuré et un volet machine learning léger pour classifier les tâches en fonction de l'urgence et de l'importance.

## Fonctionnalités

- ✏️ CRUD complet des tâches (titre, description, échéance, durée estimée, tags, statut).
- 🤖 Priorisation automatique via un micro-modèle scikit-learn (scores d'urgence et d'importance + label `critical|urgent|important|normal|low`).
- 📊 Tableau de bord des statistiques (taux de complétion, moyenne d'urgence/importance, focus score, etc.).
- 🔁 Intégration temps réel entre le front et le backend grâce à React Query.

## Stack technique

- **Frontend** : React 18, Vite, React Query, axios, date-fns.
- **Backend** : Node.js, Express, Mongoose, dotenv.
- **ML** : Python 3, scikit-learn, pandas, joblib.
- **Base de données** : MongoDB.

## Arborescence

```
backend/      # API Express + accès MongoDB + intégration du classifieur Python
frontend/     # Application React (Vite)
ml/           # Scripts scikit-learn (prédiction + génération de modèle)
```

## Pré-requis

- Node.js 18+
- MongoDB en local ou en SaaS (MongoDB Atlas, etc.)
- Python 3.10+ avec `pip`

## Installation & démarrage

### 1. Backend (API Node.js)

```bash
cd backend
npm install
cp .env.example .env
# éditer .env pour pointer vers votre instance MongoDB et votre binaire Python (python ou python3)
npm run dev
```

L'API écoute par défaut sur `http://localhost:4000`.

### 2. Service ML (scikit-learn)

```bash
cd ml
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sous Windows
pip install -r requirements.txt

# (Optionnel) générer un modèle pré-entraîné
python train_model.py
```

> Le backend appelle `ml/predict.py` pour chaque classification. Réglez la variable d'environnement `PYTHON_PATH` si votre interpréteur est `python3` au lieu de `python`.

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

L'application est servie par Vite sur `http://localhost:5173` et proxie automatiquement `/api` vers `http://localhost:4000`.

## API (extrait)

| Méthode | Endpoint                   | Description                           |
| ------- | -------------------------- | ------------------------------------- |
| GET     | `/api/tasks`               | Liste paginée des tâches              |
| POST    | `/api/tasks`               | Crée une tâche + classification ML    |
| PUT     | `/api/tasks/:id`           | Met à jour une tâche                  |
| DELETE  | `/api/tasks/:id`           | Supprime une tâche                    |
| GET     | `/api/tasks/stats/summary` | Statistiques d'efficacité agrégées    |

Les charges utiles attendent au minimum un champ `title`. `dueDate` doit être en ISO 8601 (`2024-07-01T09:00:00.000Z`). `tags` est un tableau de chaînes.

## Priorisation IA légère

- Le script Python s'appuie sur un petit dataset synthétique et un pipeline scikit-learn (`TfidfVectorizer`, `StandardScaler`, `LogisticRegression`) pour produire deux probabilités : urgence et importance.
- Un fallback heuristique côté Node garantit une réponse même si Python n'est pas disponible.
- Vous pouvez étendre le dataset dans `ml/model_utils.py` ou entraîner un modèle personnalisé via `ml/train_model.py`.

## To-do / pistes d'extension

- Authentification multi-utilisateurs et espaces de travail.
- Historisation des décisions de priorisation.
- Exports (CSV, Notion, ClickUp…) et webhooks.
- Tests automatisés (Jest pour le front, supertest pour l'API, pytest pour la partie ML).

---

🎯 Projet pensé pour mettre en valeur un repository GitHub mêlant front, backend et ML léger. Clonez, adaptez et déployez TaskMate selon vos besoins !
