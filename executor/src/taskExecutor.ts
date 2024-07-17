import Redis from 'ioredis';
import { Task } from './types';

const REDIS_EXECUTED_LIST = 'task_executed_list';
const client = new Redis({ host: 'redis' });

export const executeTask = async (task: Task) => {
  // pretend we're executing the task
  console.log(`Executing task: ${task.name} - ${task.type}`);

  // log executed task 
  const logEntry = {
    id: task.id,
    type: task.type,
    name: task.name,
    executedAt: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + " UTC",
  };

  await client.rpush(REDIS_EXECUTED_LIST, JSON.stringify(logEntry));
  console.log(`Task logged in hash set: ${task.id}`);
};
