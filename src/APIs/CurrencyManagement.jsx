import axiosInstance from "./config/axios";

export const GET_ALL_EXCHANGE_RATE = async ({
  GetAutomatic,
  pageIndex,
  pageSize,
  SourceGuid,
  DestinationGuid,
}) => {
  let url = "";
  try {
    url = `billing/api/v2/exchangerate/get-all?GetAutomatic=${GetAutomatic}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (SourceGuid) {
      url += `&SourceGuid=${SourceGuid}`;
    }
    if (DestinationGuid) {
      url += `&DestinationGuid=${DestinationGuid}`;
    }

    return await axiosInstance.get(url);
  } catch (e) {
    if (e.response && e.response.status === 401) {
      return await axiosInstance.get(url);
    } else {
      throw e;
    }
  }
};

export const ADD_EXCHANGE_RATE = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v2/exchangerate/add-exchange-rate`,
      data
    );
  } catch (e) {
    if (e === "error: 401")
      return await axiosInstance.post(
        `/billing/api/v2/exchangerate/add-exchange-rate`,
        data
      );
    else throw e;
  }
};

export const EDIT_EXCHANGE_RATE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v2/exchangerate/update-exchange-rate`,
      data
    );
  } catch (e) {
    if (e === "error: 401")
      return await axiosInstance.put(
        `/billing/api/v2/exchangerate/update-exchange-rate`,
        data
      );
    else throw e;
  }
};

export const DELETE_EXCHANGE_RATE = async ({ data }) => {
  try {
    return await axiosInstance.delete(
      `/billing/api/v2/exchangerate/delete-exchange-rate?ExchangeRateGuid=${data}`
    );
  } catch (e) {
    if (e === "error: 401")
      return await axiosInstance.delete(
        `/billing/api/v2/exchangerate/delete-exchange-rate?ExchangeRateGuid=${data}`
      );
    else throw e;
  }
};

export const EXPORT_ALL_EXCHANGE_RATE = async ({ records, GetAutomatic }) => {
  const queryParams =
    records.length > 0
      ? records.map((record) => `Records=${record}`).join("&")
      : "";

  const url = queryParams
    ? `/billing/api/v2/exchangerate/export-to-excel?${queryParams}&GetAutomatic=${GetAutomatic}`
    : `/billing/api/v2/exchangerate/export-to-excel?GetAutomatic=${GetAutomatic}`;

  try {
    return await axiosInstance.get(url, {
      responseType: "blob",
    });
  } catch (e) {
    if (e.response && e.response.status === 401) {
      return await axiosInstance.get(url, {
        responseType: "blob",
      });
    } else throw e;
  }
};

export const GET_CURRENCIES = async () => {
  try {
    return await axiosInstance.get(
      `/configuration/api/v1/Currency/get-all?pageSize=1000&pageIndex=0`
    );
  } catch (e) {
    if (e === "error: 401")
      return await axiosInstance.get(
        `/configuration/api/v1/Currency/get-all?pageSize=1000&pageIndex=0`
      );
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

  let url = `/configuration/api/admin/v1/Currency/get-default`;

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

export const GET_ALL_HISTORY = async ({
  CurrencyGuid,
  pageSize = 10,
  pageNumber = 1,
}) => {
  console.log("bakc", CurrencyGuid);
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (CurrencyGuid) {
    queryParams.push(`CurrencyGuid=${CurrencyGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v2/exchangerate/get-all-history${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
