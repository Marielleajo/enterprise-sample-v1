import axiosInstance from "./config/axios";

export const GET_ALL_REASON_TYPES = async ({
  pageSize = 10,
  pageNumber = 1,
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/subscription/api/v1/ReasonType/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_REASON_TYPE = async (reasonType) => {
  try {
    return await axiosInstance.post(`/subscription/api/v1/ReasonType`, {
      ReasonTypeDetails: [reasonType],
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/subscription/api/v1/ReasonType`,
        reasonType
      );
    else throw e;
  }
};

export const UPDATE_REASON_TYPE = async (recordGuid, reasonType) => {
  try {
    const response = await axiosInstance.put(
      `/subscription/api/v1/ReasonType`,
      { RecordGuid: recordGuid, ReasonTypeDetails: [reasonType] }
    );
    return response.data;
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/subscription/api/v1/ReasonType`, {
        RecordGuid: recordGuid,
        ReasonTypeDetails: [reasonType],
      });
    throw e;
  }
};

export const DELETE_REASON_TYPE = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/subscription/api/v1/ReasonType?RecordGuid=${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/subscription/api/v1/ReasonType?RecordGuid=${recordGuid}`
      );
    throw e;
  }
};
