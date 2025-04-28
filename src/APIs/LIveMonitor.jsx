import axiosInstance from "./config/axios";

//Reporting
const BASE_URL = `${import.meta.env.VITE_API_IDENTITY_URL}`;
const REPORTING_URL = `${BASE_URL}/reporting/api/admin/v1/`;
const REPORTING_LINK = `${REPORTING_URL}MNPHLR`;
const REPORTING_LINK_SERVICES = `${REPORTING_URL}`;

export const EXPORT_LEVEL_ONE_SMS = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-one/${
    byprovider ? "provider" : "client"
  }/export?StartDate=${encodeURIComponent(StartDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  // if (StartDate) {
  //   url += `&StartDate=${encodeURIComponent(StartDate)}`;
  // }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const EXPORT_LEVEL_ONE_MNPHLR = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-one/${
    byprovider ? "provider" : "client"
  }/export?StartDate=${encodeURIComponent(StartDate)}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  // if (StartDate) {
  //   url += `&StartDate=${encodeURIComponent(StartDate)}`;
  // }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const EXPORT_LEVEL_ONE_WHATSAPP = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}whatsapp/level-one/${
    byprovider ? "provider" : "client"
  }/export?StartDate=${encodeURIComponent(StartDate)}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  // if (StartDate) {
  //   url += `&StartDate=${encodeURIComponent(StartDate)}`;
  // }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const GET_LEVEL_ONE_SMS = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-one/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_ONE_MNPHLR = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-one/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_ONE_WHATSAPP = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}whatsapp/level-one/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_ONE_WIDGETS_SMS = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-one/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_ONE_WIDGETS_MNPHLR = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-one/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_ONE_WIDGETS_WHATSAPP = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  serviceTag,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}whatsapp/level-one/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  return await axiosInstance.get(url);
};

export const EXPORT_LEVEL_TWO = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-two/${
    byprovider ? "provider" : "client"
  }/export?byprovider=${encodeURIComponent(byprovider)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const EXPORT_LEVEL_TWO_MNPHLR = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-two/${
    byprovider ? "provider" : "client"
  }/export?StartDate=${encodeURIComponent(StartDate)}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  // if (StartDate) {
  //   url += `&StartDate=${encodeURIComponent(StartDate)}`;
  // }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const EXPORT_LEVEL_TWO_WHATSAPP = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-two/${
    byprovider ? "provider" : "client"
  }/export?StartDate=${encodeURIComponent(StartDate)}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  // if (StartDate) {
  //   url += `&StartDate=${encodeURIComponent(StartDate)}`;
  // }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url, {
    responseType: "blob",
  });
};

export const GET_LEVEL_TWO = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-two/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_TWO_MNPHLR = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-two/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_TWO_WHATSAPP = async ({
  token,
  search = null,
  pageSize = 5,
  pageNumber = 1,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}whatsapp/level-two/${
    byprovider ? "provider" : "client"
  }?pageIndex=${pageNumber}&pageSize=${pageSize}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (StartDate) {
    url += `&StartDate=${encodeURIComponent(StartDate)}`;
  }
  if (EndDate) {
    url += `&EndDate=${encodeURIComponent(EndDate)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_TWO_WIDGETS = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}sms/${serviceTag}/level-two/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_TWO_WIDGETS_MNPHLR = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK}/${serviceTag}/level-two/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};

export const GET_LEVEL_TWO_WIDGETS_WHATSAPP = async ({
  token,
  search = null,
  StartDate = null,
  EndDate = null,
  ClientGuid = null,
  ProviderGuid = null,
  ServiceGuid = null,
  ChannelGuid = null,
  CountryGuid = null,
  OperatorGuid = null,
  byprovider = null,
  NoProviders = false,
  serviceTag = null,
}) => {
  // Create a URL with or without the searchCriteria parameter
  let url = `${REPORTING_LINK_SERVICES}whatsapp/level-two/summary?StartDate=${encodeURIComponent(
    StartDate
  )}&EndDate=${encodeURIComponent(EndDate)}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (ServiceGuid) {
    url += `&ServiceGuid=${encodeURIComponent(ServiceGuid)}`;
  }
  if (ChannelGuid) {
    url += `&ChannelGuid=${encodeURIComponent(ChannelGuid)}`;
  }
  if (CountryGuid) {
    url += `&CountryGuid=${encodeURIComponent(CountryGuid)}`;
  }
  if (OperatorGuid) {
    url += `&OperatorGuid=${encodeURIComponent(OperatorGuid)}`;
  }
  if (ClientGuid) {
    url += `&ClientGuid=${encodeURIComponent(ClientGuid)}`;
  }
  if (ProviderGuid) {
    url += `&ProviderGuid=${encodeURIComponent(ProviderGuid)}`;
  }
  if (byprovider) {
    url += `&byprovider=${encodeURIComponent(byprovider)}`;
  }
  if (NoProviders) {
    url += `&NoProviders=${encodeURIComponent(NoProviders)}`;
  }
  return await axiosInstance.get(url);
};
