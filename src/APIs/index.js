export const API_URL_IDENTITY = window.location.origin.includes(
  "http://localhost:6997"
)
  ? "https://omni-api-qa.montylocal.net/identity/api/v1"
  : "https://omni-api-dev.montylocal.net/identity/api/v1";

// export const API_URL_IDENTITY = "https://omni-api-dev.montylocal.net/identity/api/v1"

export const token = "bearer ";

export const API_URL_CMS = "";
export const OmniPORTAL_PATH_NAME = "Omni";

export const IDENTITY_DEFAULT_URL = `${
  import.meta.env.VITE_API_IDENTITY_URL
}/member/api/admin/v1`;
export const NOTIFICATION_DEFAULT_URL = `${
  import.meta.env.VITE_API_IDENTITY_URL
}/notification/api/v1`;
export const NOTIFICATION_ADMIN_URL = `${
  import.meta.env.VITE_API_IDENTITY_URL
}/notification/api/admin/v1`;
export const CATALOG_ADMIN_URL = `${
  import.meta.env.VITE_API_IDENTITY_URL
}/catalog/api/v1`;

export const CONFIG = {
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
    tenant: `${import.meta.env.VITE_TENANT}`,
  },
};
export const CONFIGNOTOKEN = {
  headers: {
    "Content-Type": "application/json",
    tenant: `${import.meta.env.VITE_TENANT}`,
  },
};

export const GET_TIMEZONES = `/zones`;
export const GET_TIME_IN_TIMEZONE = `/Zones/ZoneDateTimeUTC`;

export const LOGINCONFIG = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Content-Type": "application/json",
  },
};

//New Member Service
export const API_ALL_USER = IDENTITY_DEFAULT_URL + "/user/get-all";

export const GET_SCOPES = `${IDENTITY_DEFAULT_URL}/scope`;
export const GET_POLICY = `${IDENTITY_DEFAULT_URL}/policy/get-all`;
export const GET_POLICIES_ON_EDIT =
  IDENTITY_DEFAULT_URL + "/policy/get-all-user";
export const GET_POLICY_SCOPE_MAP = `${IDENTITY_DEFAULT_URL}/permission/get-policy-scopes-map`;
export const DELETE_MEMBER_ROLE = (id) =>
  `${IDENTITY_DEFAULT_URL}/policy?Id=${id}`;
export const DELETE_MEMBER_ROLE_USER = (id) =>
  `${IDENTITY_DEFAULT_URL}/policy?Id=${id}`;
export const ADD_MEMBER_ROLE = `${IDENTITY_DEFAULT_URL}/policy`;
export const ADD_PAGE_TO_ROLENAME = `${IDENTITY_DEFAULT_URL}/resource/scopes`;
export const UPDATE_PAGE_TO_ROLENAME = `${IDENTITY_DEFAULT_URL}/resource`;
export const DELETE_RESOURCE = (id) =>
  `${IDENTITY_DEFAULT_URL}/resource?Id=${id}`;
export const ASSIGN_SCOPES_RESOURCES = `${IDENTITY_DEFAULT_URL}/permission/assign-permission`;
export const UPDATE_SCOPE = `${IDENTITY_DEFAULT_URL}/scope`;
export const ADD_PAGE_TO_ROLENAME_USER = `${IDENTITY_DEFAULT_URL}/resource/scopes`;

export const EDIT_STATUS_USER = `${IDENTITY_DEFAULT_URL}/user/set-active-status`;
export const API_ADD_USER = `${IDENTITY_DEFAULT_URL}/user/contact`;
export const API_UPDATE_USER = `${IDENTITY_DEFAULT_URL}/user/contact`;
export const CHANGE_STATUS = IDENTITY_DEFAULT_URL + "/user/set-active-status";
export const GET_ALL_USERS = IDENTITY_DEFAULT_URL + "/user/get-all";
export const GET_SINGLE_USER = IDENTITY_DEFAULT_URL + "/user";
//Get Policies
export const GET_POLICIES = IDENTITY_DEFAULT_URL + "/policy/get-all";
// TERMS AND CONDITIONS
export const GET_ALL_TERMS = CATALOG_ADMIN_URL + "/Content/term_condition";
export const EDIT_TERMS = CATALOG_ADMIN_URL + "/Content";
export const ADD_TERMS = CATALOG_ADMIN_URL + "/Content";
