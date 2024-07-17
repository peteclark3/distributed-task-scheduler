import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import cron from 'node-cron';
import { Task } from './types';

const client = new Redis({ host: 'redis' }); 

const tasksKey = 'tasks';

/**
 * Add a new task...
 * Automatically generates an id and sets the status to 'pending'.
 * If the task type is "immediate," set it as a cron job to run in 5 seconds (meeting the criteria for a task to run within 10 seconds).
 * Future consideration: add an immediate task type to the redis stream right here; don't bother storing it?
 */
export const addTask = async (task: Omit<Task, 'id' | 'status'>): Promise<void> => {
  console.log(`task is ${JSON.stringify(task)}`);
  const id = uuidv4();
  let newTask: Task = { ...(task as Task), id, status: 'pending' };
  console.log(`newTask is ${JSON.stringify(newTask)}`);

  if (task.type === 'immediate') {
    const now = new Date();
    const seconds = (now.getSeconds() + 5) % 60;
    const minutes = (now.getSeconds() + 5 >= 60) ? now.getMinutes() + 1 : now.getMinutes();
    const cronExpression = `${seconds} ${minutes} ${now.getHours()} ${now.getDate()} ${now.getMonth() + 1} *`;
    newTask = { ...newTask, schedule: cronExpression };
  }

  await client.hset(tasksKey, id, JSON.stringify(newTask));
};

export const getTaskList = async (): Promise<Task[]> => {
  const tasks = await client.hgetall(tasksKey);
  return Object.values(tasks).map(task => JSON.parse(task));
};

/**
 * Update an existing task with the given id.
 * Allows updating any subset of the task's properties, except for the id, per the type definition,
 * additionally making it super clear that id is not mutable by having it be its own parameter. :) 
 */
export const updateTask = async (id: string, task: Partial<Omit<Task, 'id'>>): Promise<void> => {
  const existingTask = await client.hget(tasksKey, id);
  if (existingTask) {
    const updatedTask: Task = { ...(JSON.parse(existingTask) as Task), ...task };
    await client.hset(tasksKey, id, JSON.stringify(updatedTask));
  }
};

export const removeTask = async (id: string): Promise<void> => {
  await client.hdel(tasksKey, id);
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
 * Check if the given cron expression is valid.
 */
const isValidCron = (expression: string): boolean => {
  return cron.validate(expression);
};
