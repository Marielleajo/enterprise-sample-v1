import { Add, Delete, Download, Edit, Lock } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import {
  BLOCK_ROUTE,
  DELETE_ROUTE,
  EXPORT_ALL_ROUTE,
  GET_ALL_PROVIDER,
  GET_ALL_ROUTE,
} from "../../../APIs/Routing";
import {
  GET_ALL_COUNTRIES_API,
  GET_ALL_CRITERIA_API,
} from "../../../APIs/Criteria";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import ManageRouting from "./ManageRouting";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import Swal from "sweetalert2";
import Notification from "../../../Components/Notification/Notification";
import { AsyncPaginate } from "react-select-async-paginate";
import GetActions from "../../Utils/GetActions";
import { useLocation } from "react-router-dom";

function Routing({ t }) {
  const location = useLocation();
  const [service, setService] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [clientCategoryOptions, setClientCategoryOptions] = useState([]);
  const [clientCategoryOption, setClientCategoryOption] = useState([]);
  const [manageEditRoute, setManageEditRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState([]);
  const [manageAddRoute, setManageAddRoute] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);
  const [countries, SetCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [operator, setOperator] = useState("");
  const [randomValue, setRandomValue] = useState("");
  const [provider, setProvider] = useState("");
  const [blockedOption, setBlockedOption] = useState("");
  const [lockedOption, setLockedOption] = useState("");
  const [mcc, setMCC] = useState("");
  const [mnc, setMNC] = useState("");
  const [reason, setReason] = useState("");
  const [reasonOptions, setReasonOptions] = useState(false);
  const [description, setDescription] = useState("");
  const [ModalOpenSwitchLock, setModalOpenSwitchLock] = useState(false);
  const [ModalOpenSwitchBlock, setModalOpenSwitchBlock] = useState(false);
  const [providerOptions, setProviderOptions] = useState([]);
  // const [serviceURL, setServiceURL] = useState("");
  const [blockedOptions, setblockedOptions] = useState([
    { label: "Blocked", value: "Block" },
    { label: "Unblocked", value: "Unblock" },
  ]);
  const [lockedOptions, setLockedOptions] = useState([
    { label: "Locked", value: "Lock" },
    { label: "Unlocked", value: "Unlock" },
  ]);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  let serviceURL = "";
  if (service == "sms") {
    serviceURL = "OneWay";
  } else if (service == "sms-two-way") {
    serviceURL = "TWO_WAY_SMS";
  } else if (service == "hlr") {
    serviceURL = service;
  } else if (service == "mnp") {
    serviceURL = service;
  } else if (service == "whatsapp") {
    serviceURL = "whatsapp";
  }

  const getAllRoutes = async () => {
    setLoading(true);

    try {
      let response = await GET_ALL_ROUTE({
        serviceURL,
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: clientCategoryOption ? clientCategoryOption : null,
        CountryGuid: country ? country : null,
        OperatorGuid: operator?.value ? operator?.value : null,
        Blocked: blockedOption
          ? blockedOption === "Block"
            ? true
            : false
          : null,
        Locked: lockedOption ? (lockedOption === "Lock" ? true : false) : null,
        Mcc: mcc ? mcc : null,
        Mnc: mnc ? mnc : null,
        ProviderGuid: provider?.value ? provider?.value : null,
      });
      const data =
        response?.data?.data?.data?.length > 0
          ? response?.data?.data?.data?.map((item) => ({
              ...item,
            }))
          : [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      SetData([]);
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLockUnlock = async () => {
    setLoading(true);
    try {
      let actionStatus = "";
      if (selectedRoute?.isLocked) {
        actionStatus = "Unlock";
      } else {
        actionStatus = "Lock";
      }

      let body = {
        recordGuid: selectedRoute?.recordGuid,
        ReasonGuid: reason,
        Description: description ? description : "",
      };

      let response = await BLOCK_ROUTE({
        postData: body,
        serviceURL,
        actionStatus,
      });
      if (response?.data?.success) {
        showSnackbar("Lock/Unlock Rate Successful!");
        setModalOpenSwitchLock(false);
        getAllRoutes();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async () => {
    setLoading(true);
    try {
      let actionStatus = "";
      if (selectedRoute?.isBlocked) {
        actionStatus = "Unblock";
      } else {
        actionStatus = "Block";
      }

      let body = {
        recordGuid: selectedRoute?.recordGuid,
        ReasonGuid: reason,
        Description: description ? description : "",
      };

      let response = await BLOCK_ROUTE({
        postData: body,
        serviceURL,
        actionStatus,
      });
      if (response?.data?.success) {
        showSnackbar("Block/Unblock Rate Successful!");
        setModalOpenSwitchBlock(false);
        getAllRoutes();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllReasons = async (type) => {
    setLoading(true);
    try {
      let response = await GET_ALL_CRITERIA_API({ type });
      const options = response?.data?.data?.criteria?.map((x, i) => ({
        label: x.name,
        value: x.recordGuid,
      }));
      setReasonOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/Route/${service}`;
    }
    setLoading(true);
    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
    getAllClientCategory();
    setLoading(false);
  }, [location.pathname]);

  const handleFilterReset = () => {
    setClientCategoryOption("");
    setCountry("");
    setOperator("");
    setProvider("");
    setMNC("");
    setMCC("");
    setBlockedOption("");
    setLockedOption("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  const getAllClientCategory = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS_CATEGORY({});
      const options = response?.data?.data?.clientCategory?.map((item) => ({
        value: item?.recordGuid,
        label: item?.clientCategoryDetails[0]?.name,
      }));
      setClientCategoryOptions(options);
    } catch (e) {
      console.log(e);
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportAllRoutes = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_ROUTE({
        serviceURL,
        token,
        search: "",
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: clientCategoryOption ? clientCategoryOption : null,
        CountryGuid: country ? country : null,
        OperatorGuid: operator?.value ? operator?.value : null,
        Blocked: blockedOption
          ? blockedOption === "Block"
            ? true
            : false
          : null,
        Locked: lockedOption ? (lockedOption === "Lock" ? true : false) : null,
        Mcc: mcc ? mcc : null,
        Mnc: mnc ? mnc : null,
        ProviderGuid: provider?.value ? provider?.value : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Routes.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const DeleteSelectedRows = async () => {
    const lockedItems = Data?.filter((item) => item?.isLocked === true);
    const lockedGuids = lockedItems.map((lockedItem) => lockedItem.recordGuid);

    // Check if all selected items are locked
    const areAllSelectedLocked = rowSelectionModel?.every((guid) =>
      lockedGuids.includes(guid)
    );

    if (areAllSelectedLocked) {
      showSnackbar("Can't Delete a Locked Route!", "error");
      return;
    }

    // Remove the locked items from the rowSelectionModel
    const updatedRowSelectionModel = rowSelectionModel?.filter(
      (guid) => !lockedGuids.includes(guid)
    );
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_ROUTE({
          formData: { RecordGuids: rowSelectionModel },
          serviceURL,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Routes Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllRoutes();
        setRowSelectionModel([]);
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  const DeleteRoute = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_ROUTE({
          formData: { RecordGuids: [value?.recordGuid] },
          serviceURL,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Route Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllRoutes();
        setRowSelectionModel([]);
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  const handleAddMangeRoute = () => {
    setManageAddRoute(true);
  };

  const handleEditMangeRoute = (data) => {
    setSelectedRoute(data);
    setManageEditRoute(true);
  };

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    }
  };

  const GetAllProviders = async () => {
    try {
      let response = await GET_ALL_PROVIDER({
        RecordGuid: serviceGuid,
      });
      setProviderOptions(response?.data?.data?.items);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: country,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
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

  useEffect(() => {
    GetAllCountries();
  }, []);

  useEffect(() => {
    if (serviceGuid && channelGuid) {
      getAllRoutes();
      GetAllProviders();
    }
  }, [serviceGuid, channelGuid, paginationModel]);

  const handleSwitchChangeSwitchLock = (data) => {
    setDescription("");
    setReason("");
    setReasonOptions(false);
    getAllReasons(
      data?.isLocked ? "ROUTING_UNLOCK_REASON" : "ROUTING_LOCK_REASON"
    );
    setModalOpenSwitchLock(!ModalOpenSwitchLock);
    setSelectedRoute(data);
  };

  const handleSwitchChangeSwitchBlock = (data) => {
    setDescription("");
    setReason("");
    setSelectedRoute(data);
    getAllReasons(
      data?.isBlocked ? "ROUTING_UNBLOCK_REASON" : "ROUTING_BLOCK_REASON"
    );
    setModalOpenSwitchBlock(!ModalOpenSwitchBlock);
  };

  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Grid item xs={12} md={4}>
                {/* <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">Routes</Typography>
                  <Typography className="breadcrumbactiveBtn">
                    {service?.length < 4
                      ? service?.toUpperCase()
                      : service
                          ?.split("-") // Split the string by hyphens
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize the first letter of each word
                          .join(" ")}
                  </Typography>
                </Breadcrumbs> */}
              </Grid>
              <Grid
                item
                xs={6}
                md={8}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                {rowSelectionModel?.length > 0 && (
                  <Button
                    className="mui-btn primary filled"
                    id="send-service-provider-id"
                    onClick={() => DeleteSelectedRows()}
                    startIcon={<DeleteIcon />}
                  >
                    Delete All
                  </Button>
                )}

                <Button
                  className="mui-btn primary outlined"
                  id="send-service-provider-id"
                  onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                >
                  <FilterAltIcon fontSize="small" />
                </Button>
                <Button
                  className="mui-btn grey filled"
                  id="send-service-provider-id"
                  onClick={() => exportAllRoutes()}
                  startIcon={<Download />}
                >
                  Export
                </Button>
                <Button
                  className="mui-btn primary filled"
                  id="send-service-provider-id"
                  onClick={() => handleAddMangeRoute()}
                  startIcon={<Add />}
                >
                  Add Route
                </Button>
              </Grid>

              {showAdvanceSearch && (
                <Grid item xs={12}>
                  <AdvancedSearch
                    showAdvanceSearch={showAdvanceSearch}
                    handleFilterReset={handleFilterReset}
                    handleFilterSearch={handleFilterSearch}
                    setShowAdvanceSearch={setShowAdvanceSearch}
                    body={
                      <>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="clientCategory-label">
                              Client Category
                            </InputLabel>
                            <Select
                              key="clientCategory"
                              id="clientCategory"
                              name="clientCategory"
                              label="clientCategory"
                              labelId="clientCategory-label"
                              onChange={(e) => {
                                setClientCategoryOption(e.target.value);
                                setRandomValue(Math.random());
                              }}
                              value={clientCategoryOption || ""}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {clientCategoryOptions?.map((item) => (
                                <MenuItem key={item?.value} value={item?.value}>
                                  {item?.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                              key="country"
                              id="country"
                              name="country"
                              label="Country"
                              labelId="country-label"
                              onChange={(e) => {
                                setCountry(e.target.value);
                                setRandomValue(Math.random());
                              }}
                              value={country}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {countries.map((country) => (
                                <MenuItem
                                  key={country.recordGuid}
                                  value={country.recordGuid}
                                >
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          {country != "" && country != undefined ? (
                            <InputLabel
                              sx={{ fontSize: "12px", marginBottom: "-5px" }}
                            >
                              Operator
                            </InputLabel>
                          ) : (
                            <InputLabel sx={{ marginTop: "10px" }} />
                          )}
                          <AsyncPaginate
                            key={randomValue}
                            id="async-menu-style"
                            onChange={(value) => {
                              setOperator(value);
                            }}
                            value={operator}
                            loadOptions={loadOperatorOptions}
                            additional={{
                              page: 1,
                            }}
                            isDisabled={country == "" || country == undefined}
                            placeholder="Operator"
                            classNamePrefix="react-select"
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: 150, // Adjust height as needed
                                overflow: "hidden", // Hide scrollbar
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: 150, // Adjust height as needed
                                overflowY: "auto", // Enable vertical scroll if needed
                              }),
                            }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="country-label">Provider</InputLabel>
                            <Select
                              key="provider"
                              id="provider"
                              name="provider"
                              label="Provider"
                              labelId="provider-label"
                              onChange={(e) => {
                                setProvider(e.target.value);
                              }}
                              value={provider}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {providerOptions.map((item) => (
                                <MenuItem
                                  key={item.recordGuid}
                                  value={item.recordGuid}
                                >
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <TextField
                              key={"mnc"}
                              fullWidth
                              id={"mnc"}
                              name={"mnc"}
                              label="Search by MNC Number"
                              variant="standard"
                              type="text"
                              value={mnc}
                              onChange={(e) => setMNC(e?.target?.value)}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <TextField
                              key={"mcc"}
                              fullWidth
                              id={"mcc"}
                              name={"mcc"}
                              label="Search by MCC Number"
                              variant="standard"
                              type="text"
                              value={mcc}
                              onChange={(e) => setMCC(e?.target?.value)}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="country-label">Block</InputLabel>
                            <Select
                              key="blockedOption"
                              id="blockedOption"
                              name="blockedOption"
                              label="Block"
                              labelId="blockedOption-label"
                              onChange={(e) => {
                                setBlockedOption(e.target.value);
                              }}
                              value={blockedOption}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {blockedOptions.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="country-label">Lock</InputLabel>
                            <Select
                              key="lockedOption"
                              id="lockedOption"
                              name="lockedOption"
                              label="Lock"
                              labelId="lockedOption-label"
                              onChange={(e) => {
                                setLockedOption(e.target.value);
                              }}
                              value={lockedOption}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {lockedOptions.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    }
                  />
                </Grid>
              )}
              <Grid item xs={12} marginTop={2}>
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "clientCategoryName",
                      headerName: "Client Category",
                      flex: 1,
                      minWidth: 200,
                    },
                    {
                      field: "operatorName",
                      headerName: "Operator",
                      flex: 1,
                      minWidth: 200,
                    },
                    {
                      field: "countryName",
                      headerName: "Country",
                      flex: 1,
                      minWidth: 100,
                    },
                    {
                      field: "providerName",
                      headerName: "Provider",
                      flex: 1,
                      minWidth: 100,
                    },
                    {
                      field: "mnc",
                      headerName: "MNC",
                      flex: 1,
                      minWidth: 100,
                    },
                    {
                      field: "mcc",
                      headerName: "MCC",
                      flex: 1,
                      minWidth: 100,
                    },
                    {
                      headerName: "Block",
                      field: "isBlocked",
                      minWidth: 100,

                      renderCell: (params) => {
                        return (
                          !params?.row?.isLocked && (
                            <Box
                              direction="row"
                              sx={{
                                display: "flex",
                                justifyContent: "left",
                                alignItems: "left",
                                width: "100%",
                              }}
                              spacing={2}
                            >
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={params?.row?.isBlocked}
                                    onChange={() =>
                                      handleSwitchChangeSwitchBlock(params.row)
                                    }
                                  />
                                }
                              />
                            </Box>
                          )
                        );
                      },
                      flex: 1,
                    },
                    {
                      headerName: "Lock",
                      field: "isLocked",
                      minWidth: 100,

                      renderCell: (params) => {
                        return (
                          <Box
                            direction="row"
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                            spacing={2}
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={params?.row?.isLocked}
                                  onChange={() =>
                                    handleSwitchChangeSwitchLock(params.row)
                                  }
                                />
                              }
                            />
                          </Box>
                        );
                      },
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      cellClassName: "actions-cell",

                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                          >
                            {!params?.row?.isLocked && (
                              <Box>
                                <Tooltip title="Edit Route">
                                  <IconButton
                                    onClick={() =>
                                      handleEditMangeRoute(params?.row)
                                    }
                                    size="small"
                                    id="editRoute"
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Route">
                                  <IconButton
                                    onClick={() => DeleteRoute(params?.row)}
                                    size="small"
                                    id="deleteRoute"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )}
                            {params?.row?.isLocked && (
                              <Tooltip title="Locked Route">
                                <IconButton size="small" id="LockedRoute">
                                  <Lock />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        );
                      },
                    },
                  ]}
                  data={Data}
                  loading={loading}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  totalRows={totalRows}
                  rowSelectionModel={rowSelectionModel}
                  setRowSelectionModel={setRowSelectionModel}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddRoute && (
          <MuiModal
            title="Add Route"
            open={manageAddRoute}
            width="500px"
            id="edit-contact-form"
            handleClose={() => setManageAddRoute(false)}
          >
            <ManageRouting
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddRoute={setManageAddRoute}
              clientCategoryOptions={clientCategoryOptions}
              serviceGuid={serviceGuid}
              channelGuid={channelGuid}
              getAllRoutes={getAllRoutes}
              serviceURL={serviceURL}
            />
          </MuiModal>
        )}

        {manageEditRoute && (
          <MuiModal
            title="Edit Route"
            open={manageEditRoute}
            width="500px"
            id="edit-contact-form"
            handleClose={() => setManageEditRoute(false)}
          >
            <ManageRouting
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageAddRoute={setManageEditRoute}
              clientCategoryOptions={clientCategoryOptions}
              serviceGuid={serviceGuid}
              channelGuid={channelGuid}
              getAllRoutes={getAllRoutes}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
              serviceURL={serviceURL}
            />
          </MuiModal>
        )}

        {ModalOpenSwitchLock && (
          <MuiModal
            title={selectedRoute?.isLocked ? "Unlock Rate" : "Lock Rate"}
            open={ModalOpenSwitchLock}
            width="500px"
            id="edit-contact-form"
            handleClose={() => setModalOpenSwitchLock(false)}
          >
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="clientCategory-label">
                    {selectedRoute?.isLocked
                      ? "Please select reason of Unlock"
                      : "Please select reason of Lock"}
                  </InputLabel>
                  <Select
                    key="reason"
                    id="reason"
                    name="reason"
                    label={
                      selectedRoute?.isLocked
                        ? "Please select reason of Unlock"
                        : "Please select reason of Lock"
                    }
                    labelId="reason-label"
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                    value={reason || ""}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {reasonOptions.length > 0 &&
                      reasonOptions?.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              {reason == "" && (
                <Grid item xs={12} mt={2}>
                  <InputLabel
                    id="clientCategory-label"
                    style={{ color: "#c41035", fontSize: "12px" }}
                  >
                    {selectedRoute?.isLocked
                      ? "Please select reason of Unlock"
                      : "Please select reason of Lock"}
                  </InputLabel>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{ marginTop: "20px" }}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  onClick={() => handleLockUnlock()}
                  className="mui-btn primary filled"
                  id="add-rate"
                  disabled={loading || reason == ""}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </MuiModal>
        )}

        {ModalOpenSwitchBlock && (
          <MuiModal
            title={selectedRoute?.isBlocked ? "Unblock" : "Block"}
            open={ModalOpenSwitchBlock}
            width="500px"
            id="edit-contact-form"
            handleClose={() => setModalOpenSwitchBlock(false)}
          >
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="clientCategory-label">
                    {selectedRoute?.isBlocked
                      ? "Please select reason of Unblock"
                      : "Please select reason of Block"}
                  </InputLabel>
                  <Select
                    key="reason"
                    id="reason"
                    name="reason"
                    label={
                      selectedRoute?.isBlocked
                        ? "Please select reason of Unblock"
                        : "Please select reason of Block"
                    }
                    labelId="reason-label"
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                    value={reason || ""}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {reasonOptions.length > 0 &&
                      reasonOptions?.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              {reason == "" && (
                <Grid item xs={12} mt={2}>
                  <InputLabel
                    id="clientCategory-label"
                    style={{ color: "#c41035", fontSize: "12px" }}
                  >
                    {selectedRoute?.isBlocked
                      ? "Please select reason of Unblock"
                      : "Please select reason of Block"}
                  </InputLabel>
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{ marginTop: "20px" }}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  onClick={() => handleBlockUnblock()}
                  className="mui-btn primary filled"
                  id="add-rate"
                  disabled={loading || reason == ""}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </MuiModal>
        )}
      </Box>
    </>
  );
}

export default withTranslation("translations")(GetActions(Routing));
