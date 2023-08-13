var searchBtn = document.getElementById('searchBtn');
var searchCity = document.getElementById('searchCity');
var searchCard = document.getElementById('searchCard');
var searchHistoryCard = document.getElementById('searchHistoryCard');
var currentWeatherCard = document.getElementById('currentWeatherCard');
var dailyWeatherCard = document.getElementById('dailyWeatherCard');

var openWeatherAPI = "5a53411e129f903ae31c1c2a4945c078";
var citySearchList = [];

function verifyInput() {
    var strCityName = searchCity.value;

    // With the given RegEx, if the input carries a non-aplhabetic character, display the error with no further continuation
    var regSpecExp = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var regIntExp = /\d+/g;
    if (regSpecExp.test(strCityName) || regIntExp.test(strCityName)) {
        alert(`Error: Invalid characters found. Try again.`);
        return;
    }

    // So long as the array isn't empty, check to see if a city name was already searched
    if (citySearchList.length !== 0) {
        for (var i = 0; i < citySearchList.length; i++) {
            if (strCityName == citySearchList[i]) {
                alert(`Error: ${strCityName} was already searched.`);
                return;
            }
        }
    }

    // If no errors were thrown, proceed to the next function
    getGeoCoords(strCityName);
}

function getGeoCoords(cityName) {
    var openWeatherGeoURL = "https://api.openweathermap.org/geo/1.0/direct";

    fetch(`${openWeatherGeoURL}?q=${cityName}&appid=${openWeatherAPI}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // This is acting as the final validation check; to see whether or not the API has given a data response
            if(data.length !== 0) {
                var dataLat = data[0].lat;
                var dataLong = data[0].lon;
                setHistory(cityName);
                getCurrentWeather(dataLat, dataLong);
                getDailyWeather(dataLat, dataLong);
            } else {
                // Throw an error message before exiting the function
                alert('Error: Invalid Entry. Try again.');
                return;
            }
        });
}

function setHistory(city) {
    citySearchList.push(city);
    searchHistoryCard.textContent = "";

    for (var n = citySearchList.length - 1; n > -1; n--) {
        var cityBtnEl = document.createElement('button');
        cityBtnEl.setAttribute('id', `button${n}`);
        cityBtnEl.setAttribute('class', 'cityBtns');
        cityBtnEl.textContent = citySearchList[n];
        searchHistoryCard.append(cityBtnEl);
    }

    if (!document.getElementById('clearBtn') && !document.getElementById('saveBtn')) {
        var clearBtnEl = document.createElement('button');
        var saveBtnEl = document.createElement('button');
        clearBtnEl.setAttribute('id', 'clearBtn');
        saveBtnEl.setAttribute('id', 'saveBtn');
        clearBtnEl.textContent = 'Clear History';
        saveBtnEl.textContent = 'Save History';
        searchCard.append(clearBtnEl);
        searchCard.append(saveBtnEl);
    }
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

searchBtn.addEventListener('click', verifyInput);