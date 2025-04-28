import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ALL_SERVICES = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
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

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/catalog/api/v1/Service/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const DELETE_SERVICE = async ({ formData }) => {
  try {
    return await axiosInstance.delete(`/catalog/api/v1/Service`, {
      data: formData,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(`/catalog/api/v1/Service`, {
        data: formData,
      });
    else throw e;
  }
};

export const ADD_SERVICE = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/v1/Service/add-service-basic`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/v1/Service/add-service-basic`,
        postData
      );
    else throw e;
  }
};

export const EDIT_SERVICE = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/Service`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/catalog/api/v1/Service`, postData);
    else throw e;
  }
};

export const UPDATE_SERVICE_PRICE = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/Service`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/catalog/api/v1/Service`, postData);
    else throw e;
  }
};

export const UPDATE_SERVICE_STATUS = async ({ formData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/Service/status`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/v1/Service/status`,
        formData
      );
    else throw e;
  }
};

export const GET_ALL_SERVICE_CATEGORY = async () => {
  let url = `/catalog/api/v1/ServiceCategory/GetAll`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ALL_SERVICE_TYPE = async () => {
  let url = `/catalog/api/v1/ServiceType/get-all`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_PRICING_TYPES = async ({ data }) => {
  let url = `/configuration/api/v1/criteria/get-all`;

  try {
    return await axiosInstance.post(url, data);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.post(url);
    else throw e;
  }
};

//manage features
export const GET_ALL_FEATURES = async ({ ServiceGuid }) => {
  let url = `/catalog/api/v1/Feature/get-all?ServiceGuid=${ServiceGuid}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const MANAGE_FEATURE = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/catalog/api/v1/Feature`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/catalog/api/v1/Feature`, postData);
    else throw e;
  }
};

export const ASSIGN_FEATURE_TO_SERVICE = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/catalog/api/v1/ServiceFeature`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/v1/ServiceFeature`,
        postData
      );
    else throw e;
  }
};

export const DELETE_FEATURE = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/catalog/api/v1/Feature?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/catalog/api/v1/Feature?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

//category apis

export const GET_ALL_CATEGORIES = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
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

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/catalog/api/v1/ServiceCategory/GetAll${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const UPDATE_CATEGORY_STATUS = async ({ formData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/ServiceCategory`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/v1/ServiceCategory`,
        formData
      );
    else throw e;
  }
};

export const ADD_SERVICE_CATEGORY = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/v1/ServiceCategory/add-service-category-basic`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/v1/ServiceCategory/add-service-category-basic`,
        formData
      );
    else throw e;
  }
};

export const EDIT_SERVICE_CATEGORY = async ({ formData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/ServiceCategory`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/v1/ServiceCategory`,
        formData
      );
    else throw e;
  }
};

export const DELETE_SERVICE_CATEGORY = async ({ formData }) => {
  try {
    return await axiosInstance.delete(`/catalog/api/v1/ServiceCategory`, {
      data: formData,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(`/catalog/api/v1/ServiceCategory`, {
        data: formData,
      });
    else throw e;
  }
};

//Type apis
export const GET_ALL_TYPES = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
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

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/catalog/api/v1/ServiceType/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const UPDATE_TYPE_STATUS = async ({ formData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/ServiceType`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/catalog/api/v1/ServiceType`, formData);
    else throw e;
  }
};

export const ADD_SERVICE_TYPE = async ({ formData }) => {
  try {
    return await axiosInstance.post(`/catalog/api/v1/ServiceType`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/catalog/api/v1/ServiceType`, formData);
    else throw e;
  }
};

export const EDIT_SERVICE_TYPE = async ({ formData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/ServiceType`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/catalog/api/v1/ServiceType`, formData);
    else throw e;
  }
};

export const DELETE_SERVICE_TYPE = async ({ formData }) => {
  try {
    return await axiosInstance.delete(`/catalog/api/v1/ServiceType`, {
      data: formData,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(`/catalog/api/v1/ServiceType`, {
        data: formData,
      });
    else throw e;
  }
};
