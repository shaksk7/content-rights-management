# Content Rights Management API

Backend API for managing content licensing and rights 
across territories and platforms.

## Tech Stack
- FastAPI
- PostgreSQL + SQLAlchemy
- Redis (caching)
- JWT Authentication
- Docker

## Run Locally

### Prerequisites
- Docker Desktop running

### Start
```bash
docker-compose up --build
```

### API Docs
```
http://localhost:8000/docs
```

## Authentication
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` — copy the token
3. Click Authorize in Swagger, paste the token

## Endpoints

### Auth
| Endpoint | Method | Description |
|---|---|---|
| /api/auth/register | POST | Register |
| /api/auth/login | POST | Login |
| /api/auth/me | GET | Current user |

### Content
| Endpoint | Method | Description |
|---|---|---|
| /api/content | POST | Add content |
| /api/content | GET | List content |
| /api/content/{id} | GET | Single content |
| /api/content/{id} | PUT | Update content |
| /api/content/{id} | DELETE | Delete content |

### Rights
| Endpoint | Method | Description |
|---|---|---|
| /api/rights | POST | Create rights |
| /api/rights | GET | List rights |
| /api/rights/{id} | GET | Single rights |
| /api/rights/check-availability | POST | Check availability |
| /api/rights/conflicts/list | GET | List conflicts |

### Reports
| Endpoint | Method | Description |
|---|---|---|
| /api/reports/expiring | GET | Expiring rights |
| /api/reports/by-territory | GET | Rights by territory |

## Run Tests
```bash
docker exec -it content-rights-backend-1 pytest tests/ -v
```