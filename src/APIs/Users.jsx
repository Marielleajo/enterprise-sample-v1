import axiosInstance from "./config/axios";

export const GET_ALL_USERS = async ({ pageSize = 10, pageNumber = 1 }) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `member/api/admin/v1/user/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_USER = async (user) => {
  try {
    return await axiosInstance.post(`/member/api/admin/v1/user/contact`, {
      ...user,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/member/api/admin/v1/user/contact`, {
        ...user,
      });
    else throw e;
  }
};

export const UPDATE_USER = async (user) => {
  try {
    return await axiosInstance.put(`/member/api/admin/v1/user/contact`, {
      ...user,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/member/api/admin/v1/user/contact`, {
        ...user,
      });
    else throw e;
  }
};

export const DELETE_USER = async (recordGuid) => {
  try {
    return await axiosInstance.delete(
      `/member/api/admin/v1/user?UserGuid=${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/member/api/admin/v1/user?UserGuid=${recordGuid}`
      );
    else throw e;
  }
};

export const GET_USER = async (recordGuid) => {
  try {
    return await axiosInstance.get(
      `/member/api/admin/v1/user?UserGuid=${recordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/member/api/admin/v1/user?UserGuid=${recordGuid}`
      );
    else throw e;
  }
};

export const UPDATE_USER_STATUS = async (UserGuid, IsEnabled) => {
  try {
    return await axiosInstance.put(
      `member/api/admin/v1/user/set-active-status`,
      { UserGuid, IsEnabled }
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `member/api/admin/v1/user/set-active-status`,
        { UserGuid, IsEnabled }
      );
    else throw e;
  }
};
