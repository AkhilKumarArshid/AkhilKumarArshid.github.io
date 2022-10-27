import {startLoading } from './citiesData.js';
import {updateTopCitiesData} from './topCities.js';
import {updateContinentsData } from './citiesAtGlance.js';


var url = "http://localhost:8080/all-timezone-cities";
async function getcontent () {
    let response = await fetch(url);

if (response.ok) { // if HTTP-status is 200-299
  let json = await response.json();
  startLoading(json);
  updateTopCitiesData();
  updateContinentsData();
} else {
  console.log("HTTP-Error: " + response.status);
}
setTimeout(()=> getcontent(), 144000000);//timer to update cities for every four hours
}
getcontent ();

function getNextNHoursWeather(city) {

    return new Promise(function (resolve, reject) {
          if (city.cityName !== 'Not Available') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var time = new Date().toLocaleString("en-US", {
              timeZone: city.timeZone,
            });
            var city_Date_Time_Name = time + ", " + city.cityName;

            var raw = JSON.stringify({
              city_Date_Time_Name: city_Date_Time_Name,
              hours: 6,
            });

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            let resp = fetch("http://localhost:8080/hourly-forecast", requestOptions)
              .then((response) => response.json())
              .catch((error) => console.log("error", error));

              resolve(resp);
          }
    });
}

function getCityDateAndTime(city) {
  return new Promise(function (resolve, reject) {
    if (city !== "Not Available") {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      let url = "http://localhost:8080/date-time?city=" + city;

      let result = fetch(url, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.log("error", error));

      resolve(result);
    }
  });
}

export{getNextNHoursWeather, getCityDateAndTime};