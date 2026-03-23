FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Expose port 8000
EXPOSE 8000

# Run development server to bind only to localhost in docker... wait, if it binds to localhost inside docker, it can't be accessed by the host. So in docker we bind to 0.0.0.0, but in docker-compose we bind to 127.0.0.1 on the host.
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
