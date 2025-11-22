import app from './app';
import dotenv from 'dotenv';
import db from './db/db';
import redisClient from './services/redis';
import {
  worker,
  emailQueue,
  connection as emailQueueConnection,
} from './queues/email-queue';
import { cronTask } from './cron-jobs/sample-cron';
import { Server } from 'http';

// Load environment variables from the .env file
dotenv.config();

// Define the server port: use the PORT from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the Express server and listen on the specified port
const server: Server = app.listen(PORT, () => {
  // Log a message once the server is successfully running
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown configuration
const SHUTDOWN_TIMEOUT = parseInt(process.env.SHUTDOWN_TIMEOUT || '10000', 10); // Default 10 seconds

// Graceful shutdown function
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Set a flag to prevent accepting new requests
  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  // Create a promise that resolves when all cleanup is done
  const cleanupPromises: Promise<void>[] = [];

  // Close BullMQ worker
  cleanupPromises.push(
    worker
      .close()
      .then(() => {
        console.log('✅ BullMQ worker closed');
      })
      .catch((err) => {
        console.error('❌ Error closing BullMQ worker:', err);
      })
  );

  // Close BullMQ queue
  cleanupPromises.push(
    emailQueue
      .close()
      .then(() => {
        console.log('✅ BullMQ queue closed');
      })
      .catch((err) => {
        console.error('❌ Error closing BullMQ queue:', err);
      })
  );

  // Close BullMQ Redis connection
  cleanupPromises.push(
    emailQueueConnection
      .quit()
      .then(() => {
        console.log('✅ BullMQ Redis connection closed');
      })
      .catch((err) => {
        console.error('❌ Error closing BullMQ Redis connection:', err);
      })
  );

  // Stop cron jobs
  try {
    cronTask.stop();
    console.log('✅ Cron jobs stopped');
  } catch (err) {
    console.error('❌ Error stopping cron jobs:', err);
  }

  // Close Redis connection
  cleanupPromises.push(
    redisClient
      .quit()
      .then(() => {
        console.log('✅ Redis connection closed');
      })
      .catch((err) => {
        console.error('❌ Error closing Redis connection:', err);
      })
  );

  // Close database connection
  cleanupPromises.push(
    db
      .destroy()
      .then(() => {
        console.log('✅ Database connection closed');
      })
      .catch((err) => {
        console.error('❌ Error closing database connection:', err);
      })
  );

  // Wait for all cleanup operations to complete
  try {
    await Promise.all(cleanupPromises);
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during graceful shutdown:', err);
    process.exit(1);
  }
}

// Set up timeout for forced shutdown
let shutdownTimer: NodeJS.Timeout | null = null;

function startShutdownTimer(): void {
  if (shutdownTimer) return;

  shutdownTimer = setTimeout(() => {
    console.error('⚠️  Shutdown timeout reached. Forcing exit...');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
}

// Handle termination signals
process.on('SIGTERM', () => {
  startShutdownTimer();
  gracefulShutdown('SIGTERM').catch((err) => {
    console.error('❌ Fatal error during shutdown:', err);
    process.exit(1);
  });
});

process.on('SIGINT', () => {
  startShutdownTimer();
  gracefulShutdown('SIGINT').catch((err) => {
    console.error('❌ Fatal error during shutdown:', err);
    process.exit(1);
  });
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException').catch(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection').catch(() => {
    process.exit(1);
  });
});
