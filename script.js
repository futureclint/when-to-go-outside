// FUNCTION: userLocation
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

// FUNCTION: userWeather
const userWeather = (location) => {

    const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=minutely&exclude=daily&appid=5a9bbd6a2093ff22cc95b08a149b5373`;

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

// FUNCTION: parseWeatherData
const parseWeatherData = (weather) => {

    // Current temperature in Fahrenheit and rounded
    let currentTemp = Math.round(weather.current.temp * 1.8 - 459.67);

    // Log current temperature
    console.log('Current temperature: ' + currentTemp + '°');

    // Mess with times
    console.log(`Let's mess with times…`)

    console.log(`- - -`);

    // Hourly
    const time0 = new Date(weather.hourly[0].dt * 1000); // convert to date and time
    const hour0 = Number(time0.getHours()); // get hour as integer
    const displayTime0 = displayTime(hour0);
    console.log(`Time 0: ${time0}`);
    console.log(`Hour 0: ${hour0}`);
    console.log(`Display Time 0: ${displayTime0}`);

    console.log(`- - -`);

    const time5 = new Date(weather.hourly[5].dt * 1000); // convert to date and time
    const hour5 = Number(time5.getHours()); // get hour as integer
    const displayTime5 = displayTime(hour5);
    console.log(`Time 5: ${time5}`);
    console.log(`Hour 5: ${hour5}`);
    console.log(`Display Time 5: ${displayTime5}`);








    // Log end
    console.log(`- - - end - - -`);
}

// FUNCTION: currentTime
// Gets the current time and returns is as an object with hours and minutes as integers
const currentTime = () => {
    const date = new Date();
    const time = {
        hours: Number(date.getHours()),
        minutes: Number(date.getMinutes())
    };
    return time;
}

// FUNCTION: displayTime
// Receives an hour integer and a minutes integer
// If no minutes integer received, defaults to 0
// If hour <= 12, display AM, otherwise subtract 12 from hour and display PM
// For minutes less than 10 it adds a 0 in front of minutes (format: 8:07 AM)
// Outputs the time as a display string (format: 8:32 AM)
const displayTime = (hour, minutes = 0) => {
    if (hour <= 12) {
        return hour.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' AM';
    } else {
        return (hour - 12).toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' PM';
    }
}

// Log start
console.log('- - - start - - -');

// Listen for user click on button, run userLocation function
document.querySelector('#location').addEventListener('click', userLocation);
