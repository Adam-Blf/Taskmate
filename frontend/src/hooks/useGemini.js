import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/analyze-task`, taskData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enrichDescription = async (title) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/enrich-description`, { title });
      return response.data.description;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enrich description');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const suggestRelatedTasks = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/suggest-tasks/${taskId}`);
      return response.data.suggestions;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to suggest tasks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/analyze-project/${projectId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const summarizeNote = async (content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/summarize-note`, { content });
      return response.data.summary;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const extractTags = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/extract-tags`, { text });
      return response.data.tags;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract tags');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const chat = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/chat`, { prompt });
      return response.data.response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analyzeTask,
    enrichDescription,
    suggestRelatedTasks,
    analyzeProject,
    summarizeNote,
    extractTags,
    chat
  };
};
