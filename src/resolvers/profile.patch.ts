import { Request, Response } from 'express';
import { getLocation, getTemperature, prepareProfileData } from '../utils';

export const profilePatch = async (req: Request, res: Response) => {
  const oldProfile = await req.context.db.profile.findUnique({
    where: {
      personaId: req.params.personaId,
    },
  });

  const profileFields = prepareProfileData(req);

  // If only one coordinate is updated then the original will be used for the other
  let { latitude, longitude } = profileFields;
  if (!latitude && oldProfile) latitude = oldProfile.latitude;
  if (!longitude && oldProfile) longitude = oldProfile.longitude;

  // Verify that location data was successfully retrieved
  const locationData = await getLocation(latitude, longitude);
  if (locationData.status) {
    res.status(locationData.status);
    if (locationData.detail === 'Not Found') {
      res.send({
        message: 'Invalid latitude and/or longitude provided',
      });
    } else {
      res.send({
        message: locationData.detail,
      });
    }
    return;
  }

  const { city, state, forecast } = locationData;

  // Verify that temperature data was successfully retrieved
  const temperature = await getTemperature(forecast);
  if (temperature.status) {
    res.status(temperature.status);
    res.send({
      message: temperature.detail,
    });
    return;
  }

  const data = {
    ...profileFields,
    city,
    state,
    forecastUrl: forecast,
    temperature,
  };

  try {
    const result = await req.context.db.profile.update({
      where: { personaId: profileFields.personaId },
      data,
      include: { interests: true },
    });
    res.send(JSON.stringify(result));
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404);
      res.send({
        message: 'No profile could be found for the given personaId',
      });
    } else {
      res.status(400);
      res.send({
        message: 'An unknown error occurred while processing your request',
        code: e.code,
        error: e.message,
      });
    }
  }
};
