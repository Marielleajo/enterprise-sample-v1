import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ALL_COUNTRIES_API = async ({
  PageSize = 10,
  pageNumber = 1,
  Name = null,
}) => {
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

export const GET_ALL_TAXES = async ({
  token,
  pageSize = 5,
  pageNumber = 1,
  CountryGuid,
  FromDate,
  ToDate,
}) => {
  NEWCONFIG.headers.Authorization = `Bearer ${token}`;

  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (CountryGuid) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (FromDate !== null) {
    queryParams.push(`FromDate=${FromDate}`);
  }
  if (ToDate !== null) {
    queryParams.push(`ToDate=${ToDate}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/tax/gettaxes${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_TAXES = async ({
  token,
  pageSize = 5,
  pageNumber = 1,
  CountryGuid,
  FromDate,
  ToDate,
}) => {
  NEWCONFIG.headers.Authorization = `Bearer ${token}`;

  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (FromDate !== null) {
    queryParams.push(`FromDate=${FromDate}`);
  }
  if (ToDate !== null) {
    queryParams.push(`ToDate=${ToDate}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/tax/export-to-excel${queryString}`;

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
export const DELETE_TAXES = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/billing/api/v1/tax/delete?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/billing/api/v1/tax/delete?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

export const GET_ALL_TAX_TYPE_API = async () => {
  return await axiosInstance.get(
    `/billing/api/v1/TaxType/gettaxTypes?SearchKeyword=&pageSize=1000`
  );
};
export const GET_ALL_TAX_CATEGORY_API = async () => {
  return await axiosInstance.get(
    `/billing/api/v1/TaxCategory/get-all?SearchKeyword=&pageSize=1000`
  );
};

export const ADD_TAX = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/billing/api/v1/tax/add`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/billing/api/v1/tax/add`, postData);
    else throw e;
  }
};
export const EDIT_TAX = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/billing/api/v1/tax/update`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/billing/api/v1/tax/update`, postData);
    else throw e;
  }
};
