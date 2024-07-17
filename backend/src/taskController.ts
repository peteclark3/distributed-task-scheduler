import { Request, Response } from 'express';
import { addTask, getTaskList, updateTask, removeTask } from './taskStorage';
import Redis from 'ioredis';

const REDIS_EXECUTED_LIST = 'task_executed_list';
const client = new Redis({ host: 'redis' });

export const registerTask = async (req: Request, res: Response) => {
  const task = req.body;
  console.log(`registerTask: ${JSON.stringify(task)}`);
  await addTask(task);
  res.status(201).send('Task registered');
};

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await getTaskList();
  res.status(200).json(tasks);
};

export const editTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = req.body;
  await updateTask(id, task);
  res.status(200).send('Task updated');
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await removeTask(id);
  res.status(200).send('Task deleted');
};

export const getExecutedTasks = async (req: Request, res: Response) => {
  try {
    const logs = await client.lrange(REDIS_EXECUTED_LIST, 0, -1);
    const executedTasks = logs.map(log => JSON.parse(log));
    res.status(200).json(executedTasks);
  } catch (error) {
    console.error('Error retrieving executed tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
