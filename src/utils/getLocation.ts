import fetch from 'node-fetch';

export const getLocation = async (latitude: number, longitude: number) => {
  if (!latitude || !longitude)
    return {
      city: undefined,
      state: undefined,
      forecast: undefined,
    };

  const res = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
  const body = await res.json();

  if (body?.status) {
    return body;
  }

  try {
    const {
      properties: { forecast, relativeLocation },
    } = body;
    const {
      properties: { city, state },
    } = relativeLocation;

    return { city, state, forecast };
  } catch (e) {
    return 'An unknown error occurred, please try again in a few moments';
  }
};
