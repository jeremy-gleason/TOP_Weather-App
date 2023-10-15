const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');

const loadingDiv = document.getElementById('loading-div');

const resultBox = document.getElementById('result-box');
const resultMessage = document.getElementById('result-message');
const locationH2 = document.querySelector('#result-box h2');
const timeSpan = document.getElementById('localtime-span');
const tempSpan = document.getElementById('temp-span');
const tempSelect = document.getElementById('temp-unit');
const conditionSpan = document.getElementById('condition-span');
const conditionImg = document.getElementById('condition-img');

let temp_celsius, temp_fahrenheit;

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

const formatDate = (dateString) => {
  const dateAndTime = dateString.split(" ");
  const yearMonthDay = dateAndTime[0].split("-");
  const hourMinute = dateAndTime[1].split(":");
  let isAM = false;
  let hour = parseInt(hourMinute[0]);
  if (hour > 12) {
    hour -= 12;
  } else if (hour < 12) {
    isAM = true;
    if (hour === 0)
      hour = 12;
  }
  return (new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]).toDateString() + " " + hour + ":" + hourMinute[1] + (isAM ? "AM" : "PM"));
};

const displayWeather = (weather_obj) => {
  console.log('Region: ', weather_obj.region);
  locationH2.textContent = `${weather_obj.city}${weather_obj.region ? ", " + weather_obj.region : ""}, ${weather_obj.country}`;
  timeSpan.textContent = formatDate(weather_obj.localtime);
  tempSpan.textContent = tempSelect.value === 'celsius' ? weather_obj.temp_c : weather_obj.temp_f;
  conditionSpan.textContent = weather_obj.condition;
  conditionImg.src = `https:${weather_obj.condition_icon}`;
}

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (searchBox.validity.valueMissing) {
    console.log("Missing value");
  } else {
    const searchTerm = searchBox.value;
    resultBox.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    resultMessage.textContent = `Searching for "${searchTerm}...`;
    const weather_obj = await getWeather(searchTerm);
    loadingDiv.classList.add('hidden');
    if (!weather_obj) {
      resultMessage.textContent = `No results found for "${searchTerm}".`;
      resultBox.classList.add('hidden');
    }
    else {
      temp_celsius = weather_obj.temp_c;
      temp_fahrenheit = weather_obj.temp_f;
      resultMessage.textContent = `Results found for "${searchTerm}":`;
      resultBox.classList.remove('hidden');
      displayWeather(weather_obj);
    }
  }
});

tempSelect.addEventListener('change', (e) => {
  if (e.target.value === 'celsius')
    tempSpan.textContent = temp_celsius;
  else
    tempSpan.textContent = temp_fahrenheit;
  console.log(e.target);
  console.log(e.target.value);
});