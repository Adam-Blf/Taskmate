const average = (values) => {
  if (!values.length) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Number((sum / values.length).toFixed(2));
};

export const buildStats = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed);
  const activeTasks = totalTasks - completedTasks.length;
  const now = new Date();

  const overdueTasks = tasks.filter(
    (task) => task.dueDate && !task.completed && new Date(task.dueDate) < now
  );

  const completionRate = totalTasks
    ? Number(((completedTasks.length / totalTasks) * 100).toFixed(1))
    : 0;

  const urgencyScores = tasks.map((task) => task.urgency ?? 0);
  const importanceScores = tasks.map((task) => task.importance ?? 0);

  const completionDurations = completedTasks
    .filter((task) => task.completedAt)
    .map((task) => {
      const end = new Date(task.completedAt).getTime();
      const start = new Date(task.createdAt).getTime();
      return (end - start) / (1000 * 60 * 60); // hours
    })
    .filter((value) => value >= 0);

  const focusScore = Number(
    (0.6 * average(importanceScores) + 0.4 * average(urgencyScores)).toFixed(2)
  );

  return {
    totalTasks,
    activeTasks,
    completedTasks: completedTasks.length,
    completionRate,
    overdueTasks: overdueTasks.length,
    averageUrgency: average(urgencyScores),
    averageImportance: average(importanceScores),
    averageCompletionHours: average(completionDurations),
    focusScore
  };
};
