import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import cron from 'node-cron';
import { Task } from './types';

const client = new Redis({ host: 'redis' }); // Adjust connection settings as needed

const tasksKey = 'tasks';

/**
 * Add a new task with the given properties.
 * Automatically generates an id and sets the status to 'pending'.
 */
export const addTask = async (task: Omit<Task, 'id' | 'status'>): Promise<void> => {
  const id = uuidv4();
  const newTask: Task = { ...(task as Task), id, status: 'pending' };
  await client.hset(tasksKey, id, JSON.stringify(newTask));
};

/**
 * Get a list of all tasks.
 */
export const getTaskList = async (): Promise<Task[]> => {
  const tasks = await client.hgetall(tasksKey);
  return Object.values(tasks).map(task => JSON.parse(task));
};

/**
 * Update an existing task with the given id.
 * Allows updating any subset of the task's properties, except for the id.
 */
export const updateTask = async (id: string, task: Partial<Omit<Task, 'id'>>): Promise<void> => {
  const existingTask = await client.hget(tasksKey, id);
  if (existingTask) {
    const updatedTask: Task = { ...(JSON.parse(existingTask) as Task), ...task };
    await client.hset(tasksKey, id, JSON.stringify(updatedTask));
  }
};

/**
 * Remove a task by its id.
 */
export const removeTask = async (id: string): Promise<void> => {
  await client.hdel(tasksKey, id);
};

/**
 * Get a list of tasks that are due for execution.
 * A task is due if its status is 'pending' and its scheduled time has passed.
 */
export const getDueTasks = async (): Promise<Task[]> => {
  const tasks = await client.hgetall(tasksKey);
  const now = Date.now();
  return Object.values(tasks)
    .map(task => JSON.parse(task))
    .filter((task): task is Task => {
      return task.status === 'pending' && new Date(task.schedule).getTime() <= now;
    });
};

/**
 * Get a list of tasks that are scheduled using cron syntax.
 */
export const getCronTasks = async (): Promise<Task[]> => {
  const tasks = await client.hgetall(tasksKey);
  return Object.values(tasks)
    .map(task => JSON.parse(task))
    .filter((task): task is Task => {
      return task.status === 'pending' && task.schedule && isValidCron(task.schedule);
    });
};

/**
 * Mark a task as scheduled.
 */
export const markTaskAsScheduled = async (id: string): Promise<void> => {
  const task = await client.hget(tasksKey, id);
  if (task) {
    const updatedTask: Task = { ...(JSON.parse(task) as Task), status: 'scheduled' };
    await client.hset(tasksKey, id, JSON.stringify(updatedTask));
  }
};

/**
 * Check if the given cron expression is valid.
 */
const isValidCron = (expression: string): boolean => {
  return cron.validate(expression);
};
