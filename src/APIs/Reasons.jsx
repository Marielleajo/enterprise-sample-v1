import axiosInstance from "./config/axios";

export const GET_ALL_REASONS = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  type,
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

  if (type !== null) {
    queryParams.push(`categoryTags=${encodeURIComponent(type)}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/criteria/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_ROUTING_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Criteria/add-routing-reasons`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Criteria/add-routing-reasons`,
        postData
      );
    else throw e;
  }
};

export const EDIT_ROUTING_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Criteria/update-routing-reasons`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Criteria/update-routing-reasons`,
        postData
      );
    else throw e;
  }
};

export const DELETE_ROUTING_REASON = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/configuration/api/admin/v1/Criteria/delete-routing-reasons?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/Criteria/delete-routing-reasons?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};
export const ADD_SENDER_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Criteria`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Criteria`,
        postData
      );
    else throw e;
  }
};

export const EDIT_SENDER_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Criteria`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Criteria`,
        postData
      );
    else throw e;
  }
};

export const DELETE_SENDER_REASON = async ({ RecordGuid }) => {
  try {
    return await axiosInstance.delete(
      `/configuration/api/admin/v1/Criteria?RecordGuid=${RecordGuid}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/Criteria?RecordGuid=${RecordGuid}`
      );
    else throw e;
  }
};

export const ADD_RATING_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/Criteria/add-rating-reasons`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/admin/v1/Criteria/add-rating-reasons`,
        postData
      );
    else throw e;
  }
};

export const EDIT_RATING_REASON = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Criteria/update-rating-reasons`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Criteria/update-rating-reasons`,
        postData
      );
    else throw e;
  }
};

export const DELETE_RATING_REASON = async ({
  RecordGuid,
  CriteriaCategoryTag,
}) => {
  try {
    return await axiosInstance.delete(
      `/configuration/api/admin/v1/Criteria/delete-rating-reasons?RecordGuid=${RecordGuid}&CriteriaCategoryTag=${CriteriaCategoryTag}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/configuration/api/admin/v1/Criteria/delete-rating-reasons?RecordGuid=${RecordGuid}&CriteriaCategoryTag=${CriteriaCategoryTag}`
      );
    else throw e;
  }
};
