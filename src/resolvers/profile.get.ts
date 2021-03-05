import { Request, Response } from 'express';
import { Profile } from '@prisma/client';
import { getTemperature } from '../utils';

export const profileGet = async (req: Request, res: Response) => {
  let result: Profile | null = await req.context.db.profile.findUnique({
    where: { personaId: req.params.personaId },
    include: { interests: true },
  });

  if (!result) {
    res.status(404);
    res.send({ message: 'No profile found' });
    return;
  }

  if (result?.forecastUrl) {
    result.temperature = await getTemperature(result?.forecastUrl);
  }

  res.send(JSON.stringify(result));
};
