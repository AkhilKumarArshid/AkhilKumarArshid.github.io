import {GetValidCities} from "./citiesData.js";

"use strict";

var citiesList = [];
function updateContinentsData() {
citiesList = new GetValidCities();
displaycities(citiesList);
}

let continentsName = document.getElementById('continents-name');
var ascending = true;
continentsName.onclick = function() {
let sortedList = groupCitiesByContinentNames();

    if(!ascending) {
        sortedList.reverse();
    }
    changeArrow(ascending, 'continent-arrow');
    ascending = !ascending;
    displaycities(sortedList);
};

let temperature = document.getElementById('continents-temperature');
var lowToHigh = false;
temperature.onclick = function() {
    let list = groupCitiesByContinentNames();
    let citiesBytemp = [];

    if(ascending) {
        list.reverse();
    }

    if(lowToHigh) {
        citiesBytemp = list.sort((a,b) => {
            if(a.continent === b.continent) {
                return a.temperature - b.temperature;
            }
        });
    } else {
        citiesBytemp = list.sort((a,b) => {
            if(a.continent === b.continent) {
                return b.temperature - a.temperature;
            }
        });
    }
    changeArrow(lowToHigh, 'temperature-arrow');
    lowToHigh = !lowToHigh;
    displaycities(citiesBytemp);
};

function groupCitiesByContinentNames() {    
    let continentWiseList = citiesList.sort((a,b) => a.continent > b.continent ? 1 : -1);
    return continentWiseList;
}

//changeArrow takes the flag and className as input 
//and modifies the DOM to display the appropriate directional arrows for sorted continents and temperature
function changeArrow(flag, className) {
    let icon = flag === true ? 'arrowDown.svg' : 'arrowUp.svg';

    let arrowElement = document.getElementById(className);
    arrowElement.setAttribute('src', 'Assets/HTML&CSS/General Images & Icons/' + icon);

}

//displaycities function displays all the cities provided as cards 
function displaycities(cityList) {
    let cardsContainer = document.getElementsByClassName("main-container-3")[0];
    let newContainer = document.createElement('div');
    newContainer.setAttribute('class','continents-grid');
    cardsContainer.replaceChild(newContainer, cardsContainer.childNodes[3]);

    for(let i=0; i<12; i++) {
        let card = buildContinentCityCard(cityList[i]);
        newContainer.appendChild(card);
    }
}

//buildContinentCityCard takes city object as input and build the city card to display in HTML
function buildContinentCityCard(city) {
    let cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'continents-card');

    let cityDiv = document.createElement('div');
    cityDiv.setAttribute('class', 'continent-city');

    let continent = document.createElement('div');
    continent.setAttribute('class', 'cont-name');
    continent.innerHTML = city.continent;

    let currentCity = document.createElement('div');
    currentCity.setAttribute('class', 'city-name');
    currentCity.innerHTML = city.cityName + ', ' + city.time + ' ' + city.timeFormat;

    cityDiv.append(continent, currentCity);

    let weatherInfo = document.createElement('div');
    weatherInfo.setAttribute('class', 'weather-info');

    let tempElement = document.createElement('div');
    tempElement.setAttribute('class', 'bold-text');
    tempElement.innerHTML = city.temperature + ' °C';

    let humidityElement = document.createElement('div');
    humidityElement.setAttribute('class', 'humidity-info');

    let humidityIconElement = document.createElement('img');
    humidityIconElement.setAttribute('class', 'humidity');
    humidityIconElement.setAttribute('src', 'Assets/HTML&CSS/Weather Icons/humidityIcon.svg');
    humidityIconElement.setAttribute('alt', 'humidityIcon.svg');

    let humidityValueElement = document.createElement('span').innerHTML = city.humidity;

    humidityElement.append(humidityIconElement, humidityValueElement);

    weatherInfo.append(tempElement, humidityElement);

    cardContainer.append(cityDiv, weatherInfo);

    return cardContainer;
}

export {updateContinentsData};