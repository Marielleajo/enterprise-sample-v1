import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ALL_PROVIDERS_CATEGORY = async () => {
  return await axiosInstance.get(`/member/api/admin/v1/provider/categories`);
};

export const GET_ALL_PROVIDERS = async ({ data }) => {
  return await axiosInstance.get(
    `/catalog/api/v1/Service/get-provider-by-service`,
    { ...data }
  );
};

export const GET_ALL_ROUTE = async ({
  serviceURL,
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  Blocked = null,
  Locked = null,
  Mcc = null,
  Mnc = null,
  ProviderGuid = null,
}) => {
  NEWCONFIG.headers.Authorization = `Bearer ${token}`;

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

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  if (Blocked !== null) {
    queryParams.push(`Blocked=${Blocked}`);
  }

  if (Locked !== null) {
    queryParams.push(`Locked=${Locked}`);
  }

  if (Mcc !== null) {
    queryParams.push(`Mcc=${Mcc}`);
  }

  if (Mnc !== null) {
    queryParams.push(`Mnc=${Mnc}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/routing/api/admin/v1/RoutePlan/${serviceURL}${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_ROUTE = async ({
  serviceURL,
  token,
  search = null,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  Blocked = null,
  Locked = null,
  Mcc = null,
  Mnc = null,
  ProviderGuid = null,
}) => {
  NEWCONFIG.headers.Authorization = `Bearer ${token}`;

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

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  if (Blocked !== null) {
    queryParams.push(`Blocked=${Blocked}`);
  }

  if (Locked !== null) {
    queryParams.push(`Locked=${Locked}`);
  }

  if (Mcc !== null) {
    queryParams.push(`Mcc=${Mcc}`);
  }

  if (Mnc !== null) {
    queryParams.push(`Mnc=${Mnc}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/routing/api/admin/v1/RoutePlan/${serviceURL}/Export/Csv${queryString}`;

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

export const DELETE_ROUTE = async ({ formData, serviceURL }) => {
  try {
    return await axiosInstance.delete(
      `/routing/api/admin/v1/RoutePlan/${serviceURL}`,
      {
        data: formData,
      }
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/billing/api/v1/costplan/${serviceURL}`,
        {
          data: formData,
        }
      );
    else throw e;
  }
};

export const ADD_ROUTE = async ({ postData, serviceURL }) => {
  try {
    return await axiosInstance.post(
      `/routing/api/admin/v1/RoutePlan/${serviceURL}`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/routing/api/admin/v1/RoutePlan/${serviceURL}`,
        postData
      );
    else throw e;
  }
};

export const EDIT_ROUTE = async ({ postData, serviceURL }) => {
  try {
    return await axiosInstance.put(
      `/routing/api/admin/v1/RoutePlan/${serviceURL}`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/routing/api/admin/v1/RoutePlan/${serviceURL}`,
        postData
      );
    else throw e;
  }
};

export const BLOCK_ROUTE = async ({ postData, serviceURL, actionStatus }) => {
  try {
    return await axiosInstance.put(
      `/routing/api/admin/v1/RoutePlan/${serviceURL}/${actionStatus}`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/routing/api/admin/v1/RoutePlan/${serviceURL}/${actionStatus}`,
        postData
      );
    else throw e;
  }
};

export const GET_ALL_PROVIDER = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.get(
      `catalog/api/v1/Service/get-provider-by-service?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `catalog/api/v1/Service/get-provider-by-service?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};
