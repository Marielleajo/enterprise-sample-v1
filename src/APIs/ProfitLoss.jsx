import axiosInstance from "./config/axios";

export const GET_ALL_RATE_COST = async ({
  search = null,
  pageSize = 5,
  pageNumber = 1,
  ChannelGuid,
  ServiceGuid,
  ProviderCategoryGuid,
  ProviderGuid,
  CountryGuid,
  ClientCategoryGuid,
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

  if (ChannelGuid !== null) {
    queryParams.push(`ChannelGuid=${ChannelGuid}`);
  }

  if (ServiceGuid !== null) {
    queryParams.push(`ServiceGuid=${ServiceGuid}`);
  }

  if (ProviderCategoryGuid !== null) {
    queryParams.push(`ProviderCategoryGuid=${ProviderCategoryGuid}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }
  if (CountryGuid) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/ratecostplan/get_rate_cost_plans${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const EXPORT_ALL_RATE_COST = async ({
  search = null,
  ChannelGuid,
  ServiceGuid,
  ProviderCategoryGuid,
  ProviderGuid,
  CountryGuid,
  ClientCategoryGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (search !== null) {
    queryParams.push(`keyword=${encodeURIComponent(search)}`);
  }

  if (ChannelGuid !== null) {
    queryParams.push(`ChannelGuid=${ChannelGuid}`);
  }

  if (ServiceGuid !== null) {
    queryParams.push(`ServiceGuid=${ServiceGuid}`);
  }

  if (ProviderCategoryGuid !== null) {
    queryParams.push(`ProviderCategoryGuid=${ProviderCategoryGuid}`);
  }

  if (ProviderGuid !== null) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }
  if (CountryGuid !== null) {
    queryParams.push(`CountryGuid=${CountryGuid}`);
  }
  if (ClientCategoryGuid !== null) {
    queryParams.push(`ClientCategoryGuid=${ClientCategoryGuid}`);
  }
  queryParams.push(`exportToCsv=true`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/ratecostplan/export_rate_cost_plans${queryString}`;

  try {
    return await axiosInstance.get(url, {
      responseType: "blob",
    });
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.get(url, {
        responseType: "blob",
      });
    else throw e;
  }
};

export const GET_ALL_PROFIT_LOSS = async ({
  // search = null,
  pageSize = 5,
  pageNumber = 1,
  ServiceGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  // if (search !== null) {
  //   queryParams.push(`keyword=${encodeURIComponent(search)}`);
  // }

  if (ServiceGuid !== null) {
    queryParams.push(`ServiceGuid=${ServiceGuid}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/operationtypeprofitmargin/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const GET_ALL_PROFIT_LOSS_CLIENT = async ({
  // search = null,
  pageSize = 5,
  pageNumber = 1,
  ServiceGuid,
  ChannelGuid,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let queryParams = [];

  if (pageSize !== null) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (pageNumber !== null) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  // if (search !== null) {
  //   queryParams.push(`keyword=${encodeURIComponent(search)}`);
  // }

  if (ServiceGuid !== null) {
    queryParams.push(`ServiceGuid=${ServiceGuid}`);
  }
  if (ChannelGuid !== null) {
    queryParams.push(`ChannelGuid=${ChannelGuid}`);
  }
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  let url = `/billing/api/v1/clientcategoryprofitmargin/get-all${queryString}`;

  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};

export const POST_PROFIT_LOSS = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/operationtypeprofitmargin/add`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/operationtypeprofitmargin/add`,
        postData
      );
    else throw e;
  }
};
export const UPDATE_PROFIT_LOSS = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/operationtypeprofitmargin/update`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/operationtypeprofitmargin/update`,
        postData
      );
    else throw e;
  }
};

export const DELETE_PROFIT_LOSS = async ({ formData }) => {
  try {
    return await axiosInstance.delete(
      `/billing/api/v1/operationtypeprofitmargin/delete?OperationTypeProfitMarginGuid=${formData}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/billing/api/v1/operationtypeprofitmargin/delete?OperationTypeProfitMarginGuid=${formData}`
      );
    else throw e;
  }
};
export const DELETE_PROFIT_LOSS_CLIENT = async ({ formData }) => {
  try {
    return await axiosInstance.delete(
      `/billing/api/v1/clientcategoryprofitmargin/delete?ClientCategoryProfitMarginGUID=${formData}`
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.delete(
        `/billing/api/v1/clientcategoryprofitmargin/delete?ClientCategoryProfitMarginGUID=${formData}`
      );
    else throw e;
  }
};

export const POST_PROFIT_LOSS_CLIENT = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/billing/api/v1/clientcategoryprofitmargin/add`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/billing/api/v1/clientcategoryprofitmargin/add`,
        postData
      );
    else throw e;
  }
};
export const UPDATE_PROFIT_LOSS_CLIENT = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/billing/api/v1/clientcategoryprofitmargin/update`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/billing/api/v1/clientcategoryprofitmargin/update`,
        postData
      );
    else throw e;
  }
};

// export const GET_ALL_OPERATION = async (postData) => {
//   try {
//     return await axiosInstance.get(
//       `/configuration/api/admin/v1/Criteria/category/get-all?categoryTags=WHATSAPP_CATEGORY`,
//       postData
//     );
//   } catch (e) {
//     if (e.response?.status === 401)
//       return await axiosInstance.get(
//         `/configuration/api/admin/v1/Criteria/category/get-all?categoryTags=WHATSAPP_CATEGORY`,
//         postData
//       );
//     else throw e;
//   }
// };
export const GET_ALL_OPERATION = async () => {
  try {
    return await axiosInstance.post(`/configuration/api/v1/criteria/get-all`, {
      categoryTags: ["WHATSAPP_CATEGORY"],
    });
  } catch (e) {
    if (e.response?.status === 401)
      return await axiosInstance.post(
        `/configuration/api/v1/criteria/get-all`,
        {
          categoryTags: ["WHATSAPP_CATEGORY"],
        }
      );
    else throw e;
  }
};

export const GET_ALL_CLIENTS_CATEGORY = async () => {
  return await axiosInstance.get(`/member/api/admin/v1/Category/get-all`);
};
