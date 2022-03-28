//global variables

const currentTime = document.querySelector(".current-time");
const currentCity = document.querySelector(".current-city");
const currentCountry = document.querySelector(".current-country");
const currentTemperature = document.querySelector(".current-temperature span");
const currentDescription = document.querySelector(
  ".current-weather-description"
);
const currentTemperatureFeeling = document.querySelector(
  ".current-temperature-feeling span"
);
const currentHumidity = document.querySelector(".current-humidity span");
const currentWind = document.querySelector(".current-wind span");

const currentWeatherIcon = document.querySelector(".weather-icon img");
const forecastIcon = document.querySelectorAll(".c-weather__icon");
const forecastWrapper = document.querySelector(".c-weather");

const apiKey = "cd2abf7f3d9b78235a470a550c43025a";
const baseURLCurrentWeatherData =
  "https://api.openweathermap.org/data/2.5/weather?";
const baseURLGeocodingDirect =
  "https://api.openweathermap.org/geo/1.0/direct?q=";
const apiTemperatureUnitCelsius = "metric";
const apiTemperatureUnitFahrenheit = "imperial";

const searchCity = document.querySelector(".c-search");
const currentLocationButton = document.querySelector(".c-search__location");

function setCurrentTime() {
  currentTime.innerHTML = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(new Date());
}
setCurrentTime();
window.setInterval(setCurrentTime, 1000);

function setDay() {
  let nextDays = document.querySelectorAll(".c-weather__day");
  let currentDate = new Date(); //this provides the current date
  let currentDay = document.querySelector(".current-day");
  currentDay.innerHTML = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(currentDate);

  for (let day = 0; day < 6; day++) {
    let nextDayElement = nextDays[day]; // 6 elements c-weather__day

    let nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + day + 1);

    let nextDayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(nextDay);

    nextDayElement.innerHTML = nextDayName;
  }
}
setDay();

/* let formattedCity = (city) => {
  if (!city) {
    return false;
  }

  let cityArray = city.split(" ");

  const cities = [...cityArray]
    .map((city) => {
      return city.charAt(0).toUpperCase() + city.slice(1);
    })
    .join(" ");

  return cities;
}; */

function changeTemperatureNumber() {
  let nextDaysTemperatures = document.querySelectorAll(
    ".c-weather__temperature span"
  );

  const currentTemperatureSpan = document.querySelector(
    ".current-temperature span"
  );
  changeTemperatureScale(
    currentTemperatureSpan,
    currentTemperatureSpan.textContent
  );

  for (
    let eachTemperature = 0;
    eachTemperature < nextDaysTemperatures.length;
    eachTemperature++
  ) {
    let nexDayTemperatureElement = nextDaysTemperatures[eachTemperature];
    let nexDayTemperatureNumber = nexDayTemperatureElement.textContent.replace(
      "°",
      ""
    );

    changeTemperatureScale(nexDayTemperatureElement, nexDayTemperatureNumber);
  }
}

function convertToFahrenheit(temperature) {
  return Math.round((temperature * 9) / 5 + 32);
}

function convertToCelsius(temperature) {
  return Math.round(((temperature - 32) * 5) / 9);
}

function changeTemperatureScale(temperatureElement, temperatureText) {
  let celsiusButton = document.querySelector(".celsius");
  let fahrenheitButton = document.querySelector(".fahrenheit");

  fahrenheitButton.addEventListener("click", function () {
    temperatureElement.innerHTML = `${convertToFahrenheit(temperatureText)}
    
    ${
      temperatureElement.classList.contains("current-temperature-number")
        ? ""
        : "°"
    }`;
  });

  celsiusButton.addEventListener("click", function () {
    temperatureElement.innerHTML = `${convertToCelsius(temperatureText)}${
      temperatureElement.classList.contains("current-temperature-number")
        ? ""
        : "°"
    }`;
  });
}

changeTemperatureNumber();

function getCurrentWeatherData(response) {

  if (response.data && Object.keys(response.data).length > 0) {
    const { name, sys, main, weather, wind } = response.data;
    const responseCity = name;
    const responseCountry = sys.country;
    const responseTemperature = Math.round(main.temp);
    const responseWeatherDescription = weather[0].description;
    const responseTemperatureFeeling = Math.round(main.feels_like);
    const responseHumidity = main.humidity;
    const responseWind = Math.round(wind.speed * 3.6);
    const responseIcon = weather[0].icon;
  
    currentCity.textContent = responseCity;
    currentCountry.textContent = responseCountry;
    currentTemperature.textContent =
      responseTemperature < 10 && responseTemperature > 0
        ? `0${responseTemperature}`
        : responseTemperature;
    currentDescription.textContent = responseWeatherDescription;
    currentTemperatureFeeling.textContent = ` ${responseTemperatureFeeling}°`;
    currentHumidity.textContent = ` ${responseHumidity}%`;
    currentWind.textContent = ` ${responseWind} km/h`;
    iconSwitcher(responseIcon, currentWeatherIcon);
  } else {
    currentCity.textContent = "Whoops!";
    currentCountry.textContent = "";
    currentTemperature.textContent = "";
    currentDescription.textContent = "we couldn't find the city...";
    currentTemperatureFeeling.textContent = "";
    currentHumidity.textContent = "";
    currentWind.textContent = "";
    forecastWrapper.textContent = "";
    iconSwitcher("", currentWeatherIcon);
  }
}

function getAPIURL(lat, lon) {
  return `${baseURLCurrentWeatherData}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${apiTemperatureUnitCelsius}`;
}

function getWeatherByCurrentLocation() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    const { latitude, longitude } = pos.coords;
    const apiURLCurrentWeatherData = getAPIURL(latitude, longitude);
    axios.get(apiURLCurrentWeatherData).then(getCurrentWeatherData);
  });
}
getWeatherByCurrentLocation();

searchCity.addEventListener("submit", function (event) {
  event.preventDefault();
  const typedCity = searchCity.querySelector(".typed-city");
  const typedCityValue = typedCity.value.trim().toLowerCase();
  const apiURLGeocodingDirect = `${baseURLGeocodingDirect}${typedCityValue}&limit=5&appid=${apiKey}`;

  axios.get(apiURLGeocodingDirect).then(function (response) {
    if (response.data && response.data[0]) {
      const { lat, lon, name } = response.data[0];
      const apiURLCurrentWeatherData = getAPIURL(lat, lon);

      axios.get(apiURLCurrentWeatherData).then(function (response) {
        getCurrentWeatherData(response);
        currentCity.textContent = name;
      });
    } else {
      getCurrentWeatherData({});
    }
  });

  typedCity.value = "";
});

currentLocationButton.addEventListener("click", function (event) {
  event.preventDefault();
  getWeatherByCurrentLocation();
});

/* const wrapperParentElement = document.querySelector(".current-weather-wrapper");

function updateCurrentWeatherWrapper() {
  removeChildren(wrapperParentElement);
  wrapperParentElement.insertAdjacentHTML(
    "afterbegin",
    weatherWrapperTemplate()
  );
}

function removeChildren(parent) {
  parent.innerHTML = "";
}

function weatherWrapperTemplate() {
  return `
<p class="current-weather-title">be weather ready</p>
<span class="current-weather-dot">··</span>
<p class="current-weather-description">Cloudy</p>
<span class="current-weather-dot">··</span>
<p class="current-humidity">68% humidity</p>
<span class="current-weather-dot">··</span>
<p class="current-wind">18 km/h wind</p>
<span class="current-weather-dot">··</span>
 `;
} */

const iconSwitcher = (icon, image) => {
  const iconPath = "assets/icons/";

  switch (icon) {
    case "01d":
      image.src = `${iconPath}01d-clear-sun.gif`;
      image.alt = "clear sky";
      break;
    case "01n":
      image.src = `${iconPath}01n-clear-moon.png`;
      image.alt = "clear sky";
      break;
    case "02d":
      image.src = `${iconPath}02d-few-clouds.gif`;
      image.alt = "few clouds";
      break;
    case "02n":
      image.src = `${iconPath}02n-few-clouds.gif`;
      image.alt = "few clouds";
      break;
    case "03d":
    case "03n":
      image.src = `${iconPath}03d-03n-clouds.png`;
      image.alt = "clouds";
      break;
    case "04d":
    case "04n":
      image.src = `${iconPath}04d-04n-broken-clouds.png`;
      image.alt = "broken clouds";
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      image.src = `${iconPath}09d-09n-10d-10n-rain.gif`;
      image.alt = "rain";
      break;
    case "11d":
    case "11n":
      image.src = `${iconPath}11d-11n-thunderstorm.gif`;
      image.alt = "thunderstorm";
      break;
    case "13d":
    case "13n":
      image.src = `${iconPath}13d-13n-snow.png`;
      image.alt = "snow";
      break;
    case "50d":
    case "50n":
      image.src = `${iconPath}50d-50n-mist-fog-dust.png`;
      image.alt = "mist";
      break;
    default:
      image.src = `${iconPath}404.png`;
      image.alt = "not found";
      break;
  }
};

function updateForecastIcons() {
  forecastIcon.forEach((element) => {
    iconSwitcher("", element);
  });
}

updateForecastIcons();
