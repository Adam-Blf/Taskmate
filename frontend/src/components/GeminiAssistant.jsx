import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

const GeminiAssistant = ({ task, onApplySuggestion }) => {
  const { analyzeTask, enrichDescription, loading, error } = useGemini();
  const [analysis, setAnalysis] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleAnalyze = async () => {
    try {
      const result = await analyzeTask(task);
      setAnalysis(result);
      setShowPanel(true);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleEnrichDescription = async () => {
    try {
      const description = await enrichDescription(task.title);
      onApplySuggestion({ description });
    } catch (err) {
      console.error('Enrichment failed:', err);
    }
  };

  const getPriorityColor = (level) => {
    const colors = {
      critical: 'text-red-600 bg-red-100',
      urgent: 'text-orange-600 bg-orange-100',
      important: 'text-yellow-600 bg-yellow-100',
      normal: 'text-blue-600 bg-blue-100',
      low: 'text-gray-600 bg-gray-100'
    };
    return colors[level] || colors.normal;
  };

  return (
    <div className="gemini-assistant">
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyse en cours...
            </>
          ) : (
            <>
              <span>✨</span>
              Analyser avec Gemini
            </>
          )}
        </button>

        <button
          onClick={handleEnrichDescription}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          🤖 Enrichir la description
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showPanel && analysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Analyse IA</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Priority Level */}
            <div>
              <span className="text-sm font-medium text-gray-700">Priorité suggérée:</span>
              <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(analysis.priorityLevel)}`}>
                {analysis.priorityLevel}
              </div>
            </div>

            {/* Urgency & Importance */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Urgence:</span>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.estimatedUrgency * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{(analysis.estimatedUrgency * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Importance:</span>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(analysis.estimatedImportance * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{(analysis.estimatedImportance * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <span className="text-sm font-medium text-gray-700">Raisonnement:</span>
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {analysis.reasoning}
              </p>
            </div>

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Suggestions:</span>
                <ul className="mt-2 space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-purple-600">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <button
              onClick={() => {
                onApplySuggestion({
                  priority: analysis.priorityLevel,
                  urgency: analysis.estimatedUrgency,
                  importance: analysis.estimatedImportance
                });
                setShowPanel(false);
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Appliquer les suggestions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
