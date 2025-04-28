import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_PROVIDER_LOGS } from "../../../APIs/Logging";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";

function ProviderLog() {
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
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
      message: "",
      source: "",
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

  const getAllInfoLogs = async () => {
    setLoading(true);
    try {
      const values = formik.values;
      const fromDateTimestamp = values.fromDate
        ? Math.floor(new Date(values.fromDate).getTime() / 1000)
        : null;
      const toDateTimestamp = values.toDate
        ? Math.floor(new Date(values.toDate).getTime() / 1000)
        : null;

      let response = await GET_PROVIDER_LOGS({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        DateFrom: fromDateTimestamp,
        DateTo: toDateTimestamp,
        Source: values.source,
        Message: values.message,
      });

      const data =
        response?.data?.data?.infoLogs?.length > 0
          ? response?.data?.data?.infoLogs?.map((item, index) => ({
              id: item.id || index,
              ...item,
              message: item?.message,
              source: item?.source,
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
  useEffect(() => {
    getAllInfoLogs();
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
                  Provider Logs
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
                            key={"message"}
                            fullWidth
                            id={"message"}
                            name={"message"}
                            label={"Message"}
                            variant="standard"
                            type="text"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.message &&
                              Boolean(formik.errors.message)
                            }
                            helperText={
                              formik.touched.message && formik.errors.message
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl variant="standard" fullWidth>
                          <TextField
                            key={"source"}
                            fullWidth
                            id={"source"}
                            name={"source"}
                            label={"Procedure Name"}
                            variant="standard"
                            type="text"
                            value={formik.values.source}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.source &&
                              Boolean(formik.errors.source)
                            }
                            helperText={
                              formik.touched.source && formik.errors.source
                            }
                          />
                        </FormControl>
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
                      field: "source",
                      headerName: "Source",
                      flex: 1,
                    },
                    {
                      field: "message",
                      headerName: "Message",
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
export default GetActions(ProviderLog);
