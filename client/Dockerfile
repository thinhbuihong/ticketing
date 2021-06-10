FROM node:14.17-alpine

WORKDIR /app
COPY package.json .
RUN yarn install 
COPY . .

CMD ["yarn","run","dev"]