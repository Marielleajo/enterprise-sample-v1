import axios from "axios";
import CryptoJS from "crypto-js";

export const generateSignature = (body) => {
  const secretKey = import.meta.env.REACT_APP_FIRST_KEY;

  // Convert the body to a JSON string and clean it up
  const cleanedBody = JSON.stringify(body)
    .replace(/[\r\n]+/g, "")
    .replace(/\s+/g, "");

  // Generate the HMAC SHA-256 signature
  return CryptoJS.HmacSHA256(cleanedBody, secretKey).toString(
    CryptoJS.enc.Base64
  );
};

export const getCSRFToken = async ({ tenant }) => {
  try {
    let url = `${
      import.meta.env.VITE_API_IDENTITY_URL
    }/member/api/v1/auth/csrf`;

    const response = await axios.get(url, {
      withCredentials: true,
      headers: {
        ["tenant"]: tenant,
      },
    });

    return response?.data?.data?.csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return "null";
  }
};
