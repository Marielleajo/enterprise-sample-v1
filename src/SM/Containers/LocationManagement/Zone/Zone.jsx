import {
  Add,
  Delete,
  Edit,
  FileDownload,
  FilterAlt,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import LeakRemoveIcon from "@mui/icons-material/LeakRemove";
import {
  DELETE_Zone,
  EXPORT_Zones,
  GET_ALL_ASSIGNED_COUNTRIES,
  GET_ALL_UNASSIGNED_COUNTRIES,
  GET_ALL_Zone,
  TOGGLE_Zone_STATUS,
  ASSIGN_COUNTRIES_TO_ZONE,
  UNASSIGN_COUNTRIES_TO_ZONE,
} from "../../../../APIs/Zone";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError, hasAction } from "../../../Utils/Functions";
import ManageZone from "./ManageZone";
import CustomList from "../../../../Components/CustomList";
import GetActions from "../../../Utils/GetActions";

function Zone({ t, actions }) {
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [manageEditZone, setManageEditZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [manageAddZone, setManageAddZone] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Separate search input state
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [unassignOpen, setUnassignOpen] = useState(false);
  const [assignedCountries, setAssignedCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    getAllZones();
  }, [paginationModel]);

  const getAllZones = async () => {
    setLoading(true);
    try {
      const response = await GET_ALL_Zone({
        pageSize: paginationModel.pageSize,
        pageNumber: paginationModel.page + 1,
        SearchKeyword: search ?? "",
      });

      const items = response?.data?.data?.zones;
      const data = items?.map((item) => ({
        id: item?.recordGuid,
        name: item?.name,
        tag: item?.tag,
        isActive: item?.isActive,
      }));

      setZones(data);
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };
  const getAllAssignedCountries = async (zoneGuid) => {
    setSelectedZone(zoneGuid);
    setAssignOpen(true);
    setLoading(true);
    try {
      const response = await GET_ALL_ASSIGNED_COUNTRIES({
        ZoneGuids: zoneGuid,
      });
      setAssignedCountries(response?.data?.data?.countries);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };
  const getAllUnassignedCountries = async (zoneGuid) => {
    setSelectedZone(zoneGuid);
    setUnassignOpen(true);
    setLoading(true);
    try {
      const response = await GET_ALL_UNASSIGNED_COUNTRIES({
        ZoneGuids: zoneGuid,
      });
      setAssignedCountries(response?.data?.data?.countries);
    } catch (error) {
      showSnackbar(handleMessageError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    setSearch(searchQuery); // Update the actual search state for the API
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset pagination if needed
  };

  const toggleActiveStatus = async (zone) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status of this zone?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const toggleResponse = await TOGGLE_Zone_STATUS(zone.id);

        if (toggleResponse?.data?.success) {
          Swal.fire({
            title:
              toggleResponse?.data?.message || "Status updated successfully!",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: toggleResponse?.data?.message || "Failed to update status",
            text: "Unknown error occurred",
            icon: "error",
          });
        }

        getAllZones();
      } catch (error) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteZone = async (zone) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        setLoading(true);
        const deleteResponse = await DELETE_Zone(zone?.id);
        if (deleteResponse?.data?.success) {
          Swal.fire({
            title: deleteResponse?.data?.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: deleteResponse?.data?.message,
            text: "Unknown Error",
            icon: "error",
          });
        }
        getAllZones();
      } catch (error) {
        Swal.fire({
          title:
            error?.response?.data?.message ||
            error?.response?.data?.errors?.Name?.[0] ||
            error?.response?.data?.result?.message ||
            "Error Deleting Zone",
          text: handleMessageError(error),
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddManageZone = () => {
    setManageAddZone(true);
  };

  const handleEditManageZone = (zone) => {
    setSelectedZone(zone);
    setManageEditZone(true);
  };

  const handleExportZones = async () => {
    try {
      const response = await EXPORT_Zones(search);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "zones.xlsx");
      document.body.appendChild(link);
      link.click();

      if (response?.data?.success) {
        showSnackbar(
          response?.data?.message || "Export successful!",
          "success"
        );
      }
    } catch (e) {
      let errorMessage = "Something Went Wrong";

      try {
        if (e?.response?.data instanceof Blob) {
          // Convert Blob to JSON
          const errorText = await e?.response?.data?.text();
          const errorJson = JSON.parse(errorText);
          errorMessage =
            errorJson?.message ||
            errorJson?.errors?.Name?.[0] ||
            errorJson?.result?.message ||
            errorMessage;
        } else {
          // If already JSON, access it directly
          errorMessage =
            e?.response?.data?.message ||
            e?.response?.data?.errors?.Name?.[0] ||
            e?.response?.data?.result?.message ||
            errorMessage;
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
      }

      showSnackbar(errorMessage, "error");
    }
  };

  const handleFilterReset = () => {
    setSearch("");
    setSearchQuery("");

    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const toggleAssignCountriesToZone = async () => {
    setLoading(true);
    try {
      let apiKey = unassignOpen
        ? ASSIGN_COUNTRIES_TO_ZONE
        : UNASSIGN_COUNTRIES_TO_ZONE;
      const resp = await apiKey({
        ZoneGuids: selectedZone,
        CountryGuids: selectedCountries.map((item) => item.recordGuid),
      });

      if (resp?.data?.success) {
        showSnackbar("Success !!");
        setAssignOpen(false);
        setUnassignOpen(false);
        setLoading(false);
        setSelectedCountries([]);
        setAssignedCountries([]);
        // getAllZones();
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      showSnackbar({ error, type: "validation" }, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Grid
                item
                xs={6}
                md={8}
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                {/* <Button
                  className="mui-btn primary filled"
                  onClick={handleExportZones}
                  startIcon={<FileDownload />}
                >
                  Export Zones
                </Button> */}
                {hasAction(actions, "Add") && (
                  <Button
                    className="mui-btn primary filled"
                    onClick={handleAddManageZone}
                    startIcon={<Add />}
                  >
                    Add Zone
                  </Button>
                )}
                <Button
                  className="mui-btn primary filled"
                  id="send-service-country-id"
                  onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                >
                  <FilterAlt fontSize="small" />
                </Button>
              </Grid>

              {showAdvanceSearch && (
                <Grid item xs={12}>
                  <AdvancedSearch
                    showAdvanceSearch={showAdvanceSearch}
                    handleFilterReset={handleFilterReset}
                    handleFilterSearch={handleSearchClick}
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
                              label="Search by Name"
                              variant="standard"
                              type="text"
                              value={searchQuery}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => setSearchQuery(e?.target?.value)}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    }
                  />
                </Grid>
              )}

              <Grid item xs={12} marginTop={2}>
                <MuiTable
                  rowId="id"
                  columns={[
                    {
                      field: "name",
                      headerName: "Name",
                      flex: 1,
                      minWidth: 200,
                    },
                    {
                      field: "tag",
                      headerName: "Tag",
                      flex: 1,
                      minWidth: 150,
                    },
                    {
                      field: "isActive",
                      headerName: "Status",
                      flex: 1,
                      renderCell: (params) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={params.row.isActive}
                              onChange={() => toggleActiveStatus(params.row)}
                              color="primary"
                            />
                          }
                          label={params.row.isActive ? "Active" : "Inactive"}
                        />
                      ),
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => (
                        <>
                          {hasAction(actions, "Edit") && (
                            <Tooltip title="Edit Zone">
                              <IconButton
                                onClick={() =>
                                  handleEditManageZone(params?.row)
                                }
                                size="small"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasAction(actions, "Assign Countries") && (
                            <Tooltip title="Assign Countries">
                              <IconButton
                                onClick={() =>
                                  getAllUnassignedCountries(params?.row?.id)
                                }
                                size="small"
                              >
                                <LeakAddIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasAction(actions, "unassign countries") && (
                            <Tooltip title="Unassign Countries">
                              <IconButton
                                onClick={() =>
                                  getAllAssignedCountries(params?.row?.id)
                                }
                                size="small"
                              >
                                <LeakRemoveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasAction(actions, "Delete") && (
                            <Tooltip title="Delete Zone">
                              <IconButton
                                onClick={() => deleteZone(params?.row)}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      ),
                    },
                  ]}
                  data={zones}
                  loading={loading}
                  paginationModel={paginationModel}
                  setPaginationModel={setPaginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {manageAddZone && (
          <MuiModal
            title="Add Zone"
            open={manageAddZone}
            width="500px"
            handleClose={() => setManageAddZone(false)}
          >
            <ManageZone
              type="add"
              loading={loading}
              setLoading={setLoading}
              setManageAddZone={setManageAddZone}
              setManageEditZone={setManageEditZone}
              getAllZones={getAllZones}
            />
          </MuiModal>
        )}

        {manageEditZone && (
          <MuiModal
            title="Edit Zone"
            open={manageEditZone}
            width="500px"
            handleClose={() => setManageEditZone(false)}
          >
            <ManageZone
              type="edit"
              loading={loading}
              setLoading={setLoading}
              setManageAddZone={setManageAddZone}
              setManageEditZone={setManageEditZone}
              getAllZones={getAllZones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
            />
          </MuiModal>
        )}
        <MuiModal
          width={550}
          title={
            unassignOpen
              ? "Assign Countries to Zone"
              : "Unassign Countries from Zone"
          }
          open={assignOpen || unassignOpen}
          handleClose={() => {
            setUnassignOpen(false);
            setAssignOpen(false);
            setSelectedCountries([]);
            setAssignedCountries([]);
          }}
        >
          <>
            <CustomList
              items={assignedCountries}
              selectedItems={selectedCountries}
              setSelectedItems={setSelectedCountries}
              isLoading={loading}
              itemKey="recordGuid"
            />

            <Grid container spacing={1} mt={2}>
              <Grid item xs={6}>
                <Button
                  className="mui-btn primary outlined"
                  onClick={() => {
                    setUnassignOpen(false);
                    setAssignOpen(false);
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  className="mui-btn primary filled"
                  fullWidth
                  disabled={loading || selectedCountries?.length === 0}
                  onClick={toggleAssignCountriesToZone}
                >
                  {!unassignOpen ? "Unassign" : "Assign"}
                </Button>
              </Grid>
            </Grid>
          </>
        </MuiModal>
      </Box>
    </>
  );
}

export default withTranslation("translations")(GetActions(Zone));
