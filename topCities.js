import {GetValidCities} from "./citiesData.js";

"use strict";

var cityList = [];
var noOfCities;

function updateTopCitiesData() {
  cityList = new GetValidCities();
  displayCityCards();
}

document.getElementsByClassName("display-top-number")[0].addEventListener("input", function () {
    noOfCities = this.value;
    if(! isNaN(parseInt(noOfCities))) {
        noOfCities = parseInt(this.value);
        noOfCities = noOfCities > 10 ? 10 : (noOfCities <= 3 ? 3 : noOfCities);
    }
    let current = document.getElementsByClassName("active");
    if(current.length>0){
        current[0].className = current[0].className.replace(" active", "");
    }
    displayCityCards();
  });

//below code should be part of IIFE along woth displaycitycards function

let selectionIconDiv = document.getElementById("select-icons");
let iconList = selectionIconDiv.getElementsByClassName("w-icon");
for(let i=0; i<iconList.length; i++) {
    iconList[i].addEventListener('click', function(){
        let current = document.getElementsByClassName("active");
        if(current.length>0){
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
        let selectedIcon = this.getAttribute("id");
        filterCards(selectedIcon);
    });
}

//cities are filtered based on the input from the user
function filterCards(iconName) {
    let filteredList = [];

  for (let i = 0; i < cityList.length; i++) {
    
    if (iconName === "sunnyIcon") {
        filteredList = cityList.filter((city) => (city.temperature>29 && city.humidityValue <50 && city.precipitationValue >=50));
    }

    if(iconName === "snowflakeIcon") {
        filteredList = cityList.filter((city) => (city.temperature>19 && city.temperature < 29 && city.humidityValue > 50 && city.precipitationValue <50));
    }

    if(iconName === "rainyIconBlack") {
        filteredList = cityList.filter((city) => (city.temperature < 20 && city.humidityValue >= 50));
    }
  }

  filteredList.sort((a,b)=> {
    if(iconName === "sunnyIcon") {
        return b.temperature - a.temperature;
    }

    if(iconName === "snowflakeIcon") {
        return b.precipitationValue - a.precipitationValue;
    }

    if(iconName === "rainyIconBlack") {
        return b.humidityValue - a.humidityValue;
    }
  });

  displayCityCards(iconName,...filteredList);
}

//displayCityCards takes the array of cities filtered based on user preferance and passes on to display in the container 
  function displayCityCards(iconName, ...filteredList) {
    let start = 0;
    let listLength = filteredList.length > 0 ? filteredList.length-1 : cityList.length-1;
    let length = (noOfCities === '' || noOfCities === undefined) ? listLength :  Math.min(noOfCities-1, listLength);
    let end = length > 3 ? 3 : length;

    let prevCard = document.getElementById('previous');
    prevCard.style.display = 'none';

    let nextCard = document.getElementById('next');
    nextCard.style.display = end === length ? 'none' : 'inline-block';

    if(!iconName) {
        displayCards(start,end,cityList);
    } else {
        displayCards(start, end, filteredList);
    }

    prevCard.onclick = function() {

        start = start===0? start: start-1;
        end = (end-start < 4)? end: end-1;
        displayNextPrev(start,end);
        if(filteredList.length>0) {
        displayCards(start,end,filteredList);
        } else {
            displayCards(start,end,cityList);
        }
    }

    nextCard.onclick = function() {
        end = end === length ? length : end+1;
        start =  (end-start < 4) ? start: start+1;
        displayNextPrev(start,end, length);
        if (filteredList.length>0) {
          displayCards(start, end, filteredList);
        } else {
            displayCards(start,end,cityList);
        }
    }

  }

  //displayCards displays the city cards in the container depending on the users input/preferences
  function displayCards(start, end, citiesList) {
    let listBlock = document.createElement('ul');
    listBlock.setAttribute('class', 'cities-container');
    let cityCardsContainer = document.getElementsByClassName("city-list")[0];
    if(citiesList.length > 0) {
        for(let i=start; i<=end; i++) {
            let city = buildCityCard(citiesList[i]);
            listBlock.appendChild(city);
        }
        cityCardsContainer.replaceChild(listBlock, cityCardsContainer.childNodes[1]);
    } else {
        listBlock.innerHTML = 'currently there are no cities to display, please check after some time';
        cityCardsContainer.replaceChild(listBlock, cityCardsContainer.childNodes[1]);
        document.getElementById('next').style.display = 'none';
    }
  }

  //displayNextPrev function will enable and disable the navigation buttons
  function displayNextPrev(start, end,length) {
    let prevCard = document.getElementById('previous');
    let nextCard = document.getElementById('next');

    if(!!start) {
        prevCard.style.display = 'inline-block';
    } else {
        prevCard.style.display = 'none';
    }

    if(end === length) {
        nextCard.style.display = 'none';
    } else {
        nextCard.style.display = 'inline-block';
    }
  }

  //buildCityCard takes city object as input and build the city card to display in HTML
  function buildCityCard(city) {
    let listItem = document.createElement('li');
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'city-detail');

    let infoDiv = document.createElement('div');
    infoDiv.setAttribute('class', 'city-info');
    let span1 = document.createElement('span');
    span1.innerHTML = city.cityName;
    span1.setAttribute('class', 'bold-text');
    let span2 = document.createElement('span');
    span2.innerHTML = city.time;
    span2.setAttribute('class', 'bold-stext');
    let span3 = document.createElement('span');
    span3.innerHTML = city.date;
    span3.setAttribute('class', 'bold-stext');
    infoDiv.append(span1, span2, span3);

    let humidityDiv = document.createElement('div');
    let hIcon = document.createElement('img');
    hIcon.setAttribute('src', 'Assets/HTML&CSS/Weather Icons/humidityIcon.svg');
    hIcon.setAttribute('alt', 'humidityIcon.svg');
    hIcon.setAttribute('class', 'humidity');
    let humidity = document.createElement('span').innerHTML = city.humidity;
    humidityDiv.append(hIcon, humidity);

    let precDiv = document.createElement('div');
    let pIcon = document.createElement('img');
    pIcon.setAttribute('src', 'Assets/HTML&CSS/Weather Icons/precipitationIcon.svg');
    pIcon.setAttribute('alt', 'precipitationIcon.svg');
    pIcon.setAttribute('class', 'humidity');
    let precipitationIcon = document.createElement('span').innerHTML = city.precipitation;
    precDiv.append(pIcon, precipitationIcon);

    infoDiv.append(humidityDiv, precDiv);

    let tempInfoDiv = document.createElement('div');
    let tempIcon = document.createElement('img');
    tempIcon.setAttribute('src', city.weatherIcon);
    tempIcon.setAttribute('class', 'temp-icon');

    let tempValue = document.createElement('span');
    tempValue.innerHTML = city.temperature + ' °C';
    tempValue.setAttribute('class', 'bold-text');

    let cityIconDiv = document.createElement('div');
    let cityIcon = document.createElement('img');
    cityIcon.setAttribute('src', city.cityIcon);
    cityIcon.setAttribute('alt', city.cityName);
    cityIcon.setAttribute('class','city-icon');
    cityIconDiv.appendChild(cityIcon);

    tempInfoDiv.append(tempIcon, tempValue,cityIconDiv);

    mainDiv.append(infoDiv,tempInfoDiv);
    listItem.appendChild(mainDiv);
    return listItem;
  }

  export {updateTopCitiesData};