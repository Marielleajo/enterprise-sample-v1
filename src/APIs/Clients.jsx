import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

let client_url = `/member/api/admin/v1/client`;
let dashboard_client_url = `/member/api/admin/v1/dashboard/client`;

/**
 * Sends client information to the server.
 *
 * @param {string} clientId - The ID of the client.
 * @param {string} subject - The subject of the message.
 * @param {string} body - The body of the message.
 * @return {Promise} - A promise that resolves with the response of the API call.
 */

export const GET_CLIENT_CONFIG = async ({ type, clientId }) => {
  return await axiosInstance.get(
    `${client_url}/get-config?ClientId=${clientId}&TypeTag=${type}`
  );
};

export const SEND_CLIENT_INFO = async ({ clientId, body, subject }) => {
  return await axiosInstance?.get(
    `${client_url}/send-client-info?ClientGuid=${clientId}&Subject=${encodeURIComponent(
      subject
    )}&Body=${encodeURIComponent(body)}`
  );
};

export const UPDATE_CLIENT_STATUS = async ({ formData }) => {
  try {
    return await axiosInstance.put(`${client_url}/set-active-status`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `${client_url}/set-active-status`,
        formData
      );
    else throw e;
  }
};

export const DELETE_CLIENT = async ({ id }) => {
  try {
    return await axiosInstance.delete(`${client_url}?ClientGuid=${id}`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(`${client_url}?ClientGuid=${id}`);
    else throw e;
  }
};

export const GET_CLIENT = async ({ client }) => {
  try {
    return await axiosInstance.get(`${client_url}?ClientGuid=${client}`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(`${client_url}?ClientGuid=${client}`);
    else throw e;
  }
};

export const GET_ALL_RESELLERS = async () => {
  try {
    return await axiosInstance.get(`${client_url}/get-all?TypeTag=RESELLER`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(`${client_url}/get-all?TypeTag=RESELLER`);
    else throw e;
  }
};

export const UPDATE_ADVANCED_CLIENT = async (body) => {
  try {
    return await axiosInstance.put(`${client_url}`, body);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`${client_url}`, body);
    else throw e;
  }
};

export const REGISTER_NEW_CLIENT = async ({ formData }) => {
  return await axiosInstance.post(
    `/member/api/v1/client/register-without-mobilenumber`,
    formData,
    NEWCONFIG
  );
};

export const ADD_NEW_CLIENT = async ({ formData }) => {
  try {
    return await axiosInstance.post(`${client_url}`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`${client_url}`, formData);
    else throw e;
  }
};

export const UPDATE_NEW_CLIENT = async ({ formData }) => {
  try {
    return await axiosInstance.put(`${client_url}`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`${client_url}`, formData);
    else throw e;
  }
};

export const UPDATE_SMTP_CONFIG = async ({ formData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/SmtpConfiguration`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/SmtpConfiguration`,
        formData
      );
    else throw e;
  }
};

export const ADD_SMTP_CONFIG = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/SmtpConfiguration`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/SmtpConfiguration`,
        formData
      );
    else throw e;
  }
};

export const DELETE_SMTP_CONFIG = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/SmtpConfiguration`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/SmtpConfiguration`,
        formData
      );
    else throw e;
  }
};

export const GET_ALL_DASHBOARD_CLIENTS_API = async ({
  search = null,
  name = null,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
  kyc = null,
  HasAccount = null,
  CategoryTag = null,
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
    queryParams.push(`search=${encodeURIComponent(search)}`);
  }
  if (name !== null) {
    queryParams.push(`name=${encodeURIComponent(name)}`);
  }

  if (ParentGuid !== null) {
    queryParams.push(`ParentId=${ParentGuid}`);
  }
  if (kyc !== null) {
    queryParams.push(`kyc=${kyc}`);
  }
  if (HasAccount !== null) {
    queryParams.push(`HasAccount=${HasAccount}`);
  }
  if (CategoryTag !== null) {
    queryParams.push(`CategoryTag=${CategoryTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `${dashboard_client_url}${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const GET_ALL_CLIENT_API = async ({
  search = null,
  name = null,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
  kyc = null,
  HasAccount = null,
  CategoryTag = null,
  CreatedDate,
  Email,
  MobileNumber,
  ClassGuid,
  IsMobileVerified,
  Kyc,
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
    queryParams.push(`search=${encodeURIComponent(search)}`);
  }
  if (name) {
    queryParams.push(`name=${encodeURIComponent(name)}`);
  }
  if (Email) {
    queryParams.push(`Email=${encodeURIComponent(Email)}`);
  }
  if (CreatedDate) {
    queryParams.push(`CreatedDate=${encodeURIComponent(CreatedDate)}`);
  }
  if (MobileNumber) {
    queryParams.push(`MobileNumber=${encodeURIComponent(MobileNumber)}`);
  }
  if (ClassGuid) {
    queryParams.push(`ClassGuid=${encodeURIComponent(ClassGuid)}`);
  }
  if (Kyc?.length > 0) {
    queryParams.push(`Kyc=${encodeURIComponent(Kyc)}`);
  }
  if (IsMobileVerified) {
    queryParams.push(
      `IsMobileVerified=${encodeURIComponent(
        IsMobileVerified == "verified" ? "true" : "false"
      )}`
    );
  }

  if (ParentGuid) {
    queryParams.push(`ParentId=${ParentGuid}`);
  }
  if (kyc !== null) {
    queryParams.push(`kyc=${kyc}`);
  }
  if (HasAccount !== null) {
    queryParams.push(`HasAccount=${HasAccount}`);
  }
  if (CategoryTag !== null) {
    queryParams.push(`CategoryTag=${CategoryTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `${client_url}/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ALL_CLASSES = async ({
  token,
  ParentClientGuid,
  pageIndex,
  pageSize,
}) => {
  return await axiosInstance.get(
    `/member/api/v1/class/get-all-by-parent-client?ParentClientGuid=${ParentClientGuid}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        tenant: import.meta.env.VITE_TENANT,
      },
    }
  );
};

export const GET_ALL_CLIENT_ACCOUNT_API = async ({
  ClientGuid,
  AccountNumber = null,
  AccountTypeTag = null,
  AccountStatusTag = null,
  FromCreatedDate = null,
  ToCreatedDate = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (!ClientGuid) {
    throw new Error("ClientGuid is required.");
  }

  queryParams.push(`ClientGuid=${ClientGuid}`);

  if (AccountNumber !== null) {
    queryParams.push(`AccountNumber=${encodeURIComponent(AccountNumber)}`);
  }

  if (AccountTypeTag !== null) {
    queryParams.push(`AccountTypeTag=${encodeURIComponent(AccountTypeTag)}`);
  }

  if (AccountStatusTag !== null) {
    queryParams.push(
      `AccountStatusTag=${encodeURIComponent(AccountStatusTag)}`
    );
  }

  if (FromCreatedDate !== null) {
    queryParams.push(`FromCreatedDate=${FromCreatedDate}`);
  }

  if (ToCreatedDate !== null) {
    queryParams.push(`ToCreatedDate=${ToCreatedDate}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `billing/api/v1/clientaccount/get-all-by-client${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ALL_CATEGORIES = async () => {
  return await axiosInstance.get(`/member/api/admin/v1/Category/get-all`);
};

export const SAVE_KYC_DOCUMENT = async ({ postData }) => {
  return await axiosInstance.put(
    `/member/api/v1/client/save-kyc-document`,
    postData
  );
};

export const APPROVE_TERMS = async ({ postData }) => {
  return await axiosInstance.put(
    `/member/api/admin/v1/client/set-content`,
    postData
  );
};

export const APPROVE_KYC_DOCUMENT = async ({ postData }) => {
  return await axiosInstance.put(
    `/member/api/admin/v1/client/approve-kyc-document`,
    postData
  );
};

export const GET_ALL_CLIENTS_CATEGORY = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize !== null) {
    queryParams.push(`pageSize=${pageSize}`);
  }

  if (search !== null) {
    queryParams.push(`name=${encodeURIComponent(search)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/member/api/admin/v1/Category/get-all${queryString}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_PROVIDERS_BY_SERVICE = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  RecordGuid,
  ClientCategoryGuid = null,
  ProviderCategoryGuid,
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

  if (RecordGuid !== null) {
    queryParams.push(`RecordGuid=${RecordGuid}`);
  }

  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  if (ProviderCategoryGuid) {
    queryParams.push(`ProviderCategoryGuid=${ProviderCategoryGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/catalog/api/v1/Service/get-provider-by-service${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_CLIENT_CATEGORIES = async ({
  search = null,
  pageSize = 5,
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

  let url = `/member/api/admin/v1/Category/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_NEW_CATEGORY = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/member/api/admin/v1/Category`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/admin/v1/Category`,
        postData
      );
    else throw e;
  }
};

export const EDIT_CATEGORY = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/member/api/admin/v1/Category`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/member/api/admin/v1/Category`, postData);
    else throw e;
  }
};

export const DELETE_CATEGORY = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/member/api/admin/v1/Category?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/member/api/admin/v1/Category?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

export const GET_SERVICES = async ({
  ClientCategoryGuid,
  pageSize = 500000,
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

  if (ClientCategoryGuid !== null) {
    queryParams.push(
      `ClientCategoryGuid=${encodeURIComponent(ClientCategoryGuid)}`
    );
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/catalog/api/v1/Service/get-assigned-by-client-category${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ASSIGN_SERVICES = async ({ dataForm }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/v1/Service/map-client-category-services`,
      dataForm
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/v1/Service/map-client-category-services`,
        dataForm
      );
    else throw e;
  }
};

export const UNASSIGN_SERVICES = async ({ dataForm }) => {
  try {
    return await axiosInstance.delete(
      `/catalog/api/v1/Service/unassign-client-category-services`,
      { data: dataForm }
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/catalog/api/v1/Service/unassign-client-category-services`,
        { data: dataForm }
      );
    else throw e;
  }
};

export const GET_ALL_CLIENT_PARENT_API = async ({
  token,
  search = null,
  name = null,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
  kyc = null,
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
    queryParams.push(`search=${encodeURIComponent(search)}`);
  }
  if (name !== null) {
    queryParams.push(`name=${encodeURIComponent(name)}`);
  }

  if (ParentGuid !== null) {
    queryParams.push(`ParentId=${ParentGuid}`);
  }
  if (kyc !== null) {
    queryParams.push(`kyc=${kyc}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `${client_url}/get-all-by-parent${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_CLIENT_ELIGIBLE_BUNDLE = async ({
  ClientGuid,
  BundleTypeTags,
  bundleName,
  isSubscribed,
  pageNumber,
  pageSize,
  ClassGuid = null,
  SortBySubscribed = true,
}) => {
  let queryParams = [];
  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (BundleTypeTags != undefined) {
    queryParams.push(`BundleTypeTags=${BundleTypeTags}`);
  }
  if (bundleName != null) {
    queryParams.push(`Name=${bundleName}`);
  }
  if (ClassGuid) {
    queryParams.push(`ClassGuid=${ClassGuid}`);
  }
  if (isSubscribed != null) {
    queryParams.push(`isSubscribed=${isSubscribed}`);
  }
  if (pageNumber != null) {
    queryParams.push(`pageIndex=${pageNumber}`);
  }
  if (pageSize != null) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (SortBySubscribed != null) {
    queryParams.push(`SortBySubscribed=${SortBySubscribed}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `catalog/api/admin/v1/Bundle/get-eligible${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const SUBSCRIBE_CLIENT_TO_BUNDLE = async ({
  bundleType,
  selectedClient,
  bundleRecordGuid,
}) => {
  let url = `subscription/api/admin/v1/BundleSubscription/subscribe/${bundleType}`;
  try {
    if (bundleType == "free") {
      return await axiosInstance.post(url, {
        ClientRecordGuid: selectedClient,
      });
    } else {
      return await axiosInstance.post(url, {
        ClientRecordGuid: selectedClient,
        BundleRecordGuid: bundleRecordGuid,
      });
    }
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.post(url);
    else throw e;
  }
};

export const GET_CLIENT_BUNDLE_MODE = async ({ ClientGuid }) => {
  let queryParams = [];
  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `subscription/api/admin/v1/BundleSubscription/status${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const GET_SUBSCRIBED_CLIENT = async ({ ClientGuid }) => {
  let queryParams = [];
  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `catalog/api/admin/v1/Bundle/get-subscribed${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
