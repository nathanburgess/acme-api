import fetch from 'node-fetch';

export const getTemperature = async (forecast: string) => {
  const res = await fetch(forecast);
  const body = await res.json();

  if (body?.status) {
    return body;
  }

  try {
    const {
      properties: { periods },
    } = body;
    const { temperature, temperatureUnit } = periods[0];

    return `${temperature}${temperatureUnit}`;
  } catch (e) {
    return {
      status: 404,
      detail: 'An unknown error occurred, please try again in a few moments',
    };
  }
};
