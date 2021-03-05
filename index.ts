import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { profilePost } from './src/resolvers/profile.post';
import { profileGet } from './src/resolvers/profile.get';
import { profilePatch } from './src/resolvers/profile.patch';

const app = express();
const router = express.Router();
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      context: {
        db: PrismaClient;
      };
    }
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

router.use((req, res, next) => {
  req.context = { db: prisma };
  next();
});

router.route('/:personaId').get(profileGet).patch(profilePatch).post(profilePost);

app.listen(process.env.APP_PORT || 4000);

console.info('API listening on port', process.env.APP_PORT);
