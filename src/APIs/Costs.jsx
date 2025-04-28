import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ALL_PROVIDERS_CATEGORY = async ({
  search = null,
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

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
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

export const GET_ALL_COSTS = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ChannelGuid,
  ServiceGuid,
  ProviderCategoryGuid,
  ProviderGuid,
  OperatorGuid,
  CountryGuid,
  operationTag,
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

  if (ProviderCategoryGuid !== null) {
    queryParams.push(`ProviderCategoryGuid=${ProviderCategoryGuid}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }
  if (OperatorGuid) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  if (operationTag) {
    queryParams.push(`OperationTypeTag=${operationTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/costplan/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_COSTS = async ({
  search = null,
  ChannelGuid,
  ServiceGuid,
  ProviderCategoryGuid,
  ProviderGuid,
  CountryGuid,
  OperatorGuid,
  OperationType,
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

  if (ProviderCategoryGuid !== null) {
    queryParams.push(`ProviderCategoryGuid=${ProviderCategoryGuid}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }

  if (OperatorGuid) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperationType) {
    queryParams.push(`OperationTypeTag=${OperationType}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/costplan/export-cost-plans-to-excel${queryString}`;

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

export const DELETE_COSTS = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/costplan/multi-delete`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/costplan/multi-delete`,
        formData
      );
    else throw e;
  }
};

export const IMPORT_COST = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/costplan/import`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/costplan/import`,
        formData
      );
    else throw e;
  }
};

export const IMPORT_COST_WHATSAPP = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/costplan/import-whatsapp-cost-plans`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/costplan/import-whatsapp-cost-plans`,
        formData
      );
    else throw e;
  }
};

export const ADD_COST = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/billing/api/v1/costplan`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/billing/api/v1/costplan`, postData);
    else throw e;
  }
};

export const EDIT_COST = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/billing/api/v1/costplan`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/billing/api/v1/costplan`, postData);
    else throw e;
  }
};
