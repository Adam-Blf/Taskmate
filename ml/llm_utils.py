"""
LLM Utils pour Taskmate - Parsing intelligent et generation de taches.
"""

import os
import json
import requests
from typing import Dict, List, Optional
from datetime import datetime

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("LLM_MODEL", "mistral")


class TaskLLM:
    """Moteur LLM pour la gestion intelligente des taches."""

    def __init__(self, model_name: str = DEFAULT_MODEL):
        self.model_name = model_name

    def _call_ollama(self, prompt: str, system: str = None) -> Optional[str]:
        try:
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3, "num_predict": 800}
            }
            if system:
                payload["system"] = system
            response = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=60)
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception:
            return None

    def _parse_json(self, text: str) -> Optional[Dict]:
        if not text:
            return None
        try:
            text = text.strip()
            if "```" in text:
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            return json.loads(text)
        except Exception:
            return None

    def parse_natural_input(self, text: str) -> Dict:
        """Parse texte libre en tache structuree."""
        system = """Extrais les infos de tache depuis du texte.
Retourne JSON: title, description, dueDate (ISO), estimatedMinutes, tags[], priority.
JSON uniquement."""

        today = datetime.now().strftime("%Y-%m-%d")
        prompt = f"Date: {today}\nTexte: {text}"

        result = self._call_ollama(prompt, system)
        parsed = self._parse_json(result)

        if parsed:
            return parsed
        return {"title": text[:100], "estimatedMinutes": 30, "tags": [], "priority": "normal"}

    def generate_subtasks(self, task: Dict) -> List[Dict]:
        """Genere des sous-taches pour une tache complexe."""
        system = """Decompose en 3-6 sous-taches.
JSON array: [{title, estimatedMinutes}]. JSON uniquement."""

        prompt = f"Tache: {task.get('title', '')}\nDescription: {task.get('description', '')}"

        result = self._call_ollama(prompt, system)
        parsed = self._parse_json(result)

        return parsed if isinstance(parsed, list) else []

    def estimate_time(self, title: str, description: str = "") -> int:
        """Estime le temps en minutes."""
        system = "Retourne UNIQUEMENT un nombre (minutes estimees)."
        prompt = f"Tache: {title}\nDetails: {description}"

        result = self._call_ollama(prompt, system)
        if result:
            try:
                digits = ''.join(filter(str.isdigit, result[:10]))
                return int(digits) if digits else 30
            except Exception:
                pass
        return 30

    def suggest_tags(self, title: str, description: str = "") -> List[str]:
        """Suggere des tags pertinents."""
        system = "Retourne JSON array de 2-4 tags courts."
        prompt = f"Tache: {title}\nDescription: {description}"

        result = self._call_ollama(prompt, system)
        parsed = self._parse_json(result)

        return [str(t).lower() for t in parsed[:4]] if isinstance(parsed, list) else []

    def analyze_productivity(self, tasks: List[Dict]) -> str:
        """Analyse et conseils de productivite."""
        system = "Coach productivite. 2-3 conseils concis. Francais."

        completed = sum(1 for t in tasks if t.get('completed'))
        pending = len(tasks) - completed

        task_list = "\n".join([
            f"- {t.get('title', 'Sans titre')}"
            for t in tasks[:10]
        ])

        prompt = f"Stats: {completed} terminees, {pending} en cours\nTaches:\n{task_list}\nConseils:"

        return self._call_ollama(prompt, system) or "Continuez votre excellent travail!"

    def smart_schedule(self, tasks: List[Dict], hours: int = 8) -> List[Dict]:
        """Ordonne les taches pour la journee."""
        system = "Planifie la journee. JSON array: [{title, order, reason}]."

        task_list = "\n".join([
            f"- {t.get('title')} ({t.get('estimatedMinutes', 30)}min)"
            for t in tasks if not t.get('completed')
        ][:15])

        prompt = f"Heures dispo: {hours}h\nTaches:\n{task_list}\nPlanning:"

        result = self._call_ollama(prompt, system)
        parsed = self._parse_json(result)

        return parsed if isinstance(parsed, list) else tasks


if __name__ == "__main__":
    llm = TaskLLM()
    result = llm.parse_natural_input("Finir la presentation pour lundi, 3h de travail")
    print("Parse:", result)
