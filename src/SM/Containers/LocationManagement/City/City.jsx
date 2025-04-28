import { Add, Delete, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  CHANGE_STATUS_CITY,
  DELETE_CITY,
  EXPORT_ALL_OPERATORS,
  GET_ALL_CITIES,
} from "../../../../APIs/Configuration";
import { GET_ACTIVE_COUNTRIES_API } from "../../../../APIs/Criteria";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import ConfirmationModal from "../../../../Components/Dialog/ConfirmationModal";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import Notification from "../../../../Components/Notification/Notification";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError, hasAction } from "../../../Utils/Functions";
import GetActions from "../../../Utils/GetActions";
import ManageCity from "./ManageCity";

function City({ t, actions }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddState, setManageAddState] = useState(false);
  const [manageEditOperator, setManageEditOperator] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState([]);

  const [selectedPrefix, setSelectedState] = useState([]);

  const [modalOpenSwitchPrefixes, setModalOpenSwitchStatus] = useState(false);

  const [checkedSwitchPrefixes, setCheckedSwitchState] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [Countries, SetCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryISO, setCountryISO] = useState("");
  const [Name, setName] = useState("");
  useEffect(() => {
    getAllOperators({});
  }, [paginationModel]);
  const handleFilterReset = () => {
    setName("");
    setCountry("");
    setSearchQuery("");
    setCountryISO("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };
  useEffect(() => {
    GetAllCountries();
  }, []);

  const handleAddMangeState = () => {
    setManageAddState(true);
  };

  const handleEditMangeOperator = (data) => {
    setSelectedOperator(data);
    setManageEditOperator(true);
  };
  const handleModalCloseSwitchStatus = () => {
    setModalOpenSwitchStatus(false);
  };
  const handleSwitchChangeSwitchStatus = (rowId) => {
    setModalOpenSwitchStatus(true);
    setCheckedSwitchState(rowId);
  };

  const DeleteOperator = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_CITY(value?.recordGuid);

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "City Deleted Successfully",
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

  const handleSearch = () => {
    setPaginationModel({
      page: 0,
      pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
    });
  };
  const handleModalConfirmSwitchState = async () => {
    try {
      let postData = {
        RecordGuid: checkedSwitchPrefixes,
      };
      let response = await CHANGE_STATUS_CITY({
        postData,
      });
      if (response?.data?.success) {
        setPaginationModel({
          page: 0,
          pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        getAllOperators({});
        setModalOpenSwitchStatus(false);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ACTIVE_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const getAllOperators = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CITIES({
        token,
        Name: Name,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryIso: countryISO,
      });

      const data =
        response?.data?.data?.locations?.length > 0
          ? response?.data?.data?.locations?.map((item) => ({
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
                  Location Management
                </Typography>
                <Typography className="breadcrumbactiveBtn">City</Typography>
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
              {/* <Button
                className="mui-btn grey filled"
                id="send-service-country-id"
                onClick={() => exportAllOperators()}
                startIcon={<Download />}
              >
                Export
              </Button> */}
              {hasAction(actions, "Add") && (
                <Button
                  className="mui-btn primary filled"
                  id="send-service-country-id"
                  onClick={() => handleAddMangeState()}
                  startIcon={<Add />}
                >
                  Add City
                </Button>
              )}
              <Button
                className="mui-btn primary filled"
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
                  handleFilterSearch={handleSearch}
                  setShowAdvanceSearch={setShowAdvanceSearch}
                  loading={loading}
                  body={
                    <>
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <TextField
                            key={"Name"}
                            fullWidth
                            id={"Name"}
                            name={"Name"}
                            label="Search City by Name"
                            variant="standard"
                            type="text"
                            value={Name}
                            onChange={(e) => setName(e?.target?.value)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel>Country</InputLabel>
                          <Select
                            key="country"
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => {
                              // handleCountryChange(e);
                              setCountry(e.target.value);
                              setCountryISO(e.target.value?.isoCode);
                              // setRandomValue(Math.random());
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {Countries?.map((country) => (
                              <MenuItem
                                key={country?.recordGuid}
                                value={country}
                              >
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                    field: "description",
                    headerName: "Description",
                    flex: 1,
                    minWidth: 300,
                    renderCell: (params) => {
                      return <>{params?.row?.details[0]?.description}</>;
                    },
                  },
                  {
                    headerName: "Country",
                    field: "country",
                    flex: 1,
                    minWidth: 150,
                    renderCell: (params) => {
                      return params?.row?.country?.name || "";
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString());
                    },
                  },
                  {
                    field: "isActive",
                    headerName: "Status",
                    flex: 1,
                    minWidth: 100,
                    renderCell: (params) => {
                      const rowId = params?.row?.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={params.row?.isActive}
                                onChange={() => {
                                  handleSwitchChangeSwitchStatus(rowId);
                                  setSelectedState(params.row);
                                }}
                              />
                            }
                            label={params.row.isActive ? "Active" : "Inactive"}
                          />
                        </Box>
                      );
                    },
                  },

                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 1,
                    renderCell: (params) => {
                      return (
                        <>
                          {hasAction(actions, "Edit") && (
                            <Tooltip title="Edit City">
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
                          )}
                          {hasAction(actions, "Delete") && (
                            <Tooltip title="Delete City">
                              <IconButton
                                onClick={() => DeleteOperator(params?.row)}
                                size="small"
                                id="deleteOperator"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
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

      {manageAddState && (
        <MuiModal
          title="Add City"
          open={manageAddState}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddState(false)}
        >
          <ManageCity
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddState={setManageAddState}
            getAllOperators={getAllOperators}
          />
        </MuiModal>
      )}
      {modalOpenSwitchPrefixes && (
        <ConfirmationModal
          open={modalOpenSwitchPrefixes}
          onClose={handleModalCloseSwitchStatus}
          title={selectedPrefix?.isActive ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedPrefix?.isActive ? "deactivate " : "activate"
          } this City?`}
          onButtonClick={handleModalConfirmSwitchState}
        />
      )}

      {manageEditOperator && (
        <MuiModal
          title="Edit City"
          open={manageEditOperator}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditOperator(false)}
        >
          <ManageCity
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddState={setManageEditOperator}
            getAllOperators={getAllOperators}
            selectedOperator={selectedOperator}
            setSelectedOperator={setSelectedOperator}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translation")(GetActions(City));
