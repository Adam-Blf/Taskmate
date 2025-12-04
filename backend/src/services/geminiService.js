import axios from 'axios';

/**
 * Service pour interagir avec l'API Gemini de Google
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  /**
   * Envoie une requête à l'API Gemini
   * @param {string} prompt - Le prompt à envoyer
   * @returns {Promise<string>} - La réponse de Gemini
   */
  async generateContent(prompt) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No valid response from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Analyse une tâche et suggère une priorisation
   * @param {Object} task - La tâche à analyser
   * @returns {Promise<Object>} - Suggestions de priorisation
   */
  async analyzeTaskPriority(task) {
    const prompt = `Tu es un assistant de gestion de tâches intelligent. Analyse cette tâche et suggère une priorisation.

Tâche:
- Titre: ${task.title || 'Sans titre'}
- Description: ${task.description || 'Pas de description'}
- Date d'échéance: ${task.dueDate || 'Aucune'}
- Temps estimé: ${task.estimatedMinutes || 'Non spécifié'} minutes
- Tags: ${task.tags?.join(', ') || 'Aucun'}

Réponds au format JSON avec:
{
  "priorityLevel": "critical|urgent|important|normal|low",
  "reasoning": "Explication courte de ton raisonnement",
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "estimatedUrgency": 0.0-1.0,
  "estimatedImportance": 0.0-1.0
}`;

    const response = await this.generateContent(prompt);
    
    try {
      // Extraire le JSON de la réponse (parfois Gemini ajoute du texte autour)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      return {
        priorityLevel: 'normal',
        reasoning: response,
        suggestions: [],
        estimatedUrgency: 0.5,
        estimatedImportance: 0.5
      };
    }
  }

  /**
   * Génère une description enrichie pour une tâche
   * @param {string} title - Titre de la tâche
   * @returns {Promise<string>} - Description enrichie
   */
  async enrichTaskDescription(title) {
    const prompt = `Génère une description détaillée et actionnable pour cette tâche: "${title}".
    
La description doit:
- Être concise (2-3 phrases maximum)
- Inclure des étapes concrètes si pertinent
- Être en français
- Être professionnelle

Réponds uniquement avec la description, sans introduction.`;

    return await this.generateContent(prompt);
  }

  /**
   * Suggère des tâches connexes basées sur une tâche existante
   * @param {Object} task - La tâche de référence
   * @returns {Promise<Array>} - Liste de tâches suggérées
   */
  async suggestRelatedTasks(task) {
    const prompt = `Basé sur cette tâche, suggère 3 tâches connexes ou complémentaires:

Tâche actuelle:
- Titre: ${task.title}
- Description: ${task.description || 'Pas de description'}

Réponds au format JSON avec un tableau de tâches:
[
  {
    "title": "Titre de la tâche suggérée",
    "description": "Description courte",
    "estimatedMinutes": nombre
  }
]`;

    const response = await this.generateContent(prompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Failed to parse related tasks:', error);
      return [];
    }
  }

  /**
   * Analyse un projet et suggère des améliorations
   * @param {Object} project - Le projet à analyser
   * @param {Array} tasks - Les tâches du projet
   * @returns {Promise<Object>} - Analyse et suggestions
   */
  async analyzeProject(project, tasks = []) {
    const tasksSummary = tasks.map(t => `- ${t.title} (${t.status})`).join('\n');
    
    const prompt = `Analyse ce projet et fournis des suggestions d'amélioration:

Projet:
- Nom: ${project.name}
- Description: ${project.description || 'Pas de description'}
- Tâches (${tasks.length}):
${tasksSummary || 'Aucune tâche'}

Réponds au format JSON:
{
  "overallHealth": "excellent|good|fair|poor",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Recommandation 1", "Recommandation 2"],
  "riskFactors": ["Risque 1", "Risque 2"]
}`;

    const response = await this.generateContent(prompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Failed to parse project analysis:', error);
      return {
        overallHealth: 'fair',
        insights: [response],
        recommendations: [],
        riskFactors: []
      };
    }
  }

  /**
   * Génère un résumé intelligent d'une note
   * @param {string} content - Contenu de la note
   * @returns {Promise<string>} - Résumé
   */
  async summarizeNote(content) {
    const prompt = `Résume cette note de manière concise (maximum 2 phrases):

${content}

Réponds uniquement avec le résumé, sans introduction.`;

    return await this.generateContent(prompt);
  }

  /**
   * Extrait des tags pertinents d'un texte
   * @param {string} text - Le texte à analyser
   * @returns {Promise<Array>} - Liste de tags
   */
  async extractTags(text) {
    const prompt = `Analyse ce texte et extrait 3-5 tags pertinents en français:

"${text}"

Réponds avec un tableau JSON de mots-clés simples: ["tag1", "tag2", "tag3"]`;

    const response = await this.generateContent(prompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Failed to parse tags:', error);
      return [];
    }
  }
}

export default new GeminiService();
