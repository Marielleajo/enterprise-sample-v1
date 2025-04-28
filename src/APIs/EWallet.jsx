import axiosInstance from "./config/axios";

export const GET_ALL_FEE_CATEGORIES = async ({
                                                 pageSize = 5,
                                                 pageNumber = 1,
                                                 IsActive = null,
                                                 Name = ""
                                             }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (Name !== null) {
        queryParams.push(`Keyword=${Name}`);
    }
    if (IsActive !== null) {
        queryParams.push(`IsActive=${IsActive}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/admin/v1/FeeCategory/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_FEES_CATEGORY = async ({postData}) => {
    try {
        return await axiosInstance.post(
            `/billing/api/admin/v1/FeeCategory/add`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/billing/api/admin/v1/FeeCategory/add`,
                postData
            );
        else throw e;
    }
};

export const UPDATE_FEES_CATEGORY = async ({postData}) => {
    try {
        return await axiosInstance.put(
            `/billing/api/admin/v1/FeeCategory/update`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing/api/admin/v1/FeeCategory/update`,
                postData
            );
        else throw e;
    }
};

//Fees

export const GET_ALL_FEES = async ({postData}) => {
    let url = `/billing/api/admin/v1/Fee/get-all`;

    try {
        return await axiosInstance.post(url, postData);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.post(url, postData);
        else throw e;
    }
};


export const ADD_FEE = async ({postData}) => {
    try {
        return await axiosInstance.post(`/billing/api/admin/v1/Fee/add`, postData);
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(`/billing/api/admin/v1/Fee/add`, postData);
        else throw e;
    }
};

export const UPDATE_FEE = async ({postData}) => {
    try {
        return await axiosInstance.put(`/billing/api/admin/v1/Fee/update`, postData);
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(`/billing/api/admin/v1/Fee/update`, postData);
        else throw e;
    }
};

export const DELETE_FEE = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing/api/admin/v1/Fee/delete/${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing/api/admin/v1/Fee/delete/${recordGuid}`
            );
        } else throw e;
    }
};
export const DELETE_FEE_CATEGORY = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing/api/admin/v1/FeeCategory/delete?id=${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing/api/admin/v1/FeeCategory/delete?id=${recordGuid}`
            );
        } else throw e;
    }
};

export const DELETE_FEE_TYPE = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing/api/admin/v1/FeeType/delete?id=${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing/api/admin/v1/FeeType/delete?id=${recordGuid}`
            );
        } else throw e;
    }
};
// FeeType

export const GET_ALL_FEE_TYPES = async ({
                                            pageSize = 5,
                                            pageNumber = 1,
                                            IsActive = null,
                                            Name = ""
                                        }) => {
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (Name !== null) {
        queryParams.push(`Keyword=${Name}`);
    }
    if (IsActive !== null) {
        queryParams.push(`IsActive=${IsActive}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/admin/v1/FeeType/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_FEE_TYPE = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `/billing/api/admin/v1/FeeType/add`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/billing/api/admin/v1/FeeType/add`,
                formData
            );
        else throw e;
    }
};
export const EDIT_FEE_TYPE = async ({formData}) => {
    try {
        return await axiosInstance.put(
            `/billing/api/admin/v1/FeeType/update`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing/api/admin/v1/FeeType/update`,
                formData
            );
        else throw e;
    }
};

export const FEE_TYPE_TOOGLE_STATUS = async (RecordGuid) => {
    let queryParams = [];

    if (RecordGuid !== null) {
        queryParams.push(`RecordGuid=${RecordGuid}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/admin/v1/FeeType/toggle${queryString}`;

    try {
        return await axiosInstance.post(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.post(url);
        else throw e;
    }
};
export const FEE_CATEGORY_TOOGLE_STATUS = async (RecordGuid) => {
    let queryParams = [];

    if (RecordGuid !== null) {
        queryParams.push(`RecordGuid=${RecordGuid}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/admin/v1/FeeCategory/toggle${queryString}`;

    try {
        return await axiosInstance.post(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.post(url);
        else throw e;
    }
};

// Frequency

export const GET_ALL_FREQUENCIES = async ({pageSize = 5, pageNumber = 1}) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/Frequency/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const GET_ALL_FREQUENCY_TYPES = async ({
                                                  pageSize = 5,
                                                  pageNumber = 1,
                                              }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/Frequency/frequency-type/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};
export const GET_ALL_FREQUENCY_CATEGORIES = async ({
                                                       pageSize = 5,
                                                       pageNumber = 1,
                                                   }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/Frequency/frequency-category/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_FREQUENCY = async ({postData}) => {
    try {
        return await axiosInstance.post(
            `/billing-v2/api/v1/Frequency/add`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/billing-v2/api/v1/Frequency/add`,
                postData
            );
        else throw e;
    }
};

export const DELETE_FREQUENCY = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing-v2/api/v1/Frequency/delete/${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing-v2/api/v1/Frequency/delete/${recordGuid}`
            );
        } else throw e;
    }
};

export const UPDATE_FREQUENCY = async ({postData}) => {
    try {
        return await axiosInstance.put(
            `/billing-v2/api/v1/Frequency/update`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing-v2/api/v1/Frequency/update`,
                postData
            );
        else throw e;
    }
};

// Discount

export const GET_ALL_DISCOUNTS = async ({pageSize = 5, pageNumber = 1}) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/Discount/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const GET_ALL_DISCOUNT_TYPES = async ({
                                                 pageSize = 5,
                                                 pageNumber = 1,
                                             }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/DiscountType/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const GET_ALL_DISCOUNT_CATEGORIES = async ({
                                                      pageSize = 5,
                                                      pageNumber = 1,
                                                  }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/Discount/discount-category/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_DISCOUNT = async ({postData}) => {
    try {
        return await axiosInstance.post(
            `/billing-v2/api/v1/Discount/add`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/billing-v2/api/v1/Discount/add`,
                postData
            );
        else throw e;
    }
};

export const UPDATE_DISCOUNT = async ({postData}) => {
    try {
        return await axiosInstance.put(
            `/billing-v2/api/v1/Discount/update`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing-v2/api/v1/Discount/update`,
                postData
            );
        else throw e;
    }
};

export const DELETE_DISCOUNT = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing-v2/api/v1/Discount/delete/${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing-v2/api/v1/Discount/delete/${recordGuid}`
            );
        } else throw e;
    }
};

// limits

export const GET_ALL_LIMITS = async ({pageSize = 5, pageNumber = 1}) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/limit/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const GET_ALL_LIMIT_TYPES = async ({pageSize = 5, pageNumber = 1}) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/limit/limit-type/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};
export const GET_ALL_LIMIT_CATEGORIES = async ({
                                                   pageSize = 5,
                                                   pageNumber = 1,
                                               }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (pageSize !== null) {
        queryParams.push(`PageSize=${pageSize}`);
    }

    if (pageNumber !== null) {
        queryParams.push(`PageIndex=${pageNumber}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing-v2/api/v1/limit/limit-category/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_LIMIT = async ({postData}) => {
    try {
        return await axiosInstance.post(`/billing-v2/api/v1/limit/add`, postData);
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(`/billing-v2/api/v1/limit/add`, postData);
        else throw e;
    }
};

export const UPDATE_LIMIT = async ({postData}) => {
    try {
        return await axiosInstance.put(`/billing-v2/api/v1/limit/update`, postData);
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/billing-v2/api/v1/limit/update`,
                postData
            );
        else throw e;
    }
};

export const DELETE_LIMIT = async (recordGuid) => {
    try {
        return await axiosInstance.delete(
            `/billing-v2/api/v1/limit/delete/${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401") {
            return await axiosInstance.delete(
                `/billing-v2/api/v1/limit/delete/${recordGuid}`
            );
        } else throw e;
    }
};
