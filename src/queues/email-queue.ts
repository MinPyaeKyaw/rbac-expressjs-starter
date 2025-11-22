import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue('email-queue', { connection });

export const addEmailJobs = async (name: string, emails: any) => {
  const jobs = emails.map((email: any) => ({
    name: name,
    data: email,
  }));
  return emailQueue.addBulk(jobs);
};

const worker = new Worker(
  'email-queue',
  async (job: any) => {
    console.log(`Sending email to ${job}`);
    // Simulate email sending logic
    await new Promise((res) => setTimeout(res, 1000));

    return { status: 'sent' };
  },
  { connection }
);

worker.on('completed', (job: any) => {
  console.log(`✅ Email sent: ${job.id}`);
});

worker.on('failed', (job: any, err: any) => {
  console.error(`❌ Failed to send email: ${job.id}`, err);
});

// Export worker, queue, and connection for graceful shutdown
export { worker, emailQueue, connection };
