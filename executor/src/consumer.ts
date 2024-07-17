import Redis from 'ioredis';
import { executeTask } from './taskExecutor';

const REDIS_STREAM = 'task_stream';
const GROUP_NAME = 'task_group';
const CONSUMER_NAME = 'executor_1';

export const startConsumer = async () => {
  const client = new Redis({ host: 'redis' });

  // Create a consumer group
  try {
    await client.xgroup('CREATE', REDIS_STREAM, GROUP_NAME, '$', 'MKSTREAM');
    console.log(`Consumer group ${GROUP_NAME} created`);
  } catch (error) {
    if ((error as Error).message.includes('BUSYGROUP')) {
      console.log(`Consumer group ${GROUP_NAME} already exists`);
    } else {
      console.error(`Error creating consumer group: ${(error as Error).message}`);
      throw error;
    }
  }

  console.log(`Waiting for messages in ${REDIS_STREAM}`);

  while (true) {
   try {
      const messages = await client.xreadgroup(
        'GROUP', GROUP_NAME, CONSUMER_NAME,
        'COUNT', 1,
        'BLOCK', 1000,
        'STREAMS', REDIS_STREAM, '>'
      ) as [string, [string, string[]][]][] | null;

      if (messages) {
        console.log(`Received messages: ${JSON.stringify(messages)}`);
        for (const [stream, records] of messages) {
          for (const record of records) {
            console.log(`Received record: ${JSON.stringify(record)}`);
            const [id, fields] = record;
            console.log(`id is ${id}, fields is ${JSON.stringify(fields)}`);
            // Find the task field
            const taskFieldIndex = fields.findIndex(field => field === 'task');
            if (taskFieldIndex !== -1) {
              const taskString = fields[taskFieldIndex + 1];
              const task = JSON.parse(taskString);
              console.log(`Received task: ${task.id}`);
              await executeTask(task);
              await client.xack(REDIS_STREAM, GROUP_NAME, id);
            } else {
              console.error('Task field not found in record');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in Task Executor:', error);
    }
  }
};
