import axiosInstance from "./config/axios";

export const GET_ALL_INDUSTRIES = async ({ pageSize = 10, pageNumber = 1 }) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/v1/Industry/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_INDUSTRY = async (industryDetails) => {
  try {
    return await axiosInstance.post(`/configuration/api/admin/v1/Industry`, {
      ...industryDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.post(`/configuration/api/admin/v1/Industry`, {
        ...industryDetails,
      });
    } else throw e;
  }
};

export const UPDATE_INDUSTRY = async (industryGuid, industryDetails) => {
  try {
    return await axiosInstance.put(`/configuration/api/admin/v1/Industry`, {
      industryGuid: industryGuid,
      ...industryDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.put(`/configuration/api/admin/v1/Industry`, {
        industryGuid: industryGuid,
        ...industryDetails,
      });
    } else throw e;
  }
};

export const DELETE_INDUSTRY = async (recordGuid) => {
  try {
    return await axiosInstance.delete(`/configuration/api/admin/v1/Industry`, {
      data: { recordGuid: recordGuid },
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/Industry`,
        {
          data: { recordGuid: recordGuid },
        }
      );
    } else throw e;
  }
};
