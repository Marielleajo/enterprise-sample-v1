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
import { GET_ALL_TENANT, GET_SERVICE_LOGS } from "../../../APIs/Logging";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";

function ErrorLog() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [tenantOptions, setTenantOptions] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const { token } = useSelector((state) => state.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();
  const [resetFlag, setResetFlag] = useState(false);
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      finishFrom: "",
      finishTo: "",
      statusCode: "",
      instanceId: "",
      tenant: "",
      DateFinishFrom: "",
      DateFinishTo: "",
    },
    onSubmit: (values) => {},
  });

  const handleFilterReset = () => {
    formik.resetForm();
    setResetFlag(true);
  };

  const handleFilterSearch = () => {
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const getAllServiceLogs = async () => {
    setLoading(true);
    try {
      const values = formik.values;
      const fromDateTimestamp = values.fromDate
        ? Math.floor(new Date(values.fromDate).getTime() / 1000)
        : null;
      const toDateTimestamp = values.toDate
        ? Math.floor(new Date(values.toDate).getTime() / 1000)
        : null;
      const fromDateTimestampFinish = values.DateFinishFrom
        ? Math.floor(new Date(values.DateFinishFrom).getTime() / 1000)
        : null;
      const toDateTimestampFinish = values.DateFinishTo
        ? Math.floor(new Date(values.DateFinishTo).getTime() / 1000)
        : null;

      let response = await GET_SERVICE_LOGS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        DateStartFrom: fromDateTimestamp,
        DateStartTo: toDateTimestamp,
        InstanceId: values.instanceId,
        StatusCode: values.statusCode,
        TenantRecordGuid: values.tenant,
        DateFinishTo: toDateTimestampFinish,
        DateFinishFrom: fromDateTimestampFinish,
      });

      const data =
        response?.data?.data?.serviceLogs?.length > 0
          ? response?.data?.data?.serviceLogs?.map((item, index) => ({
              id: item.id || index,
              ...item,
              service: item?.ServiceTag,
              statusCode: item?.statusCode,
              instanceId: item?.instanceId,
              tenant: item?.tenantKey,
              createdDate: item?.startDate,
              finishedDate: item?.finishDate,
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

  const getAllTenant = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_TENANT();
      const options = response?.data?.data?.tenants?.map((item) => ({
        value: item?.recordGuid,
        label: item?.tenantKey,
      }));
      setTenantOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllTenant();
  }, []);
  useEffect(() => {
    getAllServiceLogs();
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
                <Typography className="BreadcrumbsPage">
                  Service Logs
                </Typography>
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
                          label="Start From"
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
                          label="Start To"
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
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="Date Finish From"
                          name="DateFinishFrom"
                          value={formik.values.DateFinishFrom}
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
                            formik.touched.DateFinishFrom &&
                            Boolean(formik.errors.DateFinishFrom)
                          }
                          helperText={
                            formik.touched.DateFinishFrom &&
                            formik.errors.DateFinishFrom
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="Date Finish To"
                          name="DateFinishTo"
                          value={formik.values.DateFinishTo}
                          onChange={formik.handleChange}
                          InputProps={{
                            inputProps: {
                              min: formik.values.DateFinishTo,
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={
                            formik.touched.DateFinishTo &&
                            Boolean(formik.errors.DateFinishTo)
                          }
                          helperText={
                            formik.touched.DateFinishTo &&
                            formik.errors.DateFinishTo
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"statusCode"}
                            fullWidth
                            id={"statusCode"}
                            name={"statusCode"}
                            label={"Status Code"}
                            variant="standard"
                            type="text"
                            value={formik.values.statusCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.statusCode &&
                              Boolean(formik.errors.statusCode)
                            }
                            helperText={
                              formik.touched.statusCode &&
                              formik.errors.statusCode
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
                            onChange={formik.handleChange}
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
                            id="tenant-label"
                            error={
                              formik.touched["tenant"] &&
                              Boolean(formik.errors["tenant"])
                            }
                          >
                            Tenant
                          </InputLabel>
                          <Select
                            key="tenant"
                            id="tenant"
                            name="tenant"
                            label="tenant"
                            labelId="tenant-label"
                            value={formik.values.tenant}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {tenantOptions?.map((item) => (
                              <MenuItem key={item?.value} value={item?.value}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {formik.touched.tenant && formik.errors.tenant && (
                          <FormHelperText
                            style={{ color: theme?.palette?.error?.main }}
                          >
                            {formik.errors.tenant}
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
                      field: "service",
                      headerName: "Service",
                      flex: 1,
                    },
                    {
                      field: "tenantKey",
                      headerName: "Tenant Key",
                      flex: 1,
                    },
                    {
                      field: "statusCode",
                      headerName: "Status Code",
                      flex: 1,
                    },
                    {
                      field: "instanceId",
                      headerName: "Instance Id",
                      flex: 1,
                    },
                    {
                      field: "createdDate",
                      headerName: "Created Date",
                      flex: 1,
                    },
                    {
                      field: "finishedDate",
                      headerName: "Finished Date",
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

export default GetActions(ErrorLog);
