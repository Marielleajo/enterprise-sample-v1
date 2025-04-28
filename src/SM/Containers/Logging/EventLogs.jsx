import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GET_ALL_OPERATION_EVENT,
  GET_ALL_OPERATION_STATUS,
  GET_ALL_USERS,
  GET_ERROR_LOGS,
  GET_EVENT_LOGS,
} from "../../../APIs/Logging";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";

function EventLogs() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [operationStatusOptions, setOperationStatusOptions] = useState([]);
  const [operationEventOptions, setOperationEventOptions] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();
  const [resetFlag, setResetFlag] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      fromDate: yesterday,
      toDate: today,
      username: "",
      ipAddress: "",
      description: "",
      serviceId: "",
      operationStatus: "",
      operationEvent: "",
      error: "",
      instanceId: "",
    },
    onSubmit: (values) => {},
  });

  const handleNumberChangeIpAddress = (e) => {
    const value = e.target.value;
    if (/^[\d.]*$/.test(value)) {
      formik.setFieldValue("ipAddress", value);
    }
  };
  const handleNumberChangeIstanceId = (e) => {
    const value = e.target.value;
    if (/^[\d.]*$/.test(value)) {
      formik.setFieldValue("instanceId", value);
    }
  };

  const handleFilterReset = () => {
    formik.resetForm();
    setResetFlag(true);
  };

  const handleFilterSearch = () => {
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const getAllEventLogs = async () => {
    setLoading(true);
    try {
      const values = formik.values;
      const fromDateTimestamp = values.fromDate
        ? Math.floor(new Date(values.fromDate).getTime() / 1000)
        : null;
      const toDateTimestamp = values.toDate
        ? Math.floor(new Date(values.toDate).getTime() / 1000)
        : null;

      let response = await GET_EVENT_LOGS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CreatedDateFrom: fromDateTimestamp,
        CreatedDateTo: toDateTimestamp,
        IpAddressSearch: values.ipAddress,
        InstanceId: values.instanceId,
        Error: values.error,
        Username: values.username,
        operationStatus: values.operationStatus,
        EventStatus: values.operationEvent,
      });

      const data =
        response?.data?.data?.eventLogs?.length > 0
          ? response?.data?.data?.eventLogs?.map((item, index) => ({
              id: item.id || index,
              ...item,
              ipAddress: item?.ipAddress,
              username: item?.username,
              description: item?.description,
              instanceId: item?.instanceId,
              createdDate: item?.createdDate,
              operationStatus: item?.operationStatus,
              eventStatus: item?.eventStatus,
              serviceId: item?.serviceId,
            }))
          : [];
      setData(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllStatus = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATION_STATUS();
      const options = response?.data?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));
      setOperationStatusOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };
  const getAllEvent = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATION_EVENT();
      const options = response?.data?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      }));
      setOperationEventOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllStatus();
    getAllEvent();
  }, []);
  useEffect(() => {
    getAllEventLogs();
  }, [paginationModel]);

  useEffect(() => {
    if (resetFlag) {
      setPaginationModel({ pageSize: 10, page: 0 });
      setResetFlag(false);
    }
  }, [resetFlag]);
  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={12} md={4}>
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                <Typography className="BreadcrumbsPage">Event Logs</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid
              item
              xs={6}
              md={8}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Button
                className="mui-btn secondary filled"
                id="send-service-provider-id"
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
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="From Date"
                          name="fromDate"
                          value={formik.values.fromDate}
                          onChange={formik.handleChange}
                          //   InputProps={{
                          //     inputProps: {
                          //       min: new Date().toISOString().split("T")[0],
                          //     },
                          //   }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={
                            formik.touched.fromDate &&
                            Boolean(formik.errors.fromDate)
                          }
                          helperText={
                            formik.touched.fromDate && formik.errors.fromDate
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="To Date"
                          name="toDate"
                          value={formik.values.toDate}
                          onChange={formik.handleChange}
                          InputProps={{
                            inputProps: {
                              min: formik.values.fromDate,
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={
                            formik.touched.toDate &&
                            Boolean(formik.errors.toDate)
                          }
                          helperText={
                            formik.touched.toDate && formik.errors.toDate
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"ipAddress"}
                            fullWidth
                            id={"ipAddress"}
                            name={"ipAddress"}
                            label={"IP Address"}
                            variant="standard"
                            type="text"
                            value={formik.values.ipAddress}
                            onChange={handleNumberChangeIpAddress}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.ipAddress &&
                              Boolean(formik.errors.ipAddress)
                            }
                            helperText={
                              formik.touched.ipAddress &&
                              formik.errors.ipAddress
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"username"}
                            fullWidth
                            id={"username"}
                            name={"username"}
                            label={"Username"}
                            variant="standard"
                            type="text"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.username &&
                              Boolean(formik.errors.username)
                            }
                            helperText={
                              formik.touched.username && formik.errors.username
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"error"}
                            fullWidth
                            id={"error"}
                            name={"error"}
                            label={"Error"}
                            variant="standard"
                            type="text"
                            value={formik.values.error}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.error &&
                              Boolean(formik.errors.error)
                            }
                            helperText={
                              formik.touched.error && formik.errors.error
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"instanceId"}
                            fullWidth
                            id={"instanceId"}
                            name={"instanceId"}
                            label={"Instance Id"}
                            variant="standard"
                            type="text"
                            value={formik.values.instanceId}
                            onChange={handleNumberChangeIstanceId}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.instanceId &&
                              Boolean(formik.errors.instanceId)
                            }
                            helperText={
                              formik.touched.instanceId &&
                              formik.errors.instanceId
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel
                            id="operationStatus-label"
                            error={
                              formik.touched["operationStatus"] &&
                              Boolean(formik.errors["operationStatus"])
                            }
                          >
                            Operation Status
                          </InputLabel>
                          <Select
                            key="operationStatus"
                            id="operationStatus"
                            name="operationStatus"
                            label="operationStatus"
                            labelId="operationStatus-label"
                            value={formik.values.operationStatus}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {operationStatusOptions?.map((item) => (
                              <MenuItem key={item?.value} value={item?.value}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {formik.touched.operationStatus &&
                          formik.errors.operationStatus && (
                            <FormHelperText
                              style={{ color: theme?.palette?.error?.main }}
                            >
                              {formik.errors.operationStatus}
                            </FormHelperText>
                          )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel
                            id="operationEvent-label"
                            error={
                              formik.touched["operationEvent"] &&
                              Boolean(formik.errors["operationEvent"])
                            }
                          >
                            Event Status
                          </InputLabel>
                          <Select
                            key="operationEvent"
                            id="operationEvent"
                            name="operationEvent"
                            label="operationEvent"
                            labelId="operationEvent-label"
                            value={formik.values.operationEvent}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {operationEventOptions?.map((item) => (
                              <MenuItem key={item?.value} value={item?.value}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {formik.touched.operationEvent &&
                          formik.errors.operationEvent && (
                            <FormHelperText
                              style={{ color: theme?.palette?.error?.main }}
                            >
                              {formik.errors.operationEvent}
                            </FormHelperText>
                          )}
                      </Grid>
                    </>
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} marginTop={2}>
              <Card className="kpi-card">
                <MuiTable
                  getRowId={(row) => row.id}
                  columns={[
                    {
                      field: "instanceId",
                      headerName: "Instance ID",
                      flex: 1,
                    },
                    {
                      field: "username",
                      headerName: "Username",
                      flex: 1,
                    },
                    {
                      field: "ipAddress",
                      headerName: "IP Address",
                      flex: 1,
                    },
                    {
                      field: "description",
                      headerName: "Description",
                      flex: 1,
                    },
                    {
                      field: "serviceId",
                      headerName: "Service Id",
                      flex: 1,
                    },
                    {
                      field: "operationStatus",
                      headerName: "Operation Status",
                      flex: 1,
                    },
                  ]}
                  data={Data}
                  loading={loading}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  totalRows={totalRows}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GetActions(EventLogs);
