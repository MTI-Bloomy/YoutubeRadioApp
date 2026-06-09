FROM node:24.16-alpine3.23

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install

COPY ./src ./src

EXPOSE 3000

CMD ["yarn", "start"]
