import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import BikeIndex from './bikeIndex';

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

function getBikeByDateRange(location, startDate, endDate) {
    const unixStartDate = toUnixTimestamp(startDate);
    const unixEndDate = toUnixTimestamp(endDate);

    BikeIndex.getBikeByDateRange(location, unixStartDate, unixEndDate)
        .then(function(response) {
            if (response.stolen) {
                printDateRangeElements(response, location, startDate, endDate);
            } else {
                printError(response, location);
            }
        });
}

function toUnixTimestamp(date) {
    if (date instanceof Date && !isNaN(date.getTime())) {
        return Math.floor(date.getTime() / 1000);
    } else {
        throw new Error('Invalid date format.');
    }
}

// UI Logic

function printElements(response, location) {
    document.getElementById("response").innerHTML = `There are ${response.stolen} stolen bikes in ${location}.`;
}

function printDateRangeElements(response, location, startDate, endDate) {
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    document.getElementById("response2").innerHTML = `There are ${response.stolen} stolen bikes in ${location} between ${formattedStartDate} and ${formattedEndDate}.`;
}

function printError(repsons, location) {
    document.getElementById("response").innerHTML = `There are no stolen bikes in ${location}.`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const location = document.getElementById("location-input").value;
    document.querySelector("#location-input").value = null;
    const startDateString = document.getElementById("start-date-input").value;
    const endDateString = document.getElementById("end-date-input").value;
    document.querySelector("#start-date-input").value = null;
    document.querySelector("#end-date-input").value = null;

    let startDate, endDate;

    if (startDateString && endDateString) {
        startDate = new Date(startDateString);
        endDate = new Date(endDateString);

        try {
            const unixStartDate = toUnixTimestamp(startDate);
            const unixEndDate = toUnixTimestamp(endDate);
            console.log(unixStartDate);
            console.log(unixEndDate);
            getBikeByDateRange(location, unixStartDate, unixEndDate);
        } catch (error) {
            printError(error.message, location);
            return;
        }
    } else {
        getBikeByCount(location);
    }
}


window.addEventListener("load", function() {
    document.getElementById("bikeCount-form").addEventListener("submit", handleFormSubmit);
});