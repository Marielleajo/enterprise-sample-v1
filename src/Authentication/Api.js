import axios from "axios";
import axiosInstance from "../config/axiosInstance";

export const SIGN_OUT = async () => {
  return await axiosInstance.post("/member/api/v1/auth/logout");
};

export const VERIFY_EMAIL = async ({ formData }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/user/verify-email`, {
      ...formData,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/member/api/v1/user/verify-email`, {
        ...formData,
      });
    else throw e;
  }
};

export const RESET_PASSWORD = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `/member/api/v1/user/custom-reset-password`,
      { ...formData }
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/v1/user/custom-reset-password`,
        { ...formData }
      );
    else throw e;
  }
};

export const REQUEST_OTP = async ({ username }) => {
  try {
    return await axiosInstance.post(`/member/api/v1/user/request-resend-otp`, {
      username,
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/member/api/v1/user/request-resend-otp`,
        { username }
      );
    else throw e;
  }
};

export const SIGN_IN = async ({ username, password }) => {
  return axios.post(
    `${import.meta.env.VITE_API_IDENTITY_URL}/member/api/v1/auth/login`,
    { username, password },
    {
      headers: {
        tenant: `${import.meta.env.VITE_TENANT}`,
      },
    }
  );
};
