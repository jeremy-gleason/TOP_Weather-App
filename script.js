const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');

const resultBox = document.getElementById('result-box');
const resultMessage = document.getElementById('result-message');
const locationH2 = document.querySelector('#result-box h2');
const timePara = document.getElementById('localtime-p');
const tempPara = document.getElementById('temp-p');
const tempSelect = document.getElementById('temp-unit');
const conditionPara = document.getElementById('condition-p');
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
  } else {
    isAM = true;
    if (hour === 0)
      hour = 12;
  }
  return (new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]).toDateString() + " " + hour + ":" + hourMinute[1] + (isAM ? "AM" : "PM"));
};

const displayWeather = (weather_obj) => {
  console.log('Region: ', weather_obj.region);
  locationH2.textContent = `${weather_obj.city}${weather_obj.region ? ", " + weather_obj.region : ""}, ${weather_obj.country}`;
  timePara.textContent = `Local time: ${formatDate(weather_obj.localtime)}`;
  tempPara.textContent = `Temperature: ${tempSelect.value === 'celsius' ? weather_obj.temp_c : weather_obj.temp_f}`;
  conditionPara.textContent = `Conditions: ${weather_obj.condition}`;
  conditionImg.src = `https:${weather_obj.condition_icon}`;
}

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (searchBox.validity.valueMissing) {
    console.log("Missing value");
  } else {
    const searchTerm = searchBox.value;
    // searchBox.value = "";
    const weather_obj = await getWeather(searchTerm);
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
    tempPara.textContent = `Temperature: ${temp_celsius}`;
  else
    tempPara.textContent = `Temperature: ${temp_fahrenheit}`;
  console.log(e.target);
  console.log(e.target.value);
});