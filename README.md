# Social Platform CTF

This application is a simple social media platform built for a Capture The Flag (CTF) context.

## Architecture
- **Frontend**: React SPA (Vite)
- **Backend**: Django + Django REST Framework
- **Database**: SQLite
- **Styling**: Neo-brutalism CSS

## Setup & Running
The repository includes standard Docker Compose configuration for one-click startup. 
Make sure you have Docker and Docker Compose installed.

```bash
docker-compose up --build
```
The application will be accessible at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/

## Demo Users
The application database comes pre-seeded with the following users:
- `admin` : `password123`
- `alice` : `password123`
- `bob` : `password123`
