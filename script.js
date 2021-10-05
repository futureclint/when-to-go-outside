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

    // Get current temperature and display
    let currentTemp = Math.round(weather.current.temp * 1.8 - 459.67);
    console.log('Current temperature: ' + currentTemp + '°');

    // Get current time and display
    const now = getTime();
    console.log('Current Time: ' + displayTime(now.hours, now.minutes));

    // Mess with times
    console.log(`Let's mess with times…`)

    console.log(`- - -`);

    // Sunrise & sunset times
    const timeSunRise = new Date(weather.current.sunrise * 1000);
    const timeSunSet = new Date(weather.current.sunset * 1000);
    console.log(`Sunrise: ${timeSunRise}`);
    console.log(`Sunset: ${timeSunSet}`);

    console.log(`- - -`);

    // Create empty array for hour blocks
    const hourBlock = [];

    // Assign next 24 hours of hourly weather objects to array
    for (let i = 0; i < 24; i++) {
        hourBlock[i] = weather.hourly[i];
    }

    // Log first hourly weather object as an example
    console.log('First hour of weather:');
    console.log(hourBlock[0]);

    // Determine how many blocks to delete based on time of first hour block
    // Find hours left in the day
    let hoursLeft = 24 - Number((new Date(hourBlock[0].dt * 1000)).getHours());
    console.log('Hours left in day: ' + hoursLeft);

    // Find hours already passed in the day, then delete same number from array
    let hoursPassed = 24 - hoursLeft;
    for (hoursPassed; hoursPassed > 0; hoursPassed--) {
        hourBlock.pop();
    }

    // Log array length, which should equal hours left in the day
    console.log('HourBlock length: ' + hourBlock.length);

    console.log(`- - -`);

    // Iterate over hourBlock array for time ranges
    for (let i = 0; i < hourBlock.length; i++) {
        let time = new Date(hourBlock[i].dt * 1000);
        let hour = Number(time.getHours());

        // If first hour block, start at current time
        if (i === 0) {
            console.log( 'Time Range ' + i + ': ' +
                displayTime(getTime().hours, getTime().minutes) +
                ' – ' + displayTime((hour + 1)) );
                console.log('Temp: ' + convertTemp(hourBlock[i].temp) + '°');
            console.log(`- - -`);
        } else {
            console.log( 'Time Range ' + i + ': ' +
                displayTime(hour) + ' – ' + displayTime((hour + 1)));
            console.log('Temp: ' + convertTemp(hourBlock[i].temp) + '°');
            console.log(`- - -`);
        }

    }

    // Log end
    console.log(`---------------------END---------------------`);
}

// FUNCTION: getTime
// Given a date passed in, returns the time as an object with hours and minutes as integers
// If no date passed in, date is assigned the current date/time
const getTime = (date = new Date()) => {
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
    if (hour < 12) {
        return hour.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' AM';
    } else if (hour === 12) {
        return hour.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' PM';
    } else if (hour === 24) {
        return (hour - 12).toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' AM';
    } else {
        return (hour - 12).toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ' PM';
    }
}

// FUNCTION: convertTemp
// Receives a Kelvin temperature, then converts to Fahrenheit
const convertTemp = (temp) => {
    return Math.round(temp * 1.8 - 459.67);
}

// Log start
console.log('--------------------START--------------------');

// Listen for user click on button, run userLocation function
document.querySelector('#location').addEventListener('click', userLocation);
