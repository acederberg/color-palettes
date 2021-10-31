FROM node

WORKDIR /home/node/app
RUN echo 'node:Node!' | chpasswd
RUN echo 'root:Docker!' | chpasswd
USER node

ENTRYPOINT [ "bash" ]
