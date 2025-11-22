import cron from 'node-cron';

const CRON_INTERVALS = {
  ONE_MIN: '* * * * *', // Every minute
  ONE_HOUR: '0 * * * *', // At minute 0 past every hour
  SIX_HOUR: '0 */6 * * *', // Every 6th hour
  TWELVE_HOUR: '0 */12 * * *', // Every 12th hour
  ONE_DAY: '0 0 * * *', // At 00:00 (midnight) every day
  ONE_WEEK: '0 0 * * 0', // At 00:00 every Sunday (weekly)
  ONE_MONTH: '0 0 1 * *', // At 00:00 on the 1st day of every month
} as const;

let cronTask: cron.ScheduledTask | null = null;

// Function to start cron jobs
export function startCronJobs(): cron.ScheduledTask {
  if (cronTask) {
    return cronTask;
  }

  cronTask = cron.schedule(CRON_INTERVALS.ONE_MIN, () => {
    console.log('Cron job running every minute');
    // You can replace this with your task, such as sending an email, cleaning up data, etc.
  });

  console.log('✅ Cron jobs started');
  return cronTask;
}

// Function to stop cron jobs
export function stopCronJobs(): void {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
    console.log('✅ Cron jobs stopped');
  }
}

// Export cron task getter for graceful shutdown
export function getCronTask(): cron.ScheduledTask | null {
  return cronTask;
}
