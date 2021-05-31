/**
 * Weather App
 * TODO: Complete getWeatherData() to return json response Promise
 * TODO: Complete searchCity() to get user input and get data using getWeatherData()
 * TODO: Complete showWeatherData() to set the data in the the html file from response
 */

// API_KEY for maps api



let API_KEY = "a8e71c9932b20c4ceb0aed183e6a83bb";

/**
 * Retrieve weather data from openweathermap
 * HINT: Use fetch()
 * HINT: URL should look like this: 
 * https://api.openweathermap.org/data/2.5/weather?q=detroit&appid=a8e71c9932b20c4ceb0aed183e6a83bb&units=imperial
 */

  //HINT: Use template literals to create a url with input and an API key
getWeatherData = (city) =>{

  const URL = "https://api.openweathermap.org/data/2.5/weather";
  // going to use Template Literal to concatenatnate the string for the full url
  const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
  // I need to implement a fetch function to parse the url and return json reposne promise
  const retriveData = fetch(FULL_URL);
 
  // impleme nt promise to get the json reponse object

  return retriveData.then((response) => {
    return response.json();
  })

}

// CLEAR Input

clearData = () =>{
  document.getElementById('city-input').value = "";
  document.getElementById('city-name').innerText = " ------";
  document.getElementById('weather-type').innerText = "------";
  document.getElementById('temp').innerText = "--°";
  document.getElementById('min-temp').innerText = "--°";
  document.getElementById('max-temp').innerText = "--°";
  showweatherData()
}


/**
 * Retrieve city input and get the weather data
 * HINT: Use the promise returned from getWeatherData()
 */

searchCity = () => {
 
  const city = document.getElementById('city-input').value;
  getWeatherData(city)
  .then((response) => {
    showweatherData(response);
    console.log(response);
    
  })
  .catch((err) => {
    console.log(err);
  })


}







/**
 * Show the weather data in HTML
 * HINT: make sure to console log the weatherData to see how the data looks like
 */
// The reponse could be any parameter like weatherData etc. It is passed from the reponse of the getweatherData .

 showweatherData = (response) => {
   document.getElementById('city-name').innerText = response.name;
   document.getElementById('weather-type').innerText = response.weather[0].main;
   document.getElementById('temp').innerText = response.main.temp;
   document.getElementById('min-temp').innerText = response.main.temp_min;
   document.getElementById('max-temp').innerText = response.main.temp_max;
   
   

  
  



 }


  


