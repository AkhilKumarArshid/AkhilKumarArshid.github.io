import {getNextNHoursWeather, getCityDateAndTime} from './httpRequest.js';

"use strict";

var validCities = [];
var timer;

class AvailableCities {
  constructor() {
    this.validCities = validCities;
  }
}

    class GetValidCities extends AvailableCities {
      constructor() {
        super();
        let cityList = [];
        for(let i=0; i<this.validCities.length; i++) {
            let city = new SelectedCityDetails(this.validCities[i].cityName);
            cityList.push(city);
        }
        return cityList;
      }
    }

class SelectedCityDetails {
  constructor(city) {
    let availableList = new AvailableCities();
    let availableCities = availableList.validCities;
    var cityInfo = availableCities.find((item) => item.cityName === city);
    if (cityInfo) {
      let timeAndDate = new Date().toLocaleString("en-US", {
        timeZone: cityInfo.timeZone,
      });

      //setting selected city properties
      let date = timeAndDate.split(',')[0];
      let time = timeAndDate.split(',')[1];
      let temperature = parseInt(cityInfo.temperature.match(/(-?\d+)/)[0]);
      let humidity = parseInt(cityInfo.humidity.match(/(-?\d+)/)[0]);
      let precipitation = parseInt(cityInfo.precipitation.match(/(-?\d+)/)[0]);
      let timeFormat = getTimeFormatIcon(time);
      let formatIcon = timeFormat === 'AM' ? '/Assets/HTML&CSS/General Images & Icons/amState.svg' : '/Assets/HTML&CSS/General Images & Icons/pmState.svg';

      this.cityName = cityInfo.cityName;
      this.time = getFormatedTime(time);
      this.seconds = getSeconds(time);
      this.date = getFormatedDate(date);
      this.temperature = temperature;
      this.humidity = cityInfo.humidity;
      this.humidityValue = humidity;
      this.precipitation = cityInfo.precipitation;
      this.precipitationValue = precipitation;
      this.nextFiveHrs = cityInfo.nextFiveHrs;
      this.weatherIcon = "Assets/HTML&CSS/Weather Icons/" + getWeatherIcon(temperature);
      this.cityIcon = '/Assets/HTML&CSS/Icons_for_cities/' + cityInfo.cityName.toLowerCase() + '.svg';
      this.timeFormat = timeFormat;
      this.timeFormatIcon = formatIcon;
      this.continent = getContName(cityInfo.timeZone);
      this.timeZone = cityInfo.timeZone;

    } else {
      dummyCityObj.call(this);
    }
  }
  updateNextFiveHours(time, format) {
    let currentHour = parseInt(getHour(time));
    let nextFormat = format === 'AM' ? 'PM' : 'AM';

    for (let i = 1; i < 6; i++) {
      if(time === 'Not Available') {
      document.getElementById("hour" + i).innerHTML = 'NIL';
      } else {
        currentHour++;
        let nextHour = currentHour < 12 ? currentHour + format : (currentHour % 12 === 0 ? currentHour + nextFormat : currentHour % 12 + nextFormat);
        document.getElementById("hour" + i).innerHTML = nextHour;
      }

    }
  }
  updateWeatherIcons(currentTemp, nextFivehours) {
    currentTemp = currentTemp === 'NIL' ? 'NIL' : currentTemp + "°C";
    nextFivehours.unshift(currentTemp);

    for (let i = 0; i < 6; i++) {
      let temperature = parseInt(nextFivehours[i].match(/(-?\d+)/));
      if(!isNaN(temperature)) {
        let element = document.getElementById("weather-icons-" + i);
        let iconUrl = "Assets/HTML&CSS/Weather Icons/" + getWeatherIcon(temperature);
        element.setAttribute("src", iconUrl);
        document.getElementById("temperature-" + i).innerHTML = temperature;
      } else {
        document.getElementById("temperature-" + i).innerHTML = nextFivehours[i];
      }
    }
  }
}

function startLoading(fetchedList){
  validCities = fetchedList;
  let citiesList = new GetValidCities();
  let defaultCity = citiesList[0].cityName;
  let listInput = document.getElementsByClassName('selected-city')[0];
  listInput.setAttribute('value', defaultCity);
  updateSelectedCityDetails(defaultCity);

  let dataList = document.getElementById("cities");
  dataList.innerHTML = ''; //clearing existing options available to build a new list
    for (let i = 0; i < citiesList.length; i++) {
    let opt = document.createElement("option");
    opt.setAttribute("value", citiesList[i].cityName);
    dataList.appendChild(opt);
  }
  
  document.getElementsByName("cities")[0].addEventListener("input", function () {
    let city = this.value;
    updateSelectedCityDetails(city); //updates the details for the selected city i.e., time, date, temperature etc.
  });
}

//updateSelectedCityDetails takes city object as input and build the city container to display in HTML
function updateSelectedCityDetails(city) {
    let citydetails = new SelectedCityDetails(city);

    //setting selected city properties

    document.getElementById("hour-minute").innerHTML = citydetails.time;
    document.getElementById("seconds").innerHTML = citydetails.seconds;
    document.getElementById("date").innerHTML = citydetails.date;
    document.getElementById("c-icon").setAttribute('src', citydetails.cityIcon);
    document.getElementById("am-icon").setAttribute('src', citydetails.timeFormatIcon);

    //updating the DOM with live server data
    updateTimeAndDate(citydetails.cityName);

    document.getElementById("temperature").innerHTML = citydetails.temperature;
    let tempF = (citydetails.temperature * 9/5) + 32;
    document.getElementById("temperature-f").innerHTML = citydetails.temperature === 'NIL' ? 'NIL' : Math.round(tempF * 100)/100;

    document.getElementById("humidity").innerHTML = citydetails.humidity;
    document.getElementById("precipitation").innerHTML = citydetails.precipitation;
    citydetails.updateNextFiveHours(citydetails.time, citydetails.timeFormat);

    if(citydetails.cityName === 'Not Available') {
      citydetails.updateWeatherIcons(citydetails.temperature, citydetails.nextFiveHrs);
      if(timer) {
        clearTimeout(timer);
      }
    } else {
    updateNext5HoursWeather(citydetails);
    }
  }

  function updateNext5HoursWeather(citydetails) {
    getNextNHoursWeather(citydetails).then(function (response) {
      let nextFivehours = response.temperature;
      citydetails.updateWeatherIcons(citydetails.temperature, nextFivehours);
    });
     if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => updateNext5HoursWeather(citydetails), 3600000);//timer to update weather for every one hour
  }

  //splits the time string and returns time in hours and minutes format
function getFormatedTime(time) {
    let hour = getHour(time);
    let minutes = time.split(':')[1];
    return hour+':'+minutes;
  }

  //splits the time string and returns time in hours 
  function getHour(time){
    return time.split(':')[0];
  }

  //splits the time string and returns seconds
  function getSeconds(time) {
    return ':'+ time.split(':')[2].split(' ')[0];
  }

  //splits the time string and returns the time format i.e., AM-PM
  function getTimeFormatIcon(time) {
     return time.split(':')[2].split(' ')[1];
  }

  //splits the date string and returns date in a new format to display
  function getFormatedDate(date){
    const day = date.split('/')[1];
    const month = new Date(date).toLocaleString('default', {month: 'short'});
    const year =  date.split('/')[2];
    return day+'-'+month+'-'+year;
  }

  //getWeatherIcon take the temperature and returns the icon to display depending on the temperature value
  function getWeatherIcon(temp){
    if(temp<18){
        return 'rainyIcon.svg';
    } else if(temp >= 18 && temp <= 22 ) {
        return 'windyIcon.svg'
    } else if(temp > 22 && temp <= 29){
        return 'cloudyIcon.svg';
    } else return 'sunnyIcon.svg'
  }

    //returns the continent name 
  function getContName(name) {
    return name.split('/')[0];
  }

  function updateTimeAndDate(city) {
      getCityDateAndTime(city).then(function(response) {
        let res = response.city_Date_Time_Name;
        let date = res.split(',')[0];
        let time = res.split(',')[1];
        let timeFormat = getTimeFormatIcon(time);
        let formatIcon = timeFormat === 'AM' ? '/Assets/HTML&CSS/General Images & Icons/amState.svg' : '/Assets/HTML&CSS/General Images & Icons/pmState.svg';
        document.getElementById("hour-minute").innerHTML = getFormatedTime(time);
        document.getElementById("seconds").innerHTML = getSeconds(time);
        document.getElementById("date").innerHTML = getFormatedDate(date);
        document.getElementById("am-icon").setAttribute('src', formatIcon);
      });
    }

  function dummyCityObj() {
   
    this.cityName = 'Not Available';
    this.time = 'Not Available';
    this.seconds = '';
    this.date = 'Not Available';
    this.temperature = 'NIL';
    this.humidity = 'NIL';
    this.humidityValue = 'NIL';
    this.precipitation = 'NIL';
    this.precipitationValue = 'NIL';
    this.nextFiveHrs = ['NIL', 'NIL', 'NIL', 'NIL', 'NIL'];
    this.cityIcon = '';
    this.timeFormatIcon = '';
  }


  export{GetValidCities, startLoading};