import axiosInstance from "./config/axios";

export const GET_ALL_CATEGORY = async () => {
  return await axiosInstance.get(`/catalog/api/v1/ContentCategory/get-all`);
};
export const GET_ALL_CONTENT_TYPE = async () => {
  return await axiosInstance.get(`/catalog/api/v1/ContentType/get-all`);
};

export const POST_CATEGORY = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/v1/ContentCategory`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/v1/ContentCategory`,
        postData
      );
    else throw e;
  }
};

export const GET_ALL_CONTENT = async (tag) => {
  return await axiosInstance.get(`/catalog/api/v1/Content/${tag}`);
};

export const GET_LATEST_CONTENT = async ({ postData }) => {
  return await axiosInstance.post(
    `/catalog/api/v1/Content/get-latest`,
    postData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const UPDATE_CONTENT = async ({ postData }) => {
  try {
    return await axiosInstance.put(`/catalog/api/v1/Content`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(`/catalog/api/v1/Content`, postData);
    else throw e;
  }
};
export const POST_CONTENT = async ({ postData }) => {
  try {
    return await axiosInstance.post(`/catalog/api/v1/Content`, postData);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/catalog/api/v1/Content`, postData);
    else throw e;
  }
};
