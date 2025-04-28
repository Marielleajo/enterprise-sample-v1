import axios from "axios";
import axiosInstance from "./config/axios";
import { generateSignature } from "../SM/Utils/GetSignature";
import { getCSRFToken } from "../SM/Utils/GenerateSignature";

let configuration_url = "configuration/api/v1/";

export const SIGN_OUT = async () => {
  return await axiosInstance.post("/member/api/v1/auth/logout");
};

export const VERIFY_EMAIL = async ({ formData }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/user/verify-email`, {
      ...formData,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/member/api/v1/user/verify-email`, {
        ...formData,
      });
    else throw e;
  }
};

export const RESET_PASSWORD = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/member/api/v1/user/custom-reset-password`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/v1/user/custom-reset-password`,
        formData
      );
    else throw e;
  }
};

export const CHANGE_PASSWORD = async ({ NewPassword }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/user/change-password`, {
      NewPassword,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/member/api/v1/user/change-password`, {
        NewPassword,
      });
    else throw e;
  }
};

export const REQUEST_OTP = async ({ username }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/user/request-resend-otp`, {
      username,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/v1/user/request-resend-otp`,
        { username }
      );
    else throw e;
  }
};

export const SIGN_IN = async ({ username, password }) => {
  return axios.post(
    `${import.meta.env.VITE_API_IDENTITY_URL}/member/api/v1/auth/login`,
    { username, password },
    {
      headers: {
        tenant: `${import.meta.env.VITE_TENANT}`,
      },
    }
  );
};

export const SIGN_IN_URL = async ({ username, password }) => {
  const xsignature = generateSignature({ username, password });
  const isCSRF = import.meta.env.VITE_CSRF;
  const tenant = `${import.meta.env.VITE_TENANT}`;
  let csrfToken;
  if (isCSRF == "true") {
    csrfToken = await getCSRFToken({ tenant });
    if (!csrfToken) {
      return;
    }
  }

  const URL = `${
    import.meta.env.VITE_API_IDENTITY_URL
  }/member/api/v1/auth/login-user`;
  return axios.post(
    URL,
    { username, password },
    {
      withCredentials: isCSRF == "true" ? true : null,
      headers: {
        tenant: tenant,
        "X-Signature": xsignature,
        MenuGroup: 2,
        "X-CSRF-TOKEN": isCSRF == "true" ? csrfToken : null,
      },
    }
  );
};

export const UPLOAD_MEDIA = async ({ token, formData }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/Media/Upload`, formData);
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.post(`/member/api/v1/Media/Upload`, formData);
    } else throw e;
  }
};

export const GET_ALL_CHANNELS = async (token) => {
  return await axios.get(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/notification/api/admin/v1/Channel/get-all`,
    {
      headers: {
        tenant: import.meta.env.VITE_TENANT,
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const GET_ADDRESS = async ({ clientGuid }) => {
  try {
    return await axiosInstance.get(
      `/member/api/v1/address/client?ClientGuid=${clientGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/member/api/v1/address/client?ClientGuid=${clientGuid}`
      );
    else throw e;
  }
};

export const GET_SMTP_BY_ID = async ({ clientGuid }) => {
  try {
    return await axiosInstance.get(
      `/configuration/api/admin/v1/SmtpConfiguration/get-all?ClientGuid=${clientGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/admin/v1/SmtpConfiguration/get-all?ClientGuid=${clientGuid}`
      );
    else throw e;
  }
};

export const GET_SASS_CONFIG = async ({ path }) => {
  try {
    return await axiosInstance.get(
      `/member/api/admin/v1/client/get-saas-config?BusinessWebUrl=${path}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/member/api/admin/v1/client/get-saas-config?BusinessWebUrl=${path}`
      );
    else throw e;
  }
};

export const GET_ADVANCED_SERVICES = async ({
  clientCategoryGuid,
  clientGuid,
}) => {
  return await axiosInstance.get(
    `/catalog/api/v1/Service/get-client-advanced-service?ClientCategoryGuid=${clientCategoryGuid}&ClientGuid=${clientGuid}`
  );
};

export const SUBSCRIBE_TO_SERVICE = async ({ postData }) => {
  return await axiosInstance.post(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/subscription/api/v1/ServiceSubscription/subscribe`,
    postData
  );
};

export const UNSUBSCRIBE_TO_SERVICE = async ({ postData }) => {
  return await axiosInstance.post(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/subscription/api/v1/ServiceSubscription/unsubscribe`,
    postData
  );
};

export const SUBSCRIBE_TO_FEATURE = async ({ postData }) => {
  return await axiosInstance.post(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/subscription/api/v1/FeatureSubscription/subscribe`,
    postData
  );
};

export const UNSUBSCRIBE_TO_FEATURE = async ({ postData }) => {
  return await axiosInstance.post(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/import { tenantKey } from './../Redux/Actions/index';
subscription/api/v1/FeatureSubscription/unsubscribe`,
    postData
  );
};

export const GET_USER_MENU_API = async ({ menuRecordGuid }) => {
  try {
    const response = await axiosInstance.get(
      `/member/api/admin/v1/Menu/get-user-menu?MenuRecordGuid=${menuRecordGuid}`
    );
    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      return await axiosInstance.get(
        `/member/api/admin/v1/Menu/get-user-menu?MenuRecordGuid=${menuRecordGuid}`
      );
    } else {
      throw e;
    }
  }
};

export const GET_ALL_LANGUAGES = async () => {
  const params = {
    PageIndex: 1,
    PageSize: 1000,
  };

  try {
    return await axiosInstance.get(`${configuration_url}language/get-all`, {
      params,
    });
  } catch (e) {
    if (e?.response?.status === 401) {
      return await axiosInstance.get(`${configuration_url}language/get-all`, {
        params,
      });
    } else throw e;
  }
};
