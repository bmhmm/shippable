FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY app ./app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]