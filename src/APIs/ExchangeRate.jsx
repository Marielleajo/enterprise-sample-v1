import axiosInstance from "./config/axios";

export const GET_ALL_EXCHANGERATES = async ({
                                                pageSize = 5,
                                                pageNumber = 1,
                                                ClientCategoryGuid,
                                            }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    if (ClientCategoryGuid !== null) {
        queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/v2/exchangerate/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const EXPORT_ALL_EXCHANGERATES = async ({search = null}) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (search !== null) {
        queryParams.push(`keyword=${encodeURIComponent(search)}`);
    }

    const queryString =
        queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

    let url = `/billing/api/v2/exchangerate/export-to-excel${queryString}`;

    try {
        return await axiosInstance.get(url, {
            responseType: "blob",
        });
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(url, {
                responseType: "blob",
            });
        else throw e;
    }
};

export const ADD_EXCHANGERATE = async ({postData}) => {
    try {
        return await axiosInstance.post(
            `/billing/api/v2/exchangerate/add-exchange-rate`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/billing/api/v2/exchangerate/add-exchange-rate`,
                postData
            );
        else throw e;
    }
};

export const EDIT_EXCHANGERATE = async ({postData}) => {
    try {
        return await axiosInstance.put(
            `/billing/api/v2/exchangerate/update-exchange-rate`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing/api/v2/exchangerate/update-exchange-rate`,
                postData
            );
        else throw e;
    }
};

export const GET_ALL_MISSING_EXCHANGERATES = async ({
                                                        search = null,
                                                        pageSize = 5,
                                                        pageNumber = 1,
                                                        ChannelGuid,
                                                        ServiceGuid,
                                                        ClientCategoryGuid,
                                                        CountryRecordGuid,
                                                        OperatorRecordGuid,
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
        queryParams.push(`keyword=${encodeURIComponent(search)}`);
    }

    if (ChannelGuid !== null) {
        queryParams.push(`ChannelGuid=${ChannelGuid}`);
    }

    if (ServiceGuid !== null) {
        queryParams.push(`ServiceGuid=${ServiceGuid}`);
    }

    if (ClientCategoryGuid !== null) {
        queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
    }

    if (CountryRecordGuid !== null) {
        queryParams.push(`CountryRecordGuid=${CountryRecordGuid}`);
    }

    if (OperatorRecordGuid !== null) {
        queryParams.push(`OperatorRecordGuid=${OperatorRecordGuid}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/v2/EXCHANGERATEplan/get-missing-EXCHANGERATE-plans-by-client-category${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const EXPORT_MISSING_EXCHANGERATES = async ({
                                                       search = null,
                                                       ChannelGuid,
                                                       ServiceGuid,
                                                       ClientCategoryGuid,
                                                       ProviderGuid,
                                                   }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (search !== null) {
        queryParams.push(`keyword=${encodeURIComponent(search)}`);
    }

    if (ChannelGuid !== null) {
        queryParams.push(`ChannelGuid=${ChannelGuid}`);
    }

    if (ServiceGuid !== null) {
        queryParams.push(`ServiceGuid=${ServiceGuid}`);
    }

    if (ClientCategoryGuid !== null) {
        queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
    }

    const queryString =
        queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

    let url = `/billing/api/v2/EXCHANGERATEplan/export-missing-EXCHANGERATE-plan-to-excel${queryString}`;

    try {
        return await axiosInstance.get(url, {
            responseType: "blob",
        });
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(url, {
                responseType: "blob",
            });
        else throw e;
    }
};
export const GET_DEFAULT_CURRENCIES = async () => {
    // Create a URL with or without the searchCriteria parameter

    let url = `/configuration/api/admin/v1/Currency/get-default`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};
export const getAllCurrenciesAPI = async () => {
    // Create a URL with or without the searchCriteria parameter

    let url = `/configuration/api/admin/v2/Currency/get-default`;

    try {
        return await axiosInstance.get(url, {
            responseType: "blob",
        });
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(url, {
                responseType: "blob",
            });
        else throw e;
    }
};
