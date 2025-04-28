import axiosInstance from "./config/axios";
import { NEWCONFIG } from "./index_new";

let reseller_url = "/member/api/admin/v1/client";

export const UPDATE_RESELLER_STATUS = async ({ token, formData }) => {
  try {
    return await axiosInstance.put(
      `${reseller_url}/set-active-status`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `${reseller_url}/set-active-status`,
        formData
      );
    else throw e;
  }
};

export const DELETE_RESELLER = async ({ token, id }) => {
  try {
    return await axiosInstance.delete(`${reseller_url}?ClientGuid=${id}`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(`${reseller_url}?ClientGuid=${id}`);
    else throw e;
  }
};

export const ADD_NEW_RESELLER = async ({ token, formData }) => {
  try {
    return await axiosInstance.post(`${reseller_url}`, formData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`${reseller_url}`, formData);
    else throw e;
  }
};

export const GET_ALL_RESELLER_API = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  type,
  StatusTag,
  SignupDateFrom,
  SignupDateTo,
  RejectedDateFrom,
  RejectedDateTo,
  RejectionReasonGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${reseller_url}/get-all?PageIndex=${pageNumber}&PageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (type) {
    url += `&TypeTag=${encodeURIComponent(type)}`;
  }
  if (StatusTag) {
    url += `&StatusTag=${encodeURIComponent(StatusTag)}`;
  }
  if (SignupDateFrom) {
    url += `&SignupDateFrom=${encodeURIComponent(SignupDateFrom)}`;
  }
  if (SignupDateTo) {
    url += `&SignupDateTo=${encodeURIComponent(SignupDateTo)}`;
  }
  if (RejectedDateFrom) {
    url += `&RejectedDateFrom=${encodeURIComponent(RejectedDateFrom)}`;
  }
  if (RejectedDateTo) {
    url += `&RejectedDateTo=${encodeURIComponent(RejectedDateTo)}`;
  }
  if (RejectionReasonGuid) {
    url += `&RejectionReasonGuid=${encodeURIComponent(RejectionReasonGuid)}`;
  }

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ADMIN_RESELLER_API = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `/member/api/v1/user/get-client-users?PageIndex=${pageNumber}&PageSize=${pageSize}&ParentGuid=${ParentGuid}&TypeTag=ADMIN`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ALL_CLIENT_RESELLER_API = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ParentGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${reseller_url}/get-all?PageIndex=${pageNumber}&PageSize=${pageSize}&ParentId=${ParentGuid}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_RESELLER_API = async ({ search = null, TypeTag }) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${reseller_url}/export-csv?TypeTag=${TypeTag}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_PIN = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/member/api/v1/user/request-reset-password`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/v1/user/request-reset-password`,
        formData
      );
    else throw e;
  }
};

export const GET_CLIENT_SERVICES = async ({
  token,
  recordGuid,
  clientCategoryRecordGuid,
}) => {
  NEWCONFIG.headers.Authorization = `Bearer ${token}`;
  // Create a URL with or without the searchCriteria parameter
  let url = `/catalog/api/v1/Service/get-client-service?`;
  if (recordGuid) {
    url += `&ClientGuid=${encodeURIComponent(recordGuid)}`;
  }

  if (clientCategoryRecordGuid) {
    url += `&ClientCategoryGuid=${encodeURIComponent(
      clientCategoryRecordGuid
    )}`;
  }

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const SUBSCRIBE_RESELLER = async ({ dataForm }) => {
  try {
    return await axiosInstance.post(
      `/subscription/api/v1/ServiceSubscription/subscribe`,
      dataForm
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/subscription/api/v1/ServiceSubscription/subscribe`,
        dataForm
      );
    else throw e;
  }
};

export const UNSUBSCRIBE_RESELLER = async ({ dataForm }) => {
  try {
    return await axiosInstance.post(
      `/subscription/api/v1/ServiceSubscription/unsubscribe`,
      dataForm
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/subscription/api/v1/ServiceSubscription/unsubscribe`,
        dataForm
      );
    else throw e;
  }
};

export const GET_ALL_ACCOUNTS_TYPE = async () => {
  // Create a URL with or without the searchCriteria parameter
  let url = `/billing/api/v1/AccountType/get-all`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_CONFIG_DATA = async ({ id }) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${reseller_url}/get-config?TypeTag=ACCOUNT_CONFIG&ClientId=${id}`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const REJECT_RESELLER = async (data) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `member/api/admin/v1/client/reject-signup`;
  try {
    return await axiosInstance.put(url, data);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.put(url, data);
    else throw e;
  }
};
export const APPROVE_RESELLER = async (data) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `member/api/admin/v1/client/approve-signup`;
  try {
    return await axiosInstance.put(url, data);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.put(url, data);
    else throw e;
  }
};
export const GET_ALL_CATEGORTIES = async () => {
  let url = `member/api/admin/v1/Category/get-all?WithExport=false&PageSize=1000&PageIndex=0`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
