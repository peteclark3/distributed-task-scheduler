FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# annoying workaround for react-scripts not starting in docker 
# when building only with docker-compose. 
# Makes the frontend take a bit to start on its first run. :/
CMD [ "sh", "-c", "npm install && npm run start" ]
