import { Add, Delete, Download, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  EXPORT_ALL_OPERATORS,
  GET_ALL_OPERATORS,
} from "../../../../APIs/Configuration";
import { DELETE_COSTS } from "../../../../APIs/Costs";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import GetActions from "../../../Utils/GetActions";
import ManageOperator from "./ManageOperator";

function Operator({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddOperator, setManageAddOperator] = useState(false);
  const [manageEditOperator, setManageEditOperator] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterReset = () => {
    setCountry("");
    setSearchQuery("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  useEffect(() => {
    getAllOperators({});
  }, [paginationModel]);

  // useEffect(() => {
  //   GetAllCountries();
  // }, []);

  const handleAddMangeOperator = () => {
    setManageAddOperator(true);
  };

  const handleEditMangeOperator = (data) => {
    setSelectedOperator(data);
    setManageEditOperator(true);
  };

  const DeleteOperator = async (value) => {
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
            title: "Operator Deleted Successfully",
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
        getAllOperators({});
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

  const getAllOperators = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATORS({
        token,
        search: searchQuery,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryGuid: country?.value ?? null,
      });

      const data =
        response?.data?.data?.items?.length > 0
          ? response?.data?.data?.items?.map((item) => ({
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

  const exportAllOperators = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_OPERATORS({
        token,
        search: "",
        CountryGuid: country?.value ? country?.value : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Operators.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

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
                <Typography className="BreadcrumbsPage">
                  Configurations
                </Typography>
                <Typography className="breadcrumbactiveBtn">
                  Operators
                </Typography>
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
              <Button
                className="mui-btn grey filled"
                id="send-service-country-id"
                onClick={() => exportAllOperators()}
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                className="mui-btn primary filled"
                id="send-service-country-id"
                onClick={() => handleAddMangeOperator()}
                startIcon={<Add />}
              >
                Add Operator
              </Button>
              <Button
                className="mui-btn secondary filled"
                id="send-service-country-id"
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
                      <Grid item xs={6}>
                        <FormControl fullWidth variant="standard">
                          <TextField
                            key={"name"}
                            fullWidth
                            id={"name"}
                            name={"name"}
                            label="Search by Name"
                            variant="standard"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        {/* <FormControl fullWidth variant="standard">
                          <InputLabel>Country</InputLabel>
                          <Select
                            key="country"
                            id="country" // Add an id for accessibility
                            name="country" // Name should match the field name in initialValues
                            value={country}
                            onChange={handleCountryChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>

                            {Countries?.map((country) => (
                              <MenuItem
                                key={country?.recordGuid}
                                value={country?.recordGuid}
                              >
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select> */}
                        {/* </FormControl> */}
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                          value={country}
                          onChange={(value) => {
                            setCountry(value);
                          }}
                          placeholder="Country *"
                          pageSize={10}
                          dataPath="data.data.countries" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
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
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    minWidth: 300,
                  },
                  {
                    headerName: "Country",
                    field: "country",
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params) => {
                      return params?.name || "";
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString());
                    },
                  },
                  {
                    field: "mcCsString",
                    headerName: "MCC",
                    flex: 1,
                    minWidth: 100,
                  },
                  {
                    field: "mnCsString",
                    headerName: "MNC",
                    flex: 1,
                    minWidth: 100,
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
                          <Tooltip title="Edit Operator">
                            <IconButton
                              onClick={() =>
                                handleEditMangeOperator(params?.row)
                              }
                              size="small"
                              id="editOperator"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Operator">
                            <IconButton
                              onClick={() => DeleteOperator(params?.row)}
                              size="small"
                              id="deleteOperator"
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
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {manageAddOperator && (
        <MuiModal
          title="Add Operator"
          open={manageAddOperator}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddOperator(false)}
        >
          <ManageOperator
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddOperator={setManageAddOperator}
            getAllOperators={getAllOperators}
          />
        </MuiModal>
      )}

      {manageEditOperator && (
        <MuiModal
          title="Edit Operator"
          open={manageEditOperator}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditOperator(false)}
        >
          <ManageOperator
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddOperator={setManageEditOperator}
            getAllOperators={getAllOperators}
            selectedOperator={selectedOperator}
            setSelectedOperator={setSelectedOperator}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translation")(GetActions(Operator));
