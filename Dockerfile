FROM node:15 AS builder

WORKDIR /acme

COPY package*.json ./
COPY prisma ./prisma/

RUN npm i

COPY . .

FROM node:15

COPY --from=builder /acme ./

EXPOSE 4000
CMD ["npm", "run", "start"]