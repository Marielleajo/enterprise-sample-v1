import { convertToTimestamp } from "../SM/Utils/Functions";
import axiosInstance from "./config/axios";

export const GET_RECEIPTS = async ({
  pageNumber,
  pageSize,
  ClientRecordGuid,
  dateTo,
  dateFrom,
  transactionId,
}) => {
  let url = `/transaction/api/admin/v1/order/get-receipts`;
  const queryParams = [];

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (ClientRecordGuid) {
    queryParams.push(`ClientRecordGuid=${ClientRecordGuid}`);
  }

  if (transactionId) {
    queryParams.push(`TransactionGuid=${transactionId}`);
  }

  if (dateFrom) {
    queryParams.push(`DateFrom=${convertToTimestamp(dateFrom)}`);
  }

  if (dateTo) {
    queryParams.push(`DateTo=${convertToTimestamp(dateTo)}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
