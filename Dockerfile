FROM node:18

# Create directories for frontend and backend code
RUN mkdir -p /usr/src/app/frontend
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet --no-cache --no-progress

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
