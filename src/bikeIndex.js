export default class BikeIndex{

    static async getBikeByCount(city){
        try {
            const response = await fetch(`https://bikeindex.org:443/api/v3/search/count?location=${city}&distance=10&stolenness=proximity`);
            const jsonifiedResponse = await response.json();
            if (!response.ok) {
                const errorMessage = `${response.status} (${response.statusText})`;
                throw new Error(errorMessage);
            }
            return jsonifiedResponse;
        } catch(error) {
            return error;
        }
    }


}