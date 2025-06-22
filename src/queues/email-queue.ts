import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
});

const emailQueue = new Queue('email-queue', { connection });

export const addEmailJobs = async (name: string, emails: any) => {
  const jobs = emails.map((email: any) => ({
    name: name,
    data: email,
  }));
  await emailQueue.addBulk(jobs);
};
