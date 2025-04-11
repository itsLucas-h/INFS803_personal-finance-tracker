# INFS803 — Personal Finance Tracker

A full-stack **Personal Finance Tracker** built for INFS803, following best practices in software engineering, API design, testing, CI/CD, cloud deployment, and collaborative Git workflows.

This backend is built using **Node.js**, **Express**, **TypeScript**, **PostgreSQL (AWS RDS)**, and supports features like authentication, budgeting, goal-setting, transactions tracking, reporting, and secure file uploads to AWS S3.


## Table of Contents

1. [Project Overview](#project-overview)  
2. [Architecture](#architecture)  
3. [Tech Stack](#tech-stack)  
4. [UML Diagram](#uml-diagram)  
5. [Client-Server Flow](#client-server-flow)  
6. [User Flow](#user-flow)  
7. [Git Branching Strategy](#git-branching-strategy)  
8. [API Endpoints](#api-endpoints)  
9. [Authentication Flow](#authentication-flow)  
10. [Setup Instructions](#setup-instructions)  
11. [Testing & Linting](#testing--linting)  
12. [Docker Support](#docker-support)  
13. [CI/CD Pipeline](#cicd-pipeline)  
14. [Deployment](#deployment)  


## Project Overview

This web application allows users to:
- Track **expenses** and **income**
- Set **financial goals** and **monthly budgets**
- View **insightful reports**
- Upload related documents (e.g. receipts) securely to AWS S3
- Authenticate via secure **JWT-based auth**

It follows a **modular, testable, and production-ready** backend architecture with full support for **CI/CD** using GitHub Actions.


## Architecture

- **Client:** React/Next.js frontend
- **Server:** Node.js + Express REST API  
- **Database:** PostgreSQL (AWS RDS)  
- **Storage:** AWS S3 for file uploads  
- **Auth:** JWT with secure middleware  
- **Validation:** Zod  
- **CI/CD:** GitHub Actions → AWS EC2  
- **Dockerized:** For both development and production

### Folder Structure

```txt
INFS803_PERSONAL-FINANCE-TRACKER/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml            # CI/CD workflow: builds Docker image and deploys to AWS EC2
│   │   ├── lint.yml              # ESLint & Prettier checks
│   │   ├── release.yml           # Release tagging & changelog
│   │   └── test.yml              # Runs Jest test suite
│   └── dependabot.yml            # Dependency updates automation
│
├── .vscode/
│   └── settings.json            # Auto linting + Formatting on save 
│
├── backend/
│   ├── coverage/                # Jest test coverage reports
│   ├── dist/                    # Compiled JS output (TypeScript)
│   ├── node_modules/            # Installed backend dependencies
│   ├── scripts/                 # Fix `.js` imports for ESM
│   │
│   ├── src/
│   │   ├── config/              # Environment, DB, S3 configs
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Auth, error, validation middleware
│   │   ├── models/              # Sequelize models
│   │   ├── routes/              # Feature-specific route modules
│   │   ├── services/            
│   │   ├── tests/               # Unit & integration test files
│   │   ├── types/               # Global TypeScript types/interfaces
│   │   ├── uploads/             # File-related logic (presigned URLs, etc.)
│   │   ├── utils/               # S3 uploader and presigner utilities
│   │   ├── validators/          # Zod validation schemas
│   │   ├── app.ts               # Initializes Express app, middleware, and routes
│   │   └── server.ts            # Starts the HTTP server and connects to the database
│   │
│   ├── .dockerignore
│   ├── .env.example             # Template environment config
│   ├── .prettierrc              # Prettier configuration
│   ├── Dockerfile               # Docker container definition
│   ├── eslint.config.js         # ESLint configuration
│   ├── jest.config.ts           # Jest testing config
│   ├── package.json             # Backend package definition
│   ├── package-lock.json
│   └── tsconfig.json            # TypeScript config
│
├── frontend/                    # Frontend app (Next.js, React, etc.)
│   └── node_modules/
│
├── .gitattributes
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Tech Stack

| Component        | Technology                            |
|------------------|---------------------------------------|
| Language         | TypeScript                            |
| Server Framework | Express.js                            |
| Database         | PostgreSQL + Sequelize ORM (AWS RDS)  |
| Authentication   | JWT                                   |
| Validation       | Zod                                   |
| File Storage     | AWS S3                                |
| Deployment       | AWS EC2 + Docker                      |
| Testing          | Jest + Supertest                      |
| Linting          | ESLint + Prettier                     |
| CI/CD            | GitHub Actions                        |



## UML Diagram


## Client-Server Flow


## User Flow


## Git Branching Strategy

This project follows **GitFlow** for organized collaboration.

### Branch Structure

| Branch        | Purpose                                    |
|---------------|--------------------------------------------|
| `main`        | Production-ready code. Auto-deploys to EC2 |
| `develop`     | Integrated working branch                  |
| `feature/*`   | Feature-specific development               |
| `release/*`   | Pre-release finalization & version bumping |
| `hotfix/*`    | Emergency production fixes                 |

```bash

# Feature development
git flow feature start <feature-name>
git flow feature finish <feature-name>

# Release Preparation
git flow release start <version>
git flow release finish <version>

# Hotfix for Production Issues
git flow hotfix start <hotfix-name>
git flow hotfix finish <hotfix-name>

```


## API Endpoints

Transactions
- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

Budgets
- `GET /budgets`
- `POST /budgets`
- `PUT /budgets/:id`
- `DELETE /budgets/:id`

Goals
- `GET /goals`
- `POST /goals`
- `PUT /goals/:id`
- `DELETE /goals/:id`

Reports
- `GET /reports/summary`
- `GET /reports/trends`
- `GET /reports/budget-vs-actual`

Files
- `POST /files/upload`
- `GET /files`

## Authentication Flow

| Endpoint          | Method | Description                    |
|-------------------|--------|--------------------------------|
| `/auth/register`  | POST   | Register a new user            |
| `/auth/login`     | POST   | Authenticate & receive token   |
| `/auth/me`        | GET    | Retrieve user profile          |

JWT tokens are passed via the `Authorization: Bearer <token>` header.



## Setup Instructions

Clone & Install

```bash
git clone https://github.com/your-username/infs803-finance-tracker-backend.git
cd infs803-finance-tracker-backend
npm install
```

Setup Environment Variables

```bash
cp .env.example .env
```
Update with your credentials (PostgreSQL, AWS, JWT, etc.).

Run the Server

```bash
npm run dev
```


## Testing & Linting

Run Tests

```bash
npm run test
```

Linting & Formatting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format using Prettier
```


## Docker Support

1. Build Docker Image

```bash
docker build -t finance-tracker-backend .
```
2. Run the Docker Container

```bash
docker run -d -p 3000:3000 --name finance-api --env-file .env finance-tracker-backend
```

3. Open Browser and go to:  http://localhost:3000

4. Stop and Remove the Container

```bash
docker stop finance-api
docker rm finance-api
```

5. Remove the Image (if needed)

```bash
docker rmi finance-tracker-backend
```

6. Full One-Liner (Rebuild + Run)

```bash
docker stop finance-api && docker rm finance-api && docker build -t finance-tracker-backend . && docker run -d -p 3000:3000 --name finance-api --env-file .env finance-tracker-backend
```

Monitor via Docker Desktop

- Go back to the **Docker Desktop GUI** → Containers tab  
- You’ll see `finance-tracker-backend` running ✅

- Open **Docker Desktop**
- Go to the **Containers** tab
- You should see `finance-tracker-backend` running ✅



## CI/CD Pipeline

CI/CD is fully automated via GitHub Actions:
- Runs test suite on every push
- Builds Docker image on merges to main
- Deploys to AWS EC2
- Tags releases automatically from release/* branches



## Deployment

- Deployed on AWS EC2
- Dockerized with NGINX reverse proxy
- Uses .env for secrets and config

### GitHub Secrets (CI/CD Config)

The following secrets must be configured in your GitHub repository to enable automated deployment to **AWS EC2** via GitHub Actions:

| Secret Name   | Description |
|---------------|-------------|
| `EC2_HOST`    | Public IPv4 address of your EC2 instance. [Find it here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html#Concepts_PublicIP) |
| `EC2_USER`    | SSH username for your instance. Usually `ec2-user` (Amazon Linux), `ubuntu` (Ubuntu). [Reference](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html#AccessingInstancesLinuxCLI) |
| `EC2_KEY`     | Private key for SSH access (your `.pem` file). Store as a **multiline GitHub Secret**. [How to create and download](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#key-pairs-creating) |

### How to Add

1. Go to your repo on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add the three secrets listed above