import axiosInstance from "./config/axios";

let billing_url = "billing/api/v1/";

export const TRANSFER_TO_CLIENT = async ({ formData }) => {
  try {
    return await axiosInstance.post(
      `${billing_url}clientaccount/balance/transfer`,
      formData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `${billing_url}clientaccount/balance/transfer`,
        formData
      );
    else throw e;
  }
};

export const GET_DEFAULT_BALANCE = async ({ clientID }) => {
  try {
    return await axiosInstance.get(
      `${billing_url}clientaccount/balance/get-default-balance?ClientGuid=${clientID}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `${billing_url}clientaccount/balance/get-default-balance?ClientGuid=${clientID}`
      );
    else throw e;
  }
};

export const GET_RATE_PLANS = async ({
  clientID,
  channelId,
  page,
  size,
  countryGuid,
  serviceGuid,
}) => {
  let countryCode = "";

  if (countryGuid) countryCode = "&CountryGuid=" + countryGuid;

  try {
    return await axiosInstance.get(
      `${billing_url}rateplan/get-parent-rate?ClientGuid=${clientID}&ChannelGuid=${channelId}&ServiceGuid=${serviceGuid}&pageIndex=${page}&pageSize=${size}${countryCode}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `${billing_url}rateplan/get-parent-rate?ClientGuid=${clientID}&ChannelGuid=${channelId}&ServiceGuid=${serviceGuid}&pageIndex=${page}&pageSize=${size}${countryCode}`
      );
    else throw e;
  }
};

export const TOP_UP_FUNDS = async (body) => {
  try {
    return await axiosInstance.post(`transaction/api/v1/pay/topup`, body);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`transaction/api/v1/pay/topup`, body);
    else throw e;
  }
};

export const TOP_UP_CONFIG = async () => {
  try {
    return await axiosInstance.get(
      `/configuration/api/v1/GlobalConfiguration?Key=TopUp_Config`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/configuration/api/v1/GlobalConfiguration?Key=TopUp_Config`
      );
    else throw e;
  }
};

export const GET_PAYMENT_REPORT = async ({
  startDate,
  endDate,
  currencyCode,
  clients,
  pageIndex,
  pageSize,
  ReferenceNumber,
}) => {
  let params = "";

  if (currencyCode) params = params + `&CurrencyCode=${currencyCode}`;
  if (startDate) params = params + `&StartDate=${startDate}`;
  if (endDate) params = params + `&EndDate=${endDate}`;
  if (ReferenceNumber) params = params + `&ReferenceNumber=${ReferenceNumber}`;

  try {
    return await axiosInstance.get(
      `/transaction/api/v1/Transaction/get-transaction-payment-report?Clients=${clients}&PageIndex=${pageIndex}&PageSize=${pageSize}${params}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `/transaction/api/v1/Transaction/get-transaction-payment-report?Clients=${clients}&PageIndex=${pageIndex}&PageSize=${pageSize}${params}`
      );
    else throw e;
  }
};

// export const EXPORT_PAYMENT_REPORT = async ({
//   startDate,
//   endDate,
//   currencyCode,
//   clients,
//   pageIndex,
//   pageSize,
// }) => {
//   let params = "";

//   if (currencyCode) params = params + `&CurrencyCode=${currencyCode}`;
//   if (startDate) params = params + `&StartDate=${startDate}`;
//   if (endDate) params = params + `&EndDate=${endDate}`;

//   try {
//     return await axiosInstance.get(
//       `/transaction/api/v1/Transaction/export-transaction-payment-report-csv?Clients=${clients}${params}`
//     );
//   } catch (e) {
//     if (e == "error: 401")
//       return await axiosInstance.get(
//         `/transaction/api/v1/Transaction/export-transaction-payment-report-csv?Clients=${clients}${params}`
//       );
//     else throw e;
//   }
// };

export const EXPORT_PAYMENT_REPORT = async ({
  startDate,
  endDate,
  currencyCode,
  clients,
  pageIndex,
  pageSize,
  status,
}) => {
  // Create an object to hold the request payload
  const requestData = {
    Clients: clients,
    CurrencyCode: currencyCode ?? null,
    StartDate: startDate ?? null,
    EndDate: endDate ?? null,
    StatusTag: [
      "SUCCESS",
      "FAILED",
      "REJECTED",
      "TIMEOUT",
      "REFUNDED",
      "CANCELED",
    ],
  };
  if (status) {
    requestData.StatusTag = [status];
  }

  try {
    return await axiosInstance.post(
      `/transaction/api/v1/Transaction/export-transaction-payment-report-csv`,
      requestData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/transaction/api/v1/Transaction/export-transaction-payment-report-csv`,
        requestData
      );
    else throw e;
  }
};

export const GET_BALANCE_HISTORY = async ({
  clientGuid,
  pageIndex,
  pageSize,
  exportData,
  startDate,
  endDate,
  currencyCode,
  paymentType,
  ClientAccountGuid,
  WithTotalValues,
  MinAmount,
  MaxAmount,
  ReferenceNumber,
}) => {
  let queryParams = [];

  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (pageIndex) {
    queryParams.push(`pageIndex=${pageIndex}`);
  }
  if (clientGuid) {
    queryParams.push(`ClientGuid=${clientGuid}`);
  }

  queryParams.push(`ClientAccountGuid=${ClientAccountGuid}`);

  if (exportData) {
    queryParams.push(`export=${exportData}`);
  }

  if (currencyCode) {
    queryParams.push(`currency=${currencyCode}`);
  }
  if (startDate) {
    queryParams.push(`startdate=${startDate}`);
  }
  if (endDate) {
    queryParams.push(`enddate=${endDate}`);
  }
  if (paymentType) {
    queryParams.push(`PaymentType=${paymentType}`);
  }
  if (MinAmount) {
    queryParams.push(`MinAmount=${MinAmount}`);
  }
  if (MaxAmount) {
    queryParams.push(`MaxAmount=${MaxAmount}`);
  }
  if (ReferenceNumber) {
    queryParams.push(`ReferenceNumber=${ReferenceNumber}`);
  }
  if (WithTotalValues) {
    queryParams.push(`WithTotalValues=true`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  try {
    return await axiosInstance.get(
      `${billing_url}/clientaccount/balance/get-balance-history${queryString}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `${billing_url}/clientaccount/balance/get-balance-history${queryString}`
      );
    else throw e;
  }
};

export const GET_CLIENT_ACCOUNTS = async ({
  clientID,
  pageIndex,
  pageSize,
}) => {
  try {
    return await axiosInstance.get(
      `${billing_url}clientaccount/get-all-by-client?ClientGuid=${clientID}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(
        `${billing_url}clientaccount/get-all-by-client?ClientGuid=${clientID}&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
    else throw e;
  }
};
