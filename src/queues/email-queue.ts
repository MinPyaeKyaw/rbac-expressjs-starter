import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis();

const emailQueue = new Queue('email-queue', { connection });

export const addEmailJobs = async (name: string, emails: any) => {
  const jobs = emails.map((email: any) => ({
    name: name,
    data: email,
  }));
  await emailQueue.addBulk(jobs);
};
