import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..', '..', '..');
const scriptPath = resolve(repoRoot, 'ml', 'predict.py');

const fallbackPrioritization = (payload) => {
  const dueDate = payload?.dueDate ? new Date(payload.dueDate) : null;
  const minutes = Number(payload?.estimatedMinutes ?? 30) || 30;
  const now = new Date();

  let urgency = 0;
  if (dueDate) {
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 0) urgency = 1;
    else if (diffHours <= 24) urgency = 0.8;
    else if (diffHours <= 72) urgency = 0.6;
    else urgency = 0.3;
  } else {
    urgency = 0.4;
  }

  let importance = 0.5;
  if (Array.isArray(payload?.tags) && payload.tags.length > 0) {
    if (payload.tags.some((tag) => ['client', 'livraison', 'deadline'].includes(tag.toLowerCase()))) {
      importance = 0.9;
    } else if (payload.tags.some((tag) => ['maintenance', 'low'].includes(tag.toLowerCase()))) {
      importance = 0.3;
    }
  }
  if (minutes >= 240) importance = Math.min(1, importance + 0.2);

  let priorityLabel = 'normal';
  if (urgency >= 0.8 && importance >= 0.7) priorityLabel = 'critical';
  else if (urgency >= 0.7) priorityLabel = 'urgent';
  else if (importance >= 0.7) priorityLabel = 'important';

  return { urgency, importance, priorityLabel };
};

const runPythonProcess = (commands, payload) =>
  new Promise((resolvePromise) => {
    if (!commands.length) {
      return resolvePromise({ result: null, error: new Error('No python executable found') });
    }

    const [command, ...rest] = commands;
    const child = spawn(command, [scriptPath], {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    const handleFallback = (error) => {
      if (error?.code === 'ENOENT' && rest.length) {
        runPythonProcess(rest, payload).then(resolvePromise);
      } else {
        resolvePromise({ result: null, error: error || new Error(stderr || 'unknown error') });
      }
    };

    child.on('error', handleFallback);

    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise({ result: stdout });
      } else {
        handleFallback(new Error(`Exit code ${code}: ${stderr}`));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });

export const prioritizeTask = async (taskData) => {
  if (!existsSync(scriptPath)) {
    console.warn(`ML script not found at ${scriptPath}, skipping Python execution.`);
    return fallbackPrioritization(taskData);
  }

  const pythonCandidates = Array.from(
    new Set(
      [process.env.PYTHON_PATH, 'python', 'python3'].filter(Boolean)
    )
  );

  const payload = {
    title: taskData?.title ?? '',
    description: taskData?.description ?? '',
    dueDate: taskData?.dueDate ?? null,
    estimatedMinutes: taskData?.estimatedMinutes ?? 30,
    tags: taskData?.tags ?? []
  };

  const execution = await runPythonProcess(pythonCandidates, payload);

  if (execution.result) {
    try {
      const parsed = JSON.parse(execution.result);
      return {
        urgency: parsed.urgency,
        importance: parsed.importance,
        priorityLabel: parsed.priorityLabel
      };
    } catch (error) {
      console.error('Failed to parse prioritization response', error);
      return fallbackPrioritization(taskData);
    }
  }

  console.error('Prioritizer fallback engaged', execution.error);
  return fallbackPrioritization(taskData);
};
