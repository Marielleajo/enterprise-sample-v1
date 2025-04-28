import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

export const GET_ALL_OPERATORS = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  CountryGuid,
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
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/Operator/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_OPERATORS = async ({ search = null, CountryGuid }) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/Operator/export-operators-csv${queryString}`;

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

export const ADD_OPERATOR = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Operator`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Operator`,
        postData
      );
    else throw e;
  }
};

export const EDIT_OPERATOR = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Operator`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Operator`,
        postData
      );
    else throw e;
  }
};

export const GET_ALL_PREFIXES = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  PrefixNumber,
  CountryGuid,
  OperatorGuid,
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
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (PrefixNumber !== null) {
    queryParams.push(`PrefixNumber=${PrefixNumber}`);
  }
  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/Prefix/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_PREFIX = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Prefix`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Prefix`,
        postData
      );
    else throw e;
  }
};

export const EDIT_PREFIX = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Prefix`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Prefix`,
        postData
      );
    else throw e;
  }
};

export const CHANGE_STATUS_PREFIXES = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Prefix/toggle-status`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Prefix/toggle-status`,
        postData
      );
    else throw e;
  }
};

export const EXPORT_ALL_PREFIXES = async ({
  search = null,
  PrefixNumber,
  CountryGuid,
  OperatorGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (PrefixNumber !== null) {
    queryParams.push(`PrefixNumber=${PrefixNumber}`);
  }
  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/Prefix/export-prefixes-csv${queryString}`;

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

export const DELETE_PREFIX = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/configuration/api/admin/v1/Prefix?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/Prefix?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

export const IMPORT_PREFIX = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Prefix/import-prefixes-csv`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Prefix/import-prefixes-csv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    else throw e;
  }
};

export const GET_ALL_MNC = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  mnc,
  CountryGuid,
  OperatorGuid,
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
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (mnc !== null) {
    queryParams.push(`mnc=${mnc}`);
  }
  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/MNC/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_MNC = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/MNC`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/MNC`,
        postData
      );
    else throw e;
  }
};

export const EDIT_MNC = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/configuration/api/admin/v1/MNC`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/MNC`,
        postData
      );
    else throw e;
  }
};

export const CHANGE_STATUS_MNC = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/MNC/toggle-status`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/MNC/toggle-status`,
        postData
      );
    else throw e;
  }
};

export const CHANGE_STATUS_MAIN = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/MNC/toggle-is-main`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/MNC/toggle-is-main`,
        postData
      );
    else throw e;
  }
};

export const EXPORT_ALL_MNC = async ({
  search = null,
  mnc,
  CountryGuid,
  OperatorGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (mnc !== null) {
    queryParams.push(`mnc=${mnc}`);
  }
  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/MNC/export-mncs-csv${queryString}`;

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

export const DELETE_MNC = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/configuration/api/admin/v1/MNC?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/MNC?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

export const GET_ALL_STATE = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  CountryIso,
  Name,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (search) {
    queryParams.push(`SearchKeyword=${search}`);
  }

  if (CountryIso !== null) {
    queryParams.push(`CountryIso=${CountryIso}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/State/get-system${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const DELETE_STATE = async (RecordGuid) => {
  try {
    return await axiosInstance.delete(
      `configuration/api/admin/v1/State?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `configuration/api/admin/v1/State?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};
export const ADD_STATE = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `configuration/api/admin/v1/State`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `configuration/api/admin/v1/State`,
        postData
      );
    else throw e;
  }
};
export const CHANGE_STATUS_STATE = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/State/toggle-status`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/State/toggle-status`,
        postData
      );
    else throw e;
  }
};
export const EDIT_STATE = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/State`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/State`,
        postData
      );
    else throw e;
  }
};

export const EXPORT_ALL_STATES = async ({ search = null, CountryGuid }) => {
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`Name=${encodeURIComponent(search)}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/State/export-cities-csv${queryString}`;

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
export const GET_ALL_DISTRICT = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  CountryIso,
  Name,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (Name) {
    queryParams.push(`Name=${Name}`);
  }

  if (CountryIso !== null) {
    queryParams.push(`CountryIso=${CountryIso}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/District/get-system${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const ADD_DISTRICT = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `configuration/api/admin/v1/District`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `configuration/api/admin/v1/District`,
        postData
      );
    else throw e;
  }
};
export const CHANGE_STATUS_DISTRICT = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/District/toggle-status`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/District/toggle-status`,
        postData
      );
    else throw e;
  }
};
export const DELETE_DISTRICT = async (RecordGuid) => {
  try {
    return await axiosInstance.delete(
      `configuration/api/admin/v1/District?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `configuration/api/admin/v1/District?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};
export const EDIT_DISTRICT = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/District`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/District`,
        postData
      );
    else throw e;
  }
};

export const GET_ALL_CITIES = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  CountryIso,
  Name,
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

  if (CountryIso !== null) {
    queryParams.push(`CountryIso=${CountryIso}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `configuration/api/admin/v1/city/get-system${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const ADD_CITY = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `configuration/api/admin/v1/city`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `configuration/api/admin/v1/city`,
        postData
      );
    else throw e;
  }
};
export const CHANGE_STATUS_CITY = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/City/toggle-status`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/City/toggle-status`,
        postData
      );
    else throw e;
  }
};
export const DELETE_CITY = async (RecordGuid) => {
  try {
    return await axiosInstance.delete(
      `configuration/api/admin/v1/City?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `configuration/api/admin/v1/City?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};
export const EDIT_CITY = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/City`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/City`,
        postData
      );
    else throw e;
  }
};
