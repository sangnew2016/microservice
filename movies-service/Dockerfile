# Node v7 as the image to support ES6
FROM node:7.5.0-alpine

# create a new user to our new container and avoid the root user
RUN addgroup -S nupp && adduser -S -g nupp nupp

ENV HOME=/home/nupp

COPY package.json $HOME/app/

COPY src/ $HOME/app/src

ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init

WORKDIR $HOME/app

RUN chown -R nupp:nupp $HOME/* /usr/local/ && \
    chmod +x /usr/local/bin/dumb-init && \
    npm cache clean && \
    npm install --silent --progress=false --production && \
    chown -R nupp:nupp $HOME/*

USER nupp

EXPOSE 3000

CMD ["dumb-init", "npm", "start"]