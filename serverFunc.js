const timeZone = require('./nodeJs/timeZone.js');

function getdata() {
  return timeZone.allTimeZones();
}

  process.on('message', (msg) => {
    if(msg === 'allTimeZones') {
        const cl = getdata();
        process.send(cl);
    } else if(msg === 'hourly-forecast') {
        let args = process.env;
        // console.log(args.city, args.hours);
        let cities = timeZone.allTimeZones();
        const forecast = timeZone.nextNhoursWeather(args.city, args.hours, cities);
        process.send(forecast);
    } else if(msg === 'date-time') {
        let args = process.env;
        const cityDNT = timeZone.timeForOneCity(args.city);
        process.send(cityDNT);
    }
  });