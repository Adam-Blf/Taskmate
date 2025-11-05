import { useEffect, useMemo, useState } from 'react';

const defaultValues = {
  title: '',
  description: '',
  dueDate: '',
  estimatedMinutes: 60,
  tags: [],
  completed: false
};

const toLocalInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const normalizeTags = (value) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const TaskForm = ({ initialTask, onSubmit, isSubmitting, onCancel }) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [tagsInput, setTagsInput] = useState('');

  const isEditMode = Boolean(initialTask?._id);

  useEffect(() => {
    if (initialTask) {
      setFormValues({
        title: initialTask.title ?? '',
        description: initialTask.description ?? '',
        dueDate: initialTask.dueDate ? toLocalInputValue(initialTask.dueDate) : '',
        estimatedMinutes: initialTask.estimatedMinutes ?? 60,
        completed: Boolean(initialTask.completed),
        tags: initialTask.tags ?? []
      });
      setTagsInput((initialTask.tags ?? []).join(', '));
    } else {
      setFormValues(defaultValues);
      setTagsInput('');
    }
  }, [initialTask]);

  const estimatedHours = useMemo(
    () => Math.round((Number(formValues.estimatedMinutes || 0) / 60) * 10) / 10,
    [formValues.estimatedMinutes]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formValues,
      tags: normalizeTags(tagsInput),
      estimatedMinutes: Number(formValues.estimatedMinutes) || 60,
      dueDate: formValues.dueDate ? new Date(formValues.dueDate).toISOString() : null
    };
    onSubmit?.(payload);
  };

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h2>{isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
          <p>Ajoutez vos actions et laissez TaskMate prioriser automatiquement.</p>
        </div>
        {isEditMode && (
          <button
            type="button"
            className="ghost-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
      </header>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>Titre *</span>
          <input
            name="title"
            type="text"
            required
            placeholder="Ex. Préparer la présentation client"
            value={formValues.title}
            onChange={handleChange}
          />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea
            name="description"
            placeholder="Détails, critères de succès, contexte…"
            rows={3}
            value={formValues.description}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Échéance</span>
          <input
            name="dueDate"
            type="datetime-local"
            value={formValues.dueDate}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Durée estimée (minutes)</span>
          <input
            name="estimatedMinutes"
            type="number"
            min="5"
            step="5"
            value={formValues.estimatedMinutes}
            onChange={handleChange}
          />
          <small className="hint">≈ {estimatedHours} h</small>
        </label>

        <label className="full-width">
          <span>Tags</span>
          <input
            name="tags"
            type="text"
            placeholder="client, sécurité, interne…"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
          <small className="hint">Séparez les tags par des virgules</small>
        </label>

        {isEditMode && (
          <label className="checkbox">
            <input
              name="completed"
              type="checkbox"
              checked={formValues.completed}
              onChange={handleChange}
            />
            <span>Marquer comme terminée</span>
          </label>
        )}

        <footer className="form-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </button>
        </footer>
      </form>
    </section>
  );
};

export default TaskForm;
