const request = require('postman-request');

const forecast = (latitude, longitude, cb) => {
  const weatherApi = {
    url: 'http://api.weatherstack.com/',
    key: 'c703d7a73d02bf90d8e94cebba5cd12c',
  };

  const url = `${weatherApi.url}current?access_key=${weatherApi.key}&query=${latitude},${longitude}&units=m`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      // low level error handling
      cb('unable to connect to weather service!', undefined);
    } else if (body.error) {
      // error handling for no matching results
      cb('Unable to find location', undefined);
    } else {
      const current = body.current;

      cb(
        undefined,
        `${current.weather_descriptions[0]} - ${current.temperature}°C   | cloud cover: ${current.cloudcover}%   |   humidity: ${current.humidity}%   |   wind speed: ${current.wind_speed} km/h`
      );
    }
  });
};

module.exports = forecast;
