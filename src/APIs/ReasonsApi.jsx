import axiosInstance from "./config/axios";

export const GET_ALL_REASON = async ({
  pageSize = 10,
  pageNumber = 1,
  Description = null,
  ReasonTypeTag = null,
}) => {
  let queryParams = [];

  if (pageNumber !== null) {
    queryParams.push(`pageNumber=${pageNumber}`);
  }

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (Description !== null) {
    queryParams.push(`Description=${Description}`);
  }

  if (ReasonTypeTag !== null) {
    queryParams.push(`ReasonTypeTag=${ReasonTypeTag}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/subscription/api/v1/Reason/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e === "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_REASON = async (formData) => {
  try {
    return await axiosInstance.post(`/subscription/api/v1/Reason`, formData);
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.post(`/subscription/api/v1/Reason`, formData);
    } else throw e;
  }
};

export const UPDATE_REASON = async (formData) => {
  try {
    return await axiosInstance.put(`/subscription/api/v1/Reason`, formData);
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.put(`/subscription/api/v1/Reason`, formData);
    } else throw e;
  }
};

export const DELETE_REASON = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/subscription/api/v1/Reason?RecordGuid=${recordGuid}`
    );
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.delete(
        `/subscription/api/v1/Reason?RecordGuid=${recordGuid}`
      );
    } else throw e;
  }
};
