//global variables
const responseContainer = document.querySelector(
  ".container__weather--response"
);
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
const currentHighTemperature = document.querySelector(
  ".current-temperature-max span"
);
const currentLowTemperature = document.querySelector(
  ".current-temperature-min span"
);
const currentHumidity = document.querySelector(".current-humidity span");
const currentVisibility = document.querySelector(".current-visibility span");
const currentWind = document.querySelector(".current-wind span");

const currentWeatherIcon = document.querySelector(".weather-icon img");
const forecastWrapper = document.querySelector(".c-weather");

const errorMessage = document.querySelector(".error-message");
const firstColumnWrapper = document.querySelector(".current-weather-data");
const thirdColumnWrapper = document.querySelector(".current-weather-wrapper");

const apiKey = "cd2abf7f3d9b78235a470a550c43025a";
const baseURLCurrentWeatherData =
  "https://api.openweathermap.org/data/2.5/weather?";
const baseURLGeocodingDirect =
  "https://api.openweathermap.org/geo/1.0/direct?q=";
const baseURLOneCall = "https://api.openweathermap.org/data/2.5/onecall?";
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

function setCurrentDate() {
  let currentDate = new Date(); //this provides the current date
  let currentDay = document.querySelector(".current-day");
  currentDay.innerHTML = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(currentDate);
}

setCurrentDate();

/* function setDay() {
  let nextDays = document.querySelectorAll(".c-weather__day");
  

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
setDay(); */

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
  const celsiusButton = document.querySelector(".celsius");
  const fahrenheitButton = document.querySelector(".fahrenheit");

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

responseContainer.style.display = "none";

function getCurrentWeatherData(response) {
  console.log(response);
  if (response.data && Object.keys(response.data).length > 0) {
    const { name, sys, main, weather, wind, visibility } = response.data;
    const responseCity = name;
    const responseCountry = sys.country;
    const responseTemperature = Math.round(main.temp);
    const responseWeatherDescription = weather[0].description;
    const responseTemperatureFeeling = Math.round(main.feels_like);
    const responseHumidity = main.humidity;
    const responseVisibility = Math.round(visibility / 1000);
    const responseWind = Math.round(wind.speed * 3.6);
    const responseIcon = weather[0].icon;
    const iconObject = iconSwitcher(responseIcon);

    errorMessage.style.display = "none";
    responseContainer.style.display = "block";
    firstColumnWrapper.style.display = "block";
    thirdColumnWrapper.style.display = "flex";
    currentCity.textContent = responseCity;
    currentCountry.textContent = responseCountry;
    currentTemperature.textContent =
      responseTemperature < 10 && responseTemperature > 0
        ? `0${responseTemperature}`
        : responseTemperature;
    currentDescription.textContent = responseWeatherDescription;
    currentTemperatureFeeling.textContent = ` ${responseTemperatureFeeling}`;
    currentHumidity.textContent = ` ${responseHumidity}%`;
    currentVisibility.textContent = ` ${responseVisibility} km`;
    currentWind.textContent = ` ${responseWind} km/h`;
    currentWeatherIcon.setAttribute("src", iconObject.src);
    currentWeatherIcon.setAttribute("alt", iconObject.alt);
  } else {
    responseContainer.style.display = "block";
    firstColumnWrapper.style.display = "none";
    thirdColumnWrapper.style.display = "none";
    currentCity.textContent = "Whoops!";
    currentCountry.textContent = "";
    errorMessage.style.display = "block";
    errorMessage.textContent =
      "sorry, we couldn't find the city... let's try again!";
    forecastWrapper.textContent = "";
    const iconObject = iconSwitcher("");
    currentWeatherIcon.setAttribute("src", iconObject.src);
    currentWeatherIcon.setAttribute("alt", iconObject.alt);
  }
}

function getForecastWeatherData(response) {
  const { daily } = response.data;
  forecastWrapper.innerHTML = "";
  const responseHighestTemperature = Math.round(daily[0].temp.max);
  const responseLowestTemperature = Math.round(daily[0].temp.min);
  currentHighTemperature.textContent = responseHighestTemperature;
  currentLowTemperature.textContent = responseLowestTemperature;
  for (let index = 1; index < daily.length - 1; index++) {
    const { temp, weather, dt } = daily[index];
    const highTemperature = Math.round(temp.max);
    const lowTemperature = Math.round(temp.min);
    const weatherIcon = weather[0].icon;
    const iconObject = iconSwitcher(weatherIcon);
    const day = new Date(dt * 1000);
    const formattedDay = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(day);
    const forecastDescription = weather[0].description;

    forecastWrapper.innerHTML += `<div class="col-12 col-sm-6 mb-3">
    <div class="c-weather__box c-weather__box--${index}">
    <h3 class="c-weather__day c-weather__day--active">${formattedDay}</h3>
    <p class="c-weather__temperature">
      <span class="c-weather__high-temperature">${highTemperature}°</span>
      <span class="c-weather__low-temperature">${lowTemperature}°</span>
    </p>
    <p class="c-weather__description">${forecastDescription}</p>
    <img src="${iconObject.src}" alt="${iconObject.alt}" class="c-weather__icon" />
  </div>
  </div>`;
  }
}

function getAPIURL(baseURL, lat, lon) {
  return `${baseURL}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${apiTemperatureUnitCelsius}`;
}

function getWeatherByCurrentLocation() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    const { latitude, longitude } = pos.coords;
    const apiURLCurrentWeatherData = getAPIURL(
      baseURLCurrentWeatherData,
      latitude,
      longitude
    );
    const apiURLOneCall = getAPIURL(baseURLOneCall, latitude, longitude);
    axios.get(apiURLCurrentWeatherData).then(getCurrentWeatherData);
    axios.get(apiURLOneCall).then(getForecastWeatherData);
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
      const apiURLCurrentWeatherData = getAPIURL(
        baseURLCurrentWeatherData,
        lat,
        lon
      );
      const apiURLOneCall = getAPIURL(baseURLOneCall, lat, lon);

      axios.get(apiURLCurrentWeatherData).then(function (response) {
        getCurrentWeatherData(response);
        currentCity.textContent = name;
      });
      axios.get(apiURLOneCall).then(getForecastWeatherData);
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

const iconSwitcher = (icon) => {
  const iconPath = "assets/icons/";

  switch (icon) {
    case "01d":
      return {
        src: `${iconPath}01d-clear-sun.gif`,
        alt: "clear sky",
      };
    case "01n":
      return {
        src: `${iconPath}01n-clear-moon.png`,
        alt: "clear sky",
      };
    case "02d":
      return {
        src: `${iconPath}02d-few-clouds.gif`,
        alt: "few clouds",
      };
    case "02n":
      return {
        src: `${iconPath}02n-few-clouds.gif`,
        alt: "few clouds",
      };
    case "03d":
    case "03n":
      return {
        src: `${iconPath}03d-03n-clouds.png`,
        alt: "clouds",
      };
    case "04d":
    case "04n":
      return {
        src: `${iconPath}04d-04n-broken-clouds.png`,
        alt: "broken clouds",
      };
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return {
        src: `${iconPath}09d-09n-10d-10n-rain.gif`,
        alt: "rain",
      };
    case "11d":
    case "11n":
      return {
        src: `${iconPath}11d-11n-thunderstorm.gif`,
        alt: "thunderstorm",
      };
    case "13d":
    case "13n":
      return {
        src: `${iconPath}13d-13n-snow.png`,
        alt: "snow",
      };
    case "50d":
    case "50n":
      return {
        src: `${iconPath}50d-50n-mist-fog-dust.png`,
        alt: "mist",
      };
    default:
      return {
        src: `${iconPath}404.png`,
        alt: "not found",
      };
  }
};
