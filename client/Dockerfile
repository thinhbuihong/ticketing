FROM node:14-stretch-slim

WORKDIR /app
COPY package.json .
RUN yarn install 
COPY . .

CMD ["yarn","run","dev"]