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
- **Job Queue** – Queued background tasks using Redis & BullMQ.

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

1. **Configure database credentials** (Optional but recommended):

   Before starting, you may want to update the database credentials in `docker-compose.yml` for security:

   - Open `docker-compose.yml`
   - Update the MySQL service environment variables:
     - `MYSQL_ROOT_PASSWORD` - Set your MySQL root password
     - `MYSQL_PASSWORD` - Set your MySQL user password (should match `MYSQL_ROOT_PASSWORD` if using root)
   - Update the app service environment variables to match:
     - `DB_USER` - MySQL username (default: `root`)
     - `DB_PASSWORD` - MySQL password (must match `MYSQL_ROOT_PASSWORD`)
   - Update the MySQL healthcheck password to match your `MYSQL_ROOT_PASSWORD`

   **Example:**

   ```yaml
   mysql:
     environment:
       - MYSQL_ROOT_PASSWORD=your_secure_password
       - MYSQL_PASSWORD=your_secure_password

   app:
     environment:
       - DB_USER=root
       - DB_PASSWORD=your_secure_password
   ```

2. **Build and start all services** (MySQL, Redis, and the Express app):

```bash
docker compose up --build
```

This will automatically:

- Start a MySQL 8.0 database
- Start a Redis server for job queues
- Wait for MySQL to be ready (healthcheck)
- **Automatically run database migrations** to create all tables
- **Automatically run database seeds** to populate initial data
- Build and start the Express.js application

3. **Access the application**:

   - API Server: http://localhost:3000
   - MySQL Database: localhost:3306
   - Redis: localhost:6379

4. **Log in with these credentials** (from seed data):

   The seeds run automatically, so you can immediately log in with any of these test users:

   - **Admin User**
     - Username: `admin`
     - Password: `admin123`
   - **Super Admin User**
     - Username: `superadmin`
     - Password: `admin123`
   - **Developer User**
     - Username: `developer`
     - Password: `password123`
   - **Test User**
     - Username: `testuser`
     - Password: `password123`

### Development Mode (Optional)

If you prefer to run without Docker for development:

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

   - Copy `.env.example` to `.env` (if available)
   - Configure your local MySQL and Redis connections

3. **Run database migrations and seeds**:

```bash
# Run migrations to create database tables
npm run db:migrate

# Run seeds to populate initial data
npm run db:seed
```

4. **Start the development server**:

```bash
npm run dev
```

**Note**:

- When using Docker, migrations and seeds run automatically on container startup
- Do not run SQL schema files directly. Always use migrations to manage your database schema

### 📄 API Documentation

- **API Documentation**: Read README.md in feature folders
- **Technical Documentation**: Read [here](src/docs/tech_docs.md)

### 📄 Additional Resources

1. 📄 Postman collection can be found in `src/docs` folder. Get [here](src/docs/rbac_express.postman_collection.
2. 📝 Read detailed technical documentation [here](src/docs/tech_docs.md)

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
