import { Add, Delete, Download, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormHelperText,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  DELETE_TAXES,
  EXPORT_ALL_TAXES,
  GET_ALL_COUNTRIES_API,
  GET_ALL_TAXES,
} from "../../../APIs/Taxes";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import ManageTaxes from "./ManageTaxes";

function Taxes() {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [manageAddTax, setmanageAddTax] = useState(false);
  const [manageEditTax, setmanageEditTax] = useState(false);
  const [selectedTax, setselectedTax] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      country: "",
    },
    onSubmit: (values) => {},
  });

  const handleFilterReset = () => {
    formik.resetForm();
    setResetFlag(true);
  };

  useEffect(() => {
    if (resetFlag) {
      getAllTaxes();
      setPaginationModel({ pageSize: 10, page: 0 });
      setResetFlag(false);
    }
  }, [resetFlag]);

  const handleFilterSearch = () => {
    setPaginationModel({ pageSize: 10, page: 0 });
    getAllTaxes();
  };

  const getAllCountries = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_COUNTRIES_API({});
      const options = response?.data?.data?.countries?.map((item) => ({
        value: item?.recordGuid,
        label: item?.name,
      }));
      setCountryOptions(options);
    } catch (e) {
      console.log("rresp", e);
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllTaxes = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_TAXES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryGuid: formik.values.country.value,
        FromDate: formik.values.fromDate,
        ToDate: formik.values.toDate,
      });
      const data =
        response?.data?.data?.taxes?.length > 0
          ? response?.data?.data?.taxes?.map((item) => ({
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

  const DeleteCost = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Log the value being deleted for debugging

        // Execute the delete request
        const deleteResponse = await DELETE_TAXES({
          RecordGuid: value?.recordGuid,
        });

        // Check the response
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: "Tax Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Deleting Tax",
            text: deleteResponse?.data?.message || "Unknown Error",
            icon: "error",
          });
        }

        // Refresh your data or perform any necessary actions
        getAllTaxes();
        setRowSelectionModel([]);
      } catch (e) {
        console.error("Error while deleting tax:", e);
        Swal.fire({
          title: "Error Deleting Tax",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  const exportAllTaxes = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_TAXES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryGuid: "",
        FromDate: "",
        ToDate: "",
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Taxes.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMangeTax = () => {
    setmanageAddTax(true);
  };

  const handleEditMangeTax = (data) => {
    setselectedTax(data);
    setmanageEditTax(true);
  };

  useEffect(() => {
    getAllCountries();
    getAllTaxes();
  }, [paginationModel]);

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
            {/* <Grid item xs={12} md={4}>
                            <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                                <Typography className="BreadcrumbsPage">Taxes</Typography>
                            </Breadcrumbs>
                        </Grid> */}
            <Grid
              item
              xs={6}
              md={8}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              {/* {rowSelectionModel?.length > 0 && (
                <Button
                  className="mui-btn primary filled"
                  id="send-service-provider-id"
                  // onClick={() => DeleteSelectedRows()}
                  startIcon={<DeleteIcon />}
                >
                  Delete All
                </Button>
              )} */}
              <Button
                className="mui-btn grey filled"
                id="send-service-provider-id"
                onClick={() => exportAllTaxes()}
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                className="mui-btn primary filled"
                id="send-service-provider-id"
                onClick={() => handleAddMangeTax()}
                startIcon={<Add />}
              >
                Add Tax
              </Button>
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
                      <Grid item xs={4}>
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                          value={formik?.values?.country}
                          onChange={(value) => {
                            formik.setFieldValue("country", value);
                            formik.setFieldValue("operator", "");
                          }}
                          placeholder="Country *"
                          pageSize={10}
                          dataPath="data.data.countries" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
                        />
                        {formik.touched.country && formik.errors.country && (
                          <FormHelperText>
                            {formik.errors.country}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="From Date"
                          name="fromDate"
                          value={formik.values.fromDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="To Date"
                          name="toDate"
                          value={formik.values.toDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
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
                    field: "rate",
                    headerName: "Tax Rate %",
                    flex: 1,
                  },
                  {
                    field: "countryName",
                    headerName: "Country",
                    flex: 1,
                  },
                  {
                    field: "fromDate",
                    headerName: "From Date",
                    flex: 1,
                    renderCell: (params) =>
                      params?.row?.fromDate
                        ? new Date(params?.row?.fromDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "",
                  },
                  {
                    field: "toDate",
                    headerName: "To Date",
                    flex: 1,
                    renderCell: (params) =>
                      params?.row?.fromDate
                        ? new Date(params?.row?.fromDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "",
                  },
                  {
                    field: "isForDisplayOnly",
                    headerName: "From Display Only",
                    flex: 1,
                    renderCell: (params) => (
                      <Switch checked={params.row.isForDisplayOnly} />
                    ),
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
                          <Tooltip title="Edit Tax">
                            <IconButton
                              onClick={() => handleEditMangeTax(params?.row)}
                              size="small"
                              id="editTax"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Tax">
                            <IconButton
                              onClick={() => DeleteCost(params?.row)}
                              size="small"
                              id="deleteTax"
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageAddTax && (
        <MuiModal
          title="Add Tax"
          open={manageAddTax}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageAddTax(false)}
        >
          <ManageTaxes
            type="add"
            loading={loading}
            setLoading={setLoading}
            setmanageAddTax={setmanageAddTax}
            selectedTax={selectedTax}
            setselectedTax={setselectedTax}
            getAllTaxes={getAllTaxes}
          />
        </MuiModal>
      )}

      {manageEditTax && (
        <MuiModal
          title="Edit Tax"
          open={manageEditTax}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageEditTax(false)}
        >
          <ManageTaxes
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setmanageEditTax={setmanageEditTax}
            selectedTax={selectedTax}
            setselectedTax={setselectedTax}
            getAllTaxes={getAllTaxes}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default GetActions(Taxes);
