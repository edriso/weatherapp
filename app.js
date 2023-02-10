// Express to run server and routes
const express = require("express");

// Cors for cross origin allowance
// https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
// const cors = require("cors");

// axios to handle the api request
const axios = require("axios");

// Start up an instance of app
const app = express();

require("dotenv").config();

// configuring ejs
app.set("view engine", "ejs");
// Here we are configuring express to use body-parser as middle-ware to get form data
app.use(express.urlencoded({ extended: true }));

// configuring cors
// app.use(cors());

// Initialize the main project folder
app.use(express.static("public"));

// Handling get requests
app.get("/", (req, res) => {
  res.render("index", { city: "" });
});

app.get("/city/:city", (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.APIKEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios
    .get(url)
    .then((response) => {
      const cityStatus = response.data;

      // let dayOrNight =
      //     cityStatus.weather[0].icon.slice(-1) === "d" ? "Day" : "Night";
      // console.log(dayOrNight);

      res.render("city", { cityStatus, city });
    })
    .catch((error) => {
      res.render("404", { city });
      console.log(error.message);
    });
});

app.get("/*", (req, res) => {
  res.redirect("/");
});

// Handling post request
app.post("/", (req, res) => {
  const city = req.body.city.trim().toLowerCase();

  if (!city) {
    res.redirect("/");
  } else {
    res.redirect("/city/" + city);
  }
});

// Spin up the server
// process.env.PORT for server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
