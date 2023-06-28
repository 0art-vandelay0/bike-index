import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import BikeIndex from './bikeIndex.js';

function getBikeByCount(location) {
    BikeIndex.getBikeByCount(location)
        .then(function(response) {
            if (response.stolen) {
                printElements(response, location);
            } else {
                printError(response, location);
            }
        });
}

async function getBikeByDateRange(location, startDate, endDate) {
    try {
        const unixStartDate = BikeIndex.toUnixTimestamp(startDate);
        const unixEndDate = BikeIndex.toUnixTimestamp(endDate);

        const response = await BikeIndex.getBikeByDateRange(location, unixStartDate, unixEndDate);

        if (response.stolen) {
            if (Array.isArray(response.bikes)) {
                const filteredBikes = BikeIndex.filterBikesByDateRange(response.bikes, unixStartDate, unixEndDate);
                printDateRangeElements(filteredBikes.length, location, startDate, endDate);
            } else {
                printError('Invalid response format', location);
            }
        } else {
            printError(response.error, location);
        }
    } catch (error) {
        printError(error.message, location);
    }
}


function toUnixTimestamp(date) {
    const timestamp = Date.parse(date);
    if (!isNaN(timestamp)) {
        return Math.floor(timestamp / 1000);
    } else {
        throw new Error('Invalid date format.');
    }
}

// UI Logic

function printElements(response, location) {
    document.getElementById("response").innerHTML = `The response is ${response} for ${location}.`;
}

function printDateRangeElements(count, location, startDate, endDate) {
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    document.getElementById("response2").innerHTML = `There are ${count} stolen bikes in ${location} between ${formattedStartDate} and ${formattedEndDate}.`;
}

function printError(error, location) {
    document.getElementById("response").innerHTML = `There was an error accessing data in ${location}: 
    ${error}.`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const location = document.getElementById("location-input").value;
    document.querySelector("#location-input").value = null;
    const startDateString = document.getElementById("start-date-input").value;
    const endDateString = document.getElementById("end-date-input").value;

    console.log("StartDateString:", startDateString);
    console.log("EndDateString:", endDateString);

    let startDate, endDate;

    if (startDateString && endDateString) {
        startDate = new Date(startDateString);
        endDate = new Date(endDateString);

        console.log("StartDate:", startDate);
        console.log("EndDate:", endDate);

        try {
            const unixStartDate = toUnixTimestamp(startDate);
            const unixEndDate = toUnixTimestamp(endDate);
            console.log("UnixStartDate:", unixStartDate);
            console.log("UnixEndDate:", unixEndDate);
            getBikeByDateRange(location, startDate, endDate);
        } catch (error) {
            printError(error.message, location);
            return;
        }
    } else {
        getBikeByCount(location);
    }
}

window.addEventListener("load", function(){
    document.getElementById("bikeCount-form").addEventListener("submit", handleFormSubmit);
});