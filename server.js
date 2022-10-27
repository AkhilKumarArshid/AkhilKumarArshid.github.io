const express = require('express');
const bodyParser = require('body-parser');
const timeZone = require('./nodeJs/timeZone.js');
const { fork } = require('child_process');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

var citylist;
app.get("/all-timezone-cities", (req, res) => {
  const child = fork('./serverFunc.js');
  child.send('allTimeZones');
  child.on('message', (citylists) => {
    res.send(citylists);
  });
});

app.post("/hourly-forecast", (req, res) => {
  let city = req.body.city_Date_Time_Name;
  let hours = req.body.hours;
  // citylist = timeZone.allTimeZones();
  const child = fork('./serverFunc.js',[], {env: {'city':city, 'hours': hours}});
  child.send('hourly-forecast');
  child.on('message', (weather) => {
    res.send(weather);
  });
});

app.get("/date-time", (req, res) => {
  let city = req.query.city;
  if (city) {
    const child = fork('./serverFunc.js',[], {env: {'city':city}});
    child.send('date-time');
    child.on('message', (cityDNT) => {
    res.send(cityDNT);
  });
  } else {
    res.status(404);
    res.json({ Error: "not a valid Endpoint. please check APU doc" });
  }
});

app.listen(8080, () => {
    console.log('Server started at port localhost:8080');
});

