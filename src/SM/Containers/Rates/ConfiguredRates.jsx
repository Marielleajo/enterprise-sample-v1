import { Add, Delete, Download, Edit, Upload } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  GET_ALL_COUNTRIES_API,
  GET_ALL_CRITERIA_API,
} from "../../../APIs/Criteria";
import {
  ADD_LOCK_UNLOCK,
  DELETE_RATES,
  EXPORT_ALL_RATES,
  GET_ALL_RATES,
  IMPORT_RATE,
  IMPORT_RATE_WHATSAPP,
} from "../../../APIs/Rates";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import DropZone from "../../../Components/DropZone";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageRates from "./ManageRates";
import Sample from "./rate_plan_sample.xlsx";
import WhatsappSample from "./rate_plan_country_sample.xlsx";
import { GET_ALL_OPERATION } from "../../../APIs/ProfitLoss";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import { AsyncPaginate } from "react-select-async-paginate";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import { useLocation } from "react-router-dom";

function ConfiguredRates({ t }) {
  const theme = useTheme();
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
  const [manageAddRate, setManageAddRate] = useState(false);
  const [manageEditRate, setManageEditRate] = useState(false);
  const [importRate, setImportRate] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [clientCategoryOptions, setClientCategoryOptions] = useState([]);
  const [clientCategoryOption, setClientCategoryOption] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [operationTypeOptions, setOperationTypeOptions] = useState([]);
  const [operator, setOperator] = useState("");
  const [operation, setOperation] = useState("");
  const [selectedRate, setSelectedRate] = useState([]);
  const [randomValue, setRandomValue] = useState("");
  const [file, setFile] = useState({
    file: null,
    fileName: "",
  });
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);

  const [reason, setReason] = useState("");
  const [reasonOptions, setReasonOptions] = useState(false);
  const [description, setDescription] = useState("");
  const [isModalOpenSwitchLock, setModalOpenSwitchLock] = useState(false);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  const [confirmedFilters, setConfirmedFilters] = useState({
    ClientCategoryGuid: null,
    CountryGuid: null,
    OperatorGuid: null,
    OperationType: null,
  });

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/rate/${service}`;
    }

    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
  }, [location]);

  useEffect(() => {
    if (serviceTag == "WHATSAPP") {
      getAllOperation();
    }
  }, [serviceTag]);

  const getAllOperation = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATION();
      const options = response?.data?.data?.criteria?.map((item) => ({
        value: item?.recordGuid,
        label: item?.name,
      }));
      setOperationTypeOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterReset = () => {
    setClientCategoryOption("");
    setCountry("");
    if (serviceTag !== "WHATSAPP") setOperator("");
    if (serviceTag === "WHATSAPP") setOperation("");
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
    setConfirmedFilters({
      ClientCategoryGuid: null,
      CountryGuid: null,
      OperatorGuid: null,
      OperationType: null,
    });
  };

  const handleFilterSearch = () => {
    setConfirmedFilters({
      ClientCategoryGuid: clientCategoryOption?.value || null,
      CountryGuid: country || null,
      OperatorGuid: (serviceTag !== "WHATSAPP" && operator?.value) || null,
      OperationType:
        serviceTag === "WHATSAPP" && operation?.label
          ? operation.label.toUpperCase()
          : null,
    });
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  const handleAddMangeRate = () => {
    setManageAddRate(true);
  };

  const handleEditMangeRate = (data) => {
    setSelectedRate(data);
    setManageEditRate(true);
  };

  const handleImportRate = () => {
    setImportRate(true);
    formik?.handleReset();
    setFile({
      file: null,
      fileName: "",
    });
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
        const deleteResponses = await DELETE_RATES({
          formData: { RecordGuids: updatedRowSelectionModel },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: deleteResponses?.data?.message,
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
        getAllRates();
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

  const DeleteRate = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_RATES({
          formData: { RecordGuids: [value?.recordGuid] },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: deleteResponses?.data?.message,
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
        getAllRates();
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

  const loadClientCategoryOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_CLIENTS_CATEGORY({
        pageNumber: page,
        pageSize: 5,
        search,
      });
      const options = response?.data?.data?.clientCategory?.map((item) => ({
        value: item?.recordGuid,
        label: item?.clientCategoryDetails[0]?.name,
      }));

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.clientCategory?.length <
        response?.data?.data?.totalRows;

      return {
        options: options,
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

  const handleSwitchChangeSwitchLock = (data) => {
    setDescription("");
    setReason("");
    setSelectedRate(data);
    getAllReasons(
      data?.isLocked
        ? "BILLING_RATE_PLAN_UNLOCK_REASONS"
        : "BILLING_RATE_PLAN_LOCK_REASONS"
    );
    setModalOpenSwitchLock(!isModalOpenSwitchLock);
  };

  const handleLockUnlock = async () => {
    setLoading(true);
    try {
      let body = {
        RatePlantGuid: selectedRate?.recordGuid,
        LockRatePlan: !selectedRate?.isLocked,
        LockReasonGuid: reason ? reason : description,
      };

      let response = await ADD_LOCK_UNLOCK({ postData: body });
      if (response?.data?.success) {
        showSnackbar("Lock/Unlock Rate Successful!");
        setModalOpenSwitchLock(false);
        getAllRates();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadOperationOptions = async (search, loadedOptions, { page }) => {
    return {
      options: operationTypeOptions,
      hasMore: false, // Assuming no pagination needed for operation types
    };
  };

  const handleModalCloseSwitchLock = () => {
    setModalOpenSwitchLock(false);
  };

  const getAllRates = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_RATES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: clientCategoryOption
          ? clientCategoryOption?.value
          : null,
        CountryGuid: country ? country.value : null,
        OperatorGuid: operator?.value,
        operationTag: operation?.label?.toUpperCase(),
      });

      const data =
        response?.data?.data?.ratePlans?.length > 0
          ? response?.data?.data?.ratePlans?.map((item) => ({
              ...item,
            }))
          : [];

      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportAllRates = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_RATES({
        token,
        search: "",
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: confirmedFilters.ClientCategoryGuid,
        CountryGuid: confirmedFilters.CountryGuid,
        OperatorGuid: confirmedFilters.OperatorGuid,
        OperationType: confirmedFilters.OperationType,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Rates.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      clientCategory: null,
      operationType: "",
      file: null,
    },
    validationSchema:
      serviceTag == "WHATSAPP"
        ? Yup.object().shape({
            clientCategory: Yup.object().required(
              "Client Category is required"
            ),
            operationType: Yup.string().required("Operation type is required"),
          })
        : Yup.object().shape({
            clientCategory: Yup.object().required(
              "Client Category is required"
            ),
          }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("RatesFile", file?.file);
        formData.append("channelGuid", channelGuid);
        formData.append("serviceGuid", serviceGuid);
        formData.append("ClientCategoryGuid", values?.clientCategory?.value);
        let response = [];
        if (service == "whatsapp") {
          formData.append("OperationTypeGuid", values?.operationType);
          response = await IMPORT_RATE_WHATSAPP({
            formData,
          });
        } else {
          response = await IMPORT_RATE({
            formData,
          });
        }

        if (response?.data?.success) {
          setImportRate(false);
          showSnackbar(response?.data?.message ?? "");
          getAllRates();
          setLoading(false);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  // Get all countries
  // const GetAllCountries = async () => {
  //   try {
  //     let countriesResponse = await GET_ALL_COUNTRIES_API({});
  //     setCountries(countriesResponse?.data?.data?.countries);
  //   } catch (e) {
  //     Notification.error(e);
  //   }
  // };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: country.value,
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
    if (serviceGuid && channelGuid) {
      getAllRates();
      // GetAllCountries();
    }
  }, [serviceGuid, channelGuid, paginationModel]);

  return (
    <>
      <Grid item xs={12} className="sub_section_container">
        <Grid
          container
          className=""
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Grid item xs={12} md={4}></Grid>
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
                id="delete-rate"
                onClick={() => DeleteSelectedRows()}
                startIcon={<DeleteIcon />}
              >
                Delete All
              </Button>
            )}
            <Button
              className="mui-btn grey filled"
              id="export-rate"
              onClick={() => exportAllRates()}
              startIcon={<Download />}
            >
              Export
            </Button>
            <Button
              className="mui-btn grey filled"
              id="import-rate"
              onClick={() => handleImportRate()}
              startIcon={<Upload />}
            >
              Import
            </Button>
            <Button
              className="mui-btn primary filled"
              id="add-rate"
              onClick={() => handleAddMangeRate()}
              startIcon={<Add />}
            >
              Add Rate
            </Button>
            <Button
              className="mui-btn primary filled"
              id="filter-rates"
              onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
            >
              <FilterAltIcon fontSize="small" />
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
                    <Grid item xs={4}>
                      {/* {clientCategoryOption != "" &&
                      clientCategoryOption != undefined ? (
                        <InputLabel
                          sx={{ fontSize: "12px", marginBottom: "-5px" }}
                        >
                          Client Category
                        </InputLabel>
                      ) : (
                        <InputLabel sx={{ marginTop: "10px" }} />
                      )}
                      <AsyncPaginate
                        id="async-menu-style"
                        onChange={(value) => {
                          setClientCategoryOption(value);
                          setRandomValue(Math.random());
                        }}
                        value={clientCategoryOption || ""}
                        loadOptions={loadClientCategoryOptions}
                        additional={{
                          page: 1,
                        }}
                        placeholder="Client Category"
                        classNamePrefix="react-select"
                      /> */}
                      <CustomAsyncPaginate
                        apiFunction={GET_ALL_CLIENTS_CATEGORY}
                        onChange={(value) => {
                          setClientCategoryOption(value);
                          setRandomValue(Math.random());
                        }}
                        value={clientCategoryOption || ""}
                        placeholder="Client Category"
                        pageSize={10}
                        dataPath="data.data.clientCategory" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                        isNested
                        labelPath={"clientCategoryDetails"}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomAsyncPaginate
                        apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                        value={country}
                        onChange={(value) => {
                          setCountry(value);
                          console.log(value);
                          serviceTag !== "WHATSAPP" && setOperator("");
                          setRandomValue(Math.random());
                        }}
                        placeholder="Country *"
                        pageSize={10}
                        dataPath="data.data.countries" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      {/* {formik.values.country != "" &&
                      formik.values.country != undefined ? (
                        <InputLabel
                          sx={{ fontSize: "12px", marginBottom: "-5px" }}
                        >
                          {serviceTag == "WHATSAPP"
                            ? "Operation Type"
                            : "Operator"}
                        </InputLabel>
                      ) : (
                        <InputLabel sx={{ marginTop: "10px" }} />
                      )}
                      <AsyncPaginate
                        key={randomValue}
                        id="async-menu-style"
                        onChange={(value) => {
                          serviceTag === "WHATSAPP"
                            ? setOperation(value)
                            : setOperator(value);
                        }}
                        value={serviceTag === "WHATSAPP" ? operation : operator}
                        loadOptions={
                          serviceTag === "WHATSAPP"
                            ? loadOperationOptions
                            : loadOperatorOptions
                        }
                        additional={{
                          page: 1,
                        }}
                        isDisabled={
                          serviceTag !== "WHATSAPP" &&
                          (country == "" || country == undefined)
                        }
                        placeholder={
                          serviceTag == "WHATSAPP"
                            ? "Operation Type"
                            : "Operator"
                        }
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
                      /> */}
                      <CustomAsyncPaginate
                        key={randomValue}
                        apiFunction={
                          serviceTag === "WHATSAPP"
                            ? GET_ALL_OPERATION
                            : GET_OPERATORS
                        }
                        onChange={(value) => {
                          serviceTag === "WHATSAPP"
                            ? setOperation(value)
                            : setOperator(value);
                        }}
                        value={serviceTag === "WHATSAPP" ? operation : operator}
                        isDisabled={
                          serviceTag !== "WHATSAPP" &&
                          (country == "" || country == undefined)
                        }
                        placeholder={
                          serviceTag == "WHATSAPP"
                            ? "Operation Type"
                            : "Operator"
                        }
                        pageSize={10}
                        dataPath={
                          serviceTag === "WHATSAPP"
                            ? "data.data.criteria"
                            : "data.data.items"
                        }
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                        params={{ iso: country?.value }}
                      />
                    </Grid>
                  </>
                }
              />
            </Grid>
          )}
          <Grid item xs={12} marginTop={2}>
            {service == "whatsapp" && (
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "clientCategoryName",
                    headerName: "Client Category",
                    flex: 1,
                  },
                  {
                    field: "countryCode",
                    headerName: "Country ISO",
                    flex: 1,
                  },
                  {
                    field: "country",
                    headerName: "Country",
                    flex: 1,
                  },
                  {
                    field: "operationTypeTag",
                    headerName: "Operation Type",
                    flex: 1,
                  },
                  {
                    field: "rate",
                    headerName: "Rate",
                    flex: 1,
                  },
                  {
                    headerName: "Lock",
                    field: "isLocked",
                    minWidth: 100,

                    renderCell: (params) => {
                      const rowId = params.row.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
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
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 1,
                    renderCell: (params) => {
                      if (!params?.row?.isLocked) {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                          >
                            <Tooltip title="Edit Rate">
                              <IconButton
                                onClick={() => handleEditMangeRate(params?.row)}
                                size="small"
                                id="editRate"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Rate">
                              <IconButton
                                onClick={() => DeleteRate(params?.row)}
                                size="small"
                                id="deleteRate"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        );
                      }
                      return null;
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
            )}
            {service != "whatsapp" && (
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "clientCategoryName",
                    headerName: "Client Category",
                    flex: 1,
                  },
                  {
                    field: "countryCode",
                    headerName: "Country ISO",
                    flex: 1,
                  },
                  {
                    field: "country",
                    headerName: "Country",
                    flex: 1,
                  },
                  {
                    field: "operator",
                    headerName: "Operator",
                    flex: 1,
                  },
                  {
                    field: "rate",
                    headerName: "Rate",
                    flex: 1,
                  },
                  {
                    headerName: "Lock",
                    field: "isLocked",
                    minWidth: 100,

                    renderCell: (params) => {
                      const rowId = params.row.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
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
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 1,
                    renderCell: (params) => {
                      if (!params?.row?.isLocked) {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                            }}
                          >
                            <Tooltip title="Edit Rate">
                              <IconButton
                                onClick={() => handleEditMangeRate(params?.row)}
                                size="small"
                                id="editRate"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Rate">
                              <IconButton
                                onClick={() => DeleteRate(params?.row)}
                                size="small"
                                id="deleteRate"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        );
                      }
                      return null;
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
            )}
          </Grid>
        </Grid>
      </Grid>

      {manageAddRate && (
        <MuiModal
          title="Add Rate"
          open={manageAddRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddRate(false)}
        >
          <ManageRates
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddRate={setManageAddRate}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllRates={getAllRates}
          />
        </MuiModal>
      )}

      {manageEditRate && (
        <MuiModal
          title="Edit Rate"
          open={manageEditRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditRate(false)}
        >
          <ManageRates
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddRate={setManageEditRate}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllRates={getAllRates}
            selectedRate={selectedRate}
            setSelectedRate={setSelectedRate}
          />
        </MuiModal>
      )}

      {importRate && (
        <MuiModal
          title="import File"
          open={importRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setImportRate(false)}
        >
          <Grid item xs={12}>
            {formik?.values?.clientCategory != "" &&
            formik?.values?.clientCategory != undefined ? (
              <InputLabel sx={{ fontSize: "12px", marginBottom: "-5px" }}>
                Client Category
              </InputLabel>
            ) : (
              <InputLabel sx={{ marginTop: "10px" }} />
            )}
            <AsyncPaginate
              id="async-menu-style"
              value={formik?.values?.clientCategory || ""}
              onChange={(value) => {
                formik?.setFieldValue("clientCategory", value);
                setRandomValue(Math.random());
              }}
              loadOptions={loadClientCategoryOptions}
              additional={{
                page: 1,
              }}
              placeholder="Client Category"
              classNamePrefix="react-select"
            />
            {formik?.touched?.clientCategory &&
              formik?.errors?.clientCategory && (
                <FormHelperText style={{ color: "red" }}>
                  {formik?.errors?.clientCategory}
                </FormHelperText>
              )}
          </Grid>
          {service == "whatsapp" && (
            <Grid item xs={12} mt={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel
                  id="operationType-label"
                  error={
                    formik.touched["operationType"] &&
                    Boolean(formik.errors["operationType"])
                  }
                >
                  Operation Type*
                </InputLabel>
                <Select
                  key="operationType"
                  id="operationType"
                  name="operationType"
                  label="Operation Type"
                  labelId="operationType-label"
                  value={formik.values.operationType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.operationType &&
                    Boolean(formik.errors.operationType)
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {operationTypeOptions?.map((item) => (
                    <MenuItem key={item?.value} value={item?.value}>
                      {item?.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.operationType &&
                  formik.errors.operationType && (
                    <FormHelperText
                      style={{ color: theme?.palette?.error?.main }}
                    >
                      {formik.errors.operationType}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>
          )}
          <Grid item md={12} mt={3}>
            <DropZone
              onUpload={async (acceptedFiles, fileRejections) => {
                setFile({
                  file: acceptedFiles[0],
                  fileName: acceptedFiles[0]?.name,
                });
              }}
              accept={".xls, .xlsx"}
              fileUploaded={file?.fileName}
            />
            {!file && (
              <FormHelperText style={{ color: "red" }}>
                {"File is required!"}
              </FormHelperText>
            )}
          </Grid>
          <Grid item md={12} className="mb-2 d-flex justify-content-end">
            <a href={service != "whatsapp" ? Sample : WhatsappSample}>
              Download Sample
            </a>
          </Grid>
          <Grid container justifyContent="between" className="my-3">
            <Button
              className="mui-btn secondary outlined"
              onClick={() => setImportRate(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              className="mui-btn primary filled"
              disabled={loading}
              onClick={formik?.handleSubmit}
            >
              {loading ? t("Loading...") : t("Confirm")}
            </Button>
          </Grid>
        </MuiModal>
      )}

      {isModalOpenSwitchLock && (
        <MuiModal
          title={selectedRate?.isLocked ? "Unlock Rate" : "Lock Rate"}
          open={isModalOpenSwitchLock}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setModalOpenSwitchLock(false)}
        >
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth variant="standard">
                <InputLabel id="clientCategory-label">
                  {selectedRate?.isLocked
                    ? "Please select reason of Unlock"
                    : "Please select reason of Lock"}
                </InputLabel>
                <Select
                  key="reason"
                  id="reason"
                  name="reason"
                  label={
                    selectedRate?.isLocked
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
                disabled={loading}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </MuiModal>
      )}
    </>
  );
}

export default withTranslation("translations")(ConfiguredRates);
