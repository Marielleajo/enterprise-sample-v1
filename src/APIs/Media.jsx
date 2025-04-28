import axios from "axios";
import axiosInstance from "./config/axios";

export const GET_MEDIA_LINK = ({ token, path }) => {
  return `${
    import.meta.env.VITE_API_IDENTITY_URL
  }/media/api/v1/File/Get/${token}/${path}`;
};

export const UPLOAD_MEDIA = async ({
  type = "image",
  contentType = "image/jpg",
  width = 50,
  height = 500,
  file,
  token,
}) => {
  let data = new FormData();
  data.append("ContentType", contentType);
  data.append("ThumbnailWidth", width);
  data.append("ThumbnailHeight", height);
  data.append("file", file);
  data.append("RefPath", token);
  return axiosInstance.post(`/media/api/v1/File/upload-${type}`, data);
};

export const GET_FILE_DIRCTORY = () => {
  return axios.get(
    `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/media/api/v1/Config/get-config-media-paths`,
    {
      headers: {
        tenant: import.meta.env.VITE_TENANT,
      },
    }
  );
};
