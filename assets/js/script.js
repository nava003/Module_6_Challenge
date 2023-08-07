var searchBtn = document.getElementById('searchBtn');
var searchCity = document.getElementById('cityName');

var openWeatherAPI = "5a53411e129f903ae31c1c2a4945c078";
// var stringSample = "London";

function getGeoCoords() {
    var openWeatherGeoURL = "https://api.openweathermap.org/geo/1.0/";

    fetch(`${openWeatherGeoURL}direct?q=${searchCity.value}&appid=${openWeatherAPI}`)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function getWeatherAPI(lat, lon) {
    var openWeatherDayURL = "https://api.openweathermap.org/data/2.5/";

    fetch(`${openWeatherDayURL}forecast?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}`)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

searchBtn.addEventListener('click', getGeoCoords);