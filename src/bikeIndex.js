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

    static async getBikeByDateRange(location, startDate, endDate) {
        try {
            const response = await fetch(
                `https://bikeindex.org:443/api/v3/search/count?location=${location}&distance=10&stolenness=proximity&date_stolen__gte=${startDate}&date_stolen__lte=${endDate}`
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
}
