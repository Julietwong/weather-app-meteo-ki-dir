//Global variables
let apiKey = "43b685724e0c77779a4487b322bb66db";
let apiWeatherUrl = "api.openweathermap.org/data/2.5/weather";
let apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
let units = "metric";

//Update location
function searchCity(event){
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");   
  let cityNameLowerCase = searchInput.value.toLowerCase();
  if (cityNameLowerCase === "melbourne"){    
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=melbourne,au&units=metric&appid=43b685724e0c77779a4487b322bb66db`).then(showSearchedCityWeather);
  }
  
  else if (cityNameLowerCase){
    axios.get(`https://${apiWeatherUrl}?q=${cityNameLowerCase}&units=${units}&appid=${apiKey}`).then(showSearchedCityWeather);
  }  
}

//Format date - calculate the date
function formatDate(timezone){
  let time = new Date();
  let localTimeOffset = (time.getTimezoneOffset())*60;
  let UTC = time.setSeconds(time.getSeconds() + localTimeOffset);
  time.setSeconds(time.getSeconds()+timezone);
  let hours = time.getHours();
  if (hours < 10){
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10){
    minutes = `0${minutes}`;         
  }

  //background colour change
 if (hours >= 0 && hours < 5){
    document.getElementById("mainCard").style.backgroundImage="linear-gradient(to top, #09203f 0%, #537895 100%)";
 }
 if (hours >= 5 && hours <= 7){
    document.getElementById("mainCard").style.backgroundImage="linear-gradient(to top, #d9afd9 0%, #97d9e1 100%)";
 }
  if (hours >= 7 && hours < 15){
   document.getElementById("mainCard").style.backgroundImage="linear-gradient(to top, #30cfd0 0%, #330867 100%)";
 }
 if (hours >= 15 && hours < 18 ){
   document.getElementById("mainCard").style.backgroundImage="linear-gradient(120deg, #f6d365 0%, #fda085 100%)";
 }
 if (hours >= 18 && hours <= 24){
    document.getElementById("mainCard").style.backgroundImage="linear-gradient(to top, #09203f 0%, #537895 100%)";
 }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ];
  let day = days[time.getDay()];
  let date = time.getDate();
  let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
  ];

  let month = months[time.getMonth()];
  return `${day}, ${date} ${month}, ${hours}:${minutes}`; 
}

//Update City
function showSearchedCityWeather(response){    
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML=Math.round(response.data.main.temp);
  celciusTemperature = currentTemp.innerHTML;
  
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML=`💧Humidity: ${response.data.main.humidity}%`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML=`💨Wind: ${Math.round((response.data.wind.speed)*3.6)} km/h`;  
  
  let cityName = response.data.name;  
  let countryCode = response.data.sys.country;  
  let location = document.querySelector("#location-name");
  location.innerHTML = `${cityName}, ${countryCode}`;

  let weatherIcon = document.querySelector("#current-weather-icon"); 
  weatherIcon.setAttribute("src",`src/images/icon_${response.data.weather[0].icon}.png`);
  weatherIcon.setAttribute("alt",`${response.data.weather[0].description}`); 
  
  let weatherDescription = document.querySelector("#current-weather-description");
  let weatherDescriptionValue=response.data.weather[0].description;   
  weatherDescription.innerHTML = `${weatherDescriptionValue}`;

  let currentDate = document.querySelector("#current-date-time");
  currentDate.innerHTML = formatDate(response.data.timezone);

  axios.get(`${apiForecastUrl}?q=${cityName},${countryCode}&units=metric&appid=${apiKey}`).then(displayForecast);
}

function formatHours(timezone, timestamp){ 
  let time = new Date(timestamp);  
  let localTimeOffset = (time.getTimezoneOffset())*60;
  let UTC = time.setSeconds(time.getSeconds() + localTimeOffset);
  time.setSeconds(time.getSeconds()+timezone);
  let hours = time.getHours();
  if (hours < 10){
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10){
    minutes = `0${minutes}`;         
  } 
  return `${hours}:${minutes}`; 
}

function displayForecast(response){
  let forecastElement = document.querySelector("#forecast-hours");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 0; index <6;index++){  
  forecast = response.data.list[index];
    let timezone = response.data.city.timezone;
    forecastElement.innerHTML +=`
      <div class="col-2 forecast-3hour">    
          <img 
            class="forecast-3hour-result-icon"
            id = "#"
            src="src/images/icon_${forecast.weather[0].icon}.png"
            alt="">  
        <p class="forecast-3hour" id="3hour-forecast-hour">
          ${formatHours(timezone, forecast.dt*1000)}
        </p>
        <p class="forecast-3hour-result-temperature">
          ${Math.round(forecast.main.temp_max)}° / ${Math.round(forecast.main.temp_min)}°
        </p>								
        <p class="forecast-3hour-result-precipitation">
          💧 ${forecast.main.humidity}%
        </p>								
      </div>	
    `;
  } 
}

//Current location 
function showPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude,longitude);
    axios.get(`https://${apiWeatherUrl}?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`).then(showSearchedCityWeather);
}
function currentLocationSearch(){
    navigator.geolocation.getCurrentPosition(showPosition);
}  

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", currentLocationSearch);

//Search form
let form = document.querySelector("form");
form.addEventListener("submit", searchCity);

//Convert temperature units
let celciusTemperature = null;

function convertToFarenheit(event){
event.preventDefault();
let temperatureValue = document.querySelector("#current-temperature");
let farenheitTemperature = Math.round ((celciusTemperature) * 9/5) + 32;
temperatureValue.innerHTML = farenheitTemperature;
celciusButton.classList.remove("active");
farenheitButton.classList.add("active");
}

function convertToCelcius(event){
  event.preventDefault();
  let temperatureValue = document.querySelector("#current-temperature");
  temperatureValue.innerHTML = celciusTemperature;  
  farenheitButton.classList.remove("active");
  celciusButton.classList.add("active");
}

let farenheitButton = document.querySelector("#unit-farenheit");
farenheitButton.addEventListener("click",convertToFarenheit);

let celciusButton = document.querySelector("#unit-celcius");
celciusButton.addEventListener("click",convertToCelcius);

//Initial load
 axios.get(`https://api.openweathermap.org/data/2.5/weather?q=melbourne,au&units=metric&appid=${apiKey}`).then(showSearchedCityWeather);
