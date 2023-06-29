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
                printDateRangeElements(filteredBikes, location, startDate, endDate);
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

function printDateRangeElements(filteredBikes, location, startDate, endDate) {
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    let html = '';

    if (filteredBikes.length > 0) {
        html += `<p>There are ${filteredBikes.length} stolen bikes in ${location} between ${formattedStartDate} and ${formattedEndDate}:</p>`;
        html += '<ul>';
        filteredBikes.forEach((bike) => {
            const stolenDate = new Date(bike.date_stolen * 1000).toLocaleDateString();
            html += `<li>Date Stolen: ${stolenDate}</li>`;
            html += `<li>Stolen Location: ${bike.stolen_location}</li>`;
            html += `<li>Frame Model: ${bike.frame_model}</li>`;
            html += '<br>';
        });
        html += '</ul>';
    } else {
        html = `<p>No stolen bikes found in ${location} between ${formattedStartDate} and ${formattedEndDate}.</p>`;
    }

    document.getElementById("response2").innerHTML = html;
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
        startDate = new Date(startDateString + ":00.000Z");
        endDate = new Date(endDateString + ":00.000Z");

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