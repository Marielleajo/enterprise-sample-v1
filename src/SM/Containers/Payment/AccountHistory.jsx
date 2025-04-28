import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import MuiCard from "../../../Components/MuiCard/MuiCard";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {
  GET_ACCOUNT_ACTIVITY_CLIENT,
  GET_ALL_RESELLER_API,
} from "../../../APIs/Postpaid";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  convertToEpochTimestamp,
  get_DD_MM_YYYY,
  handleMessageError,
} from "../../Utils/Functions";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSelector } from "react-redux";
import { GET_BALANCE_HISTORY } from "../../../APIs/Billing";
import { GET_ALL_CLIENTS } from "../../../APIs/Prepaid";
import CloseIcon from "@mui/icons-material/Close";
import GetActions from "../../Utils/GetActions";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";

const AccountHistory = ({ actions }) => {
  const { token } = useSelector((state) => state.authentication);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [accountTypeOptions, setAccountTypeOptions] = useState([]);
  const [accountType, setAccountType] = useState(null);
  const dateRangeOptions = [
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 3 Months", value: "last_3_months" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "Last Year", value: "last_year" },
    { label: "Last 2 Years", value: "last_2_years" },
    { label: "Custom Range", value: "custom" },
  ];

  const [customRange, setCustomRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [dateRangeOption, setDateRangeOption] = useState();
  const transactionTypeOptions = [
    { label: "All", value: "all" },
    { label: "Credit", value: "credit" },
    { label: "Debits", value: "debits" },
  ];
  const [transactionType, setTransactionType] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [data, setData] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);

  const formatDateRange = (start, end) => {
    if (!start || !end) return "Custom";
    return `${start} to ${end}`;
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setCustomRange((prev) => ({
      ...prev,
      startDate,
      endDate: prev.endDate && prev.endDate < startDate ? "" : prev.endDate,
    }));
  };

  // get date range method
  const getDateRange = (range) => {
    const now = new Date();
    now.setUTCHours(23, 59, 59, 0); // End of today in UTC (without milliseconds)
    let startDate = new Date(now); // Copy current date

    switch (range) {
      case "last_7_days":
        startDate.setUTCDate(now.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0); // Start of the day
        break;
      case "last_month":
        startDate.setUTCMonth(now.getUTCMonth() - 1);
        startDate.setUTCDate(1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "last_3_months":
        startDate.setUTCMonth(now.getUTCMonth() - 3);
        startDate.setUTCDate(1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "last_6_months":
        startDate.setUTCMonth(now.getUTCMonth() - 6);
        startDate.setUTCDate(1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "last_year":
        startDate.setUTCFullYear(now.getUTCFullYear() - 1);
        startDate.setUTCMonth(0, 1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "last_2_years":
        startDate.setUTCFullYear(now.getUTCFullYear() - 2);
        startDate.setUTCMonth(0, 1);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      default:
        return { startDate: null, endDate: null };
    }

    return {
      startDate: Math.floor(startDate.getTime() / 1000), // Unix timestamp in seconds
      endDate: Math.floor(now.getTime() / 1000), // Unix timestamp in seconds
    };
  };

  // get reseller accounts
  const getAllAccounts = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS({
        search: "",
        ParentGuid: selectedReseller?.value,
        ParentIncluded: true,
      });

      const data = response?.data?.data?.accounts ?? [];
      setAccountTypeOptions(data);
      setAccountType(data?.find((item) => item?.isPrimary)?.recordGuid);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  // get History data
  const getHistoryData = async () => {
    setLoading(true);
    let startDateValue;
    let endDateValue;
    if (dateRangeOption === "custom") {
      startDateValue = convertToEpochTimestamp(customRange?.startDate);
      endDateValue = convertToEpochTimestamp(customRange?.endDate);
    } else {
      let { startDate, endDate } = getDateRange(dateRangeOption);
      startDateValue = startDate;
      endDateValue = endDate;
    }

    let body = {
      pageIndex: paginationModel?.page + 1,
      pageSize: paginationModel?.pageSize,
      startDate: startDateValue,
      endDate: endDateValue,
      paymentType:
        transactionType?.toLowerCase() === "all" ? null : transactionType,
      ClientAccountGuid: accountType,
      clientGuid: selectedReseller?.value,
      WithTotalValues: true,
      MinAmount: minAmount,
      MaxAmount: maxAmount,
      ReferenceNumber: referenceNumber,
    };
    try {
      let response = await GET_BALANCE_HISTORY(body);
      if (response?.data?.success) {
        setData(
          (response?.data?.data?.balanceHistory ?? []).map((item, index) => ({
            ...item,
            recordGuid: index,
          }))
        );
        setTotalRows(response?.data?.data?.totalRows);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearDateRange = () => {
    setCustomRange({
      startDate: null,
      endDate: null,
    });
    setDateRangeOption("");
  };

  const handleFilterSearch = () => {
    if (minAmount > 0 && maxAmount > 0 && minAmount > maxAmount) {
      showSnackbar("Max amount must be greater than the min amount!", "error");
      return;
    }
    if (selectedReseller?.value) {
      getHistoryData();
    } else {
      showSnackbar("Please select a reseller!", "error");
    }
  };

  const handleFilterReset = () => {
    setSelectedReseller(null);
    setAccountType(null);
    handleClearDateRange();
    setTransactionType(null);
    setMinAmount(null);
    setMaxAmount(null);
    setReferenceNumber(null);
    setShowOther(false);
  };

  useEffect(() => {
    if (selectedReseller) {
      getAllAccounts();
    }
  }, [selectedReseller]);

  useEffect(() => {
    if (accountType) {
      getHistoryData();
    }
  }, [paginationModel]);

  return (
    <Box p={2} sx={{ maxHeight: "95vh", overflowY: "auto" }}>
      <Grid item xs={12} mt={2}>
        <AdvancedSearch
          showAdvanceSearch={showAdvanceSearch}
          handleFilterReset={handleFilterReset}
          handleFilterSearch={handleFilterSearch}
          setShowAdvanceSearch={setShowAdvanceSearch}
          hideButton={false}
          loading={loading}
          body={
            <>
              <Grid item xs={12} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomAsyncPaginate
                      value={selectedReseller}
                      onChange={(value) => {
                        setSelectedReseller(value);
                        setData([]);
                        setAccountType(null);
                      }}
                      placeholder="Select Reseller"
                      label="Reseller"
                      apiFunction={GET_ALL_RESELLER_API}
                      dataPath={"data.data.clients"}
                      params={{ TypeTag: "RESELLER", StatusTag: "APPROVED" }}
                      customLabel={(item) => `${item.firstName} - ${item.name}`}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="standard" sx={{ pb: 2 }}>
                      {accountType ? (
                        <InputLabel
                          id="accountType-label"
                          shrink={!!accountType}
                          sx={{
                            fontSize: 12,
                            color: "#6f736f",
                            // mt: "-1rem",
                          }}
                        >
                          Select Account Type
                        </InputLabel>
                      ) : (
                        <InputLabel
                          id="AccountType-label"
                          sx={{
                            fontSize: 16,
                            color: "#6f736f",
                          }}
                        >
                          Select Account Type
                        </InputLabel>
                      )}
                      <Select
                        labelId="accountType-label"
                        id="accountType"
                        name="accountType"
                        displayEmpty
                        value={accountType}
                        placeholder={"Select Account Type"}
                        onChange={(e) => {
                          setAccountType(e.target.value);
                        }}
                        sx={{
                          borderBottom: "1px solid #ccc",
                          "& .MuiSelect-select": {
                            padding: "5px 0",
                          },
                        }}
                      >
                        {accountTypeOptions?.map((item) => (
                          <MenuItem
                            key={item?.recordGuid}
                            value={item?.recordGuid}
                          >
                            {item?.accountNumber} - {"(postpaid)"}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {showOther && (
                <>
                  <Grid item xs={3} position={"relative"}>
                    <FormControl fullWidth variant="standard" sx={{ pb: 2 }}>
                      {dateRangeOption && (
                        <CloseIcon
                          sx={{
                            position: "absolute",
                            bottom: "1.5rem",
                            right: "1rem",
                            zIndex: "10",
                            cursor: "pointer",
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                          onClick={() => {
                            handleClearDateRange();
                          }}
                        />
                      )}
                      <InputLabel
                        shrink={!!dateRangeOption}
                        sx={{
                          fontSize: dateRangeOption ? 12 : 16,
                          color: "#6f736f",
                        }}
                      >
                        Date Range
                      </InputLabel>
                      <Select
                        id="dateRange"
                        value={dateRangeOption ?? ""}
                        onChange={(e) => {
                          setDateRangeOption(e.target.value);
                          setCustomRange({
                            startDate: null,
                            endDate: null,
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return "";
                          }
                          if (selected === "custom") {
                            return formatDateRange(
                              customRange.startDate,
                              customRange.endDate
                            );
                          }
                          const label = dateRangeOptions.find(
                            (o) => o.value === selected
                          )?.label;
                          return label || "";
                        }}
                        sx={{
                          borderBottom: "1px solid #ccc",
                          "& .MuiSelect-select": { padding: "5px 0" },
                        }}
                      >
                        {dateRangeOptions.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {dateRangeOption === "custom" && (
                    <>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Start Date"
                          type="date"
                          variant="standard"
                          value={customRange.startDate}
                          onChange={handleStartDateChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="End Date"
                          type="date"
                          variant="standard"
                          value={customRange.endDate}
                          onChange={(e) =>
                            setCustomRange((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          InputProps={{
                            inputProps: {
                              min: customRange.startDate,
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={3} position={"relative"}>
                    {transactionType && (
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          bottom: "1.5rem",
                          right: "1rem",
                          zIndex: "10",
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                        onClick={() => {
                          setTransactionType(null);
                        }}
                      />
                    )}
                    <FormControl fullWidth variant="standard" sx={{ pb: 2 }}>
                      <InputLabel
                        id="transaction-type-label"
                        shrink={!!transactionType}
                        sx={{
                          fontSize: transactionType ? 12 : 16,
                          color: "#6f736f",
                        }}
                      >
                        Transaction Type
                      </InputLabel>

                      <Select
                        id="transactionType"
                        name="transactionType"
                        displayEmpty
                        value={transactionType}
                        placeholder={"Select Transaction Type"}
                        onChange={(e) => {
                          setTransactionType(e.target.value);
                        }}
                        sx={{
                          borderBottom: "1px solid #ccc",
                          "& .MuiSelect-select": {
                            padding: "5px 0",
                          },
                        }}
                      >
                        {transactionTypeOptions?.map((item, index) => (
                          <MenuItem key={index} value={item?.value}>
                            {item?.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} position={"relative"}>
                    {minAmount && (
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          bottom: "1.5rem",
                          right: "1rem",
                          zIndex: "10",
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                        onClick={() => {
                          setMinAmount(null);
                        }}
                      />
                    )}
                    <TextField
                      fullWidth
                      id="minAmount"
                      name="minAmount"
                      label="Minimum Amount"
                      variant="standard"
                      type="text"
                      value={minAmount ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,20}$/.test(value)) {
                          setMinAmount(value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key))
                          e.preventDefault();
                      }}
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>
                  <Grid item xs={3} position={"relative"}>
                    {maxAmount && (
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          bottom: "1.5rem",
                          right: "1rem",
                          zIndex: "10",
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                        onClick={() => {
                          setMaxAmount(null);
                        }}
                      />
                    )}
                    <TextField
                      fullWidth
                      id="maxAmount"
                      name="maxAmount"
                      label="Maximum Amount"
                      variant="standard"
                      type="text"
                      value={maxAmount ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,20}$/.test(value)) {
                          setMaxAmount(value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key))
                          e.preventDefault();
                      }}
                    />
                  </Grid>
                  <Grid item xs={3} position={"relative"}>
                    {referenceNumber && (
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          bottom: "1.5rem",
                          right: "1rem",
                          zIndex: "10",
                          cursor: "pointer",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                        onClick={() => {
                          setReferenceNumber(null);
                        }}
                      />
                    )}
                    <TextField
                      fullWidth
                      id="referenceNumber"
                      name="referenceNumber"
                      label="Reference Number"
                      variant="standard"
                      type="text"
                      value={referenceNumber ?? ""}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      inputProps={{ maxLength: 30 }}
                    />
                  </Grid>
                </>
              )}
            </>
          }
          hasMoreFilter={true}
          showOther={showOther}
          setShowOther={setShowOther}
        />
      </Grid>
      {accountType && data?.length > 0 ? (
        <>
          {/*  Cards details */}
          <Grid item xs={12} mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <MuiCard
                  title={"Total Credits"}
                  value={data?.totalCredits ?? 0}
                  icon={
                    <MonetizationOnOutlinedIcon
                      fontSize="large"
                      sx={{ color: "green" }}
                    />
                  }
                  valueStyle={{ color: "green" }}
                />
              </Grid>
              <Grid item xs={4}>
                <MuiCard
                  title={"Total Debits"}
                  value={data?.totalDebits ?? 0}
                  icon={
                    <MonetizationOnOutlinedIcon
                      fontSize="large"
                      sx={{ color: "red" }}
                    />
                  }
                  valueStyle={{ color: "red" }}
                />
              </Grid>
              <Grid item xs={4}>
                <MuiCard
                  title={"Net Balance"}
                  value={Number(
                    (data?.totalCredits ?? 0) - (data?.totalDebits ?? 0)
                  )}
                  icon={
                    <MonetizationOnOutlinedIcon
                      fontSize="large"
                      sx={{ color: "blue" }}
                    />
                  }
                  valueStyle={{ color: "blue" }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* table data */}

          <Grid item xs={12} my={2}>
            <MuiTable
              rowId="recordGuid"
              columns={[
                {
                  field: "type",
                  headerName: "Transaction Type",
                  width: 150,
                },
                {
                  field: "description",
                  headerName: "Description",
                  width: 300,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "amount",
                  headerName: "Amount",
                  width: 150,
                  renderCell: (params) => (
                    <span
                      style={{ color: params.value >= 0 ? "green" : "red" }}
                    >
                      {params.value ?? "--"}
                    </span>
                  ),
                },

                {
                  field: "currency",
                  headerName: "Currency",
                  width: 150,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "createdAt",
                  headerName: "Date",
                  width: 150,
                  renderCell: (params) => (
                    <span>{get_DD_MM_YYYY(params.value)}</span>
                  ),
                },
                {
                  field: "referenceNumber",
                  headerName: "Reference Number",
                  width: 200,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "processedBy",
                  headerName: "Processed By",
                  width: 150,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
              ]}
              data={data}
              loading={loading}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
            />
          </Grid>
        </>
      ) : loading ? (
        <Grid item xs={12} mt={2}>
          <Box className="Loader" sx={{ height: "50vh" }}>
            <CircularProgress />
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12} mt={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" color="#ccc" mt={2}>
              No Data Found For This Reseller
            </Typography>
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default GetActions(AccountHistory);
