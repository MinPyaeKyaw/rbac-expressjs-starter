import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import sendEmail from '../utils/node-mailer';

const connection = new IORedis();

const worker = new Worker(
  'email-queue',
  async (job: any) => {
    console.log(`Sending email to ${job.data.to}`);
    await sendEmail({
      to: job.data.to,
      subject: job.data.subject,
      html: job.data.html,
    });
  },
  { connection }
);

worker.on('completed', (job: any) => {
  console.log(`✅ Email sent: ${job.id}`);
});

worker.on('failed', (job: any, err: any) => {
  console.error(`❌ Failed to send email: ${job.id}`, err);
});
