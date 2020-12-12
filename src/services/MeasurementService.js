import {HTTP} from "@/services/AxiosBase";

export default class MeasurementService {
    static async getMeasurements(filter, options) {
        return HTTP.get('measurement', {
            params: {
                pageSize: options.itemsPerPage,
                pageNumber: options.page,
                ...options,
                ...filter
            }
        }).then((res) => {
            return res;
        });
    }
}
