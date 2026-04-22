![version](https://img.shields.io/badge/version-1.0.1-DC0A2D?style=flat-square) ![mern](https://img.shields.io/badge/mern-stack-141418?style=flat-square) ![license](https://img.shields.io/badge/license-MIT-424242?style=flat-square) ![type](https://img.shields.io/badge/type-data--sci-4CAF50?style=flat-square)

# TaskMate – Gestionnaire de Tâches Intelligent / Smart Task Manager

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000?logo=vercel&logoColor=white)

[🇫🇷 Version Française](#version-française) | [🇬🇧 English Version](#english-version)

---

## <a name="version-française"></a>🇫🇷 Version Française

Application complète (React + Node.js + MongoDB + scikit-learn) qui combine gestion de tâches, priorisation automatisée et statistiques d'efficacité. Architecture prête pour GitHub démontrant un front moderne, un backend Express structuré et un volet machine learning léger pour classifier les tâches.

### ✨ Fonctionnalités

- ✏️ **CRUD Complet**: gestion des tâches (titre, description, échéance, durée estimée, tags, statut)
- 🤖 **Priorisation IA**: classification automatique via scikit-learn (urgent/important/normal/bas)
- 📊 **Statistiques**: tableau de bord avec taux de complétion, focus score, moyennes
- 🔁 **Temps Réel**: intégration frontend/backend via React Query

### 🛠️ Stack Technologique

| Composant | Technologie | Objectif |
|-----------|-------------|----------|
| **Frontend** | React 18 + Vite | Interface utilisateur moderne |
| **Backend** | Node.js + Express + Mongoose | API REST et accès MongoDB |
| **Machine Learning** | Python 3.10 + scikit-learn | Priorisation automatique |
| **Base de données** | MongoDB | Stockage NoSQL |
| **Gestion État** | React Query + axios | Cache et synchronisation |
| **Utilitaires** | date-fns, dotenv, joblib | Dates, env, sérialisation |

### 📁 Structure du Projet

```
Taskmate/
├── backend/              # API Express + intégration ML
│   ├── .env.example      # Template configuration backend
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── controllers/  # Logique métier
│       ├── models/       # Schémas Mongoose
│       ├── routes/       # Endpoints API
│       ├── services/     # Service priorisation
│       └── utils/        # Helpers
├── frontend/             # Application React + Vite
│   ├── .env.example      # Template configuration frontend
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── components/   # Composants UI
│       ├── api/          # Client HTTP
│       └── hooks/        # Custom hooks
├── ml/                   # Scripts scikit-learn
│   ├── .env.example      # Template configuration ML
│   ├── requirements.txt
│   ├── model_utils.py
│   ├── predict.py        # Endpoint prédiction
│   └── train_model.py    # Entraînement modèle
└── README.md
```

### 🚀 Démarrage Rapide

#### Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- Python 3.10+ avec pip

#### 1. Backend (API Node.js)

```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec votre URI MongoDB et chemin Python
npm run dev  # Écoute sur http://localhost:4000
```

**Variables d'environnement (backend/.env)**:
```env
MONGODB_URI=mongodb://localhost:27017/taskmate
PYTHON_PATH=python3
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

#### 2. Service ML (scikit-learn)

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate  # Windows | source .venv/bin/activate (Linux/Mac)
pip install -r requirements.txt

# (Optionnel) Entraîner modèle personnalisé
python train_model.py
```

**Variables d'environnement (ml/.env)**:
```env
MODEL_PATH=model.pkl
VECTORIZER_PATH=vectorizer.pkl
```

> Le backend appelle `ml/predict.py` via subprocess. Configurez `PYTHON_PATH` si votre interpréteur est `python3`.

#### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env
# Vérifier VITE_API_URL pointe vers http://localhost:4000
npm run dev  # Écoute sur http://localhost:5173
```

**Variables d'environnement (frontend/.env)**:
```env
VITE_API_URL=http://localhost:4000
```

### 📋 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tasks` | Liste paginée des tâches |
| POST | `/api/tasks` | Créer tâche + classification ML |
| PUT | `/api/tasks/:id` | Mettre à jour tâche |
| DELETE | `/api/tasks/:id` | Supprimer tâche |
| GET | `/api/tasks/stats/summary` | Statistiques agrégées |

**Payload exemple (POST /api/tasks)**:
```json
{
  "title": "Finir rapport projet",
  "description": "Compléter sections 3-5",
  "dueDate": "2025-11-25T18:00:00.000Z",
  "estimatedDuration": 120,
  "tags": ["urgent", "travail"]
}
```

### 🤖 Priorisation IA

- **Pipeline ML**: TfidfVectorizer + StandardScaler + LogisticRegression
- **Entrées**: titre, description, échéance (features textuelles + temporelles)
- **Sorties**: scores urgence/importance (0-1) + label priorité
- **Fallback**: si Python indisponible, heuristiques Node.js basées sur échéance

**Labels de priorité**:
- `critical`: urgent ET important
- `urgent`: urgent mais pas important
- `important`: important mais pas urgent
- `normal`: ni urgent ni important
- `low`: faible priorité

### 📊 Statistiques

Le dashboard affiche :
- **Taux de complétion**: % tâches terminées
- **Moyenne urgence/importance**: scores ML agrégés
- **Focus score**: métrique de concentration (tâches critiques/totales)
- **Distribution par statut**: en cours, terminées, en retard

### 🔒 Bonnes Pratiques

- **Séparer les environments**: ne jamais commiter les fichiers `.env`
- **Validation dates**: utiliser ISO 8601 strict pour `dueDate`
- **Gestion erreurs**: le backend capture les erreurs Python et renvoie fallback
- **Tests**: ajouter Jest (frontend), supertest (backend), pytest (ML)

### 🗺️ Feuille de Route

- [ ] **Authentification**: multi-utilisateurs avec JWT
- [ ] **Workspaces**: espaces de travail partagés
- [ ] **Historique**: journalisation des décisions de priorisation
- [ ] **Exports**: CSV, PDF, intégrations (Notion, Trello)
- [ ] **Notifications**: rappels par email/push
- [ ] **Mode hors ligne**: PWA avec synchronisation
- [ ] **Tests automatisés**: couverture complète frontend/backend/ML

---

## <a name="english-version"></a>🇬🇧 English Version

Full-stack application (React + Node.js + MongoDB + scikit-learn) combining task management, automated prioritization, and efficiency statistics. GitHub-ready architecture showcasing modern frontend, structured Express backend, and lightweight ML classification.

### ✨ Features

- ✏️ **Complete CRUD**: task management (title, description, due date, estimated duration, tags, status)
- 🤖 **AI Prioritization**: automatic classification via scikit-learn (urgent/important/normal/low)
- 📊 **Statistics**: dashboard with completion rate, focus score, averages
- 🔁 **Real-Time**: frontend/backend integration via React Query

### 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18 + Vite | Modern user interface |
| **Backend** | Node.js + Express + Mongoose | REST API and MongoDB access |
| **Machine Learning** | Python 3.10 + scikit-learn | Automatic prioritization |
| **Database** | MongoDB | NoSQL storage |
| **State Management** | React Query + axios | Caching and synchronization |
| **Utilities** | date-fns, dotenv, joblib | Dates, env, serialization |

### 📁 Project Structure

```
Taskmate/
├── backend/              # Express API + ML integration
│   ├── .env.example      # Backend configuration template
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── controllers/  # Business logic
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API endpoints
│       ├── services/     # Prioritization service
│       └── utils/        # Helpers
├── frontend/             # React + Vite application
│   ├── .env.example      # Frontend configuration template
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── components/   # UI components
│       ├── api/          # HTTP client
│       └── hooks/        # Custom hooks
├── ml/                   # scikit-learn scripts
│   ├── .env.example      # ML configuration template
│   ├── requirements.txt
│   ├── model_utils.py
│   ├── predict.py        # Prediction endpoint
│   └── train_model.py    # Model training
└── README.md
```

### 🚀 Quick Start

#### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.10+ with pip

#### 1. Backend (Node.js API)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Python path
npm run dev  # Listens on http://localhost:4000
```

**Environment variables (backend/.env)**:
```env
MONGODB_URI=mongodb://localhost:27017/taskmate
PYTHON_PATH=python3
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

#### 2. ML Service (scikit-learn)

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate  # Windows | source .venv/bin/activate (Linux/Mac)
pip install -r requirements.txt

# (Optional) Train custom model
python train_model.py
```

**Environment variables (ml/.env)**:
```env
MODEL_PATH=model.pkl
VECTORIZER_PATH=vectorizer.pkl
```

> Backend calls `ml/predict.py` via subprocess. Configure `PYTHON_PATH` if your interpreter is `python3`.

#### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env
# Verify VITE_API_URL points to http://localhost:4000
npm run dev  # Listens on http://localhost:5173
```

**Environment variables (frontend/.env)**:
```env
VITE_API_URL=http://localhost:4000
```

### 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Paginated task list |
| POST | `/api/tasks` | Create task + ML classification |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats/summary` | Aggregated statistics |

**Example payload (POST /api/tasks)**:
```json
{
  "title": "Finish project report",
  "description": "Complete sections 3-5",
  "dueDate": "2025-11-25T18:00:00.000Z",
  "estimatedDuration": 120,
  "tags": ["urgent", "work"]
}
```

### 🤖 AI Prioritization

- **ML Pipeline**: TfidfVectorizer + StandardScaler + LogisticRegression
- **Inputs**: title, description, due date (textual + temporal features)
- **Outputs**: urgency/importance scores (0-1) + priority label
- **Fallback**: if Python unavailable, Node.js heuristics based on due date

**Priority labels**:
- `critical`: urgent AND important
- `urgent`: urgent but not important
- `important`: important but not urgent
- `normal`: neither urgent nor important
- `low`: low priority

### 📊 Statistics

Dashboard displays:
- **Completion rate**: % completed tasks
- **Avg urgency/importance**: aggregated ML scores
- **Focus score**: concentration metric (critical tasks/total)
- **Status distribution**: in progress, completed, overdue

### 🔒 Best Practices

- **Separate environments**: never commit `.env` files
- **Date validation**: use strict ISO 8601 for `dueDate`
- **Error handling**: backend catches Python errors and returns fallback
- **Testing**: add Jest (frontend), supertest (backend), pytest (ML)

### 🗺️ Roadmap

- [ ] **Authentication**: multi-user with JWT
- [ ] **Workspaces**: shared work environments
- [ ] **History**: logging of prioritization decisions
- [ ] **Exports**: CSV, PDF, integrations (Notion, Trello)
- [ ] **Notifications**: email/push reminders
- [ ] **Offline mode**: PWA with synchronization
- [ ] **Automated testing**: full frontend/backend/ML coverage

### 📄 License

This project is open source. See LICENSE file for details.

---

**Built for smart task management with AI prioritization**

For issues or feature requests, open an issue on the project repository.

---

<p align="center">
  <sub>Par <a href="https://adam.beloucif.com">Adam Beloucif</a> · Data Engineer & Fullstack Developer · <a href="https://github.com/Adam-Blf">GitHub</a> · <a href="https://www.linkedin.com/in/adambeloucif/">LinkedIn</a></sub>
</p>
