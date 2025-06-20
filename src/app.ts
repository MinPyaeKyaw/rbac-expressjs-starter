import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middlewares/error-handler';
import helmet from 'helmet';
import './cron-jobs/sample-cron';
import { accessLogFormat, auditLogFormat } from './configs/log-formats';
import auditLogStream from './middlewares/audit-log';
import { upload } from './middlewares/multer-upload';

// Initialize the Express application
const app = express();

// Middleware to set security-related HTTP headers
app.use(helmet());

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to handle file uploads using multer.
app.use(upload.single('file'));

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Middleware to parse URL-encoded payloads (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies attached to the client request
app.use(cookieParser());

// Access Logger middleware that logs each request in ISO date format, HTTP method, and URL
app.use(morgan(accessLogFormat));

// Audit Logger middleware that logs detailed request information to /src/storage/logs/audit.log file
// This includes method, URL, status, response time, content length, and request body
morgan.token('body', (req) => JSON.stringify((req as express.Request).body));
app.use(morgan(auditLogFormat, { stream: auditLogStream }));

// Register all application routes
app.use(routes);

// Register custom error handling middleware at the end
// This ensures it catches errors from previous middlewares or routes
app.use(errorHandler);

// Export the configured Express app for use (e.g., in server.ts)
export default app;
