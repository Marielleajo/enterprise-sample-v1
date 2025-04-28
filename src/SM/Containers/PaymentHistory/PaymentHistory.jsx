import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  getUnix_DD_MM_YYYY,
  handleMessageError,
  hasAction,
} from "../../Utils/Functions";
import { GET_ALL_RESELLER_API } from "../../../APIs/Postpaid";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import {
  EXPORT_PAYMENT_REPORT,
  GET_PAYMENT_REPORT,
} from "../../../APIs/Billing";
import { useSelector } from "react-redux";
import { Download } from "@mui/icons-material";
import GetActions from "../../Utils/GetActions";

const PaymentHistory = ({ actions }) => {
  let { clientId } = useSelector((state) => state?.authentication);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);

  const [data, setData] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [showOther, setShowOther] = useState(false);

  //Filter
  const statusList = ["SUCCESS", "FAILED", "CANCELED", "REFUNDED", "TIMEOUT"];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterState, setFilterState] = useState({
    startDate: null,
    endDate: null,
    referenceNumber: null,
  });

  const getPaymentData = async () => {
    setLoading(true);
    try {
      let response = await GET_PAYMENT_REPORT({
        pageIndex: paginationModel?.page + 1,
        pageSize: paginationModel?.pageSize,
        clients: [selectedReseller?.value],
        startDate: filterState?.startDate
          ? new Date(filterState?.startDate + "T00:00:00Z") / 1000
          : null,
        endDate: filterState?.endDate
          ? new Date(filterState?.endDate + "T23:59:59Z") / 1000
          : null,
        ReferenceNumber: filterState?.referenceNumber,
      });
      const retreivedData =
        response?.data?.data?.payments?.map((data) => ({
          ...data,
        })) || [];

      setData(retreivedData);
      setTotalRows(response?.data?.data?.totalRows);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportPaymentHistory = async () => {
    setExportLoading(true);
    try {
      let response = await EXPORT_PAYMENT_REPORT({
        clients: [selectedReseller?.value],
        startDate: filterState?.startDate
          ? new Date(startDate + "T00:00:00Z") / 1000
          : null,
        endDate: filterState?.endDate
          ? new Date(endDate + "T23:59:59Z") / 1000
          : null,
        ReferenceNumber: filterState?.referenceNumber,
      });

      if (response?.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Payment history.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();

        showSnackbar("Export Successful");
      } else {
        showSnackbar("Something went wrong exporting data", "error");
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setExportLoading(false);
    }
  };

  const handleFilterReset = () => {
    setShowTable(false);
    setSelectedReseller(null);
    setFilterState({
      startDate: null,
      endDate: null,
      referenceNumber: null,
    });
  };

  const handleFilterSearch = () => {
    if (!selectedReseller?.value) {
      showSnackbar("Please select a reseller!", "error");
      return;
    }
    setShowTable(true);
    getPaymentData();
  };

  useEffect(() => {
    if (selectedReseller) {
      getPaymentData();
    }
  }, [paginationModel]);

  return (
    <Box className="page_container" sx={{ p: 0 }}>
      <Box
        className="section_container scroll"
        mt={2}
        gap={2}
        sx={{ px: "1rem !important" }}
      >
        <Grid item xs={12} my={2}>
          <AdvancedSearch
            showAdvanceSearch={showAdvanceSearch}
            handleFilterReset={handleFilterReset}
            handleFilterSearch={handleFilterSearch}
            setShowAdvanceSearch={setShowAdvanceSearch}
            hideButton={false}
            loading={loading}
            body={
              <>
                {hasAction(actions, "Export") && data?.length > 0 && (
                  <Button
                    className="mui-btn primary outlined"
                    startIcon={<Download />}
                    disabled={exportLoading}
                    onClick={() => {
                      exportPaymentHistory();
                    }}
                    sx={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "1rem",
                    }}
                  >
                    Export
                  </Button>
                )}
                <Grid item xs={12} mb={2}>
                  <Grid container>
                    <Grid item xs={3}>
                      <CustomAsyncPaginate
                        apiFunction={GET_ALL_RESELLER_API} // Pass the function directly
                        value={selectedReseller}
                        onChange={(value) => {
                          setSelectedReseller(value);
                          setShowTable(false);
                        }}
                        placeholder="Reseller"
                        pageSize={10}
                        dataPath="data.data.clients" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                        params={{ TypeTag: "RESELLER", StatusTag: "APPROVED" }}
                        customLabel={(item) =>
                          `${item.firstName} - ${item.name}`
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                {showOther && (
                  <>
                    {/*Payment Reference Number*/}
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="standard"
                        type="number"
                        value={filterState?.referenceNumber ?? ""}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            referenceNumber: e.target?.value,
                          }));
                        }}
                        label="Payment Reference Number"
                      />
                    </Grid>
                    {/* Start Date */}
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Start Date"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        inputProps={{
                          max: endDate
                            ? endDate
                            : new Date().toISOString().split("T")[0],
                        }}
                        value={filterState?.startDate ?? ""}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }));
                        }}
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    {/* End Date */}
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        variant="standard"
                        label="End Date"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        inputProps={{
                          max: new Date().toISOString().split("T")[0],
                          min: filterState?.startDate ?? "",
                        }}
                        value={filterState?.endDate ?? ""}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }));
                        }}
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
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
        </Grid>{" "}
        {showTable && (
          <Grid item xs={12} my={2} position={"relative"}>
            <MuiTable
              rowId="paymentRecordGuid"
              columns={[
                {
                  field: "clientFullName",
                  headerName: "Reseller Name",
                  width: 200,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                // {
                //   field: "accountNumber",
                //   headerName: "Postpaid Account ID",
                //   width: 200,
                // },
                {
                  field: "amount",
                  headerName: "Payment Amount",
                  width: 150,
                  renderCell: (params) => (
                    <span
                      style={{ color: params.value >= 0 ? "green" : "red" }}
                    >
                      {params.value}
                    </span>
                  ),
                },
                {
                  field: "currencyCode",
                  headerName: "Currency",
                  width: 100,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "paymentMethodName",
                  headerName: "Payment Method",
                  width: 150,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "referenceNumber",
                  headerName: "Reference Number",
                  width: 200,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "typeTag",
                  headerName: "Transaction Type",
                  width: 200,
                  renderCell: (params) => <span>{params.value ?? "--"}</span>,
                },
                {
                  field: "statusName",
                  headerName: "Status",
                  width: 150,
                  renderCell: (params) => (
                    <span
                      style={{
                        color:
                          params.value?.toLowerCase() === "success"
                            ? "green"
                            : params.value?.toLowerCase() === "pending"
                            ? "orange"
                            : "red",
                      }}
                    >
                      {params.value ?? "--"}
                    </span>
                  ),
                },
                {
                  field: "createdDate",
                  headerName: "Payment Date",
                  width: 150,
                  renderCell: (params) => (
                    <span>{getUnix_DD_MM_YYYY(params.value)}</span>
                  ),
                },
                {
                  field: "clientName",
                  headerName: "Entered By",
                  width: 200,
                },
              ]}
              data={data}
              loading={loading}
              setPaginationModel={setPaginationModel}
              paginationModel={paginationModel}
              totalRows={totalRows}
            />
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default GetActions(PaymentHistory);
