import Redis from 'ioredis';
import cron from 'node-cron';
import { getCronTasks } from './taskStorage';

const REDIS_STREAM = 'task_stream';
const client = new Redis({ host: 'redis' });

const POLLING_INTERVAL = 1000; // Poll every second

interface CustomScheduledTask {
  task: cron.ScheduledTask;
  schedule: string;
}

interface ScheduledTasks {
  [key: string]: CustomScheduledTask;
}

const scheduledTasks: ScheduledTasks = {};

export const startScheduler = async () => {
  console.log('Scheduler connected to Redis');

  const setupCronTasks = async () => {
    const cronTasks = await getCronTasks();
    const currentTaskIds = cronTasks.map(task => task.id);

    // delete tasks that no longer exist
    Object.keys(scheduledTasks).forEach(taskId => {
      if (!currentTaskIds.includes(taskId)) {
        scheduledTasks[taskId].task.stop();
        delete scheduledTasks[taskId];
        console.log(`Removed task: ${taskId}`);
      }
    });

    // add (or update) existing tasks
    for (const task of cronTasks) {
      if (scheduledTasks[task.id]) {
        if (scheduledTasks[task.id].schedule !== task.schedule) {
          scheduledTasks[task.id].task.stop();
          scheduledTasks[task.id] = {
            task: cron.schedule(task.schedule, async () => {
              await client.xadd(REDIS_STREAM, '*', 'id', task.id, 'task', JSON.stringify(task));
              console.log(`Cron task added to queue: ${task.id}`);
            }),
            schedule: task.schedule,
          };
          console.log(`Updated task: ${task.id}`);
        }
      } else {
        scheduledTasks[task.id] = {
          task: cron.schedule(task.schedule, async () => {
            await client.xadd(REDIS_STREAM, '*', 'id', task.id, 'task', JSON.stringify(task));
            console.log(`Cron task added to queue: ${task.id}`);
          }),
          schedule: task.schedule,
        };
        console.log(`Scheduled task: ${task.id}`);
      }
    }
  };

  await setupCronTasks();

  setInterval(setupCronTasks, POLLING_INTERVAL);
};
