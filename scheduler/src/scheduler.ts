import Redis from 'ioredis';
import cron from 'node-cron';
import { getCronTasks } from './taskStorage';

const REDIS_STREAM = 'task_stream';
const client = new Redis({ host: 'redis' });

const POLLING_INTERVAL = 1000; // Poll every second

export const startScheduler = async () => {
  console.log('Scheduler connected to Redis');

  const scheduledTasks: { [key: string]: boolean } = {};

  const setupCronTasks = async () => {
    // Get cron tasks from the storage
    const cronTasks = await getCronTasks();
    for (const task of cronTasks) {
      // Check if the task is already scheduled to avoid duplication
      if (!scheduledTasks[task.id]) {
        cron.schedule(task.schedule, async () => {
          await client.xadd(REDIS_STREAM, '*', 'id', task.id, 'task', JSON.stringify(task));
          console.log(`Cron task added to queue: ${task.id}`);
        });
        scheduledTasks[task.id] = true;
        console.log(`Scheduled task: ${task.id}`);
      }
    }
  };

  // Initial setup of cron tasks
  await setupCronTasks();

  // Poll for new cron tasks at the specified interval
  setInterval(setupCronTasks, POLLING_INTERVAL);
};
