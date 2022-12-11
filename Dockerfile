FROM node:16

WORKDIR /app

COPY index.js handlers.js model.js package.json ./

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
