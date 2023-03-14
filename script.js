// FUNCTION: userLocation
// Runs when button is clicked
// If location successfully received, calls userWeather function and passes location to it
const userLocation = () => {

    // Call loading function
    loading();

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
        alert('There was an error getting your location. Enable location services and try again.');
    }

    // Log that it is about to start locating
    console.log('Locating…');

    // Try to get location, then run either success or error function
    navigator.geolocation.getCurrentPosition(success, error);

}

// FUNCTION: userWeather
// Calls OpenWeather API using given location, then converts data to JSON
// Calls parseWeatherData function and passes JSON object to it
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
// Receives JSON weather data, then parses it, then displays it on the page
const parseWeatherData = (weather) => {

    // Declare variables
    // Create variables for sunrise time, sunset time
    const sunriseTime = new Date(weather.current.sunrise * 1000);
    const sunsetTime = new Date(weather.current.sunset * 1000);

    // Create variables for the hour
    const sunriseHour = getTime(new Date(weather.current.sunrise * 1000)).hours; // <<<<<<<<<<<<<<<<
    const sunsetHour = getTime(new Date(weather.current.sunset * 1000)).hours;

    // Get current temperature and display
    let currentTemp = Math.round(weather.current.temp * 1.8 - 459.67);
    console.log('Current temperature: ' + currentTemp + '°');

    // Get current time and display
    const now = getTime();
    console.log('Current Time: ' + displayTime(now.hours, now.minutes));

    // Create empty array for hour blocks
    const hourBlock = [];

    // Assign next 24 hours of hourly weather objects to array
    for (let i = 0; i < 24; i++) {
        hourBlock[i] = weather.hourly[i];
    }

    // Determine how many blocks to delete based on time of first hour block
    // Find hours left in the day
    let hoursLeft = 24 - Number((new Date(hourBlock[0].dt * 1000)).getHours());

    // Find hours already passed in the day, then delete same number from array
    let hoursPassed = 24 - hoursLeft;
    for (hoursPassed; hoursPassed > 0; hoursPassed--) {
        hourBlock.pop();
    }

    // Loop beginning to end and remove items from front of array that are pre-sunrise
    for (let i = 0; i < hourBlock.length; i++) {
        let hour = getBlockHour(hourBlock[i]);
        if (hour < sunriseHour) {
            hourBlock.shift();
        }
    }

    // Loop end to beginning and remove items from end of array that are post-sunset
    for (let i = (hourBlock.length - 1); i > 0; i--) {
        let hour = getBlockHour(hourBlock[i]);
        if (hour > sunsetHour) {
            hourBlock.pop();
        }
    }

    console.log(`Let's output the time blocks…`);
    console.log(`- - -`);

    loading(false);

    // Iterate over hourBlock array to output elements for each hour block
    for (let i = 0; i < hourBlock.length; i++) {

        // Declare variables

        // Create variable for the current array item we're in (block)
        let block = hourBlock[i];

        // Create variable for the hour of the current block we're in
        let hour = getBlockHour(block);

        // Create new div element for the hour we are in, then append it to the hour div
        let hourDiv = document.createElement('div');
        document.querySelector('.hours').appendChild(hourDiv);
        // Create new h3 for time range, then append it to the hour div
        let timeRange = document.createElement('h3');
        hourDiv.appendChild(timeRange);

        // Create variables for temperature, UV index, humidity, and precipitation chance
        let temperature = convertTemp(block.temp);
        let uvIndex = Math.round(block.uvi);
        let humidity = block.humidity;
        let precipitation = block.pop;

        // NOTE: it is possible (but not common) to have multiple weather types in the same hour, but this will default to just displaying the first for MVP
        // TODO: iterate through weather types array to display multiple weather types if there are any
        let iconCode = block.weather[0].icon;
        let description = block.weather[0].description;

        // Assign quality index of 100 to start, then deduct from score depending on conditions
        // NOTE: for MVP this will not be displayed
        // TODO: go through each weather condition and deduct from quality index, then display quality index
        let qualityIndex = 100;

        // Output time range
        // If first hour block, start at current time or sunrise time
        // Else if last hour block, stop at sunset time
        // Else output normal block time beginning to end
        if (i === 0) {
            if (sunriseHour === hour) {
                // Sunrise hour
                // Pass in time range to h3: sunrise time to end of block
                timeRange.innerText = `${displayTime(getTime(sunriseTime).hours, getTime(sunriseTime).minutes)} (sunrise)–${displayTime(hour + 1)}`;
            } else {
                // Current hour
                // Pass in time range to h3: current time to end of block
                timeRange.innerText = `${displayTime(getTime().hours, getTime().minutes)} (now)–${displayTime(hour + 1)}`;
            }
        } else if (i === (hourBlock.length - 1)) {
            // Sunset hour
            // Pass in time range to h3: hour block start to sunset time
            timeRange.innerText = `${displayTime(hour)}–${displayTime(getTime(sunsetTime).hours, getTime(sunsetTime).minutes)} (sunset)`;
        } else {
            // Normal hour
            // Pass in time range to h3: hour block start to end
            timeRange.innerText = `${displayTime(hour)}–${displayTime(hour + 1)}`;
        }

        // Create spans for weather details text
        let spanUVI = document.createElement('span');
        let spanHumid = document.createElement('span');
        let spanPrecip = document.createElement('span');
        let spanTemp = document.createElement('span');

        // Add classes to spans
        spanUVI.className = 'details';
        spanHumid.className = 'details';
        spanPrecip.className = 'details';
        spanTemp.className = 'temp';

        // Add text data to spans
        spanUVI.innerText = `UVI: ${uvIndex}`;
        spanHumid.innerText = `Humidity: ${humidity}%`;
        spanPrecip.innerText = `Precipitation: ${precipitation}%`;
        spanTemp.innerText = `${temperature}°`;

        // Append spans to hour div
        hourDiv.appendChild(spanUVI);
        hourDiv.appendChild(spanHumid);
        hourDiv.appendChild(spanPrecip);
        hourDiv.appendChild(spanTemp);

        // Output icon image
        // Add src, width, title, and alt before appending
        // Icons are 100px @2X, so set width to 50px
        let iconImg = document.createElement('img');
        let iconImgURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconImg.setAttribute('src', iconImgURL);
        iconImg.setAttribute('width', '50');
        iconImg.setAttribute('title', description); // <<<<<<<<<<<<<
        iconImg.setAttribute('alt', description); // <<<<<<<<<<<<
        hourDiv.appendChild(iconImg);

        // Log weather details for hour
        console.log(`Hour: ${hour}`);
        console.log(`Temperature: ${temperature}°`);
        console.log(`UV Index: ${uvIndex}`);
        console.log(`Humidity: ${humidity}%`);
        console.log(`Precipitation Chance: ${precipitation}%`);
        console.log(`Quality Index: ${qualityIndex}`);
        console.log(`- - -`);

    }
    // End of hourBlock array iteration

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

// FUNCTION: getBlockHour
// Receive an array item from hourBlock and returns the hour value
const getBlockHour = (block) => {
    let time = new Date(block.dt * 1000);
    let hour = Number(time.getHours());
    return hour;
}

// FUNCTION: loading
const loading = (set = true) => {
    // Remove any elements that exist within the hours block
    const hourElements = document.querySelector('.hours');
    hourElements.innerHTML = '';

    // If setting loading, place loading text within the hours block
    if (set === true) {
        let loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerText = 'Loading…';
        document.querySelector('.hours').appendChild(loading);
    }
}

// Log start
console.log('--------------------START--------------------');

// Listen for user click on button, run userLocation function
document.querySelector('#location').addEventListener('click', userLocation);
