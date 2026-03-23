FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Same logic: bind to 0.0.0.0 inside container, expose to host 127.0.0.1 in docker-compose.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
