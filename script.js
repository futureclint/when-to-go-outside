const userLocation = () => {

    // Runs if location successfully received
    const success = (position) => {
        // Create location object with latitude and longitude
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        // Run userWeather function passing in location object
        userWeather(location);
    }

    // Runs if location not received
    const error = () => {
        // Log that there was an error getting location
        console.log('There was an error getting your location');
    }

    // Log that it is about to start locating
    console.log('Locating…');

    // Try to get location, then run either success or error function
    navigator.geolocation.getCurrentPosition(success, error);

}

const userWeather = (location) => {

    const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&appid=5a9bbd6a2093ff22cc95b08a149b5373`;

    fetch(weatherURL)
        .then((response) => {
            return response.json();
        })
        .then((responseJSON) => {

            // Weather object with all data
            let weather = responseJSON;

            // Run parseWeatherData function passing in weather object
            parseWeatherData(weather);

        })
}

const parseWeatherData = (weather) => {

    // Current temperature in Fahrenheit and rounded
    let currentTemp = Math.round(weather.current.temp * 1.8 - 459.67);

    // Log current temperature
    console.log('Current temperature: ' + currentTemp + '°');

    // Log end
    console.log(`- - - end - - -`);
}

// Log start
console.log('- - - start - - -');

// Listen for user click on button, run userLocation function
document.querySelector('#location').addEventListener('click', userLocation);
