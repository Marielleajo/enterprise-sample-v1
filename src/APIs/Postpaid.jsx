import axiosInstance from "./config/axios";

export const GET_ALL_RESELLER_API = async ({
  pageNumber = 1,
  pageSize = 10,
  search,
  TypeTag,
  StatusTag,
}) => {
  let queryParams = [];

  if (search) {
    queryParams.push(`search=${search}`);
  }
  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (TypeTag !== null) {
    queryParams.push(`TypeTag=${TypeTag}`);
  }
  if (StatusTag) {
    queryParams.push(`StatusTag=${StatusTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/member/api/admin/v1/client/get-all${queryString}`;
  return await axiosInstance.get(url);
};

export const GET_ALL_CLIENT_API = async ({
  ParentId,
  search = null,
  pageSize = 2,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (ParentId !== null) {
    queryParams.push(`ParentId=${ParentId}`);
  }
  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (search !== null) {
    queryParams.push(`search=${encodeURIComponent(search)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/member/api/admin/v1/client/get-all${queryString}`;

  return await axiosInstance.get(url);
};

export const GET_THRESHOLD = async ({ PageSize }) => {
  return await axiosInstance.get(
    `/configuration/api/v1/GlobalConfiguration/get-all?PageSize=${PageSize}`
  );
};
export const GET_ALL_PROVIDER_API = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/member/api/admin/v1/provider/get-all`,
      postData
    );
  } catch (e) {
    if (e.response?.status === 401)
      return await axiosInstance.post(
        `/member/api/admin/v1/provider/get-all`,
        postData
      );
    else throw e;
  }
};

// Table get all
export const GET_ALL_PROVIDERS = async ({
  search,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
  ProviderGuids,
}) => {
  const requestBody = {
    PageSize: pageSize,
    PageIndex: pageNumber,
    search: search,
    ParentGuid: ParentGuid,
    ProviderGuids: ProviderGuids,
  };

  let url = `/billing/api/v1/provideraccount/get-all-postpaid`;
  try {
    return await axiosInstance.post(url, requestBody);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.post(url, requestBody);
    else throw e;
  }
};
export const GET_ALL_CLIENTS = async ({
  search,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
  ClientGuids, // Remove default value from here
  ParentIncluded = false,
}) => {
  const requestBody = {
    PageSize: pageSize,
    PageIndex: pageNumber,
    search: search,
    ParentGuid: ParentGuid,
    ParentIncluded: ParentIncluded,
  };

  // Conditionally add ClientGuids to the requestBody if it exists
  if (ClientGuids) {
    requestBody.ClientGuids = [ClientGuids];
  }

  let url = `/billing/api/v1/clientaccount/get-all-postpaid`;
  try {
    return await axiosInstance.post(url, requestBody);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.post(url, requestBody);
    else throw e;
  }
};

export const GET_ACCOUNT_ACTIVITY_CLIENT = async ({
  pageSize = 5,
  pageNumber = 1,
  ClientAccountGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (ClientAccountGuid !== null) {
    queryParams.push(`ClientAccountGuid=${ClientAccountGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/clientaccount/get-history${queryString}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ACCOUNT_ACTIVITY_PROVIDER = async ({
  pageSize = 5,
  pageNumber = 1,
  ProviderAccountGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (ProviderAccountGuid !== null) {
    queryParams.push(`ProviderAccountGuid=${ProviderAccountGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/provideraccount/get-history${queryString}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
//

export const ADD_DOWN_PAYMENT_CLIENT = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/clientaccount/add-down-payment`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/clientaccount/add-down-payment`,
        postData
      );
    else throw e;
  }
};

export const POST_CLIENTS = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/clientaccount/open-postpaid-account`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/clientaccount/open-postpaid-account`,
        postData
      );
    else throw e;
  }
};

export const UPDATE_BALANCE_CLIENT = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/clientaccount/update-balance-limit`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/clientaccount/update-balance-limit`,
        postData
      );
    else throw e;
  }
};

export const ADD_DOWN_PAYMENT_PROVIDER = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/provideraccount/add-down-payment`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/provideraccount/add-down-payment`,
        postData
      );
    else throw e;
  }
};

export const POST_PROVIDER = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/provideraccount/open-postpaid-account`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/provideraccount/open-postpaid-account`,
        postData
      );
    else throw e;
  }
};

export const UPDATE_BALANCE_PROVIDER = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/provideraccount/update-balance-limit`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/provideraccount/update-balance-limit`,
        postData
      );
    else throw e;
  }
};
