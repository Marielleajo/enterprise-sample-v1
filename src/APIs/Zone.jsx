import axiosInstance from "./config/axios";

export const GET_ALL_Zone = async ({
  pageSize = 10,
  pageNumber = 1,
  SearchKeyword = "",
}) => {
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (SearchKeyword !== null) {
    queryParams.push(`SearchKeyword=${SearchKeyword}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/Zone/get-system${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ADD_Zone = async (zoneDetails) => {
  try {
    return await axiosInstance.post(`/configuration/api/admin/v1/Zone`, {
      ...zoneDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.post(`/configuration/api/admin/v1/Zone`, {
        ...zoneDetails,
      });
    } else throw e;
  }
};

export const UPDATE_Zone = async (zoneDetails) => {
  try {
    return await axiosInstance.put(`/configuration/api/admin/v1/Zone`, {
      ...zoneDetails,
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.put(`/configuration/api/admin/v1/Zone`, {
        ...zoneDetails,
      });
    } else throw e;
  }
};

export const DELETE_Zone = async (recordGuid) => {
  try {
    return await axiosInstance.delete(`/configuration/api/admin/v1/Zone`, {
      params: { RecordGuid: recordGuid },
    });
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.delete(`/configuration/api/admin/v1/Zone`, {
        params: { RecordGuid: recordGuid },
      });
    } else throw e;
  }
};

export const TOGGLE_Zone_STATUS = async (recordGuid) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/Zone/toggle-status`,
      {
        RecordGuid: recordGuid,
      }
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.put(
        `/configuration/api/admin/v1/Zone/toggle-status`,
        {
          RecordGuid: recordGuid,
        }
      );
    } else throw e;
  }
};

export const EXPORT_Zones = async (SearchKeyword) => {
  try {
    return await axiosInstance.get(
      `/configuration/api/admin/v1/Zone/export-zones-excel${
        SearchKeyword ? `?SearchKeyword=${SearchKeyword}` : ""
      }`,
      {
        responseType: "blob",
      }
    );
  } catch (e) {
    if (e.response?.status === 401) {
      // Retry the export call on 401 error
      return await axiosInstance.get(
        `/configuration/api/admin/v1/Zone/export-zones-excel${
          SearchKeyword ? `?SearchKeyword=${SearchKeyword}` : ""
        }`,
        {
          responseType: "blob",
        }
      );
    } else {
      throw e;
    }
  }
};

export const GET_ALL_ASSIGNED_COUNTRIES = async ({ ZoneGuids }) => {
  let queryParams = [];

  if (ZoneGuids !== null) {
    queryParams.push(`ZoneGuids=${ZoneGuids}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/ZoneCountry/get-by-zone${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const GET_ALL_UNASSIGNED_COUNTRIES = async ({ ZoneGuids }) => {
  let queryParams = [];

  if (ZoneGuids !== null) {
    queryParams.push(`ZoneGuids=${ZoneGuids}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/configuration/api/admin/v1/ZoneCountry/get-unassigned-by-zone${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const ASSIGN_COUNTRIES_TO_ZONE = async ({ ZoneGuids, CountryGuids }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/admin/v1/ZoneCountry/assign`,
      {
        ZoneGuid: ZoneGuids,
        CountryGuids: CountryGuids,
      }
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.post(
        `/configuration/api/admin/v1/ZoneCountry/assign`,
        {
          ZoneGuid: ZoneGuids,
          CountryGuids: CountryGuids,
        }
      );
    } else throw e;
  }
};
export const UNASSIGN_COUNTRIES_TO_ZONE = async ({
  ZoneGuids,
  CountryGuids,
}) => {
  try {
    return await axiosInstance.put(
      `/configuration/api/admin/v1/ZoneCountry/unassign`,
      {
        ZoneGuid: ZoneGuids,
        CountryGuids: CountryGuids,
      }
    );
  } catch (e) {
    if (e == "error: 401") {
      return await axiosInstance.put(
        `/configuration/api/admin/v1/ZoneCountry/unassign`,
        {
          ZoneGuid: ZoneGuids,
          CountryGuids: CountryGuids,
        }
      );
    } else throw e;
  }
};
