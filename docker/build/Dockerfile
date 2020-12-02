FROM node:lts

ENV NODE_ENV production
ENV DATA_DIR /data

ARG release=latest

WORKDIR /srv

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --silent && mv node_modules ../

COPY . .
RUN rm -R docker && mkdir /data

EXPOSE 80
VOLUME ["/data"]

CMD yarn run start:prod
