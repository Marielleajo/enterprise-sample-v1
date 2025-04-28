import axiosInstance from "./config/axios";

// Get all CampaignTypes with pagination
export const GET_ALL_CampaignType = async ({
  pageSize = 10,
  pageNumber = 1,
  search = null,
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (search !== null || search !== "") {
    queryParams.push(`Name=${search}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/notification/api/v1/campaigntype/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e === "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

// Add a new CampaignType
export const ADD_CampaignType = async (campaignTypeDetails) => {
  try {
    return await axiosInstance.post(`/notification/api/v1/campaigntype`, {
      CampaignTypeDetails: [campaignTypeDetails],
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.post(`/notification/api/v1/campaigntype`, {
        CampaignTypeDetails: [campaignTypeDetails],
      });
    } else throw e;
  }
};

// Update an existing CampaignType
export const UPDATE_CampaignType = async (campaignTypeDetails, recordGuid) => {
  try {
    return await axiosInstance.put(`/notification/api/v1/campaigntype`, {
      RecordGuid: recordGuid,
      CampaignTypeDetails: [campaignTypeDetails],
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.put(`/notification/api/v1/campaigntype`, {
        RecordGuid: recordGuid,
        CampaignTypeDetails: [campaignTypeDetails],
      });
    } else throw e;
  }
};

// Delete a CampaignType by RecordGuid
export const DELETE_CampaignType = async (recordGuid) => {
  try {
    return await axiosInstance.delete(`/notification/api/v1/campaigntype`, {
      params: { RecordGuid: recordGuid },
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.delete(`/notification/api/v1/campaigntype`, {
        params: { RecordGuid: recordGuid },
      });
    } else throw e;
  }
};

export const GET_ALL_CampaignCategory = async ({
  pageSize = 10,
  pageNumber = 1,
  search = "",
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (search !== null) {
    queryParams.push(`Name=${search}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/notification/api/v1/campaigncategory/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e === "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

// Add a new CampaignCategory
export const ADD_CampaignCategory = async (categoryDetails) => {
  try {
    return await axiosInstance.post(`/notification/api/v1/campaigncategory`, {
      CampaignCategoryDetails: [categoryDetails],
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.post(`/notification/api/v1/campaigncategory`, {
        CampaignCategoryDetails: [categoryDetails],
      });
    } else throw e;
  }
};

// Update an existing CampaignCategory
export const UPDATE_CampaignCategory = async (categoryDetails, recordGuid) => {
  try {
    return await axiosInstance.put(`/notification/api/v1/campaigncategory`, {
      RecordGuid: recordGuid,
      CampaignCategoryDetails: [categoryDetails],
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.put(`/notification/api/v1/campaigncategory`, {
        RecordGuid: recordGuid,
        CampaignCategoryDetails: [categoryDetails],
      });
    } else throw e;
  }
};

// Delete a CampaignCategory by RecordGuid
export const DELETE_CampaignCategory = async (recordGuid) => {
  try {
    return await axiosInstance.delete(`/notification/api/v1/campaigncategory`, {
      params: { RecordGuid: recordGuid },
    });
  } catch (e) {
    if (e === "error: 401") {
      return await axiosInstance.delete(
        `/notification/api/v1/campaigncategory`,
        {
          params: { RecordGuid: recordGuid },
        }
      );
    } else throw e;
  }
};
