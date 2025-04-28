import axiosInstance from "./config/axios";

export const GET_ALL_CURRENCIES = async ({
                                             search = null,
                                             pageSize = 10,
                                             pageNumber = 1
                                         }) => {

    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    if (search !== null) {
        queryParams.push(`searchKeyword=${encodeURIComponent(search)}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/configuration/api/admin/v1/Currency/get-system${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const EXPORT_ALL_CURRENCIES = async () => {
    const url = `/configuration/api/admin/v1/Currency/export-currencies-csv`;
    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const UPDATE_CURRENCY = async ({token, data}) => {
    const url = `/configuration/api/admin/v1/Currency`;
    try {
        return await axiosInstance.put(url, data);
    } catch (e) {
        throw e;
    }
};

export const DELETE_CURRENCY = async ({currencyId}) => {
    const url = `/configuration/api/admin/v1/Currency?RecordGuid=${currencyId}`;

    try {
        return await axiosInstance.delete(url);
    } catch (e) {
        throw e;
    }
};

export const UPDATE_STATUS_CURRENCY = async ({recordGuid, isActive}) => {
    const url = '/configuration/api/admin/v1/Currency/toggle-status';
    const data = {
        RecordGuid: recordGuid,
        isActive: isActive,
    };

    try {
        return await axiosInstance.put(url, data);
    } catch (e) {
        throw e;
    }
};