


const FAVORED_LOCATIONS = 'favoredLocations';
const LAST_LOCATION = 'lastLocation';

export const STORAGE = {

    getLastlocation(){
    return JSON.parse(localStorage.getItem(LAST_LOCATION));  
},

    setLastLocation(cityName){
    localStorage.setItem(LAST_LOCATION, JSON.stringify(cityName));
},

     setFavoredToStorage(array){
    localStorage.setItem( FAVORED_LOCATIONS, JSON.stringify(array));
},

     getFavoredFromStorage(){
   return JSON.parse(localStorage.getItem(FAVORED_LOCATIONS));
}
};







