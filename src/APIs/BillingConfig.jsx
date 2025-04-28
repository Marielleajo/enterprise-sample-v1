import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ACCOUNT_STATUS = async ({
  search = null,
  pageSize = 10,
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

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/AccountStatus/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ACCOUNT_STATUS = async ({ search = null }) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/AccountStatus/export-to-excel${queryString}`;

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

export const GET_ACCOUNT_TYPE = async ({
  search = null,
  pageSize = 10,
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

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/AccountType/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_PROFIT_MARGIN = async ({
  search = null,
  ProviderGuid,
  ServiceGuid,
  ChannelGuid,
  pageSize = 10,
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

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${encodeURIComponent(ProviderGuid)}`);
  }

  if (ServiceGuid !== null) {
    queryParams.push(`ServiceGuid=${encodeURIComponent(ServiceGuid)}`);
  }

  if (ChannelGuid !== null) {
    queryParams.push(`ChannelGuid=${encodeURIComponent(ChannelGuid)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/clientcategoryprofitmargin/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const POPULATE_RATE_PROFIT = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/rateplan/populate_rate_plan_profit_margin`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/rateplan/populate_rate_plan_profit_margin`,
        data
      );
    else throw e;
  }
};

export const POPULATE_WHATSAPP_RATE_PROFIT = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/rateplan/populate_whatsapp_rate_plan_profit_margin`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/rateplan/populate_whatsapp_rate_plan_profit_margin`,
        data
      );
    else throw e;
  }
};

export const EXPORT_ACCOUNT_TYPE = async ({ search = null }) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/AccountType/export-to-excel${queryString}`;

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
