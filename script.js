const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');

const locationH2 = document.querySelector('#result-box h2');
const timePara = document.getElementById('localtime-p');
const tempPara = document.getElementById('temp-p');
const conditionPara = document.getElementById('condition-p');
const conditionImg = document.getElementById('condition-img');


const getWeather = async (location) => {
  try {
    const resp = await fetch(`https://api.weatherapi.com/v1/current.json?key=c44ea833cdb140efaa443630232209&q=${location}`);
    console.log(resp);
    const data = await resp.json();
    console.log(data);
    return {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country,
      localtime: data.location.localtime,
      temp_f: data.current.temp_f,
      temp_c: data.current.temp_c,
      condition: data.current.condition.text,
      condition_icon: data.current.condition.icon
    };
  } catch (err) {
    console.log(err);
  }
}

const displayWeather = (weather_obj) => {
  locationH2.textContent = `${weather_obj.city}, ${weather_obj.region}, ${weather_obj.country}`;
  timePara.textContent = `Local time: ${weather_obj.localtime}`;
  tempPara.textContent = `Temperature: ${weather_obj.temp_c}°C/${weather_obj.temp_f}°F`;
  conditionPara.textContent = `Conditions: ${weather_obj.condition}`;
conditionImg.src = `https:${weather_obj.condition_icon}`;
}

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  getWeather(searchBox.value).then(displayWeather);
});