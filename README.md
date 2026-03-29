# Content Rights Management System

A full stack application for managing content licensing
and rights across territories and platforms.

## Tech Stack

**Backend:** FastAPI, PostgreSQL, Redis, SQLAlchemy, JWT, Pytest, Docker

**Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind CSS, Vite

## Run Locally

### Prerequisites
- Docker Desktop running
- Git

### Start
```bash
git clone https://github.com/shaksk7/content-rights-management
cd content-rights
docker compose up --build
```

### Access
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs

## Features
- JWT Authentication
- Content management (movies, series, sports, news)
- Rights licensing across territories and platforms
- Availability checking with Redis caching
- Conflict detection between overlapping rights
- Reports — expiring rights, rights by territory
- Private Docker network — only frontend and backend exposed

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |

### Content
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/content | Create content |
| GET | /api/content | List content |
| GET | /api/content/{id} | Get content |
| PUT | /api/content/{id} | Update content |
| DELETE | /api/content/{id} | Delete content |

### Rights
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/rights | Create rights |
| GET | /api/rights | List rights |
| GET | /api/rights/{id} | Get rights |
| POST | /api/rights/check-availability | Check availability |
| GET | /api/rights/conflicts/list | List conflicts |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/reports/expiring | Expiring rights |
| GET | /api/reports/by-territory | Rights by territory |

## Project Structure
```
content-rights/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── redis_client.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── auth/
│   ├── content/
│   ├── rights/
│   ├── reports/
│   └── tests/
└── frontend/
    ├── Dockerfile
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── store/
    └── package.json
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in values before running.