import { Add, Delete, Download, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  CHANGE_STATUS_MAIN,
  CHANGE_STATUS_MNC,
  DELETE_MNC,
  EXPORT_ALL_MNC,
  GET_ALL_MNC,
} from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import { GET_OPERATORS } from "../../../../APIs/SMSAPIS";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import ConfirmationModal from "../../../../Components/Dialog/ConfirmationModal";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import ManageMNC from "./ManageMNC";
import Notification from "../../../../Components/Notification/Notification";
import { AsyncPaginate } from "react-select-async-paginate";
import GetActions from "../../../Utils/GetActions";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function MNC({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddMNC, setManageAddMNC] = useState(false);
  const [manageEditMNC, setManageEditMNC] = useState(false);
  const [MNCNumber, setMNCNumber] = useState([]);
  const [country, setCountry] = useState([]);
  const [operator, setOperator] = useState([]);
  const [selectedMNC, setSelectedMNC] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [Countries, SetCountries] = useState([]);
  const [Operators, setOperators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomValue, setRandomValue] = useState("");

  const handleFilterReset = () => {
    setMNCNumber("");
    setCountry("");
    setOperator("");
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
    GetAllCountries();
  }, []);

  useEffect(() => {
    getAllMNC({});
  }, [paginationModel]);

  const handleAddMangeMNC = () => {
    setManageAddMNC(true);
  };

  const handleEditMangeMNC = (data) => {
    setSelectedMNC(data);
    setManageEditMNC(true);
  };

  const DeleteMNC = async (value) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_MNC({
          RecordGuid: value?.recordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "MNC Deleted Successfully",
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
        getAllMNC({});
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

  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: country.value,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
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

  const getAllMNC = async ({ search = null }) => {
    setLoading(true);
    try {
      let response = await GET_ALL_MNC({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        mnc: MNCNumber ? MNCNumber : null,
        CountryGuid: country.value ? country.value : null,
        OperatorGuid: operator?.value ? operator?.value : null,
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

  const exportAllMNC = async ({ search = null }) => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_MNC({
        token,
        search,
        mnc: MNCNumber ? MNCNumber : null,
        CountryGuid: country ? country : null,
        OperatorGuid: operator?.value ? operator?.value : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `MNC.csv`); // Set the desired file name
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

  const [modalOpenSwitchMain, setModalOpenSwitchMain] = useState(false);
  const [modalOpenSwitchMNC, setModalOpenSwitchMNC] = useState(false);
  const [checkedSwitchMNC, setCheckedSwitchMNC] = useState(false);
  const [checkedSwitchMain, setCheckedSwitchMain] = useState(false);

  const handleSwitchChangeSwitchMNC = (rowId) => {
    setModalOpenSwitchMNC(true);
    setCheckedSwitchMNC(rowId);
  };

  const handleSwitchChangeSwitchMain = (rowId) => {
    setModalOpenSwitchMain(true);
    setCheckedSwitchMain(rowId);
  };

  const handleModalCloseSwitchMNC = () => {
    setModalOpenSwitchMNC(false);
  };

  const handleModalCloseSwitchMain = () => {
    setModalOpenSwitchMain(false);
  };

  const handleModalConfirmSwitchMNC = async () => {
    try {
      let postData = {
        RecordGuid: checkedSwitchMNC,
      };
      let response = await CHANGE_STATUS_MNC({
        postData,
      });
      if (response?.data?.success) {
        setPaginationModel({
          page: 0,
          pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        getAllMNC({});
        setModalOpenSwitchMNC(false);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  const handleModalConfirmSwitchMain = async () => {
    try {
      let postData = {
        RecordGuid: checkedSwitchMain,
      };
      let response = await CHANGE_STATUS_MAIN({
        postData,
      });
      if (response?.data?.success) {
        setPaginationModel({
          page: 0,
          pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        getAllMNC({});
        setModalOpenSwitchMain(false);
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
                  Configurations
                </Typography>
                <Typography className="breadcrumbactiveBtn">MNC</Typography>
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
                onClick={() => exportAllMNC({})}
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                className="mui-btn primary filled"
                id="send-service-country-id"
                onClick={() => handleAddMangeMNC()}
                startIcon={<Add />}
              >
                Add MNC
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
                      <Grid item xs={4}>
                        <FormControl fullWidth variant="standard">
                          <TextField
                            key={"MNCNumber"}
                            fullWidth
                            id={"MNCNumber"}
                            name={"MNCNumber"}
                            label="Search by MNC Number"
                            variant="standard"
                            type="text"
                            value={MNCNumber}
                            onChange={(e) => setMNCNumber(e?.target?.value)}
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
                              handleCountryChange(e);
                              setRandomValue(Math.random());
                            }}
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
                          </Select>
                        </FormControl> */}
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                          value={country || ""}
                          onChange={(value) => {
                            console.log(value);
                            setCountry(value);
                            setRandomValue(Math.random());
                          }}
                          placeholder="Country *"
                          pageSize={10}
                          dataPath="data.data.countries" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <CustomAsyncPaginate
                          key={randomValue}
                          apiFunction={GET_OPERATORS}
                          value={operator}
                          onChange={(value) => {
                            setOperator(value);
                          }}
                          placeholder="Operator"
                          pageSize={10}
                          dataPath="data.data.items"
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style`}
                          params={{ iso: country.value }}
                          isDisabled={country == "" || country == undefined}
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
                    field: "mcc",
                    headerName: "MCC Number",
                    flex: 1,
                  },
                  {
                    field: "mnc",
                    headerName: "MNC Number",
                    flex: 1,
                  },
                  {
                    headerName: "Country",
                    field: "country",
                    flex: 1,
                    renderCell: (params) => {
                      return params?.row?.operator?.country?.name || ""; // Extract the country name for sorting
                    },
                    sortComparator: (v1, v2, cellParams1, cellParams2) => {
                      return v1?.toString().localeCompare(v2?.toString()); // Sorting strings
                    },
                  },
                  {
                    field: "operator",
                    headerName: "Operator",
                    flex: 1,
                    renderCell: (params) => {
                      return params?.row?.operator?.name || ""; // Extract the country name for sorting
                    },
                  },
                  {
                    field: "isMain",
                    headerName: "main",
                    flex: 1,
                    renderCell: (params) => {
                      const rowId = params?.row?.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={params.row?.isMain}
                                onChange={() => {
                                  handleSwitchChangeSwitchMain(rowId);
                                  setSelectedMNC(params.row);
                                }}
                              />
                            }
                          />
                        </Box>
                      );
                    },
                  },
                  {
                    field: "status",
                    headerName: "Status",
                    flex: 1,
                    renderCell: (params) => {
                      const rowId = params?.row?.recordGuid;
                      return (
                        <Box direction="row" spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={params.row?.isActive}
                                onChange={() => {
                                  handleSwitchChangeSwitchMNC(rowId);
                                  setSelectedMNC(params.row);
                                }}
                              />
                            }
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "left",
                            width: "100%",
                          }}
                        >
                          <Tooltip title="Edit MNC">
                            <IconButton
                              onClick={() => handleEditMangeMNC(params?.row)}
                              size="small"
                              id="editMNC"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete MNC">
                            <IconButton
                              onClick={() => DeleteMNC(params?.row)}
                              size="small"
                              id="deleteMNC"
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

      {manageAddMNC && (
        <MuiModal
          title="Add MNC"
          open={manageAddMNC}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddMNC(false)}
        >
          <ManageMNC
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddMNC={setManageAddMNC}
            getAllMNC={getAllMNC}
          />
        </MuiModal>
      )}

      {manageEditMNC && (
        <MuiModal
          title="Edit MNC"
          open={manageEditMNC}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditMNC(false)}
        >
          <ManageMNC
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddMNC={setManageEditMNC}
            getAllMNC={getAllMNC}
            selectedMNC={selectedMNC}
            setSelectedMNC={setSelectedMNC}
          />
        </MuiModal>
      )}

      {modalOpenSwitchMNC && (
        <ConfirmationModal
          open={modalOpenSwitchMNC}
          onClose={handleModalCloseSwitchMNC}
          title={selectedMNC?.isActive ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedMNC?.isActive ? "deactivate " : "activate"
          } this MNC?`}
          onButtonClick={handleModalConfirmSwitchMNC}
        />
      )}

      {modalOpenSwitchMain && (
        <ConfirmationModal
          open={modalOpenSwitchMain}
          onClose={handleModalCloseSwitchMain}
          title={selectedMNC?.isMain ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedMNC?.isMain ? "deactivate " : "activate"
          } this MNC to be main?`}
          onButtonClick={handleModalConfirmSwitchMain}
        />
      )}
    </Box>
  );
}

export default withTranslation("translation")(GetActions(MNC));
