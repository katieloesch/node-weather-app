const request = require("postman-request");

const geocode = (address, cb) => {
  const geoApi = {
    url: "https://api.mapbox.com/",
    token:
      "pk.eyJ1Ijoia2F0aWUtbCIsImEiOiJjbHd0b2hnMjAwNXJpMmpwbzZqYXlqZ3I0In0.JiuECv_pIS6nOQkPYj0zgg",
  };
  const location = encodeURIComponent(address);
  const url = `${geoApi.url}search/geocode/v6/forward?q=${location}&access_token=${geoApi.token}&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      cb("Unable to connect to location services", undefined);
    } else if (body.features.length === 0) {
      cb("unable to find location", undefined);
    } else {
      const coordinates = body.features[0].geometry.coordinates;
      const fullAddress = body.features[0].properties.full_address;

      cb(undefined, {
        latitude: coordinates[1],
        longitude: coordinates[0],
        location: fullAddress,
      });
    }
  });
};

module.exports = geocode;
