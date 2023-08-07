var searchBtn = document.getElementById('searchBtn');
var searchCity = document.getElementById('cityName');
var searchHistoryCard = document.getElementById('searchHistoryCard');
var cityWeatherCard = document.getElementById('cityWeatherCard');

var openWeatherAPI = "5a53411e129f903ae31c1c2a4945c078";
// var stringSample = "London";
var citySearchList = [];

function setHistory() {
    citySearchList.push(searchCity.value);

    for (var i = 0; i < citySearchList.length; i++) {
        var btnEl = $('button');
        btnEl.attr('button', (i + 1));
    }
}

function getGeoCoords() {
    var openWeatherGeoURL = "https://api.openweathermap.org/geo/1.0/";

    fetch(`${openWeatherGeoURL}direct?q=${searchCity.value}&appid=${openWeatherAPI}`)
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            var dataLat = data[0].lat;
            var dataLong = data[0].lon;
            getCurrentWeather(dataLat, dataLong);
        });
}

function getCurrentWeather(lat, lon) {
    var openWeatherDayURL = "https://api.openweathermap.org/data/2.5/";

    fetch(`${openWeatherDayURL}weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}&units=imperial`)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

searchBtn.addEventListener('click', setHistory);
searchBtn.addEventListener('click', getGeoCoords);