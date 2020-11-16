//Global variables
let apiKey = "43b685724e0c77779a4487b322bb66db";
let apiWeatherUrl = "api.openweathermap.org/data/2.5/weather";
let units = "metric";

//Update location
function searchCity(event){
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");   
  let cityNameLowerCase = searchInput.value.toLowerCase();
  if (cityNameLowerCase === "melbourne"){    
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=melbourne,au&units=metric&appid=43b685724e0c77779a4487b322bb66db`).then(showSearchedCityWeather);
  }
  
  else if (cityNameLowerCase){
    axios.get(`https://${apiWeatherUrl}?q=${cityNameLowerCase}&units=${units}&appid=${apiKey}`).then(showSearchedCityWeather);
  }
  else{
    cityName.innerHTML=null;
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
  console.log(response.data);
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML=Math.round(response.data.main.temp);
  
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML=`Humidity: ${response.data.main.humidity}%`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML=`Wind: ${Math.round((response.data.wind.speed)*3.6)} KMPH`;  
  
  let cityName = response.data.name;  
  let countryCode = response.data.sys.country;  
  let location = document.querySelector("#location-name");
  location.innerHTML = `${cityName}, ${countryCode}`;

  let weatherDescription = document.querySelector("#current-weather-description");
  let weatherDescriptionValue=response.data.weather[0].description;   
  weatherDescription.innerHTML = `${weatherDescriptionValue}`;

  let currentDate = document.querySelector("#current-date-time");
  currentDate.innerHTML = formatDate(response.data.timezone);
}

function showCurrentLocationWeather(response){
    console.log(response.data);
    if ((response.data.main) === undefined){      
    let currentTemp = document.querySelector("#current-temperature");
    currentTemp.innerHTML=Math.round(response.data.list[0].main.temp);    
    let humidity = document.querySelector("#humidity");
    humidity.innerHTML=`Humidity: ${response.data.list[0].main.humidity}%`;

    let windSpeed = document.querySelector("#wind-speed");
    windSpeed.innerHTML=`Wind: ${Math.round((response.data.list[0].wind.speed)*3.6)} KMPH`;  
    
    let cityName = response.data.list[0].name;
    let countryCode = response.data.list[0].sys.country;
    let location = document.querySelector("#location-name");
    location.innerHTML = `${cityName}, ${countryCode}`;

    let weatherDescription = document.querySelector("#current-weather-description");
    let weatherDescriptionValue=response.data.list[0].weather[0].description;   
    weatherDescription.innerHTML = `${weatherDescriptionValue}`;
      }
      else{
      console.log(response.data.main);
      }
}

//Current location 
function showPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude,longitude);
    axios.get(`https://${apiCurrentLocationUrl}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`).then(showCurrentLocationWeather);
}
function currentLocationSearch(){
    navigator.geolocation.getCurrentPosition(showPosition);
}  

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", currentLocationSearch);

//Search form
let form = document.querySelector("form");
form.addEventListener("submit", searchCity);

//Initial load
 axios.get(`http://api.openweathermap.org/data/2.5/weather?q=melbourne,au&units=metric&appid=43b685724e0c77779a4487b322bb66db`).then(showSearchedCityWeather)