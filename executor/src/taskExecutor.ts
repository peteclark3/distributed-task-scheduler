import Redis from 'ioredis';
import { Task } from './types';

const REDIS_EXECUTED_LIST = 'task_executed_list';
const client = new Redis({ host: 'redis' });

export const executeTask = async (task: Task) => {
  // Simulate task execution
  console.log(`Executing task: ${task.id} - ${task.type}`);

  // Log task execution to a stream
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

  // Log executed task to a hash set
  await client.rpush(REDIS_EXECUTED_LIST, JSON.stringify(logEntry));
  console.log(`Task logged in hash set: ${task.id}`);
};
