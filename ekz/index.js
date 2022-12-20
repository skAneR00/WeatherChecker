const getCoordinates = (city) => {
    // fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=5be241185789c64f116ac8057e8c1f4c`)
    fetch(`https://api.weatherbit.io/v2.0/current?lat=35.7796&city=Karaganda&key=e33e5abef8684a4690beb4c1d2cfc954&include=minutely`)
    .then(response => response.json())
    .then(json => {
        console.log(json)
    })
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
}

getCoordinates('London')