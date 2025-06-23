# ExpressJS Starter Template For RBAC Systems

A scalable Express.js project with TypeScript featuring CRUD with pagination, filtering, sorting, file uploads, soft delete, RBAC, JWT authentication, access and audit logs, and cron jobs for scheduled tasks.

![Cover Image](./src/docs/cover.png)

## Features

- **Role-Based Access Control (RBAC)** – Fine-grained access control for different user roles and permissions.
- **CRUD Operations** – Create, Read, Update, Delete endpoints out of the box.
- **Pagination, Filtering, Sorting, Searching** – Easily manage large datasets with built-in pagination, query-based filtering, and sorting mechanisms.
- **File Upload** – Upload and manage files using multer.
- **Soft Delete** – Soft-delete support using timestamps instead of permanently removing data.
- **Multi Delete & Multi Create** – Perform bulk operations with ease.
- **Authentication & Login** – Token-based login system using JWT.
- **Access Logs** – Track all incoming requests for monitoring and debugging.
- **Audit Logs** – Record data changes with before/after snapshots for critical actions.
- **Cron Jobs** – Scheduled background tasks using node-cron.
- **Job Queue** – Queued background tasks using BullMQ.

## 🧱 Tech Stack

- **Express.js** – Web framework
- **TypeScript** – Static type-checking
- **MySQL** – Database
- **Knex** – Query Builder
- **JWT** – Authentication
- **Multer** – File uploads
- **Node-Cron** – Scheduled jobs
- **Redis & BullMQ** – Job Queue
- **Morgan** – Logging
- **Docker** - Containerization
- **ESLint, Prettier** - Controlling code quality
- **Husky** - Git hook

## 📦 Use Case Ideas

- Admin dashboards
- Internal tools
- APIs for web/mobile apps
- SaaS backends

## 🚀 Quick Start

### Prerequisites

- **Docker** - [Download Docker](https://www.docker.com/products/docker-desktop/) 🐳
- **Docker Compose** - Usually comes with Docker Desktop

### Clone the repository

```bash
git clone https://github.com/MinPyaeKyaw/rbac-expressjs-starter.git
cd rbac-expressjs-starter
```

### Start the Application with Docker

1. **Build and start all services** (MySQL, Redis, and the Express app):

```bash
docker compose up --build
```

This will:
- Start a MySQL 8.0 database with the `rbac_express` schema automatically loaded
- Start a Redis server for job queues
- Build and start the Express.js application
- Wait for MySQL to be ready before starting the app

2. **Access the application**:
   - API Server: http://localhost:3000
   - MySQL Database: localhost:3306
   - Redis: localhost:6379

3. **Default database credentials**:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: `your db password`
   - Database: `rbac_express`

4. **Log in with these credentials**:
   - Username: `sai min`
   - Password: `saimin`

### Development Mode (Optional)

If you prefer to run without Docker for development:

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if available)
   - Configure your local MySQL and Redis connections

3. **Start the development server**:
```bash
npm run dev
```

### 📄 API Documentation

- **Postman Collection**: Available in `src/docs/rbac_express.postman_collection.json`
- **Technical Documentation**: Read [here](src/docs/tech_docs.md)
- **Database Schema**: Check `src/docs/rbac_express.sql`

1. Run these commands

```bash
cd rbac-expressjs-starter
npm install
npm run dev
```

2. Log in with this credential

   - username - sai min
   - password - saimin

3. 📄 Postman collection can be found in `src/docs` folder. Get [here](src/docs/rbac_express.postman_collection.
4. 📝 Read detailed technical documentation [here](src/docs/tech_docs.md)

## 👨‍💻 Author

**Sai Min Pyae Kyaw**

💼 Passionate Full Stack Developer | Node.js | TypeScript | React | MySQL  
📍 Based in Myanmar

### 🌐 Connect with me

- 💼 [LinkedIn](https://www.linkedin.com/in/sai-min-pyae-kyaw-369005200/)
- 💻 [GitHub](https://github.com/MinPyaeKyaw)
- 🌍 [Facebook](https://www.facebook.com/minpyae.kyaw.73)

---

Made with ❤️ by Sai Min Pyae Kyaw
