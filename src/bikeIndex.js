export default class BikeIndex {
    static async getBikeByCount(location) {
        try {
            const response = await fetch(
                `https://bikeindex.org:443/api/v3/search?location=${location}&distance=0&stolenness=proximity&per_page=1000`
            );
            const jsonifiedResponse = await response.json();
            console.log(location);
            console.log(jsonifiedResponse);
            if (!response.ok) {
                const errorMessage = `${response.status} (${response.statusText})`;
                throw new Error(errorMessage);
            }
            return jsonifiedResponse;
        } catch (error) {
            return error;
        }
    }

    static async getBikeByDateRange(location) {
        try {
            const response = await fetch(
                `https://bikeindex.org:443/api/v3/search?location=${location}&distance=0&stolenness=proximity&per_page=1000`
            );
            const jsonifiedResponse = await response.json();
            console.log(jsonifiedResponse);
            console.log(location);
            if (!response.ok) {
                const errorMessage = `${response.status} (${response.statusText})`;
                throw new Error(errorMessage);
            }

            if (jsonifiedResponse.bikes && jsonifiedResponse.bikes.length > 0) {
                return { stolen: true, bikes: jsonifiedResponse.bikes };
            } else {
                return { stolen: false, bikes: [] };
            }
        } catch (error) {
            return error;
        }
    }

    static filterBikesByDateRange(bikes, unixStartDate, unixEndDate) {
        let count = 0;
        bikes.forEach((bike) => {
            const bikeDate = bike.date_stolen;
            if (bikeDate >= unixStartDate && bikeDate <= unixEndDate) {
                count++;
            }
        });
        return count;
    }
    

    static toUnixTimestamp(date) {
        const timestamp = date.getTime();
        if (!isNaN(timestamp)) {
            return Math.floor(timestamp / 1000);
        } else {
            throw new Error('Invalid date format.');
        }
    }
}
