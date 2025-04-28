import axiosInstance from "./config/axios";

export const GET_ERROR_LOGS = async ({
    pageSize = 5,
    pageNumber = 1,
    DateFrom,
    DateTo,ErrorCode,ErrorMessage,Context,ClientGuid
  }) => {
  
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];
  
    if (pageSize !== null) {
      queryParams.push(`PageSize=${pageSize}`);
    }
  
    if (pageNumber !== null) {
      queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (DateFrom !== null) {
      queryParams.push(`DateFrom=${DateFrom}`);
    }
    if (DateTo !== null) {
      queryParams.push(`DateTo=${DateTo}`);
    }
    if (ErrorCode !== null) {
      queryParams.push(`ErrorCode=${ErrorCode}`);
    }
    if (ErrorMessage !== null) {
      queryParams.push(`ErrorMessage=${ErrorMessage}`);
    }
    if (Context !== null) {
      queryParams.push(`Context=${Context}`);
    }
    if (ClientGuid !== null) {
      queryParams.push(`ClientGuid=${ClientGuid}`);
    }
  
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
    let url = `/core/api/v1/log/error${queryString}`;
    try {
      return await axiosInstance.get(url);
    } catch (e) {
      if (e == "error: 401") return await axiosInstance.get(url);
      else throw e;
    }
  };

  export const GET_ALL_USERS = async () => {
    return await axiosInstance.get(
      `/member/api/admin/v1/client/get-all?SearchKeyword=&PageSize=10000`
    );
  };


  export const GET_INFO_LOGS = async ({
    pageSize = 5,
    pageNumber = 1,
    DateFrom,
    DateTo,ProcedureName,Message
  }) => {
  
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];
  
    if (pageSize !== null) {
      queryParams.push(`PageSize=${pageSize}`);
    }
  
    if (pageNumber !== null) {
      queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (DateFrom !== null) {
      queryParams.push(`DateFrom=${DateFrom}`);
    }
    if (DateTo !== null) {
      queryParams.push(`DateTo=${DateTo}`);
    }
    if (ProcedureName !== null) {
      queryParams.push(`ProcedureName=${ProcedureName}`);
    }
    if (Message !== null) {
      queryParams.push(`Message=${Message}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
    let url = `/core/api/v1/log/info${queryString}`;
    try {
      return await axiosInstance.get(url);
    } catch (e) {
      if (e == "error: 401") return await axiosInstance.get(url);
      else throw e;
    }
  };


  export const GET_PROVIDER_LOGS = async ({
    pageSize = 5,
    pageNumber = 1,
    DateFrom,
    DateTo,Source,Message
  }) => {
  
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];
  
    if (pageSize !== null) {
      queryParams.push(`PageSize=${pageSize}`);
    }
  
    if (pageNumber !== null) {
      queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (DateFrom !== null) {
      queryParams.push(`DateFrom=${DateFrom}`);
    }
    if (DateTo !== null) {
      queryParams.push(`DateTo=${DateTo}`);
    }
    if (Source !== null) {
      queryParams.push(`Source=${Source}`);
    }
    if (Message !== null) {
      queryParams.push(`Message=${Message}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
    let url = `/core/api/v1/log/provider${queryString}`;
    try {
      return await axiosInstance.get(url);
    } catch (e) {
      if (e == "error: 401") return await axiosInstance.get(url);
      else throw e;
    }
  };


  export const GET_ALL_TENANT = async () => {
    return await axiosInstance.get(
      `/configuration/api/v1/Tenant/get-all`
    );
  };


  export const GET_SERVICE_LOGS = async ({
    pageSize = 5,
    pageNumber = 1,
    DateStartFrom,
    DateStartTo,StatusCode,InstanceId,TenantRecordGuid,DateFinishTo,DateFinishFrom
  }) => {
  
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];
  
    if (pageSize !== null) {
      queryParams.push(`PageSize=${pageSize}`);
    }
  
    if (pageNumber !== null) {
      queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (DateStartFrom !== null) {
      queryParams.push(`DateStartFrom=${DateStartFrom}`);
    }
    if (DateStartTo !== null) {
      queryParams.push(`DateStartTo=${DateStartTo}`);
    }
    if (StatusCode !== null) {
      queryParams.push(`StatusCode=${StatusCode}`);
    }
    if (InstanceId !== null) {
      queryParams.push(`InstanceId=${InstanceId}`);
    }
    if (TenantRecordGuid !== null) {
      queryParams.push(`TenantRecordGuid=${TenantRecordGuid}`);
    }
    if (DateFinishTo !== null) {
      queryParams.push(`DateFinishTo=${DateFinishTo}`);
    }
    if (DateFinishFrom !== null) {
      queryParams.push(`DateFinishFrom=${DateFinishFrom}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
    let url = `/core/api/v1/log/service${queryString}`;
    try {
      return await axiosInstance.get(url);
    } catch (e) {
      if (e == "error: 401") return await axiosInstance.get(url);
      else throw e;
    }
  };


  export const GET_ALL_OPERATION_STATUS = async () => {
    return await axiosInstance.get(
      `/core/api/v1/Log/operation-status`
    );
  };
  export const GET_ALL_OPERATION_EVENT = async () => {
    return await axiosInstance.get(
      `/core/api/v1/Log/operation-event`
    );
  };


  export const GET_EVENT_LOGS = async ({
    pageSize = 5,
    pageNumber = 1,
    CreatedDateFrom,
    CreatedDateTo,IpAddressSearch,InstanceId,Error,Username,operationStatus,EventStatus
  }) => {
  
    // Create a URL with or without the searchCriteria parameter
    let queryParams = [];
  
    if (pageSize !== null) {
      queryParams.push(`PageSize=${pageSize}`);
    }
  
    if (pageNumber !== null) {
      queryParams.push(`PageIndex=${pageNumber}`);
    }
    if (CreatedDateFrom !== null) {
      queryParams.push(`CreatedDateFrom=${CreatedDateFrom}`);
    }
    if (CreatedDateTo !== null) {
      queryParams.push(`CreatedDateTo=${CreatedDateTo}`);
    }
    if (IpAddressSearch !== null) {
      queryParams.push(`IpAddressSearch=${IpAddressSearch}`);
    }
    if (InstanceId !== null) {
      queryParams.push(`InstanceId=${InstanceId}`);
    }
    if (Error !== null) {
      queryParams.push(`Error=${Error}`);
    }
    if (Username !== null) {
      queryParams.push(`Username=${Username}`);
    }
    if (EventStatus !== null) {
      queryParams.push(`EventStatus=${EventStatus}`);
    }
    if (operationStatus !== null) {
      queryParams.push(`operationStatus=${operationStatus}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
    let url = `/core/api/v1/log/event${queryString}`;
    try {
      return await axiosInstance.get(url);
    } catch (e) {
      if (e == "error: 401") return await axiosInstance.get(url);
      else throw e;
    }
  };


