import { ArrowBack } from "@mui/icons-material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GET_ALL_CURRENCIES } from "../../../APIs/Currencies";
import {
  ADD_EXCHANGE_RATE,
  DELETE_EXCHANGE_RATE,
  EDIT_EXCHANGE_RATE,
  EXPORT_ALL_EXCHANGE_RATE,
  GET_ALL_EXCHANGE_RATE,
  GET_DEFAULT_CURRENCIES,
} from "../../../APIs/CurrencyManagement";
import addexchangelogo from "../../../Assets/exchange-rate-btn.webp";
import noExchangeRate from "../../../Assets/no-exchange-rate-logo.png";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch.jsx";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  formatDateCell,
  get_MM_DD_YYYY_HH_MM_SS,
  get_YYYY_MM_DD_HH_MM_SS,
  handleMessageError,
} from "../../Utils/Functions";
import ExchangeHistory from "./ExchangeHistory.jsx";
import ExchangeRateValidationSchema from "./ExchangeRateValidationSchema";
import ReusableToogleStatusCell from "../../../Components/ReusableToogleStatusCell.jsx";

const ManualRates = ({ defaultOptions }) => {
  const { showSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const menus = useSelector((state) => state.menus);
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    currency: "",
    rate: "",
    defaultCurrency: defaultOptions?.[0]?.value,
  });
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [clearFiltersFlag, setClearFiltersFlag] = useState(false);
  const [fromFilter, setFromFilter] = useState(false);
  const [state, setState] = useState({
    tableData: [],
    showNoData: false,
    showEdit: false,
    activateModal: false,
    DeactivateModal: false,
    editModal: false,
    confirmationModal: false,
    showAdd: false,
    // defaultCurrencyOptions: [defaultOptions],
    currencyOptions: [],
    exportLoading: false,
    isAllSelected: true,
    isOpen: false,
    defaultCurrencyFilter: "",
    currencyFilter: "",
  });
  const { t } = useTranslation();
  const {
    tableData,
    showNoData,
    showTableData,
    showAdd,
    currencyFilter,
    defaultCurrencyFilter,
    loading,
    currencyOptions,
    showEdit,
    // defaultCurrencyOptions,
    isOpen,
  } = state;
  const toggleAddManualRate = () => {
    setInitialFormValues({
      currency: "",
      rate: "",
      defaultCurrency: defaultOptions?.[0]?.value,
    });
    formik.resetForm({
      values: {
        currency: "",
        rate: "",
        defaultCurrency: defaultOptions?.[0]?.value,
      },
    });
    setState((prevState) => ({
      ...prevState,
      showAdd: true,
      showEdit: false,
      activateModal: true, // Ensure this is set to true
    }));
  };

  const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // }, []);
  const [totalRows, SetTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const getAllExchangeRates = async () => {
    setIsLoading(true);
    setState((prevState) => ({
      ...prevState,
      loading: true,
      showAdd: false,
      showEdit: false,
    }));
    let pageIndex = paginationModel?.page + 1;
    let pageSize = paginationModel?.pageSize;
    let GetAutomatic = false;
    let SourceGuid = defaultCurrencyFilter
      ? formik?.values?.defaultCurrency
      : "";
    let DestinationGuid = currencyFilter ? currencyFilter : "";

    try {
      let response = await GET_ALL_EXCHANGE_RATE({
        GetAutomatic,
        pageIndex,
        pageSize,
        SourceGuid,
        DestinationGuid,
      });

      if (response?.data?.success) {
        const items = response.data?.data?.items;

        const tableData = items.map((item) => {
          let date = "-";
          let time = "-";

          if (item?.lastUpdatedDate) {
            const allDate = get_MM_DD_YYYY_HH_MM_SS(
              new Date(item.lastUpdatedDate * 1000),
              "-"
            );
            [date, time] = allDate?.split(" ") || [];
          }

          return {
            ...item,
            currencyPair: `${item?.currencyCode} / ${item?.systemCurrencyCode}`,
            status: "Active",
            date,
            time: time?.slice(0, 5),
          };
        });
        setState((prevState) => ({
          ...prevState,
          tableData: tableData,
          showAdd: false,
          showEdit: false,
          showTableData: items.length === 0 ? false : true,
          showNoData: items.length === 0 ? true : false,
          loading: false,
        }));
        SetTotalRows(response?.data?.data?.totalRows);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // getDefaultCurrency();
    getCurrencies();
    // getScopes();
  }, []);
  useEffect(() => {
    getAllExchangeRates();
  }, [paginationModel]);
  const toggleExchangeDeactivate = async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const data = state?.editInfo?.recordGuid;
      let recordResponse = await DELETE_EXCHANGE_RATE({
        data,
      });
      if (recordResponse?.data?.success) {
        showSnackbar("Exchange Rate Deactivated Successfully", "success");

        toggleDeactivate();
        getAllExchangeRates();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };
  const getDefaultCurrency = async () => {
    setIsLoading(true);
    try {
      let response = await GET_DEFAULT_CURRENCIES();
      if (response?.data?.success) {
        const label = response?.data?.data?.currency?.name;
        const value = response?.data?.data?.currency?.recordGuid;
        const data = [{ label, value }];
        setState((prevState) => ({
          ...prevState,
          defaultCurrencyOptions: data,
        }));
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      showSnackbar(handleMessageError({ e }), "error");
    }
  };
  const getCurrencies = async () => {
    try {
      const currencyOptions = await GET_ALL_CURRENCIES({ pageSize: 1000 });

      setState((prevState) => ({
        ...prevState,
        currencyOptions: currencyOptions?.data?.data?.currencies,
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const toggleActivate = () => {
    setState((prevState) => ({
      ...prevState,
      activateModal: false,
    }));
  };
  const toggleActivateEdit = () => {
    setState((prevState) => ({
      ...prevState,
      editModal: false,
    }));
  };
  const toggleActivateConfirmation = () => {
    setState((prevState) => ({
      ...prevState,
      confirmationModal: true,
      editModal: false,
    }));
  };
  const toggleDeactivateConfirmation = () => {
    setState((prevState) => ({
      ...prevState,
      confirmationModal: false,
    }));
  };
  const toggleDeactivate = () => {
    setState((prevState) => ({
      ...prevState,
      DeactivateModal: false,
    }));
  };
  const toggleSelectAll = () => {
    setState((prevState) => ({
      ...prevState,
      isAllSelected: false,
    }));
    const indexes = tableData.map((_, index) => String(index));
    setRowSelectionModel(indexes);
  };
  const toggleUnSelectAll = () => {
    setRowSelectionModel([""]);
    setState((prevState) => ({
      ...prevState,
      isAllSelected: true,
    }));
  };
  const toggleExportData = async () => {
    setState((prevState) => ({
      ...prevState,
      exportLoading: true,
    }));
    try {
      const records =
        rowSelectionModel && rowSelectionModel != ""
          ? rowSelectionModel.map((index) => tableData[index]?.recordGuid)
          : [];
      let GetAutomatic = false;
      const response = await EXPORT_ALL_EXCHANGE_RATE({
        records,
        GetAutomatic,
      });

      if (response?.data) {
        const contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const headers = response.headers;
        headers["Content-Type"] = contentType;
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Exchange.csv";
        document.body.appendChild(link);
        link.click();
        setState((prevState) => ({
          ...prevState,
          loading: false,
          exportLoading: false,
        }));
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showSnackbar("Export Successful");
      }
    } catch (error) {
      showSnackbar(handleMessageError({ error }), "error");
    } finally {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        exportLoading: false,
      }));
    }
  };
  const handleMenuChange = (value) => {
    setAnchorEl(null);
    if (value === "Edit") {
      setInitialFormValues({
        currency: state.editInfo?.currencyRecordGuid || "",
        rate: state.editInfo?.currentRate || "",
        defaultCurrency: state.editInfo?.systemCurrencyRecordGuid || "",
      });
      formik.resetForm({
        values: {
          currency: state.editInfo?.currencyRecordGuid || "",
          rate: state.editInfo?.currentRate || "",
          defaultCurrency: state.editInfo?.systemCurrencyRecordGuid || "",
        },
      });
      setState((prevState) => ({
        ...prevState,
        showAdd: false,
        showEdit: true,
        editModal: true,
      }));
    } else if (value === "Deactivate") {
      setState((prevState) => ({
        ...prevState,
        DeactivateModal: true,
      }));
    } else if (value === "View History") {
      setViewHistory(true);
    }
  };
  const toggleFilterModal = () => {
    setState((prevState) => ({ ...prevState, isOpen: !state.isOpen }));
  };
  const selectRef = useRef(null);

  const sidebarRef = useRef(null);

  const handleSearch = () => {
    setFromFilter(true);
    getAllExchangeRates();
    toggleFilterModal();
  };

  const handleClearFilters = () => {
    setState((prevState) => ({
      ...prevState,
      currencyFilter: "",
      defaultCurrencyFilter: "",
    }));
    setClearFiltersFlag(true);
    toggleFilterModal();
  };
  useEffect(() => {
    if (clearFiltersFlag) {
      getAllExchangeRates();
      setClearFiltersFlag(false);
    }
  }, [clearFiltersFlag]);
  const selectedData = (params) => {
    setState((prevState) => ({ ...prevState, editInfo: params?.row }));
  };
  // const menuActionsOptions = [
  //   state.updateCurrency ? "Edit" : "",
  //   state.deactivateCurrency ? "Deactivate" : "",
  // ].filter((option) => option !== "");
  const menuActionsOptions = ["Edit", "Deactivate", "View History"];
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    if (open) {
      const handleScroll = () => handleClose();
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [open]);
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: ExchangeRateValidationSchema(),
    onSubmit: async (values) => {
      try {
        setState((prevState) => ({
          ...prevState,
          loading: true,
        }));
        const data = {
          CurrencyGuid: values?.currency,
          Rate: values?.rate,
          UpdateIfExists: true,
        };
        let editData = {
          ExchangeRateGuid: state.editInfo?.recordGuid,
          CurrentRate: values?.rate,
        };
        let recordResponse;
        if (showAdd && !showEdit) {
          recordResponse = await ADD_EXCHANGE_RATE({
            data,
          });
        } else if (showEdit && !showAdd) {
          recordResponse = await EDIT_EXCHANGE_RATE({
            data: editData,
          });
        }
        if (recordResponse?.data?.success) {
          showSnackbar(
            showAdd === true && !showEdit
              ? "Exchange Rate Added Successfully "
              : "Exchange Rate Edited Successfully"
          );
          setState((prevState) => ({
            ...prevState,
            loading: false,
            showTableData: true,
            showAdd: false,
            showEdit: false,
            confirmationModal: false,
            fromFilter: false,
          }));
          getAllExchangeRates();
        } else {
          showSnackbar(recordResponse?.data?.message, "error");
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    },
  });

  console.log("selectedRow", selectedRow);

  return (
    <Box
      container
      id="Client"
      className="page_container"
      sx={{ paddingLeft: 0 }}
    >
      <Box className="section_container scroll">
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center align-self-center"
            style={{ minHeight: "70vh" }}
          >
            <CircularProgress />
          </div>
        ) : viewHistory ? (
          <>
            <Box
              display="flex"
              alignItems="start"
              flexDirection="column"
              mt={2}
            >
              <IconButton onClick={() => setViewHistory(false)}>
                <Box sx={{ fontSize: "1rem" }}>
                  <ArrowBack sx={{ fontSize: 20, mr: 0.5 }} />
                  Exchange History
                </Box>
              </IconButton>
              <ExchangeHistory
                loading={loading}
                setManageAccountActivity={setViewHistory}
                getAllExchangeRates={getAllExchangeRates}
                selectedRow={selectedRow}
              />
            </Box>
          </>
        ) : (
          <>
            {" "}
            {isOpen && (
              <Grid item xs={12} m={2}>
                <AdvancedSearch
                  showAdvanceSearch={isOpen}
                  handleFilterReset={handleClearFilters}
                  handleFilterSearch={handleSearch}
                  setShowAdvanceSearch={toggleFilterModal}
                  body={
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            label="Default Currency"
                            value={defaultCurrencyFilter}
                            onChange={(e) => {
                              setState((prevState) => ({
                                ...prevState,
                                defaultCurrencyFilter: e.target.value,
                              }));
                            }}
                            variant="standard"
                          >
                            {defaultOptions &&
                              defaultOptions.length > 0 &&
                              defaultOptions.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            label="Quote Currency"
                            value={currencyFilter}
                            onChange={(e) => {
                              setState((prevState) => ({
                                ...prevState,
                                currencyFilter: e.target.value,
                              }));
                            }}
                            variant="standard"
                          >
                            {currencyOptions &&
                              currencyOptions.length > 0 &&
                              currencyOptions.map((item) => (
                                <MenuItem
                                  key={item.value}
                                  value={item.recordGuid}
                                >
                                  {item.name}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </>
                  }
                />
              </Grid>
            )}
            {showNoData === true && fromFilter === false && (
              <>
                <Card
                  className="kpi-card p-4"
                  sx={{ overflow: "inherit", width: "100%" }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center align-self-center"
                    style={{ minHeight: "70vh" }}
                  >
                    <Grid
                      container
                      spacing={{ xs: 5, md: 5 }}
                      sx={{ margin: "0 auto" }}
                      textAlign={"center"}
                    >
                      <Grid
                        item
                        xs={12}
                        justifyContent="center"
                        alignItems="center"
                        alignSelf="center"
                      >
                        <img src={noExchangeRate} alt="No exchange rate Logo" />
                      </Grid>

                      <Grid item xs={12}>
                        <h5 className="no-data-available">
                          No exchange history
                        </h5>
                        <Typography variant="body3" className="no-data-desc">
                          No Manual Exchange Rates Has Been Added
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        display={"flex"}
                        justifyContent={"center"}
                        padding={3}
                      >
                        {" "}
                        <Button
                          className="mui-btn primary filled"
                          sx={{ marginInlineEnd: "10px" }}
                          onClick={() => toggleAddManualRate()}
                        >
                          Add Now
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Card>
              </>
            )}{" "}
            {fromFilter === true && showNoData && (
              <>
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"end"}
                  paddingRight={3}
                >
                  <Button
                    className="mui-btn primary outlined"
                    endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                    onClick={() => toggleFilterModal()}
                  >
                    &nbsp;Filter By
                  </Button>

                  <Button
                    className="mui-btn primary filled"
                    startIcon={
                      <img
                        src={addexchangelogo}
                        alt="Exchange"
                        width="17px"
                        height="17px"
                      />
                    }
                    onClick={() => toggleAddManualRate()}
                    sx={{
                      color: "#FFFFFF !important",
                    }}
                  >
                    Add Exchange
                  </Button>
                </Grid>

                <div className="flex justify-content-center align-items-center align-self-center mt-2">
                  <Card className="kpi-card p-5">
                    <Grid
                      container
                      spacing={{ xs: 5, md: 5 }}
                      sx={{ margin: "0 auto", height: "50vh", width: "70vw" }}
                      textAlign={"center"}
                    >
                      <Grid
                        item
                        xs={12}
                        justifyContent="center"
                        alignItems="center"
                        alignSelf="center"
                      >
                        <img src={noExchangeRate} alt="No exchange rate Logo" />
                      </Grid>
                      <Grid item xs={12}>
                        <h5 className="no-data-available">
                          No exchange history
                        </h5>
                      </Grid>
                    </Grid>
                  </Card>
                </div>
              </>
            )}
            {showAdd && (
              <MuiModal
                open={state.activateModal}
                width={460}
                height={410}
                handleClose={toggleActivate}
                title={"Manual Exchange"}
                subtitle={
                  "Welcome to a world where exchanging currency is as simple as a few clicks"
                }
              >
                <form onSubmit={formik?.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl
                        className="pb-2"
                        fullWidth
                        variant="standard"
                      >
                        <InputLabel
                          id="custom-select"
                          error={
                            formik.touched["defaultCurrency"] &&
                            Boolean(formik.errors["defaultCurrency"])
                          }
                        >
                          {t("Default Currency")}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          variant="standard"
                          name="defaultCurrency"
                          onBlur={formik.handleBlur}
                          disabled
                          error={
                            formik.touched["defaultCurrency"] &&
                            Boolean(formik.errors["defaultCurrency"])
                          }
                          helperText={
                            formik.touched["defaultCurrency"] &&
                            formik.errors["defaultCurrency"]
                          }
                          value={defaultOptions?.[0]?.value}
                          onChange={(e) => {
                            formik?.setFieldValue(
                              "defaultCurrency",
                              e.target.value
                            );
                          }}
                        >
                          {defaultOptions?.map((template, index) => (
                            <MenuItem
                              defaultValue={template[0]?.value}
                              key={index}
                              value={template?.value}
                            >
                              {template?.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.defaultCurrency &&
                          formik.errors.defaultCurrency && (
                            <FormHelperText style={{ color: "red" }}>
                              {formik.errors.defaultCurrency}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl variant="standard" fullWidth>
                        <TextField
                          key={"value"}
                          fullWidth
                          id={"value"}
                          name={"value"}
                          label={" "}
                          variant="standard"
                          type="text"
                          InputLabelProps={{ shrink: true }}
                          value={"1"}
                          disabled={true}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="mt-2 mb-2">
                    <Grid item xs={6}>
                      <FormControl
                        className="pb-2"
                        fullWidth
                        variant="standard"
                      >
                        <InputLabel
                          id="custom-select"
                          error={
                            formik.touched["countryCode"] &&
                            Boolean(formik.errors["countryCode"])
                          }
                        >
                          {t("Quote Currency")}
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          variant="standard"
                          name="currency"
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched["currency"] &&
                            Boolean(formik.errors["currency"])
                          }
                          helperText={
                            formik.touched["currency"] &&
                            formik.errors["currency"]
                          }
                          value={formik.values.currency}
                          onChange={formik.handleChange}
                        >
                          {currencyOptions?.map((template, index) => (
                            <MenuItem key={index} value={template?.recordGuid}>
                              {template?.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.currency && formik.errors.currency && (
                          <FormHelperText style={{ color: "red" }}>
                            {formik.errors.currency}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl variant="standard" fullWidth>
                        <TextField
                          key={"rate"}
                          fullWidth
                          id={"rate"}
                          name={"rate"}
                          label={"Amount"}
                          variant="standard"
                          type="number"
                          value={formik.values.rate}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (
                              value === "" ||
                              (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)
                            ) {
                              formik.setFieldValue("rate", value);
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.rate && Boolean(formik.errors.rate)
                          }
                          helperText={formik.touched.rate && formik.errors.rate}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className="mt-3">
                    <Grid item xs={12} className="text-center">
                      <Button
                        className="mui-btn primary filled"
                        type="submit"
                        disabled={state.loading}
                      >
                        Add
                      </Button>
                      <Button
                        className="mui-btn primary outlined"
                        onClick={toggleActivate}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </MuiModal>
            )}
            {showEdit && (
              <>
                <MuiModal
                  open={state.editModal}
                  width={460}
                  height={410}
                  handleClose={toggleActivateEdit}
                  title={"Manual Exchange"}
                  subtitle={
                    "Welcome to a world where exchanging currency is as simple as a few clicks"
                  }
                >
                  <form>
                    <Grid container spacing={4}>
                      <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel
                            id="demo-simple-select-label"
                            error={
                              formik.touched["defaultCurrency"] &&
                              Boolean(formik.errors["defaultCurrency"])
                            }
                          >
                            {t("Default Currency")}
                          </InputLabel>

                          <Select
                            disabled
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            variant="standard"
                            name="defaultCurrency"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["defaultCurrency"] &&
                              Boolean(formik.errors["defaultCurrency"])
                            }
                            helperText={
                              formik.touched["defaultCurrency"] &&
                              formik.errors["defaultCurrency"]
                            }
                            value={defaultOptions[0]?.value}
                            onChange={formik.handleChange}
                          >
                            {defaultOptions?.map((template, index) => (
                              <MenuItem key={index} value={template?.value}>
                                {template?.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.defaultCurrency &&
                            formik.errors.defaultCurrency && (
                              <FormHelperText style={{ color: "red" }}>
                                {formik.errors.defaultCurrency}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} mt={2}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"value"}
                            fullWidth
                            id={"value"}
                            name={"value"}
                            variant="standard"
                            type="text"
                            value={1}
                            onBlur={false}
                            error={false}
                            helperText={false}
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                          />
                        </FormControl>{" "}
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={3}>
                      <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel
                            id="demo-simple-select-label"
                            error={
                              formik.touched["countryCode"] &&
                              Boolean(formik.errors["countryCode"])
                            }
                          >
                            {t("currency")}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            disabled
                            variant="standard"
                            name="currency"
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["currency"] &&
                              Boolean(formik.errors["currency"])
                            }
                            helperText={
                              formik.touched["currency"] &&
                              formik.errors["currency"]
                            }
                            value={formik.values.currency}
                            onChange={formik.handleChange}
                          >
                            {currencyOptions?.map((template, index) => (
                              <MenuItem
                                key={index}
                                value={template?.recordGuid}
                              >
                                {template?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formik.touched.currency &&
                            formik.errors.currency && (
                              <FormHelperText style={{ color: "red" }}>
                                {formik.errors.currency}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"rate"}
                            fullWidth
                            id={"rate"}
                            name={"rate"}
                            label={"Amount"}
                            variant="standard"
                            type="number"
                            value={formik.values.rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                (/^\d*\.?\d*$/.test(value) &&
                                  Number(value) >= 0)
                              ) {
                                formik.setFieldValue("rate", value);
                              }
                            }}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.rate && Boolean(formik.errors.rate)
                            }
                            helperText={
                              formik.touched.rate && formik.errors.rate
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} className="mt-3">
                      <Grid item xs={12} className="text-center">
                        <Button
                          className="mui-btn primary filled"
                          onClick={toggleActivateConfirmation}
                        >
                          Save
                        </Button>
                        <Button
                          className="mui-btn primary outlined"
                          onClick={toggleActivateEdit}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </MuiModal>
              </>
            )}
            <MuiModal
              title="Edit ExchangeRate"
              open={state.confirmationModal}
              width="500px"
              id="edit-contact-form"
              handleClose={toggleDeactivateConfirmation}
            >
              <Typography>
                Are you sure you would like to change the currency exchange
                rate?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} className="text-center">
                  <Button
                    className="mui-btn primary outlined"
                    onClick={toggleDeactivateConfirmation}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="mui-btn primary filled"
                    disabled={state.loading}
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </MuiModal>
            {showTableData && (
              <>
                <Grid
                  item
                  xs={12}
                  display={"flex"}
                  justifyContent={"end"}
                  paddingRight={3}
                >
                  <Button
                    className="mui-btn primary outlined"
                    variant="outlined"
                    endIcon={<KeyboardArrowDownIcon fontSize="small" />}
                    onClick={() => toggleFilterModal()}
                  >
                    &nbsp;Filter By
                  </Button>

                  <Button
                    className="mui-btn primary outlined"
                    onClick={() => toggleExportData()}
                    disabled={state.exportLoading}
                  >
                    {state.exportLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <FileUploadIcon fontSize="small" />
                        &nbsp; Export
                      </>
                    )}
                  </Button>

                  <Button
                    className="mui-btn primary filled"
                    startIcon={<CurrencyExchangeIcon />}
                    onClick={() => toggleAddManualRate()}
                    sx={{
                      color: "#FFFFFF !important",
                    }}
                  >
                    Add Exchange
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <div className="p-3 card-body fixed-height">
                    <MuiTable
                      columns={[
                        {
                          headerName: t("Currency Pair"),
                          field: "currencyPair",
                          width: 200,
                          flex: 1,
                        },
                        {
                          headerName: t("Exchange Rate"),
                          field: "currentRate",
                          flex: 1,
                          renderCell: (params) => {
                            const value = Number(params?.row?.currentRate);

                            const truncated = isNaN(value)
                              ? "-"
                              : (Math.floor(value * 100) / 100).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  }
                                );

                            return (
                              <Tooltip title={value} placement="top">
                                {truncated}
                              </Tooltip>
                            );
                          },
                        },
                        {
                          headerName: t("Last Updated"),
                          field: "date",
                          flex: 1,
                          renderCell: (params) => (
                            <>{formatDateCell(params?.row?.lastUpdatedDate)}</>
                          ),
                        },
                        // {
                        //   headerName: t("Time"),
                        //   field: "time",
                        //   width: 100,
                        // },

                        {
                          headerName: t("Status"),
                          field: "status",
                          flex: 1,
                          renderCell: (params) => (
                            <>
                              <ReusableToogleStatusCell
                                value={params?.row?.status}
                                activeLabel="Active"
                              />
                            </>
                          ),
                        },
                        {
                          field: "actions",
                          headerName: "Actions",
                          flex: 1,
                          headerAlign: "left",
                          align: "left",
                          renderCell: (params) => {
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start", // Left align
                                  width: "100%",
                                  height: "100%",
                                  pl: 1,
                                }}
                              >
                                <Tooltip title="Actions">
                                  <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={
                                      open ? "long-menu" : undefined
                                    }
                                    aria-expanded={open ? "true" : undefined}
                                    aria-haspopup="true"
                                    onClick={(event) => {
                                      handleClick(event);
                                      selectedData(params);
                                      setSelectedRow(params.row);
                                    }}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Tooltip>

                                <Menu
                                  id="vertical-menu"
                                  MenuListProps={{
                                    "aria-labelledby": "long-button",
                                  }}
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  PaperProps={{
                                    elevation: 0, // Remove default shadow
                                    sx: {
                                      boxShadow: "none", // Fully remove any shadow
                                      border: "1px solid #e0e0e0", // Optional: add a light border if you want
                                    },
                                  }}
                                >
                                  {menuActionsOptions.map((option) => (
                                    <MenuItem
                                      key={option}
                                      onClick={() => {
                                        handleMenuChange(option);
                                      }}
                                    >
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Menu>
                              </Box>
                            );
                          },
                        },
                      ]}
                      data={tableData}
                      setPaginationModel={setPaginationModel}
                      paginationModel={paginationModel}
                      loading={loading}
                      totalRows={totalRows}
                      // rowSelectionModel={rowSelectionModel}
                      // setRowSelectionModel={setRowSelectionModel}
                      paginationMode="server"
                    />
                  </div>

                  <MuiModal
                    open={state.DeactivateModal}
                    width={370}
                    handleClose={toggleDeactivate}
                    title={"Deactivate this"}
                    subtitle={
                      "Are you sure you would like to deactivate the currency exchange rate"
                    }
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} className="text-center">
                        <Button
                          className="mui-btn primary filled"
                          onClick={toggleExchangeDeactivate}
                          disabled={state.loading}
                        >
                          Deactivate
                        </Button>
                        <Button
                          className="mui-btn primary outlined"
                          onClick={toggleDeactivate}
                        >
                          Cancel{" "}
                        </Button>
                      </Grid>
                    </Grid>
                  </MuiModal>
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  token: state.authentication ? state.authentication.token : "",
});

export default ManualRates;
