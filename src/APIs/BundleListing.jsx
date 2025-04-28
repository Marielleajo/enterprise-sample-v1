import axiosInstance from "./config/axios";

export const GET_BUNDLE_CATEGORIES = async ({
  pageNumber = 1,
  pageSize = 500,
  search = "",
}) => {
  let url = `/catalog/api/admin/v1/BundleCategory/get-active`;
  const queryParams = [];
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }
  if (search) {
    queryParams.push(`Search=${search}`);
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

export const GET_BUNDLES_BY_COUNTRY = async ({
  CountryGuids = null,
  CategoryTags = "COUNTRY",
  pageNumber = 1,
  pageSize = 5,
  IsActive = "",
  StartPrice = "",
  EndPrice = "",
  BundleTypeTag = "",
  ClientGuid = "",
  IsStockable = null,
  bundleCode = "",
  bundleName = "",
}) => {
  let url = `/catalog/api/admin/v1/BundleCountry/get-by-country`;
  const queryParams = [];

  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (CategoryTags) {
    queryParams.push(`CategoryTags=${CategoryTags}`);
  }
  if (CountryGuids) {
    queryParams.push(`CountryGuids=${CountryGuids}`);
  }
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }
  if (IsActive !== null) {
    queryParams.push(`IsActive=${IsActive}`);
  }
  if (StartPrice) {
    queryParams.push(`StartPrice=${StartPrice}`);
  }
  if (EndPrice) {
    queryParams.push(`EndPrice=${EndPrice}`);
  }
  if (BundleTypeTag) {
    queryParams.push(`BundleTypeTag=${BundleTypeTag}`);
  }
  if (IsStockable !== null) {
    queryParams.push(`IsStockable=${IsStockable}`);
  }
  if (bundleCode) {
    queryParams.push(`BundleCode=${bundleCode}`);
  }
  if (bundleName) {
    queryParams.push(`search=${bundleName}`);
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

export const GET_BUNDLES_BY_ZONE = async ({
  ZoneGuids,
  pageNumber = 1,
  pageSize = 5,
  IsActive = "",
  StartPrice = "",
  EndPrice = "",
  BundleTypeTag = "",
  ClientGuid = "",
  IsStockable = null,
  bundleCode = "",
  bundleName = "",
}) => {
  let url = `/catalog/api/admin/v1/Bundle/get-by-zone`;
  const queryParams = [];

  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (ZoneGuids) {
    queryParams.push(`ZoneGuids=${ZoneGuids}`);
  }

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (IsActive !== null) {
    queryParams.push(`IsActive=${IsActive}`);
  }
  if (StartPrice) {
    queryParams.push(`StartPrice=${StartPrice}`);
  }
  if (EndPrice) {
    queryParams.push(`EndPrice=${EndPrice}`);
  }
  if (BundleTypeTag) {
    queryParams.push(`BundleTypeTag=${BundleTypeTag}`);
  }

  if (IsStockable !== null) {
    queryParams.push(`IsStockable=${IsStockable}`);
  }
  if (bundleCode) {
    queryParams.push(`BundleCode=${bundleCode}`);
  }
  if (bundleName) {
    queryParams.push(`search=${bundleName}`);
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
export const GET_BUNDLE_TYPES = async ({
  pageNumber = 1,
  pageSize = 125,
  search = "",
}) => {
  let url = `/catalog/api/admin/v1/BundleType/get-all`;
  const queryParams = [];

  if (search) {
    queryParams.push(`searchKeyword=${search}`);
  }

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
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
export const GET_BUNDLES_BY_CATEGORY = async ({
  CategoryTags,
  pageNumber = 1,
  pageSize = 5,
  IsActive = "",
  StartPrice = "",
  EndPrice = "",
  BundleTypeTag = "",
  ClientGuid = "",
  IsStockable = null,
  bundleCode = "",
  bundleName = "",
}) => {
  let url = `/catalog/api/admin/v1/Bundle/get-by-category`;
  const queryParams = [];

  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (CategoryTags) {
    queryParams.push(`CategoryTags=${CategoryTags}`);
  }

  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
  }

  if (IsActive !== null) {
    queryParams.push(`IsActive=${IsActive}`);
  }
  if (StartPrice) {
    queryParams.push(`StartPrice=${StartPrice}`);
  }
  if (EndPrice) {
    queryParams.push(`EndPrice=${EndPrice}`);
  }
  if (BundleTypeTag) {
    queryParams.push(`BundleTypeTag=${BundleTypeTag}`);
  }

  if (IsStockable !== null) {
    queryParams.push(`IsStockable=${IsStockable}`);
  }
  if (bundleCode) {
    queryParams.push(`BundleCode=${bundleCode}`);
  }
  if (bundleName) {
    queryParams.push(`search=${bundleName}`);
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

export const CREATE_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/admin/v1/Bundle/add-basic`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/admin/v1/Bundle/add-basic`,
        data
      );
    else throw e;
  }
};
export const UPDATE_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/update-basic`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/update-basic`,
        data
      );
    else throw e;
  }
};

export const DELETE_BUNDLE = async ({ recordGuid }) => {
  try {
    return await axiosInstance.delete(`/catalog/api/admin/v1/Bundle`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        RecordGuid: recordGuid,
      },
    });
  } catch (e) {
    if (e.response && e.response.status === 401) {
      return await axiosInstance.delete(`/catalog/api/admin/v1/Bundle`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          RecordGuid: recordGuid,
        },
      });
    } else {
      throw e;
    }
  }
};

export const ACTIVATE_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/activate`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/activate`,
        data
      );
    else throw e;
  }
};
export const DEACTIVATE_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/deactivate`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/deactivate`,
        data
      );
    else throw e;
  }
};
export const PUBLISH_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/publish`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/publish`,
        data
      );
    else throw e;
  }
};
export const UNPUBLISH_BUNDLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/unpublish`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/unpublish`,
        data
      );
    else throw e;
  }
};

export const TOGGLE_IS_STOCKABLE = async ({ data }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Bundle/toggle-is-stockable`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Bundle/toggle-is-stockable`,
        data
      );
    else throw e;
  }
};

export const CREATE_ORDER = async ({ data }) => {
  try {
    return await axiosInstance.post(`/core/api/v1/order`, data);
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(`/core/api/v1/order`, data);
    else throw e;
  }
};
export const UPDATE_SELLING_PRICE_BULK = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/admin/v1/PriceList/set-price-bulk`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/admin/v1/PriceList/set-price-bulk`,
        data
      );
    else throw e;
  }
};
export const UPDATE_SELLING_PRICE_UNIT = async ({ data }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/admin/v1/PriceList/set-price`,
      data
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/admin/v1/PriceList/set-price`,
        data
      );
    else throw e;
  }
};

export const GET_ZONES = async ({
  pageSize = 10000,
  pageNumber = 1,
  search = "",
}) => {
  let url = `/configuration/api/v1/Zone/get-all`;
  const queryParams = [];

  if (search) {
    queryParams.push(`searchKeyword=${search}`);
  }
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
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

export const GET_ALL_CRITERIA_API = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/configuration/api/v1/criteria/get-all`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/configuration/api/v1/criteria/get-all`,
        postData
      );
    else throw e;
  }
};

export const GET_ALL_COUNTRIES_API = async ({
  pageSize = 10000,
  pageNumber = 1,
  search = "",
}) => {
  let url = `/configuration/api/v1/Country/get-all`;
  const queryParams = [];

  if (search) {
    queryParams.push(`searchKeyword=${search}`);
  }
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
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

export const GET_ALL_BILLINGCYCLE = async ({
  typeTag = null,
  pageNumber = 1,
  pageSize = 5,
  search = "",
}) => {
  let url = `/subscription/api/v1/BillingCycle/get-all`;
  const queryParams = [];

  if (typeTag) {
    queryParams.push(`TypeTag=${typeTag}`);
  }
  if (search) {
    queryParams.push(`searchKeyword=${search}`);
  }
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }

  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
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
export const GET_CURRENCIES_BY_TENANT = async ({
  pageNumber = 0,
  pageSize = 1000,
  search = "",
}) => {
  const tenant = import.meta.env.VITE_TENANT;
  let url = `/configuration/api/admin/v1/Tenant/get-all-currencies`;
  const queryParams = [];

  if (search) {
    queryParams.push(`searchKeyword=${search}`);
  }
  if (tenant) {
    queryParams.push(`RecordGuid=${tenant}`);
  }
  if (pageNumber) {
    queryParams.push(`PageIndex=${pageNumber}`);
  }
  if (pageSize) {
    queryParams.push(`PageSize=${pageSize}`);
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
export const GET_ALLVALIDITY_PERIODS = async () => {
  let url = `/subscription/api/v1/BillingCycle/get-all?TypeTag=VALIDITY_PERIOD`;
  try {
    return await axiosInstance.get(url);
  } catch (e) {
    if (e == "error: 401") return await axiosInstance.get(url);
    else throw e;
  }
};
export const GET_ALL_BASIC_BUNDLES = async ({ pageIndex, pageSize = 10 }) => {
  let url = `/catalog/api/admin/v1/Bundle/get-all-basic`;
  const queryParams = [];

  if (pageIndex) {
    queryParams.push(`pageIndex=${pageIndex}`);
  }
  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
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
export const GET_ALL_ASSIGNED_BUNDLES = async ({
  pageIndex = 0,
  pageSize = 10,
  ProviderGuid,
  ClientGuid,
  BundleCategoryTag,
}) => {
  let url = `/catalog/api/admin/v1/Bundle/get-priced-bundles`;
  const queryParams = [];

  if (pageIndex != undefined) {
    queryParams.push(`pageIndex=${pageIndex}`);
  }
  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (ProviderGuid) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }
  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (BundleCategoryTag) {
    queryParams.push(`BundleCategoryTag=${BundleCategoryTag}`);
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
export const GET_ALL_UNASSIGNED_BUNDLES = async ({
  pageIndex = 0,
  pageSize = 10,
  ProviderGuid,
  ClientGuid,
  BundleCategoryTag,
}) => {
  let url = `/catalog/api/admin/v1/Bundle/get-unpriced-bundles`;
  const queryParams = [];

  if (pageIndex) {
    queryParams.push(`pageIndex=${pageIndex}`);
  }
  if (pageSize) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (ProviderGuid) {
    queryParams.push(`ProviderGuid=${ProviderGuid}`);
  }
  if (ClientGuid) {
    queryParams.push(`ClientGuid=${ClientGuid}`);
  }
  if (BundleCategoryTag) {
    queryParams.push(`BundleCategoryTag=${BundleCategoryTag}`);
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

export const ADD_BULK_COST = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/admin/v1/Pricelist/assign-bundle-price-bulk`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/admin/v1/Pricelist/assign-bundle-price-bulk`,
        postData
      );
    else throw e;
  }
};
export const REMOVE_BULK_COST = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Pricelist/unassign-bundle-price-bulk`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Pricelist/unassign-bundle-price-bulk`,
        postData
      );
    else throw e;
  }
};
export const EDIT_BUNDLE_COST = async ({ postData }) => {
  try {
    return await axiosInstance.put(
      `/catalog/api/admin/v1/Pricelist/edit-bundle-price`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.put(
        `/catalog/api/admin/v1/Pricelist/edit-bundle-price`,
        postData
      );
    else throw e;
  }
};
export const SET_BUNDLE_COST = async ({ postData }) => {
  try {
    return await axiosInstance.post(
      `/catalog/api/admin/v1/Pricelist/assign-bundle-price`,
      postData
    );
  } catch (e) {
    if (e == "error: 401")
      return await axiosInstance.post(
        `/catalog/api/admin/v1/Pricelist/assign-bundle-price`,
        postData
      );
    else throw e;
  }
};
