const path = require("path");
const express = require("express");
const hbs = require("hbs");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:3000",
// };

app.use(cors());
// Proxy configuration
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://puzzle.mead.io/puzzle",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Remove the /api/puzzle prefix when forwarding
    },
  })
);

//define paths for express config
const publicDirPath = path.join(__dirname, "../public");
// const viewsPath = path.join(__dirname, "../views");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static  directory to serve
app.use(express.static(publicDirPath));

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "you must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          address: req.query.address,
          location: location,
          forecast: forecastData,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "you must provide a search term",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Hannah",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Hannah",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Hannah",
    msg: "SOS",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Hannah",
    msg: "Help Article Found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Hannah",
    msg: "Page Not Found",
  });
});

// app.get("", (req, res) => {
//   res.send("<h1>weather content</h1>");
// });

app.listen(3000, () => {
  console.log("server is up on port 3000...");
});
