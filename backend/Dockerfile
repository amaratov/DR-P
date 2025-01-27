# FROM node:18-alpine
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y g++ make python3-pip
RUN npm ci --omit=optional --omit=dev
RUN mkdir /.config && chmod 777 /.config
COPY ./ ./
EXPOSE 3000
CMD [ "npm", "start" ]