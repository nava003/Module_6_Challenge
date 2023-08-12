var searchBtn = document.getElementById('searchBtn');
var searchCity = document.getElementById('searchCity');
var searchCard = document.getElementById('searchCard');
var searchHistoryCard = document.getElementById('searchHistoryCard');
var currentWeatherCard = document.getElementById('currentWeatherCard');
var dailyWeatherCard = document.getElementById('dailyWeatherCard');

var openWeatherAPI = "5a53411e129f903ae31c1c2a4945c078";
var citySearchList = [];

function setHistory() {
    citySearchList.push(searchCity.value);
    searchHistoryCard.textContent = "";
    searchCard.textContent = "";

    for (var i = citySearchList.length - 1; i > -1; i--) {
        var cityBtnEl = document.createElement('button');
        cityBtnEl.setAttribute('id', `button${i}`);
        cityBtnEl.setAttribute('class', 'cityBtns');
        cityBtnEl.textContent = citySearchList[i];
        searchHistoryCard.append(cityBtnEl);
    }

    var clearBtnEl = document.createElement('button');
    var saveBtnEl = document.createElement('button');
    clearBtnEl.setAttribute('id', 'clearBtn');
    saveBtnEl.setAttribute('id', 'saveBtn');
    clearBtnEl.textContent = 'Clear History';
    saveBtnEl.textContent = 'Save History';
    searchCard.append(clearBtnEl);
    searchCard.append(saveBtnEl);
}

function getGeoCoords() {
    var openWeatherGeoURL = "https://api.openweathermap.org/geo/1.0/direct";

    fetch(`${openWeatherGeoURL}?q=${searchCity.value}&appid=${openWeatherAPI}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var dataLat = data[0].lat;
            var dataLong = data[0].lon;
            getCurrentWeather(dataLat, dataLong);
            getDailyWeather(dataLat, dataLong);
        });
}

function getCurrentWeather(lat, lon) {
    var openWeatherDayURL = "https://api.openweathermap.org/data/2.5/weather";

    fetch(`${openWeatherDayURL}?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
        });
}

function displayCurrentWeather(dat) {
    currentWeatherCard.textContent = "";

    var cityName = dat.name;
    var timeStamp = new Date(dat.dt * 1000); // Convert UNIX to Date format
    var tsDay = timeStamp.getDate();
    var tsMonth = (timeStamp.getMonth() + 1); // getMonth indexes Jan-Dec as 0-11; +1 gives the actual month number
    var tsYear = timeStamp.getFullYear();

    var headTwoEl = document.createElement('h2');
    headTwoEl.textContent = `${cityName} (${tsMonth}/${tsDay}/${tsYear})`;
    currentWeatherCard.append(headTwoEl);

    var paraEl = document.createElement('p');
    paraEl.innerHTML = `Temp: ${dat.main.temp}&#8457;<br><br>
                        Wind: ${dat.wind.speed} MPH<br><br>
                        Humidity: ${dat.main.humidity}`;
    currentWeatherCard.append(paraEl);
}

function getDailyWeather(lat, lon) {
    var dailyWeatherURL = "https://api.openweathermap.org/data/2.5/forecast";

    fetch(`${dailyWeatherURL}?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayDailyWeather(data);
        });
}

function displayDailyWeather(dat) {
    console.log("\nDaily Weather Data");
    console.log(dat);
}

searchBtn.addEventListener('click', setHistory);
searchBtn.addEventListener('click', getGeoCoords);