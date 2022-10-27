var timezone = require('./timeZone');
var http = require('http');
var url = require('url');

 let app = http.createServer(serverFunc);

function serverFunc(req, res) {
    var req_url = req.url;
    let data ='';
    let queryString = url.parse(req.url, true).query;

    res.setHeader("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader( "Access-Control-Allow-Origin", "*", "Origin", "x-requested-with", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.writeHead(200, {'Content-Type': 'application/json'});

    if (req_url === "/all-timezone-cities") {
    //   console.log(JSON.stringify(timezone.allTimeZones()));
      let result = JSON.stringify(timezone.allTimeZones());

      writeResponse(res, result);
        res.end();
        return;

    } else if (req_url === "/hourly-forecast") {
    //   console.log("wait for a while");
      let citiesList = timezone.allTimeZones();

      req.on('data', (chunk) => {
        data = JSON.parse(chunk);
      })

      req.on('end', () => {
            let cityDT = data.city_Date_Time_Name;
            let hrs = data.hours;
    
            if(data.city_Date_Time_Name) {
            let weather = timezone.nextNhoursWeather(cityDT, hrs, citiesList);
            // console.log(JSON.stringify(weather));
            writeResponse(res,JSON.stringify(weather));
            }

            res.end();
            return;     
      })

    } else if(queryString.city) {
        let timeForOneCity = timezone.timeForOneCity(queryString.city);
        // console.log(timeForOneCity);
        writeResponse(res, JSON.stringify(timeForOneCity));
        res.end();

    } else {
      console.log("get lost");
      res.end();

    }
}
    app.listen(8080);

    function writeResponse(response, output) {
        response.write(output);
    }