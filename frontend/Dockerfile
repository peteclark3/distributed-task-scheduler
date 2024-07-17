FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

# workaround to fix react-scripts not found during execution :/
RUN npm install -g create-react-app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
