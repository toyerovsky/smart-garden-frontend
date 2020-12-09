import {HTTP} from "@/services/AxiosBase";

export default class MeasurementService {
    static async getMeasurements() {
        return HTTP.get('measurement')
            .then((res) => {
                return res;
            });
    }
}
