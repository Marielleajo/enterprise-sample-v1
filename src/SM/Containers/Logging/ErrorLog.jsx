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
import { GET_ALL_USERS, GET_ERROR_LOGS } from "../../../APIs/Logging";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";

function ErrorLog() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
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
      user: "",
      context: "",
      errorMessage: "",
      errorCode: "",
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

  const getAllErrorLogs = async () => {
    setLoading(true);
    try {
      const values = formik.values;
      const fromDateTimestamp = values.fromDate
        ? Math.floor(new Date(values.fromDate).getTime() / 1000)
        : null;
      const toDateTimestamp = values.toDate
        ? Math.floor(new Date(values.toDate).getTime() / 1000)
        : null;

      let response = await GET_ERROR_LOGS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        DateFrom: fromDateTimestamp,
        DateTo: toDateTimestamp,
        ErrorCode: values.errorCode,
        ErrorMessage: values.errorMessage,
        Context: values.context,
        ClientGuid: values.user,
      });

      const data =
        response?.data?.data?.errorLogs?.length > 0
          ? response?.data?.data?.errorLogs?.map((item) => ({
              ...item,
              errorMessage: item?.errorMessage,
              errorCode: item?.errorCode,
              context: item?.context,
              user: item?.username,
              createdDate: item?.createdDate,
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

  const getAllUsers = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_USERS();
      const options = response?.data?.data?.clients?.map((item) => ({
        value: item?.recordGuid,
        label: item?.username,
      }));
      setUserOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  useEffect(() => {
    getAllErrorLogs();
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
                <Typography className="BreadcrumbsPage">Error Logs</Typography>
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
                            key={"errorMessage"}
                            fullWidth
                            id={"errorMessage"}
                            name={"errorMessage"}
                            label={"Error Message"}
                            variant="standard"
                            type="text"
                            value={formik.values.errorMessage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.errorMessage &&
                              Boolean(formik.errors.errorMessage)
                            }
                            helperText={
                              formik.touched.errorMessage &&
                              formik.errors.errorMessage
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"errorCode"}
                            fullWidth
                            id={"errorCode"}
                            name={"errorCode"}
                            label={"Error Code"}
                            variant="standard"
                            type="text"
                            value={formik.values.errorCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.errorCode &&
                              Boolean(formik.errors.errorCode)
                            }
                            helperText={
                              formik.touched.errorCode &&
                              formik.errors.errorCode
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"context"}
                            fullWidth
                            id={"context"}
                            name={"context"}
                            label={"Context"}
                            variant="standard"
                            type="text"
                            value={formik.values.context}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.context &&
                              Boolean(formik.errors.context)
                            }
                            helperText={
                              formik.touched.context && formik.errors.context
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel
                            id="user-label"
                            error={
                              formik.touched["user"] &&
                              Boolean(formik.errors["user"])
                            }
                          >
                            User
                          </InputLabel>
                          <Select
                            key="user"
                            id="user"
                            name="user"
                            label="User"
                            labelId="user-label"
                            value={formik.values.user}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {userOptions?.map((item) => (
                              <MenuItem key={item?.value} value={item?.value}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {formik.touched.user && formik.errors.user && (
                          <FormHelperText
                            style={{ color: theme?.palette?.error?.main }}
                          >
                            {formik.errors.user}
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
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "errorMessage",
                      headerName: "Error Message",
                      flex: 1,
                    },
                    {
                      field: "errorCode",
                      headerName: "Error Code",
                      flex: 1,
                    },
                    {
                      field: "context",
                      headerName: "Context",
                      flex: 1,
                    },
                    {
                      field: "user",
                      headerName: "User",
                      flex: 1,
                    },
                    {
                      field: "createdDate",
                      headerName: "Created Date",
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
