# Backend Documentation

## Overview

This backend system is built with Flask and provides a RESTful API for managing projects, tasks, and users. It includes authentication, database models, and migration support.

![Flask](https://img.shields.io/badge/Flask-3.1.1-blue)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0.41-red)
![JWT](https://img.shields.io/badge/JWT_Extended-4.7.1-orange)

## Project Structure

```
backend/
├── app/
│ ├── routes/ 		# API endpoint definitions
│ ├──  init .py 	# Flask application factory
│ ├── config.py 	# Configuration settings
│ ├── models.py 	# Database models
│ └── schemas.py 	# Marshmallow schemas
├── migrations/ 	# Database migration scripts
├── test/ 		# Unit tests
├── requirements.txt 	# Python dependencies
└── run.py 		# Application entry point
```

## ✨Key Features

### 🔐Authentication

- JWT-based authentication
- User registration and login endpoints
- Password hashing
- Role-based access control

### 📦Core Components

| Component         | Description                       |
| ----------------- | --------------------------------- |
| **Models**  | User, Project, Task               |
| **Schemas** | Data validation and serialization |
| **Routes**  | REST API endpoints                |

### 🗃️Database Models

```mermaid
erDiagram
    USER ||--o{ PROJECT : manages
    USER ||--o{ TASK : owns
    PROJECT ||--o{ TASK : contains
```

## 🚀API Endpoints

### 👥Users

| Endpoint                | Method | Description              |
| ----------------------- | ------ | ------------------------ |
| `/api/users/register` | POST   | Register new user        |
| `/api/users/login`    | POST   | Login and get JWT token  |
| `/api/users/me`       | GET    | Get current user profile |

### 📂Projects

| Endpoint               | Method | Description          |
| ---------------------- | ------ | -------------------- |
| `/api/projects`      | POST   | Create new project   |
| `/api/projects`      | GET    | List user's projects |
| `/api/projects/<id>` | GET    | Get project details  |
| `/api/projects/<id>` | PUT    | Update project       |
| `/api/projects/<id>` | DELETE | Delete project       |

### ✅Tasks

| Endpoint            | Method | Description       |
| ------------------- | ------ | ----------------- |
| `/api/tasks`      | POST   | Create new task   |
| `/api/tasks`      | GET    | List user's tasks |
| `/api/tasks/<id>` | GET    | Get task details  |
| `/api/tasks/<id>` | PUT    | Update task       |
| `/api/tasks/<id>` | DELETE | Delete task       |

## 🛠️Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL
- Python3-venv

### Installation

To install the project locally, simply run the `setup_local_dev.sh` script located in the root directory.

### Dependencies

Full list in `requirementes.txt`

### Running the Application

```
flask run
```

### Testing

```
pytest test/
```

## 🚀Deployment

The application is configured for deployment on AWS with:

* Gunicorn as WSGI server
* PostgreSQL database
* Environment-based configuration

## 🔒Security Features

* JWT authentication
* Password hashing
* Role-based access control
* Secure database configuration
* Environment variable protection
