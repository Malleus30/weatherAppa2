'use strict'

import {UI} from './view.js';
import { FORECAST_UI } from './view.js';
import {STORAGE} from './storage.js';

let globalCityName='';


  UI.btn.addEventListener('click',change);

  UI.heart_picture.style.display = 'none';
  UI.heart_picture.addEventListener('click', addLocation);



  inp.addEventListener('keydown', (e) =>{
    
  
    if(e.keyCode===13){
     const cityName = e.target.value;

     ultimateFetchRequest(cityName);
       
       showNow.style.display = 'block';
       showDetails.style.display = 'none';
       showForecast.style.display = 'none';  
    } 
});


  function addRemovalElement(){
    const deleteLocationIcon = document.querySelectorAll('.close');
   
    deleteLocationIcon.forEach(function(btn){
    btn.addEventListener('click',deleteLocationFunc);
})
}


  function deleteLocationFunc(){
    
    this.parentElement.remove();
    
    let key = this.previousElementSibling.textContent;


   let array = STORAGE.getFavoredFromStorage();
    let index = array.indexOf(key)
    

    array.splice(index,1);
  
    STORAGE.setFavoredToStorage(array);
}
 


function change(event){
 
  if(event.target.classList.contains('now'))  show(showNow);
  if(event.target.classList.contains('nowP')) show(showNow);

  if(event.target.classList.contains('details'))  show(showDetails);
  if(event.target.classList.contains('detailsP'))  show(showDetails);
  
  if(event.target.classList.contains('forecast'))  show(showForecast);
  if(event.target.classList.contains('forecastP'))  show(showForecast);
  
}



function show(id){

showNow.style.display = 'none';
showDetails.style.display = 'none';
showForecast.style.display = 'none';
 
   id.style.display='block'
}


const render = data =>{

    UI.bigCloudIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    UI.bigNumber.textContent = Math.round(data.main.temp-273);
    UI.bigNumber.textContent +='°'; 

    UI.showDetailsHeader.textContent = data.name;
    UI. detailsTemp.textContent = `Temperature: ${Math.round(data.main.temp-273)}°`;
    UI.detailsFeels.textContent= `Feels like: ${Math.round(data.main.feels_like- 273)}°`;
    UI.detailsWeather.textContent = `Weather: ${data.weather[0].main}`;
    UI.detailsSunrise.textContent = `Sunrise: ${timeTransform(data.sys.sunrise)}`;
    UI.detailsSunset.textContent = `Sunset: ${timeTransform(data.sys.sunset)}pm`;

    UI.smalSityName.textContent = data.name;

    globalCityName = UI.smalSityName.textContent;

}

const renderForecast = data => {
    
     let result = '';
     FORECAST_UI.showForecast.innerHTML = result;   
     let paragrath = document.createElement('p');
      paragrath.textContent = data.city.name;
      paragrath.classList.add('text');
      paragrath.classList.add('forecastHeader'); 

     data.list.forEach(item =>{
       const elem = ` <div class="weather_window twelve">
       <div class="date smalText"><p class="date12">${ timeTransformIntoDay(item.dt_txt.slice(0,10))}</p></div>
       <div class="time smalText"><p class="time12">${timeTransform(item.dt_txt)}</p></div>
       <div class="temperature smalText"><p class="temperature12">Temperature:${Math.round(item.main.temp)}°</p></div>
       <div class="feelsLike smalText"><p class="feelsLike12">Feels like:${Math.round(item.main.feels_like)}°</p></div>
       <div class="pictureHeader smalText"><p class="pictureHeader12">${item.weather[0].main}</p></div>
       <div class="picture"><img class="forecastPicture12" src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png"></div>
   </div>`
   ;
   result +=elem;
     }) ;
     FORECAST_UI.showForecast.insertAdjacentHTML('beforeend', result); 
     FORECAST_UI.showForecast.prepend(paragrath);   
                   
}




 function addLocation(){

  let  array = STORAGE.getFavoredFromStorage() || [];

  let check = array.indexOf(globalCityName);

  if (check===-1) {
    array.push(globalCityName);
}
 
STORAGE.setFavoredToStorage(array);

  renderFavoritePlaces()

  addRemovalElement()
}




function renderFavoritePlaces(){

 let  array = STORAGE.getFavoredFromStorage();

 if(!array) return;

  UI.displayRightDiv.innerHTML='';
  
  array.forEach(city =>{  

    let newLocation = document.createElement('div');
  
    newLocation.className = 'faforedPlace';
    
    newLocation.innerHTML = ` <p class="text loadFavoriteOne">${city}</p>
    <div class="close">
        <span class="line_rotate45"></span>
        <span class="line_rotate45"></span>
    </div>`
  
    UI.displayRightDiv.append(newLocation);
    
    addRemovalElement();
    
    addFetchRequestForFavorite();
  });
}

function addFetchRequestForFavorite(){

  const arr  =  document.querySelectorAll('.loadFavoriteOne'); 

  arr.forEach(elem => {
    elem.addEventListener('click', fetch_Request_For_Favorite);
  })
}


function fetch_Request_For_Favorite(event){
    let cityName = event.target.textContent;
     ultimateFetchRequest(cityName); 
}



function ultimateFetchRequest(cityName){

  const serverUrl = 'https://api.openweathermap.org/data/2.5/weather';                                         
  const apiKey = 'd54171d8f8672f7f9694fda045ed8d16';
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

  UI.heart_picture.style.display= 'block';
  
  const foreCastServerUrl = 'https://api.openweathermap.org/data/2.5/forecast'
  const forecastUrl = `${foreCastServerUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)

  .then((response) =>{

      return response.json();    
  })
  .then( (data)=>{
   render(data);
   STORAGE.setLastLocation(globalCityName);
  })
  .catch(error => alert(error.message));

  fetch(forecastUrl)
  .then((response) => {
    return response.json();
  })
  .then(renderForecast)
  .catch(error => alert(error.message));
}



function loadFromLocalStorage(){

    let cityName =  STORAGE.getLastlocation();                          
    if(!cityName) return;  
  
    ultimateFetchRequest(cityName);

    addRemovalElement();
  
  showNow.style.display = 'block';
  showDetails.style.display = 'none';
  showForecast.style.display = 'none';
  
  renderFavoritePlaces();
}




function timeTransform(data){

  const date = new Date(data);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = (minutes<10) ? '0'+minutes: minutes;
  return `${hours}:${minutes}`;
}

function timeTransformIntoDay(data){
  const date = new Date(data);
  let  options = { month: 'short', day: 'numeric' };
return (new Intl.DateTimeFormat('de-DE', options).format(date));
  
}

loadFromLocalStorage();


 