import axiosInstance from "./config/axios";

export const GET_ALL_RATES = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid,
  CountryGuid,
  OperatorGuid,
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

  if (ClientCategoryGuid) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }
  if (CountryGuid) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (OperatorGuid) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }
  if (operationTag) {
    queryParams.push(`OperationTypeTag=${operationTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/rateplan/get-by-client${queryString}`;
  console.log(
    "%cMyProject%cline:52%curl",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
    url
  );

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_RATES = async ({
  search = null,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid,
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

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }

  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }

  if (OperatorGuid !== null) {
    queryParams.push(`OperatorGuid=${OperatorGuid}`);
  }
  if (OperationType) {
    queryParams.push(`OperationTypeTag=${OperationType}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/rateplan/export-to-excel${queryString}`;

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

export const DELETE_RATES = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/rateplan/multi-delete`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/rateplan/multi-delete`,
        formData
      );
    else throw e;
  }
};

export const IMPORT_RATE = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/rateplan/import`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/rateplan/import`,
        formData
      );
    else throw e;
  }
};

export const IMPORT_RATE_WHATSAPP = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/rateplan/import_by_country_and_operation_type`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/rateplan/import_by_country_and_operation_type`,
        formData
      );
    else throw e;
  }
};

export const ADD_RATE = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/billing/api/v1/rateplan`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/billing/api/v1/rateplan`, postData);
    else throw e;
  }
};

export const EDIT_RATE = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/billing/api/v1/rateplan`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/billing/api/v1/rateplan`, postData);
    else throw e;
  }
};

export const GET_ALL_MISSING_RATES = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid,
  CountryRecordGuid,
  OperatorRecordGuid,
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

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (CountryRecordGuid !== null) {
    queryParams.push(`CountryRecordGuid=${CountryRecordGuid}`);
  }

  if (OperatorRecordGuid !== null) {
    queryParams.push(`OperatorRecordGuid=${OperatorRecordGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/rateplan/get-missing-rate-plans-by-client-category${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_MISSING_RATES = async ({
  search = null,
  ChannelGuid,
  ServiceGuid,
  ClientCategoryGuid,
  CountryRecordGuid,
  OperatorRecordGuid,
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

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (CountryRecordGuid !== null) {
    queryParams.push(`CountryRecordGuid=${CountryRecordGuid}`);
  }

  if (OperatorRecordGuid !== null) {
    queryParams.push(`OperatorRecordGuid=${OperatorRecordGuid}`);
  }

  const queryString =
    queryParams.length > 0 ? `?exportToCsv=true&${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/rateplan/export-missing-rate-plan-to-excel${queryString}`;

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

export const ADD_LOCK_UNLOCK = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/rateplan/lock-unlock-rate-plan`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/rateplan/lock-unlock-rate-plan`,
        postData
      );
    else throw e;
  }
};
