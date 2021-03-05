FROM node:15

WORKDIR /acme

RUN npm i -g prisma

ADD ./ ./prisma/

CMD [ "prisma", "migrate", "dev", "--preview-feature", "--name", "init"]