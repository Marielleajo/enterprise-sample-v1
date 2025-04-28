import CryptoJS from "crypto-js";

export const generateSignature = (body) => {
  const secretKey = import.meta.env.VITE_FIRST_KEY;

  // Convert the body to a JSON string and clean it up
  const cleanedBody = JSON.stringify(body)
    .replace(/[\r\n]+/g, "")
    .replace(/\s+/g, "");

  // Generate the HMAC SHA-256 signature
  return CryptoJS.HmacSHA256(cleanedBody, secretKey).toString(
    CryptoJS.enc.Base64
  );
};
