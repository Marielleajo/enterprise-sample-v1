import axiosInstance from "./config/axios";

//account Type
export const GET_ALL_ACCOUNT_TYPE = async ({
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

  let url = `/billing-v2/api/v1/AccountType/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_ACCOUNT_TYPE = async () => {
  let url = `/billing-v2/api/v1/AccountType/export-to-excel`;

  try {
    return await axiosInstance.get(url, {
      responseType: "blob",
    });
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_ACCOUNT_TYPE = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/billing-v2/api/v1/AccountType`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing-v2/api/v1/AccountType`,
        postData
      );
    else throw e;
  }
};

export const UPDATE_ACCOUNT_TYPE = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/billing-v2/api/v1/AccountType`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing-v2/api/v1/AccountType`,
        postData
      );
    else throw e;
  }
};

export const DELETE_ACCOUNT_TYPE = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/billing-v2/api/v1/AccountType?RecordGuid=${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(
        `/billing-v2/api/v1/AccountType?RecordGuid=${recordGuid}`
      );
    } else throw e;
  }
};
//account category

export const GET_ALL_ACCOUNT_CATEGORY = async ({
  pageSize = 5,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing-v2/api/v1/AccountCategory/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_ACCOUNT_CATEGORY = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing-v2/api/v1/AccountCategory`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing-v2/api/v1/AccountCategory`,
        postData
      );
    else throw e;
  }
};
export const UPDATE_ACCOUNT_CATEGORY = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing-v2/api/v1/AccountCategory`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing-v2/api/v1/AccountCategory`,
        postData
      );
    else throw e;
  }
};

export const DELETE_ACCOUNT_CATEGORY = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/billing-v2/api/v1/AccountCategory?RecordGuid=${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(
        `/billing-v2/api/v1/AccountCategory?RecordGuid=${recordGuid}`
      );
    } else throw e;
  }
};
//account template
export const GET_ALL_ACCOUNT_TEMPLATE = async ({
  pageSize = 5,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing-v2/api/v1/AccountTemplate/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_ACCOUNT_TEMPLATE = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing-v2/api/v1/AccountTemplate`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing-v2/api/v1/AccountTemplate`,
        postData
      );
    else throw e;
  }
};
export const DELETE_ACCOUNT_TEMPLATE = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/billing-v2/api/v1/AccountTemplate/${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(
        `/billing-v2/api/v1/AccountTemplate/${recordGuid}`
      );
    } else throw e;
  }
};

export const UPDATE_ACCOUNT_TEMPLATE = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing-v2/api/v1/AccountTemplate`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing-v2/api/v1/AccountTemplate`,
        postData
      );
    else throw e;
  }
};
