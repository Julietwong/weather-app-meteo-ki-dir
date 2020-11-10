//Updating Time
let currentTime=new Date();

function updateDate(time){
  let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = days[currentTime.getDay()];
  let date = ('0' + currentTime.getDate()).slice(-2);
  let months =["January","February","March","April","May","June","July","August","Septemver","October","November","December"];
  let month = months[currentTime.getMonth()];
  let hour= ('0' + currentTime.getHours()).slice(-2);
  let minutes=currentTime.getMinutes();
  let formattedDate=`${day}, ${date} ${month}, ${hour}:${minutes}`;
  let currentDate=document.querySelector("#current-date-time");
  currentDate.innerHTML = formattedDate;   
}

function updateForecastDay(time){
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day1 = days[currentTime.getDay()];
  let day2;
  let day3;
  let day4;
  let day5;
  let day6;

  if((1+(currentTime.getDay()))>6){
    day2 = days[1+(currentTime.getDay())-7];
  }
  else{
    day2 = days[1+(currentTime.getDay())];
  }
  if((2+(currentTime.getDay()))>6){
    day3 = days[2+(currentTime.getDay())-7];
  }
  else{
    day3 = days[2+(currentTime.getDay())];
  }
  if((3+(currentTime.getDay()))>6){
    day4 = days[3+(currentTime.getDay())-7];
  }
  else{
    day4= days[3+(currentTime.getDay())];
  }
  if((4+(currentTime.getDay()))>6){
    day5 = days[4+(currentTime.getDay())-7];
  }
  else{
    day5 = days[4+(currentTime.getDay())];
  }
  
  if((5+(currentTime.getDay()))>6){
    day6 = days[5+(currentTime.getDay())-7];
  }
  else{
    day6 = days[5+(currentTime.getDay())];
  }
   
  let forecastDay1 = document.querySelector("#day-1");
  forecastDay1.innerHTML = day1;
  let forecastDay2 = document.querySelector("#day-2");
  forecastDay2.innerHTML = day2;
  let forecastDay3 = document.querySelector("#day-3");
  forecastDay3.innerHTML = day3;
  let forecastDay4 = document.querySelector("#day-4");
  forecastDay4.innerHTML = day4;
  let forecastDay5 = document.querySelector("#day-5");
  forecastDay5.innerHTML = day5;
  let forecastDay6 = document.querySelector("#day-6");
  forecastDay6.innerHTML = day6;
}

updateDate (currentTime);
updateForecastDay(currentTime);

//Update location
function searchCity(event){
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let cityName = document.querySelector("#location-name");  
  let cityNameLowerCase = searchInput.value.toLowerCase();
  if (cityNameLowerCase.value === "melbourne"){
    axios.get(`https://${apiWeatherUrl}?q=melbourne,au&units=${units}&appid=${apiKey}`).then(showSearchedCityWeather);
  }
  else if (cityNameLowerCase){
    axios.get(`https://${apiWeatherUrl}?q=${cityNameLowerCase}&units=${units}&appid=${apiKey}`).then(showSearchedCityWeather);
  }
  else{
    cityName.innerHTML=null;
  }
}

let form = document.querySelector("form");
form.addEventListener("submit", searchCity);

//Convert temperature
function convertToCelcius(event){
  event.preventDefault();
  currentTemperature.innerHTML = 19;
}
function convertToFarenheit(event){
  event.preventDefault();
  currentTemperature.innerHTML= 66;
}
let currentTemperature = document.querySelector("#current-temperature");
//console.log(currentTemperature);
let celciusButton = document.querySelector("#unit-celcius");
celciusButton.addEventListener("click", convertToCelcius);
let farenheitButton = document.querySelector("#unit-farenheit");
//console.log(farenheitButton);
farenheitButton.addEventListener("click", convertToFarenheit);

//Location
let apiKey = "43b685724e0c77779a4487b322bb66db";
let apiWeatherUrl = "api.openweathermap.org/data/2.5/weather";
let apiCurrentLocationUrl = "api.openweathermap.org/data/2.5/find?"
let units = "metric";

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
  weatherDescription.innerHTML = `${weatherDescriptionValue.charAt(0).toUpperCase()+weatherDescriptionValue.slice(1)}`;
  }

  function showCurrentLocationWeather(response){
    console.log(response.data);
    if ((response.data.main) === undefined){
      console.log(response.data.list[0]);
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
  weatherDescription.innerHTML = `${weatherDescriptionValue.charAt(0).toUpperCase()+weatherDescriptionValue.slice(1)}`;
    }
    else{
    console.log(response.data.main);
    }
  }

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