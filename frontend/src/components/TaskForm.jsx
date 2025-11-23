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
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ajoutez vos actions et laissez TaskMate prioriser automatiquement.
          </p>
        </div>
        {isEditMode && (
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
      </header>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            className="input w-full"
            placeholder="Ex. Préparer la présentation client"
            value={formValues.title}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            name="description"
            className="input w-full min-h-[80px]"
            placeholder="Détails, critères de succès, contexte…"
            rows={3}
            value={formValues.description}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Échéance
          </label>
          <input
            name="dueDate"
            type="datetime-local"
            className="input w-full"
            value={formValues.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Durée estimée (minutes)
          </label>
          <div className="flex items-center gap-3">
            <input
              name="estimatedMinutes"
              type="number"
              min="5"
              step="5"
              className="input w-full"
              value={formValues.estimatedMinutes}
              onChange={handleChange}
            />
            <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              ≈ {estimatedHours} h
            </span>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tags
          </label>
          <input
            name="tags"
            type="text"
            className="input w-full"
            placeholder="client, sécurité, interne…"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Séparez les tags par des virgules
          </p>
        </div>

        {isEditMode && (
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="completed"
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 dark:border-dark-600 dark:bg-dark-700"
                checked={formValues.completed}
                onChange={handleChange}
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Marquer comme terminée</span>
            </label>
          </div>
        )}

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
            ) : (
              isEditMode ? 'Mettre à jour' : 'Créer la tâche'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
