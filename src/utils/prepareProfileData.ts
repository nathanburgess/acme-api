import { Profile } from '@prisma/client';
import { Request } from 'express';

export const prepareProfileData = (req: Request): Profile => {
  const { latitude: lat, longitude: lon, interests, ...rest } = req.body;
  const { personaId } = req.params;
  const latitude = Number(lat) || undefined;
  const longitude = Number(lon) || undefined;

  let interestsData = undefined;
  if (interests) {
    interestsData = {
      connectOrCreate: interests.map((name: string) => ({
        where: { name_profileId: { profileId: personaId, name } },
        create: { name },
      })),
    };
  }

  return {
    personaId,
    latitude,
    longitude,
    interests: interestsData,
    ...rest,
  };
};
