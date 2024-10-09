# # Dockerfile backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

# dms_stuact_backend/Dockerfile

# FROM node:14

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package*.json ./

# RUN npm install

# # Bundle app source
# COPY . .

# EXPOSE 3001
# CMD [ "node", "server.js" ]
