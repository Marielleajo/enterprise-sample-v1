// https://common-svc-api-vasdev.montylocal.net/configuration/api/v1/country?pageNumber=-1&pageSize=0
// https://mm-omni-api-software-dev.montylocal.net/member/api/admin/v1/client/get-all-parents?search=&PageIndex=1&PageSize=1000
export const BASE_URL = `${import.meta.env.VITE_API_IDENTITY_URL}`;
export const CONFIGURATION_URL = `${BASE_URL}/configuration/api/v1/`;
export const CONFIGURATION_ADMIN_URL = `${BASE_URL}/configuration/api/admin/v1/`;
export const NOTIFICATION_URL = `${BASE_URL}/notification/api/v1/`;
export const NOTIFICATION_ADMIN_URL = `${BASE_URL}/notification/api/admin/v1/`;
export const CATALOG_URL = `${BASE_URL}/catalog/api/v1/`;
export const MEMBER_URL = `${BASE_URL}/member/api/admin/v1`;
export const NON_ADMIN_MEMBER_URL = `${BASE_URL}/member/api/v1`;
export const BILLING_URL = `${BASE_URL}/billing/api/v1/`;
export const REPORTING_URL = `${BASE_URL}/reporting/api/admin/v1/`;
export const TRANSACTION_URL = `${BASE_URL}/transaction/api/admin/v1/`;
export const PAYMENT_URL = `${BASE_URL}/transaction/api/v1`;

export const SERVICE_URL = `${BASE_URL}/hlrmnp/api/v1/`;

export const NEWCONFIG = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    tenant: `${import.meta.env.VITE_TENANT}`,
    "Content-Type": "application/json",
  },
};

export const NEW_FORMDATA_CONFIG = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    tenant: `${import.meta.env.VITE_TENANT}`,
    "Content-Type": "multipart/form-data",
  },
};

// GET CONFIGURATION
export const CONFIGURATION_LINK = `${CONFIGURATION_URL}/`;

//Clients
export const CLIENT_LINK = `${MEMBER_URL}/client`;

//Reseller
export const RESELLER_LINK = `${MEMBER_URL}/client`;

//SMS API
export const SMS_API_LINK = `${MEMBER_URL}/api`;

//
export const USER_LINK = `${MEMBER_URL}/user`;
export const USER_LINK_NON_ADMIN = `${NON_ADMIN_MEMBER_URL}/user`;

export const POLICY_LINK = `${MEMBER_URL}/policy`;

//Push Notification Template
export const NOTIFICATION_LINK = `${NOTIFICATION_URL}`;

//Push Notification Application
export const NOTIFICATION_APP_LINK = `${NOTIFICATION_ADMIN_URL}`;

//Catalog
export const PACKAGE_BUILDER_LINK = `${CATALOG_URL}`;

//Category
export const CLIENT_CATEGORY_LINK = `${MEMBER_URL}/Category`;

export const PROVIDER_LINK = `${MEMBER_URL}/provider`;

//Contact
export const CONTACT_LINK = `${NOTIFICATION_URL}Contact`;
export const EXPORT_CONTACT = `${NOTIFICATION_URL}Contact/export`;

//Billing
export const GET_DEFAULT_BALANCE = `${BILLING_URL}clientaccount/balance/get-default-balance`;

//Cost
export const GET_COST = `${BILLING_URL}costplan`;

//Rate
export const GET_RATE = `${BILLING_URL}rateplan`;

//Reporting
export const REPORTING_LINK = `${REPORTING_URL}MNPHLR`;

//Reporting
export const TRANSACTION_LINK = `${TRANSACTION_URL}Transaction`;

//Provider Service
export const SERVICE_LINK = `${SERVICE_URL}`;

//Billing Payment
export const PAYMNET_LINK = `${TRANSACTION_URL}Transaction`;

//Add Payment
export const ADD_PAYMNET_LINK = `${PAYMENT_URL}`;
