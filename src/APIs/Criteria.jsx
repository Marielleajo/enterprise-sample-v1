import axios from "axios";

import axiosInstance from "./config/axios";

export const GET_CATEGORIES = async () => {
  try {
    return await axiosInstance.get(
      `/configuration/api/admin/v1/Criteria/category/get-all`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/admin/v1/Criteria/category/get-all`
      );
    else throw e;
  }
};

export const ADD_INDUSTRY = async ({ token, formData }) => {
  try {
    return await axiosInstance.post(`/configuration/api/v1/Industry`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/v1/Industry`,
        formData
      );
    else throw e;
  }
};

export const GET_ALL_INDUSTRIES = async () => {
  try {
    return await axiosInstance.get(`/configuration/api/v1/Industry/get-all`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(`/configuration/api/v1/Industry/get-all`);
    else throw e;
  }
};

export const GET_ALL_CITIES_API = async ({
  country,
  pageSize = 10,
  pageNumber = 1,
  search = null,
}) => {
  try {
    return await axiosInstance.get(
      `/configuration/api/v1/city/get-all?countryGuid=${country}&pageSize=${pageSize}&pageIndex=${pageNumber}&Name=${search}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/v1/city/get-all?countryGuid=${country}&pageSize=${pageSize}&pageIndex=${pageNumber}&Name=${search}`
      );
    else throw e;
  }
};

export const GET_ALL_COUNTRIES_API = async ({
  search = null,
  pageSize = 1000,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
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

export const GET_ALL_COUNTRIES_API_NO_TOKEN = async () => {
  try {
    return await axiosInstance.get(
      `/configuration/api/v1/Country/get-all?PageIndex=1&pageSize=400`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/v1/Country/get-all?PageIndex=1&pageSize=400`
      );
    else throw e;
  }
};

export const GET_CURRENCIES = async (token) => {
  return await axios.get(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/configuration/api/v1/Currency/get-all`,
    {
      headers: {
        tenant: import.meta.env.VITE_TENANT,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const GET_ALL_SERVICES = async (token) => {
  return await axios.get(
    `${import.meta.env.VITE_API_IDENTITY_URL}/catalog/api/v1/Service/get-all`,
    {
      headers: {
        tenant: import.meta.env.VITE_TENANT,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const GET_ALL_CHANNELS = async (token) => {
  return await axios.get(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/notification/api/admin/v1/Channel/get-all`,
    {
      headers: {
        tenant: import.meta.env.VITE_TENANT,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const GET_LANGUAGES = async () => {
  try {
    return await axiosInstance.get(
      `/configuration/api/v1/language/get-all?Code=en`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/v1/language/get-all?Code=en`
      );
    else throw e;
  }
};

export const GET_ALL_GENDERS_API = async ({ token, formData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/v1/criteria/get-all`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/v1/criteria/get-all`,
        formData
      );
    else throw e;
  }
};

export const GET_ALL_CRITERIA_API = async ({ type }) => {
  try {
    return await axiosInstance.get(
      `/configuration/api/admin/v1/criteria/get-all?categoryTags=${[type]}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/admin/v1/criteria/get-all?categoryTags=${[type]}`
      );
    else throw e;
  }
};
export const GET_ALL_TENANT_LANGUAGE = async (tenant) => {
  try {
    return await axiosInstance.get(
      `/configuration/api/admin/v1/Tenant/get-all-languages?RecordGuid=${tenant}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/admin/v1/Tenant/get-all-languages?RecordGuid=${tenant}`
      );
    else throw e;
  }
};

export const GET_ACTIVE_CRITERIA = async (data) => {
  let url = `configuration/api/admin/v1/criteria/get-active`;
  try {
    return await axiosInstance.post(url, data);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.post(url, data);
    else throw e;
  }
};

export const GET_ACTIVE_COUNTRIES_API = async ({
  search = null,
  pageSize = 10,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/Country/get-active${queryString}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const EXPORT_RESELLER = async ({ statusTag, TypeTag = "RESELLER" }) => {
  let queryParams = [];

  if (statusTag) {
    queryParams.push(`statusTag=${statusTag}`);
  }
  if (TypeTag) {
    queryParams.push(`TypeTag=${TypeTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/member/api/admin/v1/client/export-csv${queryString}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
