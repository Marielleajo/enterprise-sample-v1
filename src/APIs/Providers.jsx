import axiosInstance from "./config/axios";

let provider_url = `/member/api/admin/v1/provider`;
let core_url = `/core/api/v1`;
let configuration_core_url = `/core/api/v1/Configuration`;

export const GET_ALL_PROVIDERS = async (data) => {
    let url = `${provider_url}/get-all`;

    try {
        return await axiosInstance.post(url, data);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url, data);
        else throw e;
    }
};

export const EXPORT_ALL_PROVIDERS = async ({
                                               CategoryRecordGuid,
                                               name,
                                               Email,
                                               Type,
                                               IndustryName,
                                               Status,
                                               typeTag = "GENERAL",
                                           }) => {
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];

    if (CategoryRecordGuid !== null && CategoryRecordGuid !== undefined) {
        queryParams.push(
            `CategoryRecordGuid=${encodeURIComponent(CategoryRecordGuid)}`
        );
    }

    if (name !== null) {
        queryParams.push(`name=${encodeURIComponent(name)}`);
    }
    if (Status !== null && Status !== undefined) {
        queryParams.push(`Status=${encodeURIComponent(Status)}`);
    }
    if (typeTag !== null) {
        queryParams.push(`typeTag=${encodeURIComponent(typeTag)}`);
    }

    if (Email) {
        queryParams.push(`Email=${encodeURIComponent(Email)}`);
    }

    if (Type) {
        queryParams.push(`Type=${encodeURIComponent(Type)}`);
    }

    if (IndustryName) {
        queryParams.push(`IndustryName=${encodeURIComponent(IndustryName)}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `${provider_url}/export-csv${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const GET_ALL_PROVIDER_CATEGORIES = async ({search}) => {
    return await axiosInstance.get(
        `/member/api/admin/v1/providercategory/get-all?Name=${search}`
    );
};

export const GET_ALL_PROVIDER_ACCOUNTS = async ({ProviderGuid}) => {
    let queryParams = [];

    if (ProviderGuid) {
        queryParams.push(`ProviderGuid=${ProviderGuid}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/billing/api/v1/provideraccount/get-all-by-provider${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

//add provider apis
export const GET_ALL_TITLES = async ({data}) => {
    return await axiosInstance.post(
        `/configuration/api/v1/criteria/get-all`,
        data
    );
};

export const GET_ALL_FEATURE_TYPE_TAG = async ({data}) => {
    return await axiosInstance.post(
        `/configuration/api/v1/criteria/get-all`,
        data
    );
};

export const GET_ALL_INDUSTRIES = async () => {
    return await axiosInstance.get(
        `/configuration/api/admin/v1/Industry/get-all`
    );
};

export const ADD_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `/member/api/admin/v1/provider/add-default-type-without-login`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/member/api/admin/v1/provider/add-default-type-without-login`,
                formData
            );
        else throw e;
    }
};

export const ADD_MNP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `${configuration_core_url}/add-lookup`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `${configuration_core_url}/add-lookup`,
                formData
            );
        else throw e;
    }
};

export const EDIT_MNP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.put(
            `/configuration/api/admin/v1/LookupConfiguration`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/configuration/api/admin/v1/LookupConfiguration`,
                formData
            );
        else throw e;
    }
};

export const ADD_SMTP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `${configuration_core_url}/add-smtp`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `${configuration_core_url}/add-smtp`,
                formData
            );
        else throw e;
    }
};

export const EDIT_SMTP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.put(
            `/configuration/api/admin/v1/SmtpConfiguration`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/configuration/api/admin/v1/SmtpConfiguration`,
                formData
            );
        else throw e;
    }
};

export const ADD_SMPP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `${configuration_core_url}/add-smpp`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `${configuration_core_url}/add-smpp`,
                formData
            );
        else throw e;
    }
};

export const EDIT_SMPP_CONFIG_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.put(
            `/configuration/api/admin/v1/SmppConfig`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/configuration/api/admin/v1/SmppConfig`,
                formData
            );
        else throw e;
    }
};

export const ASSIGN_SERVICE_TO_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.post(
            `${configuration_core_url}/assign-service-provider`,
            formData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `${configuration_core_url}/assign-service-provider`,
                formData
            );
        else throw e;
    }
};

export const GET_MNPHLR_BY_ID = async ({ProviderGuid, ServiceGuid}) => {
    try {
        return await axiosInstance.get(
            `/configuration/api/admin/v1/LookupConfiguration/get-all?ProviderGuid=${ProviderGuid}&ServiceGuid=${ServiceGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(
                `/configuration/api/admin/v1/LookupConfiguration/get-all?ProviderGuid=${ProviderGuid}&ServiceGuid=${ServiceGuid}`
            );
        else throw e;
    }
};

export const GET_SMTP_BY_ID = async ({ProviderGuid}) => {
    try {
        return await axiosInstance.get(
            `/configuration/api/admin/v1/SmtpConfiguration/get-all?ProviderGuid=${ProviderGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(
                `/configuration/api/admin/v1/SmtpConfiguration/get-all?ProviderGuid=${ProviderGuid}`
            );
        else throw e;
    }
};

export const GET_SMPP_BY_ID = async ({ProviderGuid}) => {
    try {
        return await axiosInstance.get(
            `/configuration/api/admin/v1/SmppConfig/get-all?ProviderGuid=${ProviderGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(
                `/configuration/api/admin/v1/SmppConfig/get-all?ProviderGuid=${ProviderGuid}`
            );
        else throw e;
    }
};

export const SMPP_CONFIG = async ({RecordGuid}) => {
    try {
        return await axiosInstance.get(
            `/configuration/api/admin/v1/SmppConfig?RecordGuid=${RecordGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(
                `/configuration/api/admin/v1/SmppConfig?RecordGuid=${RecordGuid}`
            );
        else throw e;
    }
};

//edit provider
export const GET_PROVIDER_ID = async ({providerGuid}) => {
    try {
        return await axiosInstance.get(
            `/member/api/admin/v1/provider/info?providerGuid=${providerGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.get(
                `/member/api/admin/v1/provider/info?providerGuid=${providerGuid}`
            );
        else throw e;
    }
};

export const EDIT_PROVIDER = async ({formData}) => {
    try {
        return await axiosInstance.put(`/member/api/admin/v1/provider`, formData);
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(`/member/api/admin/v1/provider`, formData);
        else throw e;
    }
};

//Provider category apis
export const GET_ALL_PROVIDERSCATEGORIES = async ({
                                                      pageSize = 5,
                                                      pageNumber = 1,
                                                      Name = null,
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
        queryParams.push(`Name=${Name}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/member/api/admin/v1/providercategory/get-all${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const EXPORT_ALL_PROVIDERSCATEGORIES = async ({Name = null}) => {
    let queryParams = [];

    if (Name !== null) {
        queryParams.push(`Name=${Name}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    let url = `/member/api/admin/v1/providercategory/export-csv${queryString}`;

    try {
        return await axiosInstance.get(url);
    } catch (e) {
        if (e == "error: 401") return await axiosInstance.get(url);
        else throw e;
    }
};

export const ADD_PROVIDERSCATEGORIES = async ({postData}) => {
    try {
        return await axiosInstance.post(
            `/member/api/admin/v1/providercategory`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.post(
                `/member/api/admin/v1/providercategory`,
                postData
            );
        else throw e;
    }
};

export const EDIT_PROVIDERSCATEGORIES = async ({postData}) => {
    try {
        return await axiosInstance.put(
            `/member/api/admin/v1/providercategory`,
            postData
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.put(
                `/member/api/admin/v1/providercategory`,
                postData
            );
        else throw e;
    }
};

export const DELETE_PROVIDERSCATEGORIES = async ({recordGuid}) => {
    try {
        return await axiosInstance.delete(
            `/member/api/admin/v1/providercategory?RecordGuid=${recordGuid}`
        );
    } catch (e) {
        if (e == "error: 401")
            return await axiosInstance.delete(
                `/member/api/admin/v1/providercategory?RecordGuid=${recordGuid}`
            );
        else throw e;
    }
};
