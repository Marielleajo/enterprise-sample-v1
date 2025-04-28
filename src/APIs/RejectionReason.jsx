import {NEWCONFIG} from "./index_new.jsx";
import axiosInstance from "./config/axios";

let configuration_url = "/configuration/api/admin/v1";
export const ADD_CRITERIA_DATA = async (formdata) => {
    try {
        const response = await axiosInstance.post(
            `${configuration_url}/Criteria`,
            formdata
        );

        return response.data;
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `${configuration_url}/Criteria`,
                formdata
            );
        throw e;
    }
};

export const GET_ALL_DATA_SEED_LIST = async ({
                                                 token,
                                                 search = null,
                                                 pageSize = 5,
                                                 pageNumber = 1,
                                                 categoryTags = null,
                                             }) => {
    NEWCONFIG.headers.Authorization = `Bearer ${token}`;
    let url = `${configuration_url}/Criteria/get-all?PageIndex=${
        search ? 1 : pageNumber
    }&PageSize=${pageSize}`;
    if (search) {
        url += `&searchKeyword=${search}`;
    }
    if (categoryTags) {
        url += `&categoryTags=${categoryTags}`;
    }

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const UPDATE_CRITERIA_DATA = async (formData) => {
    try {
        const response = await axiosInstance.put(
            `${configuration_url}/Criteria`,
            formData
        );

        return response.data;
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(`${configuration_url}/Criteria`, formData);
        throw e;
    }
};


export const UPDATE_CRITERIA_STATUS = async ({data}) => {
    try {
        return await axiosInstance.put(
            `${configuration_url}/Criteria/toggle-status`,
            data
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `${configuration_url}/Criteria/toggle-status`,
                data
            );
        else throw e;
    }
};


export const EXPORT_DATA_SEED_LIST = async (data) => {
    try {
        // Convert the data object into query parameters
        const queryParams = new URLSearchParams(data).toString();

        return await axiosInstance.get(
            `${configuration_url}/Criteria/export-criteria-csv?${queryParams}`
        );
    } catch (e) {
        if (e.response && e.response.status === 401) {
            // Retry the request if 401 error
            const queryParams = new URLSearchParams(data).toString();
            return await axiosInstance.get(
                `${configuration_url}/Criteria/export-criteria-csv?${queryParams}`
            );
        } else {
            throw e;
        }
    }
};
