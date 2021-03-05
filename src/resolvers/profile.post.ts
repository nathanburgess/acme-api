import { Request, Response } from 'express';
import { getLocation, prepareProfileData } from '../utils';

export const profilePost = async (req: Request, res: Response) => {
  const profileFields = prepareProfileData(req);
  const { city, state, forecast } = await getLocation(
    profileFields.latitude,
    profileFields.longitude
  );

  const data = {
    ...profileFields,
    city,
    state,
    forecastUrl: forecast,
  };

  let missingFields = [];
  if (!data.firstName) missingFields.push('firstName');
  if (!data.lastName) missingFields.push('lastName');
  if (!data.latitude) missingFields.push('latitude');
  if (!data.longitude) missingFields.push('longitude');

  if (missingFields.length) {
    res.status(400);
    res.send({
      message: 'Your request is missing some required fields:',
      fields: missingFields,
    });
    return;
  }

  try {
    const result = await req.context.db.profile.create({
      data,
      include: { interests: true },
    });
    res.send(JSON.stringify(result));
  } catch (e) {
    if (e.code === 'P2002') {
      res.status(422);
      res.send({
        message: 'A profile with the given persona ID already exists',
      });
    } else {
      res.status(400);
      res.send({
        message: 'An unknown error occurred while processing your request',
        code: e.code,
      });
    }
  }
};
