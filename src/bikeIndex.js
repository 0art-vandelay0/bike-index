export default class BikeIndex {
    static async getBikeByCount(location) {
        try {
            const response = await fetch(
                `https://bikeindex.org:443/api/v3/search/count?location=${location}&stolenness=proximity`
            );
            const jsonifiedResponse = await response.json();
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
                `https://bikeindex.org:443/api/v3/search?location=${location}&distance=10&stolenness=stolen`
            );
            const jsonifiedResponse = await response.json();
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

    static filterBikesByDateRange(bikes, startDate, endDate) {
        return bikes.filter((bike) => {
            const bikeDate = new Date(bike.date_stolen * 1000);
            return bikeDate >= startDate && bikeDate <= endDate;
        });
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
