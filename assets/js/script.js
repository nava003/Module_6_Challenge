var searchBtn = document.getElementById('searchBtn');
var searchCity = document.getElementById('searchCity');
var searchCard = document.getElementById('searchCard');
var searchHistoryCard = document.getElementById('searchHistoryCard');
var currentWeatherCard = document.getElementById('currentWeatherCard');
var forecastCard = document.getElementById('forecastCard');
var horizontalRuler = document.querySelector('hr');
var footer = document.querySelector('footer');

var openWeatherAPI = "5a53411e129f903ae31c1c2a4945c078";
var citySearchList = [];

currentWeatherCard.setAttribute('style', 'display:none');
horizontalRuler.style = 'display: none';
footer.style = 'display: none';

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
                alert(`${strCityName} was already searched. Check Search History.`);
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
            if (data.length !== 0) {
                var dataLat = data[0].lat;
                var dataLong = data[0].lon;
                cityName = data[0].name;
                setHistory(cityName);
                getCurrentWeather(dataLat, dataLong);
                getForecastWeather(dataLat, dataLong);
            } else {
                // Throw an error message before exiting the function
                alert('Error: Invalid Entry. Try again.');
                return;
            }
        });
}

function setHistory(city) {
    for (var n = 0; n < citySearchList.length; n++) {
        if (city == citySearchList[n]) {
            return;
        }
    }

    citySearchList.push(city);
    searchHistoryCard.textContent = "";
    horizontalRuler.style = 'display:block';
    footer.style = 'display:block';

    for (var d = citySearchList.length - 1; d > -1; d--) {
        var cityBtnEl = document.createElement('button');
        cityBtnEl.setAttribute('id', `button${d}`);
        cityBtnEl.setAttribute('class', 'cityBtns');
        cityBtnEl.textContent = citySearchList[d];
        searchHistoryCard.append(cityBtnEl);
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
    currentWeatherCard.setAttribute('style', 'display:block');
    currentWeatherCard.textContent = "";
    var iconWeatherIMG = dat.weather[0].icon;
    var iconSRC = `https://openweathermap.org/img/wn/${iconWeatherIMG}.png`;

    var cityName = dat.name;
    var timeStamp = new Date(dat.dt * 1000); // Convert UNIX to Date format
    var tsDay = timeStamp.getDate();
    var tsMonth = (timeStamp.getMonth() + 1); // getMonth indexes Jan-Dec as 0-11; +1 gives the actual month number
    var tsYear = timeStamp.getFullYear();

    var cityHeadEl = document.createElement('h2');
    cityHeadEl.textContent = `${cityName} (${tsMonth}/${tsDay}/${tsYear})`;
    var imgEl = document.createElement('img');
    imgEl.setAttribute('src', iconSRC);
    cityHeadEl.append(imgEl);
    currentWeatherCard.append(cityHeadEl);

    var paraEl = document.createElement('p');
    paraEl.innerHTML = `Temp: ${dat.main.temp}&#8457;<br><br>
                        Wind: ${dat.wind.speed} MPH<br><br>
                        Humidity: ${dat.main.humidity} %`;
    currentWeatherCard.append(paraEl);
}

function getForecastWeather(lat, lon) {
    var dailyWeatherURL = "https://api.openweathermap.org/data/2.5/forecast";

    fetch(`${dailyWeatherURL}?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayForecastWeather(data);
        });
}

function displayForecastWeather(dat) {
    forecastCard.textContent = "";

    var forecastHeadEl = document.createElement('h3');
    forecastHeadEl.textContent = '5-Day Forecast:';
    forecastCard.append(forecastHeadEl);

    var forecastRow = document.createElement('div');
    forecastRow.setAttribute('id', 'forecastRow');
    forecastCard.append(forecastRow);

    for (var e = 0; e < dat.list.length; e++) {
        var currTimeStamp = new Date(dat.list[e].dt * 1000);
        if ((e + 1) < dat.list.length) {
            var nextTimeStamp = new Date(dat.list[(e + 1)].dt * 1000);
        }

        if (currTimeStamp.getDate() != nextTimeStamp.getDate()) {
            var dailyCard = document.createElement('div');
            dailyCard.setAttribute('class', 'dailyCard');
            forecastRow.append(dailyCard);

            var dailyDay = nextTimeStamp.getDate();
            var dailyMonth = (nextTimeStamp.getMonth() + 1);
            var dailyYear = nextTimeStamp.getFullYear();

            var dailyHeadEl = document.createElement('h4');
            dailyHeadEl.textContent = `${dailyMonth}/${dailyDay}/${dailyYear}`;
            dailyCard.append(dailyHeadEl);

            var iconForecastIMG = dat.list[e].weather[0].icon;
            var iconForecastSRC = `https://openweathermap.org/img/wn/${iconForecastIMG}.png`;
            var forecastImgEl = document.createElement('img');
            forecastImgEl.setAttribute('src', iconForecastSRC);
            dailyCard.append(forecastImgEl);

            var dailyParaEl = document.createElement('p');
            dailyParaEl.innerHTML = `Temp: ${dat.list[e].main.temp}&#8457;<br><br>
                                    Wind: ${dat.list[e].wind.speed} MPH<br><br>
                                    Humidity: ${dat.list[e].main.humidity} %`;
            dailyCard.append(dailyParaEl);
        }
    }
}

searchBtn.addEventListener('click', verifyInput);
searchHistoryCard.addEventListener('click', function(e) {
    var ctyName = e.target.textContent;
    getGeoCoords(ctyName);
});