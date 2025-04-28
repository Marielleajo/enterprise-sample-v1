import axios from "axios";
import axiosInstance from "./config/axios";

let notification_url = "/notification/api/v1";

export const GET_ALL_SMS_API = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  clientId,
  service,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${notification_url}/API/get-all-api-list?PageIndex=${pageNumber}&PageSize=${pageSize}&clientGuid=${clientId}&ServiceTag=${service}`;
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

export const UPDATE_API_STATUS = async ({ ApiGuid, IsActive }) => {
  let url = `${notification_url}/API/status?ApiGuid=${ApiGuid}&IsActive=${IsActive}`;

  try {
    return await axiosInstance.put(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const DELETE_API_RECORD = async ({ ApiGuid }) => {
  let url = `${notification_url}/API?ApiGuid=${ApiGuid}`;

  try {
    return await axiosInstance.delete(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_API_BY_ID = async ({ token, clientId }) => {
  let url = `${notification_url}/API?ApiGuid=${clientId}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_COUNTRIES = async () => {
  let url = `/configuration/api/v1/Country/get-all?PageIndex=1&pageSize=400`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_OPERATORS = async ({
  iso,
  pageNumber = 1,
  pageSize = 10,
  search = "",
}) => {
  let url = `/configuration/api/v1/Operator/get-all?FilterActive=true&countryGuid=${iso}&PageIndex=${pageNumber}&pageSize=${pageSize}&Name=${search}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_SMS_API = async ({ token, postData }) => {
  try {
    return await axiosInstance.post(`${notification_url}/API`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`${notification_url}/API`, postData);
    else throw e;
  }
};

export const EXPORT_ALL_SMS_API = async ({ clientId, service }) => {
  return await axiosInstance.get(
    `${notification_url}/API/get-all?WithExport=${true}&clientGuid=${clientId}&ServiceTag=${service}`
  );
};

export const EDIT_SMS_API = async ({ token, postData }) => {
  try {
    return await axiosInstance.put(`${notification_url}/API`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`${notification_url}/API`, postData);
    else throw e;
  }
};

export const GET_ALL_SENDERS = async ({ token }) => {
  try {
    return await axiosInstance.get(`${notification_url}/sender/get-all`);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(`${notification_url}/sender/get-all`);
    else throw e;
  }
};

export const TEST_SINGLE_API = async ({ obj }) => {
  try {
    return await axiosInstance.post(
      `${notification_url}/api/single-message`,
      obj
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `${notification_url}/api/single-message`,
        obj
      );
    else throw e;
  }
};

export const SINGLE_PUSH_NOTIFICATION_ADVANCE_SEARCH = async ({
  deviceName,
  deviceToken,
  deviceId,
  appId,
}) => {
  let url = `${notification_url}/push/get-devices?Token=${deviceToken}&DeviceName=${deviceName}&DeviceId=${deviceId}&AppId=${appId}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const TEST_BULK_API = async ({ token, postData }) => {
  try {
    return await axiosInstance.post(
      `${notification_url}/api/send-bulk-sms-test`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `${notification_url}/api/send-bulk-sms-test`,
        postData
      );
    else throw e;
  }
};
