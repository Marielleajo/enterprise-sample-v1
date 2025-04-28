import { Add, Delete, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import Swal from "sweetalert2";
import {
  CHANGE_STATUS_STATE,
  DELETE_STATE,
  EXPORT_ALL_STATES,
  GET_ALL_STATE,
} from "../../../../APIs/Configuration";
import { GET_ACTIVE_COUNTRIES_API } from "../../../../APIs/Criteria";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import ConfirmationModal from "../../../../Components/Dialog/ConfirmationModal";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError, hasAction } from "../../../Utils/Functions";
import GetActions from "../../../Utils/GetActions";
import ManageState from "./ManageState";
import { arSA } from "@mui/material/locale";

function State({ t, actions }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(true);
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

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };
  const handleFilterReset = () => {
    setName("");
    setCountry("");
    setSearchQuery("");
    setCountryISO("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };
  useEffect(() => {
    getAllStates();
  }, [paginationModel]);

  // useEffect(() => {
  //   GetAllCountries();
  // }, []);

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

  const DeleteState = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();

    if (result.isConfirmed) {
      try {
        setLoading(true);

        const deleteResponses = await DELETE_STATE(value?.recordGuid);

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "State Deleted Successfully",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        getAllStates();
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

  const getAllStates = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_STATE({
        token,
        Name: Name,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryIso: countryISO,
        search: searchQuery,
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
  const loadCountryOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ACTIVE_COUNTRIES_API({
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.countries?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.countries?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
          countryISO: item.isoCode,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };
  const exportAllStates = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_STATES({
        token,
        search: "",
        CountryGuid: country?.value ? country?.value : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `States.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };
  const handleModalConfirmSwitchState = async () => {
    setLoading(true);
    try {
      let postData = {
        RecordGuid: checkedSwitchPrefixes,
      };
      let response = await CHANGE_STATUS_STATE({
        postData,
      });

      if (response?.data?.success) {
        SetData((prevData) =>
          prevData.map((item) =>
            item.recordGuid === checkedSwitchPrefixes
              ? {
                  ...item,
                  isActive: response?.data?.data?.isActive,
                }
              : item
          )
        );
        setModalOpenSwitchStatus(false);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
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
                                <Typography className="breadcrumbactiveBtn">States</Typography>
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
                onClick={() => exportAllStates()}
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
                  Add State
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
                  body={
                    <>
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <TextField
                            key={"Name"}
                            fullWidth
                            id={"Name"}
                            name={"Name"}
                            label="Search State by Name"
                            variant="standard"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e?.target?.value)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <FormControl fullWidth variant="standard">
                          <InputLabel>Country</InputLabel>
                          <Select
                            key="country"
                            id="country" // Add an id for accessibility
                            name="country" // Name should match the field name in initialValues
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
                        </FormControl> */}
                        <AsyncPaginate
                          id="async-menu-style-accounts"
                          value={country}
                          loadOptions={loadCountryOptions}
                          additional={{
                            page: 1,
                          }}
                          onChange={(value) => {
                            setCountry(value);
                            setCountryISO(value?.countryISO);
                          }}
                          placeholder="Country"
                          classNamePrefix="react-select"
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
                      return params?.row?.country?.name || ""; // Extract the country name for sorting
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString()); // Sorting strings
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
                            <Tooltip title="Edit State">
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
                            <Tooltip title="Delete State">
                              <IconButton
                                onClick={() => DeleteState(params?.row)}
                                size="small"
                                id="DeleteState"
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
          title="Add State"
          open={manageAddState}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddState(false)}
        >
          <ManageState
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddState={setManageAddState}
            getAllStates={getAllStates}
          />
        </MuiModal>
      )}
      {modalOpenSwitchPrefixes && (
        <ConfirmationModal
          open={modalOpenSwitchPrefixes}
          loading={loading}
          onClose={handleModalCloseSwitchStatus}
          title={selectedPrefix?.isActive ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedPrefix?.isActive ? "deactivate " : "activate"
          } this State?`}
          onButtonClick={handleModalConfirmSwitchState}
        />
      )}

      {manageEditOperator && (
        <MuiModal
          title="Edit State"
          open={manageEditOperator}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditOperator(false)}
        >
          <ManageState
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddState={setManageEditOperator}
            getAllStates={getAllStates}
            selectedOperator={selectedOperator}
            setSelectedOperator={setSelectedOperator}
            SetData={SetData}
          />
        </MuiModal>
      )}
    </Box>
  );
}

export default withTranslation("translation")(GetActions(State));
