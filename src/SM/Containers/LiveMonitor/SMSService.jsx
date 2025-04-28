import {
  AccessTime,
  ArrowBack,
  Download,
  FilterAlt,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  GET_ALL_CLIENT_API,
  GET_PROVIDERS_BY_SERVICE,
} from "../../../APIs/Clients";
import {
  EXPORT_LEVEL_ONE_SMS,
  EXPORT_LEVEL_TWO,
  GET_LEVEL_ONE_SMS,
  GET_LEVEL_ONE_WIDGETS_SMS,
  GET_LEVEL_TWO,
  GET_LEVEL_TWO_WIDGETS,
} from "../../../APIs/LIveMonitor";
import { GET_COUNTRIES, GET_OPERATORS } from "../../../APIs/SMSAPIS";
import DynamicFilters from "../../../Components/DynamicFilters/DynamicFilters";
import MuiTable from "../../../Components/MuiTable/MuiTable";
// import {
//   HandleApiError,
//   adjustToLocale,
//   formatForDatetimeLocal,
//   handleMessageError,
// } from "../../Utils/Functions";
import "./LiveMonitor.scss";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  HandleApiError,
  adjustToLocale,
  formatForDatetimeLocal,
  handleMessageError,
} from "../../Utils/Functions";

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
const SMSService = ({
  type,
  availableServices,
  selectedService,
  serviceTag,
}) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([
    {
      name: "5 sec",
      value: "5000",
    },
    {
      name: "10 sec",
      value: "10000",
    },
    {
      name: "15 sec",
      value: "15000",
    },
    {
      name: "30 sec",
      value: "30000",
    },
    {
      name: "1 min",
      value: "60000",
    },
  ]);
  const [Data, SetData] = useState([]);
  const [groupByValue, setGroupByValue] = useState("client");
  const [state, setState] = useState({
    providerOptions: [],
    providerOption: "",
    clientOptions: [],
    clientOption: "",
    countryCodeOptions: [],
    countryCodeOption: "",
    operatorOptions: [],
    operatorOption: "",
    countryCodeTwoOptions: [],
    countryCodeTwoOption: "",
    operatorTwoOptions: [],
    operatorTwoOption: "",
  });
  const [clientData, setClientData] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [filterToggle, SetFilterToggle] = useState(false);
  const [levelTwoFilterToggle, setLevelTwoFilterToggle] = useState(false);

  const [dateFilter, setDateFilter] = useState("Today");
  const [tempDateFilter, setTempDateFilter] = useState("Today");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Set to start of the day

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Set to end of the day

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  const [startHour, setStartHour] = useState("00");
  const [endHour, setEndHour] = useState("23");

  const [anchorEl, setAnchorEl] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const [monitorBeingViewed, setMonitorBeingViewed] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    if (tempStartDate == "" || tempEndDate == "") {
      setDateFilter(tempDateFilter);
    } else if (tempStartDate != "" && tempEndDate != "") {
      setDateFilter("Custom Date");
    }
  };
  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [SearchQuery, SetSearchQuery] = useState(null);
  const [widgetData, setWidgetData] = useState([]);
  const [widgetDataTwo, setWidgetDataTwo] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (selectedTime != "") {
      if (!monitorBeingViewed) {
        getLevelOne();
        getLevelOneWidgets();
        const interval = setInterval(() => {
          getLevelOne();
          getLevelOneWidgets();
        }, selectedTime);
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
      } else {
        getLevelTwo({});
        getLevelTwoWidgets({});
        const interval = setInterval(() => {
          getLevelTwo({});
          getLevelTwoWidgets({});
        }, selectedTime);
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
      }
    } else {
      if (!monitorBeingViewed) {
        getLevelOne();
        getLevelOneWidgets();
      } else {
        // if (totalRows > 4) {
        getLevelTwo({
          clientGuid:
            groupByValue == "provider" ? selectedProvider : selectedClient,
        });
        getLevelTwoWidgets({
          clientGuid:
            groupByValue == "provider" ? selectedProvider : selectedClient,
        });
      }
    }
  }, [paginationModel, selectedTime, monitorBeingViewed]);

  const exportLevelOneData = async () => {
    const startHourInSeconds = startHour * 3600;
    const endHourInSeconds = endHour * 3600;

    try {
      let resellersResponse = await EXPORT_LEVEL_ONE_SMS({
        token,
        search: SearchQuery,
        StartDate: startDate
          ? Math.floor(
              formatForDatetimeLocal(
                adjustToLocale(
                  new Date(startDate.getTime() + startHourInSeconds * 1000)
                )
              ) / 1000
            )
          : Math.floor(
              formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
            ),
        EndDate: endDate
          ? Math.floor(
              formatForDatetimeLocal(
                adjustToLocale(
                  new Date(endDate.getTime() + endHourInSeconds * 1000)
                )
              ) / 1000
            )
          : Math.floor(formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000),
        ClientGuid: state?.clientOption?.value,
        ProviderGuid: state?.providerOption,
        ServiceGuid: selectedService ? selectedService?.recordGuid : null,
        ChannelGuid: null,
        CountryGuid: state?.countryCodeOption,
        OperatorGuid: state?.operatorOption,
        byprovider: groupByValue == "provider" ? true : false,
        serviceTag: selectedService
          ? selectedService?.tag?.toLowerCase() == "one_way_sms"
            ? "one-way"
            : "two-way"
          : null,
      });

      if (resellersResponse?.status === 200) {
        const reader = new FileReader();

        reader.onload = () => {
          const responseText = reader.result;

          // Check if responseText indicates an empty data
          if (
            !responseText ||
            responseText.trim() === "" ||
            responseText.includes("Empty Data")
          ) {
            showSnackbar("Empty Data", "error");
            return;
          }

          const contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          const headers = resellersResponse.headers;
          headers["Content-Type"] = contentType;

          // Create a Blob object from the response data
          const blob = new Blob([resellersResponse.data], {
            type: contentType,
          });

          // Create a URL for the Blob object
          const url = window.URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = url;
          link.download = "Export Level One Monitor.xlsx";

          // Append link to the document body
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          showSnackbar("Export Successful");
        };

        reader.onerror = () => {
          showSnackbar("Failed to read the export data", "error");
        };

        // Read the Blob as text
        reader.readAsText(resellersResponse.data);
      } else {
        showSnackbar("Failed to export data", "error");
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      // Any final actions if needed
    }
  };

  const getLevelOne = async () => {
    setLoading(true);
    try {
      const startHourInSeconds = startHour * 3600;
      const endHourInSeconds = endHour * 3600;

      const adjustedStartTimestamp = startDate
        ? Math.floor(
            adjustToLocale(
              new Date(startDate.getTime() + startHourInSeconds * 1000)
            ) / 1000
          )
        : Math.floor(adjustToLocale(startOfDay).getTime() / 1000);
      const adjustedEndTimestamp = endDate
        ? Math.floor(
            adjustToLocale(
              new Date(endDate.getTime() + endHourInSeconds * 1000)
            ) / 1000
          )
        : Math.floor(adjustToLocale(endOfDay).getTime() / 1000);

      let response = await GET_LEVEL_ONE_SMS({
        token,
        search: SearchQuery,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        StartDate: startDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(startDate)) / 1000)
          : Math.floor(
              formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
            ),
        EndDate: endDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
          : Math.floor(formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000),
        ClientGuid: state?.clientOption?.value,
        ProviderGuid: state?.providerOption,
        ChannelGuid: null,
        CountryGuid: state?.countryCodeOption,
        OperatorGuid: state?.operatorOption,
        ServiceGuid: selectedService ? selectedService?.recordGuid : null,
        byprovider: groupByValue == "provider" ? true : false,
        serviceTag: selectedService
          ? selectedService?.tag?.toLowerCase() == "one_way_sms"
            ? "one-way"
            : "two-way"
          : null,
      });

      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({ ...item }))
          : [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getLevelOneWidgets = async () => {
    setLoading(true);
    try {
      const startHourInSeconds = startHour * 3600;
      const endHourInSeconds = endHour * 3600;

      const adjustedStartTimestamp = startDate
        ? Math.floor(
            adjustToLocale(
              new Date(startDate.getTime() + startHourInSeconds * 1000)
            ) / 1000
          )
        : Math.floor(adjustToLocale(startOfDay).getTime() / 1000);
      const adjustedEndTimestamp = endDate
        ? Math.floor(
            adjustToLocale(
              new Date(endDate.getTime() + endHourInSeconds * 1000)
            ) / 1000
          )
        : Math.floor(adjustToLocale(endOfDay).getTime() / 1000);

      let response = await GET_LEVEL_ONE_WIDGETS_SMS({
        token,
        search: SearchQuery,
        serviceTag: selectedService
          ? selectedService?.tag?.toLowerCase() == "one_way_sms"
            ? "one-way"
            : "two-way"
          : null,
        StartDate: startDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(startDate)) / 1000)
          : Math.floor(
              formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
            ),
        EndDate: endDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
          : Math.floor(formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000),
        ClientGuid: state?.clientOption?.value,
        ProviderGuid: state?.providerOption,
        ServiceGuid: selectedService ? selectedService?.recordGuid : null,
        ChannelGuid: null,
        CountryGuid: state?.countryCodeOption,
        OperatorGuid: state?.operatorOption,
        byprovider: groupByValue == "provider" ? true : false,
      });

      setWidgetData([
        {
          totalCost: response?.data?.data?.totalCost ?? 0,
          totalHLRCost: response?.data?.data?.totalHLRCost ?? 0,
          totalMNPCost: response?.data?.data?.totalMNPCost ?? 0,
          totalProfit: response?.data?.data?.totalProfit ?? 0,
          totalRate: response?.data?.data?.totalRate ?? 0,
          totalCount: response?.data?.data?.totalCount ?? 0,
          totalPorted: response?.data?.data?.totalPorted ?? 0,
          totalActive: response?.data?.data?.totalActive ?? 0,
        },
      ]);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
      setIsSearch(false);
    }
  };

  const exportLevelTwoData = async () => {
    try {
      let resellersResponse = await EXPORT_LEVEL_TWO({
        token,
        search: SearchQuery,
        serviceTag: selectedService
          ? selectedService?.tag?.toLowerCase() == "one_way_sms"
            ? "one-way"
            : "two-way"
          : null,
        StartDate: startDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(startDate)) / 1000)
          : Math.floor(
              formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
            ),
        EndDate: endDate
          ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
          : Math.floor(formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000),

        ClientGuid:
          groupByValue == "provider"
            ? state?.clientOption?.value
            : selectedClient ?? "",
        ProviderGuid:
          groupByValue == "provider"
            ? selectedProvider != "" && selectedProvider != undefined
              ? selectedProvider
              : ""
            : state?.providerOption ?? "",
        ServiceGuid: selectedService ? selectedService?.recordGuid : null,
        ChannelGuid: null,
        CountryGuid: state?.countryCodeTwoOption,
        OperatorGuid: state?.operatorTwoOption,
        NoProviders:
          selectedProvider == "00000000-0000-0000-0000-000000000000"
            ? true
            : false,
        byprovider: groupByValue == "provider" ? true : false,
      });

      if (resellersResponse?.status === 200) {
        const reader = new FileReader();

        reader.onload = () => {
          const responseText = reader.result;

          // Check if responseText indicates an empty data
          if (
            !responseText ||
            responseText.trim() === "" ||
            responseText.includes("Empty Data")
          ) {
            showSnackbar("Empty Data", "error");
            return;
          }

          const contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          const headers = resellersResponse.headers;
          headers["Content-Type"] = contentType;

          // Create a Blob object from the response data
          const blob = new Blob([resellersResponse.data], {
            type: contentType,
          });

          // Create a URL for the Blob object
          const url = window.URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const link = document.createElement("a");
          link.href = url;
          link.download = "Export Level Two Monitor.xlsx";

          // Append link to the document body
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          showSnackbar("Export Successful");
        };

        reader.onerror = () => {
          showSnackbar("Failed to read the export data", "error");
        };

        // Read the Blob as text
        reader.readAsText(resellersResponse.data);
      } else {
        showSnackbar("Failed to export data", "error");
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const getLevelTwo = async ({ clientGuid, isOnClick }) => {
    setLoading(true);

    try {
      let response = "";
      if (groupByValue == "provider") {
        response = await GET_LEVEL_TWO({
          token,
          search: SearchQuery,
          serviceTag: selectedService
            ? selectedService?.tag?.toLowerCase() == "one_way_sms"
              ? "one-way"
              : "two-way"
            : null,
          pageSize: paginationModel?.pageSize,
          pageNumber: parseInt(paginationModel?.page) + 1,
          StartDate: startDate
            ? Math.floor(
                formatForDatetimeLocal(adjustToLocale(startDate)) / 1000
              )
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
              ),
          EndDate: endDate
            ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000
              ),
          ClientGuid: state?.clientOption?.value,
          ProviderGuid:
            clientGuid != "" && clientGuid != undefined
              ? clientGuid
              : selectedProvider != "" &&
                !isOnClick &&
                selectedProvider != undefined
              ? selectedProvider
              : "",
          ServiceGuid: selectedService ? selectedService?.recordGuid : null,
          ChannelGuid: null,
          CountryGuid:
            state?.countryCodeTwoOption == ""
              ? state?.countryCodeOption
              : state?.countryCodeTwoOption,
          OperatorGuid:
            state?.operatorTwoOption == ""
              ? state?.operatorOption
              : state?.operatorTwoOption,
          byprovider: groupByValue == "provider" ? true : false,
          NoProviders:
            clientGuid == "00000000-0000-0000-0000-000000000000" ? true : false,
        });
      } else {
        response = await GET_LEVEL_TWO({
          token,
          search: SearchQuery,
          serviceTag: selectedService
            ? selectedService?.tag?.toLowerCase() == "one_way_sms"
              ? "one-way"
              : "two-way"
            : null,
          pageSize: paginationModel?.pageSize,
          pageNumber: parseInt(paginationModel?.page) + 1,
          StartDate: startDate
            ? Math.floor(
                formatForDatetimeLocal(adjustToLocale(startDate)) / 1000
              )
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
              ),
          EndDate: endDate
            ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000
              ),
          ClientGuid: clientGuid ?? selectedClient,
          ProviderGuid: state?.providerOption ?? selectedProvider,
          ServiceGuid: selectedService ? selectedService?.recordGuid : null,
          ChannelGuid: null,
          CountryGuid:
            state?.countryCodeTwoOption == ""
              ? state?.countryCodeOption
              : state?.countryCodeTwoOption,
          OperatorGuid:
            state?.operatorTwoOption == ""
              ? state?.operatorOption
              : state?.operatorTwoOption,
          byprovider: groupByValue == "provider" ? true : false,
        });
      }
      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
              ...item,
            }))
          : [];
      setClientData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
      setIsSearch(false);
    }
  };

  const getLevelTwoWidgets = async ({ clientGuid, isOnClick }) => {
    setLoading(true);
    const startHourInSeconds = startHour * 3600;
    const endHourInSeconds = endHour * 3600;

    const adjustedStartTimestamp = startDate
      ? Math.floor(
          adjustToLocale(
            new Date(startDate.getTime() + startHourInSeconds * 1000)
          ) / 1000
        )
      : Math.floor(adjustToLocale(startOfDay).getTime() / 1000);
    const adjustedEndTimestamp = endDate
      ? Math.floor(
          adjustToLocale(
            new Date(endDate.getTime() + endHourInSeconds * 1000)
          ) / 1000
        )
      : Math.floor(adjustToLocale(endOfDay).getTime() / 1000);

    try {
      let response = "";
      if (groupByValue == "provider") {
        response = await GET_LEVEL_TWO_WIDGETS({
          token,
          search: SearchQuery,
          serviceTag: selectedService
            ? selectedService?.tag?.toLowerCase() == "one_way_sms"
              ? "one-way"
              : "two-way"
            : null,
          StartDate: adjustedStartTimestamp,

          EndDate: adjustedEndTimestamp,
          ClientGuid: state?.clientOption?.value,
          ProviderGuid:
            clientGuid != "" && clientGuid != undefined
              ? clientGuid
              : selectedProvider != "" &&
                !isOnClick &&
                selectedProvider != undefined
              ? selectedProvider
              : "",
          ServiceGuid: selectedService ? selectedService?.recordGuid : null,
          ChannelGuid: null,
          CountryGuid:
            state?.countryCodeTwoOption == ""
              ? state?.countryCodeOption
              : state?.countryCodeTwoOption,
          OperatorGuid:
            state?.operatorTwoOption == ""
              ? state?.operatorOption
              : state?.operatorTwoOption,
          byprovider: groupByValue == "provider" ? true : false,
          NoProviders:
            clientGuid == "00000000-0000-0000-0000-000000000000" ? true : false,
        });
      } else {
        response = await GET_LEVEL_TWO_WIDGETS({
          token,
          search: SearchQuery,
          serviceTag: selectedService
            ? selectedService?.tag?.toLowerCase() == "one_way_sms"
              ? "one-way"
              : "two-way"
            : null,
          StartDate: startDate
            ? Math.floor(
                formatForDatetimeLocal(adjustToLocale(startDate)) / 1000
              )
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(startOfDay)) / 1000
              ),
          EndDate: endDate
            ? Math.floor(formatForDatetimeLocal(adjustToLocale(endDate)) / 1000)
            : Math.floor(
                formatForDatetimeLocal(adjustToLocale(endOfDay)) / 1000
              ),
          ClientGuid: clientGuid ?? selectedClient,
          ProviderGuid: state?.providerOption ?? selectedProvider,
          ServiceGuid: selectedService ? selectedService?.recordGuid : null,
          ChannelGuid: null,
          CountryGuid:
            state?.countryCodeTwoOption == ""
              ? state?.countryCodeOption
              : state?.countryCodeTwoOption,
          OperatorGuid:
            state?.operatorTwoOption == ""
              ? state?.operatorOption
              : state?.operatorTwoOption,
          byprovider: groupByValue == "provider" ? true : false,
        });
      }
      setWidgetDataTwo([
        {
          totalCount: response?.data?.data?.totalCount ?? 0,
          totalCost: response?.data?.data?.totalCost ?? 0,
          totalDelivered: response?.data?.data?.totalDelivered ?? 0,
          deliveryPercentage: response?.data?.data?.deliveryPercentage ?? 0,
          totalProfit: response?.data?.data?.totalProfit ?? 0,
          totalRate: response?.data?.data?.totalRate ?? 0,
        },
      ]);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllProviders = async (search) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        token,
        pageSize: 10000,
        pageNumber: 0,
        RecordGuid: search
          ? search
          : selectedService
          ? selectedService?.recordGuid
          : null,
      });

      setState((prevState) => ({
        ...prevState,
        providerOptions: response?.data?.data?.items?.map((item) => ({
          value: item.recordGuid,
          name: item.name,
        })),
      }));
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  // const loadProvidersOptions = async (search, loadedOptions, { page }) => {
  //   let options = [];
  //   try {
  //     let response = await GET_PROVIDERS_BY_SERVICE({
  //       token,
  //       search: search,
  //       pageSize: 10000,
  //       pageNumber: page - 1,
  //       RecordGuid:
  //         loadedOptions?.length > 0
  //           ? loadedOptions[0]
  //           : selectedService
  //           ? selectedService
  //           : null,
  //     });

  //     if (!response.status == "200") {
  //       throw new Error("Failed to fetch data");
  //     }
  //     options = response?.data?.data?.items?.map((item) => ({
  //       value: item.recordGuid,
  //       label: item.name,
  //     }));

  //     const hasMore =
  //       (page - 1) * 5 + response?.data?.data?.items?.length <
  //       response?.data?.data?.totalRows;

  //     return {
  //       options,
  //       hasMore,
  //       additional: {
  //         page: page + 1,
  //       },
  //     };
  //   } catch (e) {
  //     showSnackbar(handleMessageError({ e }), "error");
  //     return { options: [], hasMore: false }; // Return empty options and mark as no more data
  //   }
  // };

  let { clientId } = useSelector((state) => state?.authentication);
  const { sass } = useSelector((state) => state);

  const loadClientOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = {};
      if (sass?.KYC_ENABLED === "true") {
        response = await GET_ALL_CLIENT_API({
          token,
          name: search,
          pageSize: 10,
          pageNumber: page,
          type: "BUSINESS",
          ParentGuid: clientId,
          kyc: 3,
        });
      } else {
        response = await GET_ALL_CLIENT_API({
          token,
          name: search,
          pageSize: 10,
          pageNumber: page,
          type: "BUSINESS",
          ParentGuid: clientId,
        });
      }

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.clients?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.clients?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  const getCountries = async () => {
    try {
      let response = await GET_COUNTRIES({
        token: token,
      });
      setState((prevState) => ({
        ...prevState,
        countryCodeOptions:
          response?.data?.data?.countries?.map(
            ({ name, isoCode, recordGuid }) => ({
              text: name + " " + isoCode,
              value: recordGuid,
            })
          ) || [],
        countryCodeTwoOptions:
          response?.data?.data?.countries?.map(
            ({ name, isoCode, recordGuid }) => ({
              text: name + " " + isoCode,
              value: recordGuid,
            })
          ) || [],
      }));
    } catch (e) {
      HandleApiError(e);
    }
  };

  useEffect(() => {
    setTimeError("");
  }, [tempStartDate, tempEndDate]);

  useEffect(() => {
    if (filterToggle) {
      getAllProviders();
    }
  }, [filterToggle]);

  useEffect(() => {
    if (monitorBeingViewed && isSearch) {
      getLevelTwo({});
      getLevelTwoWidgets({});
    }
  }, [state.countryCodeTwoOption, state.operatorTwoOption]);

  const getOperators = async (iso) => {
    try {
      let response = await GET_OPERATORS({
        iso,
      });
      setState((prevState) => ({
        ...prevState,
        operatorOptions:
          response?.data?.data?.items?.map(({ name, recordGuid }) => ({
            text: name,
            value: recordGuid,
          })) || [],
        operatorTwoOptions:
          response?.data?.data?.items?.map(({ name, recordGuid }) => ({
            text: name,
            value: recordGuid,
          })) || [],
      }));
    } catch (e) {
      HandleApiError(e);
    }
  };

  const handleLiveTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const [timeError, setTimeError] = useState("");

  const titleMap = {
    totalCount: "Total Count",
    totalRate: "Total Rate",
    totalCost: "Total Cost",
    totalProfit: "Total Profit",
  };

  const titleMapTwo = {
    totalCount: "Total Count",
    totalRate: "Total Rate",
    totalCost: "Total Cost",
    totalProfit: "Profit",
    totalDelivered: "Delivered",
    deliveryPercentage: "Delivery %",
  };
  return (
    <>
      <Grid
        item
        xs={12}
        sm={availableServices > 1 ? 9 : 12}
        className="sub_section_container"
      >
        <Grid
          container
          className="pt-4"
          paddingRight={2.5}
          alignContent={"flex-start"}
        >
          <Grid
            item
            xs={monitorBeingViewed ? 6 : 12}
            md={monitorBeingViewed ? 6 : 12}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            {monitorBeingViewed && (
              <IconButton
                onClick={() => {
                  setMonitorBeingViewed(null);
                  setState((prevState) => ({
                    ...prevState,
                    countryCodeTwoOption: "",
                    operatorTwoOption: "",
                  }));
                  setPaginationModel({
                    pageSize: 10,
                    page: 0,
                  });
                }}
              >
                <ArrowBack />
              </IconButton>
            )}

            <Typography variant="h5">
              Monitor{" "}
              {monitorBeingViewed
                ? ` / ${
                    groupByValue == "provider"
                      ? monitorBeingViewed?.providerName
                      : monitorBeingViewed?.clientName
                  }`
                : ""}
            </Typography>
          </Grid>
          {monitorBeingViewed && (
            <Grid
              item
              xs={6}
              md={6}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Button
                className="mui-btn grey"
                onClick={() => setLevelTwoFilterToggle(true)}
                startIcon={<FilterAlt />}
                sx={{ height: "fit-content" }}
              >
                Filter By
              </Button>
              <Button
                className="mui-btn secondary filled"
                startIcon={<Download />}
                id="download"
                onClick={() => exportLevelTwoData()}
                sx={{ height: "fit-content" }}
              >
                Export
              </Button>
            </Grid>
          )}

          {!monitorBeingViewed && (
            <>
              <Grid item xs={12} md={5}>
                <Chip
                  label="Today"
                  color="primary"
                  onClick={() => {
                    setDateFilter("Today");
                    setTempDateFilter("Today");
                    setStartDate(startOfDay);
                    setEndDate(endOfDay);
                    setTempStartDate("");
                    setTempEndDate("");
                    setPaginationModel({
                      pageSize: 10,
                      page: 0,
                    });
                  }}
                  variant={dateFilter == "Today" ? "" : "outlined"}
                  className="m-1"
                />
                <Chip
                  label="Yesterday"
                  color="primary"
                  onClick={() => {
                    const now = new Date();
                    let fromTemp, toTemp;
                    fromTemp = new Date(now - 24 * 60 * 60 * 1000);
                    toTemp = new Date(now - 24 * 60 * 60 * 1000);
                    fromTemp.setHours(0, 0, 0, 0);
                    toTemp.setHours(23, 59, 59, 999);
                    setDateFilter("Yesterday");
                    setTempDateFilter("Yesterday");
                    setTempStartDate("");
                    setTempEndDate("");
                    setStartDate(new Date(fromTemp));
                    setEndDate(new Date(toTemp));
                    setPaginationModel({
                      pageSize: 10,
                      page: 0,
                    });
                  }}
                  variant={dateFilter == "Yesterday" ? "" : "outlined"}
                  className="m-1"
                />
                <Chip
                  label="This Month"
                  color="primary"
                  onClick={() => {
                    const now = new Date();
                    let fromTemp, toTemp;

                    // Set the date to the first day of the current month
                    fromTemp = new Date(now.getFullYear(), now.getMonth(), 1);
                    toTemp = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                    fromTemp.setHours(0, 0, 0, 0); // Set to beginning of the day
                    toTemp.setHours(23, 59, 59, 999); // Set to end of the day
                    setDateFilter("This Month");
                    setTempDateFilter("This Month");
                    setTempStartDate("");
                    setTempEndDate("");
                    setStartDate(new Date(fromTemp));
                    setEndDate(new Date(toTemp));
                    setPaginationModel({
                      pageSize: 10,
                      page: 0,
                    });
                  }}
                  variant={dateFilter == "This Month" ? "" : "outlined"}
                  className="m-1"
                />
                <Chip
                  label="Last Month"
                  color="primary"
                  onClick={() => {
                    const now = new Date();
                    let fromTemp, toTemp;

                    // Get the first day of the current month
                    const firstDayOfCurrentMonth = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      1
                    );

                    // Set the date to the first day of the previous month
                    fromTemp = new Date(
                      firstDayOfCurrentMonth.getFullYear(),
                      firstDayOfCurrentMonth.getMonth() - 1,
                      1
                    );

                    // Get the last day of the previous month
                    const lastDayOfPreviousMonth = new Date(
                      fromTemp.getFullYear(),
                      fromTemp.getMonth() + 1,
                      0
                    );

                    // Set the end date to the last day of the previous month
                    toTemp = new Date(
                      lastDayOfPreviousMonth.getFullYear(),
                      lastDayOfPreviousMonth.getMonth(),
                      lastDayOfPreviousMonth.getDate()
                    );

                    fromTemp.setHours(0, 0, 0, 0); // Set to beginning of the day
                    toTemp.setHours(23, 59, 59, 999); // Set to end of the day
                    setDateFilter("Last Month");
                    setTempDateFilter("Last Month");
                    setTempStartDate("");
                    setTempEndDate("");
                    setStartDate(new Date(fromTemp));
                    setEndDate(new Date(toTemp));
                    setPaginationModel({
                      pageSize: 10,
                      page: 0,
                    });
                  }}
                  variant={dateFilter == "Last Month" ? "" : "outlined"}
                  className="m-1"
                />
                <Chip
                  label="Custom Date"
                  color="primary"
                  onClick={(e) => {
                    // setStartDate("");
                    // setEndDate("");
                    setDateFilter("Custom Date");
                    handleClick(e);
                  }}
                  variant={dateFilter == "Custom Date" ? "" : "outlined"}
                  className="m-1"
                />
                <Popover
                  id={popoverId}
                  open={popoverOpen}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box m={2}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Start Date and Start Hour */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              variant="standard"
                              label="Start Date"
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              inputProps={{
                                max:
                                  tempEndDate && tempEndDate !== ""
                                    ? new Date(tempEndDate)
                                        ?.toISOString()
                                        .slice(0, 10) // Extract only the date part
                                    : new Date().toISOString().slice(0, 10), // Extract only the date part
                              }}
                              value={
                                tempStartDate
                                  ? new Date(tempStartDate)
                                      .toISOString()
                                      .slice(0, 10) // Extract only the date part
                                  : ""
                              }
                              onChange={(e) => {
                                const startDateValue = new Date(e.target.value);
                                if (!isNaN(startDateValue.getTime())) {
                                  setStartDate(startDateValue);
                                  setTempStartDate(startDateValue);
                                } else {
                                  setStartDate("");
                                  setTempStartDate("");
                                }
                              }}
                              type="date"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel id="start-hour-label">
                                Start Hour
                              </InputLabel>
                              <Select
                                labelId="start-hour-label"
                                value={startHour}
                                onChange={(e) => setStartHour(e?.target?.value)}
                                inputProps={{
                                  onKeyDown: (e) => {
                                    e.preventDefault();
                                  },
                                }}
                                IconComponent={() => (
                                  <IconButton>
                                    <AccessTime />
                                  </IconButton>
                                )}
                                fullWidth
                              >
                                {[...Array(24).keys()].map((hour) => (
                                  <MenuItem
                                    key={hour}
                                    value={hour < 10 ? `0${hour}` : hour}
                                  >
                                    {hour < 10 ? `0${hour}` : hour}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* End Date and End Hour */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              variant="standard"
                              label="End Date"
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              inputProps={{
                                max: new Date().toISOString().slice(0, 16),
                                min: tempStartDate
                                  ? new Date(tempStartDate)
                                      ?.toISOString()
                                      .slice(0, 16)
                                  : "",
                              }}
                              style={{ position: "relative" }}
                              value={
                                tempEndDate
                                  ? new Date(tempEndDate)
                                      .toISOString()
                                      .slice(0, 10) // Extract only the date part
                                  : ""
                              }
                              onChange={(e) => {
                                const endDateValue = new Date(e.target.value);
                                if (!isNaN(endDateValue.getTime())) {
                                  setStartDate(startDate);
                                  setTempStartDate(tempStartDate);
                                  setEndDate(endDateValue);
                                  setTempEndDate(endDateValue);
                                } else {
                                  setStartDate(startDate);
                                  setTempStartDate(tempStartDate);
                                  setEndDate("");
                                  setTempEndDate("");
                                }
                              }}
                              type="date"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel id="end-hour-label">
                                End Hour
                              </InputLabel>
                              <Select
                                labelId="end-hour-label"
                                value={endHour}
                                onChange={(e) => setEndHour(e?.target?.value)}
                                inputProps={{
                                  onKeyDown: (e) => {
                                    e.preventDefault();
                                  },
                                }}
                                IconComponent={() => (
                                  <IconButton>
                                    <AccessTime />
                                  </IconButton>
                                )}
                                fullWidth
                              >
                                {[...Array(24).keys()].map((hour) => (
                                  <MenuItem
                                    key={hour}
                                    value={hour < 10 ? `0${hour}` : hour}
                                  >
                                    {hour < 10 ? `0${hour}` : hour}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* Search Button */}
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center">
                          <Button
                            color="primary"
                            variant="outlined"
                            sx={{ margin: "0 !important" }}
                            disabled={
                              startDate == "" ||
                              endDate == "" ||
                              tempStartDate == "" ||
                              tempEndDate == "" ||
                              ((startDate?.toString() === endDate?.toString() ||
                                tempStartDate?.toString() ===
                                  tempEndDate?.toString()) &&
                                startHour > endHour)
                            }
                            onClick={() => {
                              if (startDate != "" && endDate != "") {
                                if (
                                  startDate > endDate ||
                                  ((startDate?.toString() ===
                                    endDate?.toString() ||
                                    tempStartDate?.toString() ===
                                      tempEndDate?.toString()) &&
                                    startHour > endHour)
                                ) {
                                  setTimeError(
                                    "Start Date can't be larger than the End Date"
                                  );
                                } else {
                                  setTimeError("");
                                  let fromTemp, toTemp;
                                  fromTemp = new Date(
                                    startDate + 24 * 60 * 60 * 1000
                                  );
                                  toTemp = new Date(
                                    endDate + 24 * 60 * 60 * 1000
                                  );
                                  fromTemp.setHours(startHour, 0, 0, 0);
                                  toTemp.setHours(endHour, 59, 59, 999);
                                  setStartDate(new Date(fromTemp));
                                  setEndDate(new Date(toTemp));
                                  setPaginationModel({
                                    pageSize: 10,
                                    page: 0,
                                  });
                                  setAnchorEl(null);
                                }
                              }
                            }}
                          >
                            Search
                          </Button>
                        </Box>
                      </Grid>
                      {/* Error Message */}
                      {timeError != "" && (
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center">
                            <span style={{ color: "#f00" }}>{timeError}</span>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Popover>
              </Grid>
              <Grid item xs={12} md={7} display={"flex"} justifyContent={"end"}>
                <FormControlLabel
                  size="small"
                  label="Select update time:"
                  labelPlacement="start"
                  control={
                    <Select
                      sx={{
                        height: "20px",
                        marginLeft: "5px",
                        borderRadius: "16px",
                      }}
                      className="live-data-select"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={selectedTime}
                      onChange={handleLiveTimeChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {timeOptions?.map((item, idx) => (
                        <MenuItem key={idx} value={item?.value}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  sx={{ marginRight: "10px" }}
                />
                <Button
                  className="mui-btn grey"
                  onClick={() => SetFilterToggle(true)}
                  startIcon={<FilterAlt />}
                >
                  Filter By
                </Button>
                <Button
                  className="mui-btn secondary filled"
                  startIcon={<Download />}
                  id="download"
                  onClick={() => {
                    exportLevelOneData();
                  }}
                >
                  Export
                </Button>
              </Grid>
              {dateFilter == "Custom Date" && (
                <Grid item xs={12}>
                  <>
                    {tempStartDate != "" && (
                      <Chip
                        label={`${getFormattedDate(tempStartDate)} ${
                          startHour != null ? startHour + ":00" : ""
                        }`} // Append selected hour
                        color="secondary"
                        variant={"outlined"}
                        className="m-1"
                      />
                    )}
                    {tempEndDate != "" && (
                      <Chip
                        label={`${getFormattedDate(tempEndDate)} ${
                          endHour != null ? endHour + ":59" : ""
                        }`} // Append selected hour
                        color="secondary"
                        variant={"outlined"}
                        className="m-1"
                      />
                    )}
                  </>
                </Grid>
              )}
              <Grid container spacing={1} my={1}>
                {widgetData?.length > 0 &&
                  Object.keys(titleMap)?.map((name) => (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                      <Card className="kpi-cards">
                        <span className="kpi-titles">{titleMap[name]}</span>
                        <span className="kpi-values">
                          {widgetData[0][name]}
                        </span>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </>
          )}

          {monitorBeingViewed && (
            <Grid container spacing={1} my={1}>
              {widgetDataTwo?.length > 0 &&
                Object.keys(titleMapTwo)?.map((name) => (
                  <Grid item xs={12} sm={6} md={3} key={name}>
                    <Card className="kpi-cards">
                      <span className="kpi-titles">{titleMapTwo[name]}</span>
                      <span className="kpi-values">
                        {widgetDataTwo[0][name]}
                      </span>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
          <Grid item xs={12} marginTop={2}>
            <MuiTable
              columns={
                monitorBeingViewed
                  ? groupByValue == "provider"
                    ? [
                        {
                          field: "clientName",
                          headerName: "Client",
                          flex: 1,
                        },

                        {
                          field: "countryName",
                          headerName: "Country",
                          flex: 1,
                        },
                        {
                          field: "operatorName",
                          headerName: "Operator",
                          flex: 1,
                        },
                        {
                          field: "totalReceived",
                          headerName: "Total",
                          flex: 1,
                        },
                        {
                          field: "deliveryPercentage",
                          headerName: "Delivered %",
                          flex: 1,
                        },
                        {
                          field: "totalCost",
                          headerName: "Total Cost",
                          flex: 1,
                        },
                        {
                          field: "totalRate",
                          headerName: "Total Rate",
                          flex: 1,
                        },
                        {
                          field: "totalProfit",
                          headerName: "Profit",
                          flex: 1,
                        },
                        // {
                        //   field: "totalPorted",
                        //   headerName: "Total Ported",
                        //   flex: 1,
                        // },
                        // {
                        //   field: "totalActive",
                        //   headerName: "Total Active",
                        //   flex: 1,
                        // },
                      ]
                    : [
                        {
                          field: "providerName",
                          headerName: "Provider",
                          flex: 1,
                        },

                        {
                          field: "countryName",
                          headerName: "Country",
                          flex: 1,
                        },
                        {
                          field: "operatorName",
                          headerName: "Operator",
                          flex: 1,
                        },
                        {
                          field: "totalReceived",
                          headerName: "Total",
                          flex: 1,
                        },
                        {
                          field: "deliveryPercentage",
                          headerName: "Delivered %",
                          flex: 1,
                        },
                        {
                          field: "totalCost",
                          headerName: "Total Cost",
                          flex: 1,
                        },
                        {
                          field: "totalRate",
                          headerName: "Total Rate",
                          flex: 1,
                        },
                        {
                          field: "totalProfit",
                          headerName: "Profit",
                          flex: 1,
                        },
                        // {
                        //   field: "totalPorted",
                        //   headerName: "Total Ported",
                        //   flex: 1,
                        // },
                        // {
                        //   field: "totalActive",
                        //   headerName: "Total Active",
                        //   flex: 1,
                        // },
                      ]
                  : [
                      {
                        field:
                          groupByValue == "provider"
                            ? "providerName"
                            : "clientName",
                        headerName: "Name",
                        flex: 1,
                        renderCell: (params) => (
                          <Box
                            className="clientName-hover"
                            onClick={() => {
                              setPaginationModel({
                                pageSize: 10,
                                page: 0,
                              });
                              setMonitorBeingViewed(params?.row);
                              if (groupByValue == "provider") {
                                setSelectedProvider(params?.row?.providerGuid);

                                getLevelTwo({
                                  clientGuid: params?.row?.providerGuid,
                                  isOnClick: true,
                                });

                                getLevelTwoWidgets({
                                  clientGuid: params?.row?.providerGuid,
                                  isOnClick: true,
                                });
                              } else {
                                setSelectedClient(params?.row?.clientGuid);

                                getLevelTwo({
                                  clientGuid: params?.row?.clientGuid,
                                });
                                getLevelTwoWidgets({
                                  clientGuid: params?.row?.clientGuid,
                                });
                              }
                              setState((prevState) => ({
                                ...prevState,
                                countryCodeTwoOption: state.countryCodeOption,
                                operatorTwoOption: state?.operatorOption,
                              }));
                            }}
                          >
                            {params?.value}
                          </Box>
                        ),
                      },
                      {
                        field: "totalReceived",
                        headerName: "Count",
                        flex: 1,
                      },
                      {
                        field: "deliveryPercentage",
                        headerName: "Delivered %",
                        flex: 1,
                      },
                      { field: "totalProfit", headerName: "Profit", flex: 1 },
                      {
                        field: "totalCost",
                        headerName: "Total Cost",
                        flex: 1,
                      },
                      {
                        field: "totalRate",
                        headerName: "Total Rate",
                        flex: 1,
                      },
                    ]
              }
              data={monitorBeingViewed ? clientData : Data}
              loading={loading}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
            />
          </Grid>
        </Grid>
      </Grid>
      <DynamicFilters
        toggle={() => SetFilterToggle(false)}
        isOpen={filterToggle}
        handleSearch={() => {
          SetFilterToggle((prev) => false);
          setIsSearch(true);
          setPaginationModel({
            pageSize: 10,
            page: 0,
          });
        }}
        handleClearFilters={() => {
          SetFilterToggle((prev) => false);
          setSelectedClient("");
          setSelectedProvider("");
          setState((prevState) => ({
            ...prevState,
            clientOption: "",
            providerOption: "",
            countryCodeOption: "",
            operatorOption: "",
            countryCodeTwoOption: "",
            operatorTwoOption: "",
          }));
          setGroupByValue("client");
          setPaginationModel({
            pageSize: 10,
            page: 0,
          });
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">Client</span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      clientOption: "",
                    }))
                  }
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <AsyncPaginate
              id="async-menu-style"
              value={state?.clientOption}
              loadOptions={loadClientOptions}
              onChange={(value) => {
                setState((prevState) => ({
                  ...prevState,
                  clientOption: value,
                }));
              }}
              additional={{
                page: 1,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">
                  Provider
                </span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      providerOption: "",
                    }))
                  }
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <FormControl fullWidth variant="standard" className="mb-2">
              <Select
                displayEmpty
                disabled={!selectedService}
                variant="standard"
                value={state?.providerOption}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setState((prevState) => ({
                    ...prevState,
                    providerOption: value,
                  }));
                }}
              >
                <MenuItem disabled value="">
                  <em>Select...</em>
                </MenuItem>
                {state?.providerOptions?.map((provider) => (
                  <MenuItem key={provider?.value} value={provider?.value}>
                    {provider?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">Country</span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      countryCodeOption: "",
                      countryCodeTwoOption: "",
                      operatorTwoOption: "",
                      operatorOption: "",
                    }))
                  }
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              variant="standard"
              select
              value={state?.countryCodeOption}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: "rgb(128 128 128)" }}>
                        Select...
                      </span>
                    );
                  }
                  const selectedOption = state.countryCodeOptions?.find(
                    (option) => option?.value === selected
                  );
                  return selectedOption ? (
                    selectedOption.text
                  ) : (
                    <span style={{ color: "rgb(128 128 128)" }}>Select...</span>
                  );
                },
              }}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  countryCodeOption: e.target.value,
                  countryCodeTwoOption: e.target.value,
                  operatorTwoOption: "",
                  operatorOption: "",
                }));
                getOperators(e.target.value);
              }}
            >
              {state?.countryCodeOptions.map((option) => (
                <MenuItem key={option?.text} value={option?.value}>
                  {option?.text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">
                  Operator
                </span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      operatorOption: "",
                      operatorTwoOption: "",
                      countryCodeTwoOption: state.countryCodeOption,
                    }))
                  }
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              variant="standard"
              select
              disabled={!state?.countryCodeOption}
              value={state?.operatorOption}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: "rgb(128 128 128)" }}>
                        Select...
                      </span>
                    );
                  }
                  const selectedOption = state.operatorOptions?.find(
                    (option) => option?.value === selected
                  );
                  return selectedOption ? (
                    selectedOption.text
                  ) : (
                    <span style={{ color: "rgb(128 128 128)" }}>Select...</span>
                  );
                },
              }}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  operatorOption: e.target.value,
                  operatorTwoOption: e.target.value,
                  countryCodeTwoOption: state.countryCodeOption,
                }));
              }}
            >
              {state?.operatorOptions.map((option) => (
                <MenuItem key={option?.text} value={option?.value}>
                  {option?.text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Group By
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="client"
                name="radio-buttons-group"
                value={groupByValue}
                onChange={(e) => {
                  setGroupByValue(e?.target?.value);
                  setSelectedClient("");
                  setSelectedProvider("");
                }}
              >
                <FormControlLabel
                  value="client"
                  control={<Radio />}
                  label="Client"
                />
                <FormControlLabel
                  value="provider"
                  control={<Radio />}
                  label="Provider"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DynamicFilters>
      <DynamicFilters
        toggle={() => setLevelTwoFilterToggle(false)}
        isOpen={levelTwoFilterToggle}
        handleSearch={() => {
          setLevelTwoFilterToggle((prev) => false);
          setIsSearch(true);
          setPaginationModel({
            pageSize: 10,
            page: 0,
          });
        }}
        handleClearFilters={() => {
          setLevelTwoFilterToggle((prev) => false);
          if (state?.countryCodeOption != "" && state?.operatorOption == "") {
            setState((prevState) => ({
              ...prevState,
              // countryCodeTwoOption: "",
              operatorTwoOption: "",
            }));
          } else if (
            state?.countryCodeOption != "" &&
            state?.operatorOption != ""
          ) {
            setState((prevState) => ({
              ...prevState,
              // countryCodeTwoOption: "",
              // operatorTwoOption: "",
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              countryCodeTwoOption: "",
              operatorTwoOption: "",
            }));
          }
          setPaginationModel({
            pageSize: 10,
            page: 0,
          });
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">Country</span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() => {
                    if (state?.countryCodeOption == "") {
                      setState((prevState) => ({
                        ...prevState,
                        countryCodeTwoOption: "",
                        operatorTwoOption: "",
                      }));
                    }
                  }}
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              variant="standard"
              select
              value={state?.countryCodeTwoOption}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: "rgb(128 128 128)" }}>
                        Select...
                      </span>
                    );
                  }
                  const selectedOption = state.countryCodeTwoOptions?.find(
                    (option) => option?.value === selected
                  );
                  return selectedOption ? (
                    selectedOption.text
                  ) : (
                    <span style={{ color: "rgb(128 128 128)" }}>Select...</span>
                  );
                },
              }}
              disabled={state?.countryCodeOption != "" ? true : false}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  countryCodeTwoOption: e.target.value,
                  operatorTwoOption: "",
                }));
                getOperators(e.target.value);
              }}
            >
              {state?.countryCodeTwoOptions.map((option) => (
                <MenuItem key={option?.text} value={option?.value}>
                  {option?.text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <span className="mb-2 bold-font-style bold-color">
                  Operator
                </span>
              </Grid>
              <Grid
                item
                xs={6}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <span
                  onClick={() => {
                    if (
                      state?.countryCodeOption != "" &&
                      state?.operatorOption == ""
                    ) {
                      setState((prevState) => ({
                        ...prevState,
                        operatorTwoOption: "",
                      }));
                    } else if (
                      state?.countryCodeOption == "" &&
                      state?.operatorOption == ""
                    ) {
                      setState((prevState) => ({
                        ...prevState,
                        operatorTwoOption: "",
                      }));
                    }
                  }}
                  style={{ color: "#f00", cursor: "pointer" }}
                  className="mb-2"
                >
                  Clear
                </span>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              variant="standard"
              select
              disabled={
                !state?.countryCodeTwoOption || state?.operatorOption != ""
              }
              value={state?.operatorTwoOption}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: "rgb(128 128 128)" }}>
                        Select...
                      </span>
                    );
                  }
                  const selectedOption = state.operatorTwoOptions?.find(
                    (option) => option?.value === selected
                  );
                  return selectedOption ? (
                    selectedOption.text
                  ) : (
                    <span style={{ color: "rgb(128 128 128)" }}>Select...</span>
                  );
                },
              }}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  operatorTwoOption: e.target.value,
                }));
              }}
            >
              {state?.operatorTwoOptions.map((option) => (
                <MenuItem key={option?.text} value={option?.value}>
                  {option?.text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DynamicFilters>
    </>
  );
};

export default SMSService;
