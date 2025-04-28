import { Add, Delete, Download, Edit, Upload } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AsyncPaginate } from "react-select-async-paginate";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { GET_PROVIDERS_BY_SERVICE } from "../../../APIs/Clients";
import {
  DELETE_COSTS,
  EXPORT_ALL_COSTS,
  GET_ALL_COSTS,
  GET_ALL_PROVIDERS_CATEGORY,
  IMPORT_COST,
  IMPORT_COST_WHATSAPP,
} from "../../../APIs/Costs";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import { GET_ALL_OPERATION } from "../../../APIs/ProfitLoss";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import DropZone from "../../../Components/DropZone";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import Sample from "./cost_plan_sample.xlsx";
import WhatsappSample from "./cost_plan_whatsapp_sample.xlsx";
import ManageCost from "./ManageCost";

function Cost({ t }) {
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
  const [country, setCountry] = useState("");
  const [countries, SetCountries] = useState([]);
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddCost, setManageAddCost] = useState(false);
  const [manageEditCost, setManageEditCost] = useState(false);
  const [importCost, setImportCost] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [providerCategoryOptions, setProviderCategoryOptions] = useState([]);
  const [providerCategoryOption, setProviderCategoryOption] = useState([]);
  const [provider, setProvider] = useState([]);
  const [selectedCost, setSelectedCost] = useState([]);
  const [operation, setOperation] = useState("");
  const [operationTypeOptions, setOperationTypeOptions] = useState([]);
  const [operator, setOperator] = useState("");
  const [randomValue, setRandomValue] = useState("");
  const [file, setFile] = useState({
    file: null,
    fileName: "",
  });
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  const [confirmedFilters, setConfirmedFilters] = useState({
    ProviderCategoryGuid: null,
    CountryGuid: null,
    OperatorGuid: null,
    ProviderGuid: null,
    OperationType: null,
  });

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/cost/${service}`;
    }
    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
    // getAllProvidersCategory();
  }, [location]);

  useEffect(() => {
    if (serviceGuid && channelGuid) {
      getAllCosts();
    }
  }, [serviceGuid, channelGuid, paginationModel]);
  const formik = useFormik({
    initialValues: {
      providerCategory: "",
      provider: "",
      file: null,
    },
    validationSchema: Yup.object().shape({
      providerCategory: Yup.object().required("Provider Category is required"),
      provider: Yup.object().required("Provider is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("costsFile", file?.file);
        formData.append("channelGuid", channelGuid);
        formData.append("serviceGuid", serviceGuid);
        formData.append(
          "providerCategoryGuid",
          values?.providerCategory?.value
        );
        formData.append("providerGuid", values?.provider?.value);
        let response = [];
        if (service == "whatsapp") {
          response = await IMPORT_COST_WHATSAPP({
            formData,
          });
        } else {
          response = await IMPORT_COST({
            formData,
          });
        }

        if (response?.data?.success) {
          setImportCost(false);
          showSnackbar(response?.data?.message);
          getAllCosts();
          setLoading(false);
        } else {
          showSnackbar(response?.data?.message, "error");
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFilterReset = () => {
    setProviderCategoryOption("");
    setCountry("");
    setProvider("");
    serviceTag === "ONE_WAY_SMS" && setOperator("");
    if (serviceTag === "WHATSAPP") setOperation("");
    setPaginationModel({ pageSize: 10, page: 0 });
    setConfirmedFilters({
      ProviderCategoryGuid: null,
      CountryGuid: null,
      OperatorGuid: null,
      ProviderGuid: null,
      OperationType: null,
    });
  };

  const handleFilterSearch = () => {
    if (providerCategoryOption && !provider) {
      showSnackbar("Please Select a Provider!", "error");
    } else {
      setConfirmedFilters({
        ProviderCategoryGuid: providerCategoryOption.value || null,
        CountryGuid: country || null,
        OperatorGuid: serviceTag === "ONE_WAY_SMS" ? operator?.value : null,
        ProviderGuid: provider?.value || null,
        OperationType:
          serviceTag === "WHATSAPP" && operation?.label
            ? operation.label.toUpperCase()
            : null,
      });
      setPaginationModel({
        pageSize: 10,
        page: 0,
      });
    }
  };

  const handleAddMangeCost = () => {
    setManageAddCost(true);
  };

  const handleEditMangeCost = (data) => {
    setSelectedCost(data);
    setManageEditCost(true);
  };

  const handleImportCost = () => {
    setImportCost(true);
    formik?.handleReset();
    setFile({
      file: null,
      fileName: "",
    });
  };

  const DeleteSelectedRows = async () => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_COSTS({
          formData: { RecordGuids: rowSelectionModel },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Costs Deleted Successfully",
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
        getAllCosts();
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

  const DeleteCost = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_COSTS({
          formData: { RecordGuids: [value?.recordGuid] },
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Cost Deleted Successfully",
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
        getAllCosts();
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

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_PROVIDERS_CATEGORY({
        pageNumber: page,
        pageSize: 5,
        search,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.providerCategories?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.providerCategories?.map((item) => ({
          value: item?.recordGuid,
          label: item?.providerCategoryDetails[0]?.name,
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
  const loadProviderOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        token,
        pageNumber: page,
        pageSize: 10,
        search: search,
        typeTag: "",
        RecordGuid: serviceGuid ? serviceGuid : "undefined",
        ProviderCategoryGuid: providerCategoryOption.value,
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

  const getAllCosts = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_COSTS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ProviderCategoryGuid: providerCategoryOption
          ? providerCategoryOption.value
          : null,
        CountryGuid: country ? country.value : null,
        OperatorGuid: serviceTag === "ONE_WAY_SMS" ? operator?.value : null,
        ProviderGuid: provider?.value ? provider?.value : null,
        operationTag: operation?.label?.toUpperCase(),
      });
      const data =
        response?.data?.data?.costPlans?.length > 0
          ? response?.data?.data?.costPlans?.map((item) => ({
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

  const exportAllCosts = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_COSTS({
        token,
        search: "",
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ProviderCategoryGuid: confirmedFilters.ProviderCategoryGuid,
        ProviderGuid: confirmedFilters.ProviderGuid,
        CountryGuid: confirmedFilters.CountryGuid,
        OperatorGuid: confirmedFilters.OperatorGuid,
        OperationType: confirmedFilters.OperationType,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Costs.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadImportProviderOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        token,
        pageNumber: page,
        pageSize: 10,
        search: search,
        typeTag: "",
        RecordGuid: serviceGuid ? serviceGuid : "undefined",
        ProviderCategoryGuid: recordGuid
          ? recordGuid
          : formik?.values?.providerCategory?.value,
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

  const loadOperationOptions = async (search, loadedOptions, { page }) => {
    return {
      options: operationTypeOptions,
      hasMore: false, // Assuming no pagination needed for operation types
    };
  };

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
    if (serviceTag == "WHATSAPP") {
      getAllOperation();
    }
  }, [serviceTag]);

  return (
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
            <Grid
              item
              xs={12}
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
                onClick={() => exportAllCosts()}
                startIcon={<Download />}
              >
                Export
              </Button>

              <Button
                className="mui-btn grey filled"
                id="send-service-provider-id"
                onClick={() => handleImportCost()}
                startIcon={<Upload />}
              >
                Import
              </Button>
              <Button
                className="mui-btn primary filled"
                id="send-service-provider-id"
                onClick={() => handleAddMangeCost()}
                startIcon={<Add />}
              >
                Add Cost
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
                      <Grid item xs={6}>
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_PROVIDERS_CATEGORY} // Pass the function directly
                          value={providerCategoryOption || ""}
                          onChange={(value) => {
                            setProviderCategoryOption(value);
                            setProvider(null);
                            setRandomValue(Math.random());
                          }}
                          placeholder="Provider Category *"
                          pageSize={10}
                          dataPath="data.data.providerCategories" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
                          isNested
                          labelPath={"providerCategoryDetails"}
                        />
                      </Grid>

                      <Grid item xs={6} key={randomValue}>
                        <CustomAsyncPaginate
                          key={randomValue}
                          apiFunction={GET_PROVIDERS_BY_SERVICE} // Pass the function directly
                          value={provider}
                          onChange={(value) => {
                            setProvider(value);
                          }}
                          isDisabled={
                            providerCategoryOption == "" ||
                            providerCategoryOption == undefined
                          }
                          placeholder="Provider"
                          pageSize={10}
                          dataPath="data.data.items" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
                          params={{
                            token,

                            typeTag: "",
                            RecordGuid: serviceGuid ? serviceGuid : "undefined",
                            ProviderCategoryGuid: providerCategoryOption.value,
                          }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        {/* <FormControl fullWidth variant="standard">
                          <InputLabel>Country</InputLabel>
                          <Select
                            key="country"
                            id="country" // Add an id for accessibility
                            name="country" // Name should match the field name in initialValues
                            value={country}
                            onChange={(e) => {
                              setCountry(e?.target?.value);
                              setOperator("");
                              setRandomValue(Math.random());
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {countries?.map((country) => (
                              <MenuItem
                                key={country?.recordGuid}
                                value={country?.recordGuid}
                              >
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                          value={country}
                          onChange={(value) => {
                            setCountry(value);
                            setOperator("");
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

                      {service === "sms" && (
                        <Grid item xs={6}>
                          {/* {country != "" ? (
                            <InputLabel sx={{ fontSize: "12px" }}>
                              Operator
                            </InputLabel>
                          ) : (
                            <InputLabel />
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
                            isDisabled={country === "" || country === null}
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
                          /> */}
                          <CustomAsyncPaginate
                            key={randomValue}
                            apiFunction={GET_OPERATORS} // Pass the function directly
                            value={operator}
                            onChange={(value) => {
                              setOperator(value);
                            }}
                            isDisabled={country === "" || country === null}
                            placeholder="Operator"
                            pageSize={10}
                            dataPath="data.data.items" // Adjust path based on API response structure
                            totalRowsPath="data.data.totalRows"
                            method="GET"
                            id={`async-menu-style-accounts`}
                            params={{ iso: country.value }}
                          />
                        </Grid>
                      )}

                      {service === "whatsapp" && (
                        <Grid item xs={6}>
                          {/* {country != "" && country != undefined ? (
                            <InputLabel sx={{ fontSize: "12px" }}>
                              Operation Type
                            </InputLabel>
                          ) : (
                            <InputLabel sx={{ marginTop: "10px" }} />
                          )}
                          <AsyncPaginate
                            key={randomValue}
                            id="async-menu-style"
                            onChange={(value) => setOperation(value)}
                            value={operation}
                            loadOptions={loadOperationOptions}
                            additional={{
                              page: 1,
                            }}
                            placeholder="Operation Type"
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
                            apiFunction={GET_ALL_OPERATION} // Pass the function directly
                            onChange={(value) => setOperation(value)}
                            value={operation}
                            isDisabled={country === "" || country === null}
                            placeholder="Operation Type"
                            pageSize={10}
                            dataPath="data.data.criteria" // Adjust path based on API response structure
                            totalRowsPath="data.data.totalRows"
                            method="GET"
                            id={`async-menu-style-accounts`}
                          />
                        </Grid>
                      )}
                    </>
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} marginTop={2}>
              {/* <Card className="kpi-card"> */}
              {service == "whatsapp" && (
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "providerName",
                      headerName: "Provider Name",
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
                      field: "cost",
                      headerName: "Cost",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
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
                            <Tooltip title="Edit Cost">
                              <IconButton
                                onClick={() => handleEditMangeCost(params?.row)}
                                size="small"
                                id="editCost"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Cost">
                              <IconButton
                                onClick={() => DeleteCost(params?.row)}
                                size="small"
                                id="deleteCost"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
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
              )}
              {service != "whatsapp" && (
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "providerName",
                      headerName: "Provider Name",
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
                      field: "cost",
                      headerName: "Cost",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
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
                            <Tooltip title="Edit Cost">
                              <IconButton
                                onClick={() => handleEditMangeCost(params?.row)}
                                size="small"
                                id="editCost"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Cost">
                              <IconButton
                                onClick={() => DeleteCost(params?.row)}
                                size="small"
                                id="deleteCost"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
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
              )}
              {/* </Card> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageAddCost && (
        <MuiModal
          title="Add Cost"
          open={manageAddCost}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddCost(false)}
        >
          <ManageCost
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddCost={setManageAddCost}
            providerCategoryOptions={providerCategoryOptions}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllCosts={getAllCosts}
          />
        </MuiModal>
      )}

      {manageEditCost && (
        <MuiModal
          title="Edit Cost"
          open={manageEditCost}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditCost(false)}
        >
          <ManageCost
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddCost={setManageEditCost}
            providerCategoryOptions={providerCategoryOptions}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllCosts={getAllCosts}
            selectedCost={selectedCost}
            setSelectedCost={setSelectedCost}
          />
        </MuiModal>
      )}

      {importCost && (
        <MuiModal
          title="Import File"
          open={importCost}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setImportCost(false)}
        >
          <Grid item xs={12}>
            {formik?.values?.providerCategory != "" &&
            formik?.values?.providerCategory != undefined ? (
              <InputLabel sx={{ fontSize: "12px" }}>
                Provider Category *
              </InputLabel>
            ) : (
              <InputLabel sx={{ marginTop: "10px" }} />
            )}
            <AsyncPaginate
              id="async-menu-style"
              loadOptions={loadOptions}
              additional={{
                page: 1,
              }}
              onChange={(value) => {
                formik?.setFieldValue("providerCategory", value);
                setRandomValue(Math.random());
              }}
              value={formik?.values?.providerCategory || ""}
              placeholder="Provider Category *"
              classNamePrefix="react-select"
            />

            {formik?.touched?.providerCategory &&
              formik?.errors?.providerCategory && (
                <FormHelperText style={{ color: "red" }}>
                  {formik?.errors?.providerCategory}
                </FormHelperText>
              )}
          </Grid>
          <Grid item xs={12} key={randomValue} sx={{ marginTop: "20px" }}>
            {formik?.values?.providerCategory != "" &&
            formik?.values?.providerCategory != undefined ? (
              <InputLabel
                error={
                  formik?.touched["provider"] &&
                  Boolean(formik?.errors["provider"])
                }
                helperText={
                  formik?.touched["provider"] && formik?.errors["provider"]
                }
                sx={{ fontSize: "12px", marginBottom: "-5px" }}
              >
                Provider
              </InputLabel>
            ) : (
              <InputLabel sx={{ marginTop: "10px" }} />
            )}
            <AsyncPaginate
              id="async-menu-style"
              value={formik?.values?.provider}
              loadOptions={loadImportProviderOptions}
              onChange={(value) => {
                formik?.setFieldValue("provider", value);
              }}
              placeholder={"Provider"}
              additional={{
                page: 1,
              }}
              isDisabled={
                formik?.values?.providerCategory == "" ||
                formik?.values?.providerCategory == undefined
              }
              classNamePrefix="react-select"
            />
            {formik?.touched?.provider && formik?.errors?.provider && (
              <FormHelperText style={{ color: "red" }}>
                {formik?.errors?.provider}
              </FormHelperText>
            )}
          </Grid>
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
              onClick={() => setImportCost(false)}
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
    </Box>
  );
}

export default withTranslation("translations")(GetActions(Cost));
