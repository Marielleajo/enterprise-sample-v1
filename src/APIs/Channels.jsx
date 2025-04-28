import axiosInstance from "./config/axios";

// Get All Channels
export const GET_ALL_CHANNELS = async ({ pageSize = 10, pageNumber = 1 }) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/notification/api/admin/v1/Channel/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

// Add a New Channel
export const ADD_CHANNEL = async (channelDetails) => {
  try {
    return await axiosInstance.post(`/notification/api/admin/v1/Channel`, {
      ...channelDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.post(`/notification/api/admin/v1/Channel`, {
        ...channelDetails,
      });
    } else throw e;
  }
};

// Update a Channel
export const UPDATE_CHANNEL = async (channelGuid, channelDetails) => {
  try {
    return await axiosInstance.put(`/notification/api/admin/v1/Channel`, {
      channelGuid: channelGuid,
      ...channelDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.put(`/notification/api/admin/v1/Channel`, {
        channelGuid: channelGuid,
        ...channelDetails,
      });
    } else throw e;
  }
};

// Delete a Channel
export const DELETE_CHANNEL = async (channelGuid) => {
  try {
    return await axiosInstance.delete(
      `/notification/api/admin/v1/Channel?channelGuid=${channelGuid}`
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(
        `/notification/api/admin/v1/Channel?channelGuid=${channelGuid}`
      );
    } else throw e;
  }
};
