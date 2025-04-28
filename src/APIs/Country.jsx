import axiosInstance from "./config/axios";

export const GET_ALL_COUNTRIES = async ({PageSize, pageNumber, Name}) => {
    let queryParams = [];

    if (PageSize) {
        queryParams.push(`PageSize=${PageSize}`);
    }

    if (pageNumber) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (Name) {
        queryParams.push(`Name=${Name}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/configuration/api/admin/v1/Country/get-system${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const TOGGLE_COUNTRY_STATUS = async (recordGuid) => {

    try {
        return await axiosInstance.put(
            `/configuration/api/admin/v1/Country/toggle-status`,
            {
                RecordGuid: recordGuid,
            }
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.put(
                `/configuration/api/admin/v1/Country/toggle-status`,
                {
                    RecordGuid: recordGuid,
                }
            );
        } else throw e;
    }
};

export const EXPORT_Zones = async () => {
    try {
        return await axiosInstance.get(
            `/configuration/api/admin/v1/Zone/export-zones-excel`,
            {
                responseType: "blob",
            }
        );
    } catch (e) {
        throw e;
    }
};
