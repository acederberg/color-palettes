FROM node:16.14.0

RUN echo 'node:Node!' | chpasswd
RUN echo 'root:Docker!' | chpasswd
WORKDIR /home/node/app
USER node

ENTRYPOINT [ "bash" ]
