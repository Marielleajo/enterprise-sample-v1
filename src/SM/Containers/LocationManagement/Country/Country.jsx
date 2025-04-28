import { Download } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EXPORT_ALL_STATES } from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import { handleMessageError } from "../../../Utils/Functions";
import Notification from "../../../../Components/Notification/Notification";
import ConfirmationModal from "../../../../Components/Dialog/ConfirmationModal";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import {
  GET_ALL_COUNTRIES,
  TOGGLE_COUNTRY_STATUS,
} from "../../../../APIs/Country";

function Country({ t }) {
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

  const handleFilterReset = () => {
    setName("");
    setCountry("");
    setSearchQuery("");
    setCountryISO("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };
  useEffect(() => {
    getAllCountries({});
  }, [paginationModel]);

  useEffect(() => {
    GetAllCountries();
  }, []);

  const handleModalCloseSwitchStatus = () => {
    setModalOpenSwitchStatus(false);
  };
  const handleSwitchChangeSwitchStatus = (rowId) => {
    setModalOpenSwitchStatus(true);
    setCheckedSwitchState(rowId);
  };

  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const getAllCountries = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_COUNTRIES({
        token,
        Name: Name,
        PageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        CountryIso: countryISO || "LB",
      });

      const data =
        response?.data?.data?.countries?.length > 0
          ? response?.data?.data?.countries?.map((item) => ({
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
      link.setAttribute("download", `Countries.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };
  const handleModalConfirmSwitchState = async () => {
    try {
      let postData = {
        RecordGuid: checkedSwitchPrefixes,
      };
      let response = await TOGGLE_COUNTRY_STATUS(checkedSwitchPrefixes);
      if (response?.data?.success) {
        setPaginationModel({
          page: 0,
          pageSize: paginationModel?.pageSize ? paginationModel?.pageSize : 10,
        });
        getAllCountries({});
        setModalOpenSwitchStatus(false);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setPaginationModel({ pageSize: 10, page: 0 });
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
              {/* <Button
                className="mui-btn primary filled"
                id="send-service-country-id"
                onClick={() => handleAddMangeState()}
                startIcon={<Add />}
              >
                Add State
              </Button> */}
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
                  handleFilterSearch={handleFilter}
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
                            label="Search Country by Name"
                            variant="standard"
                            type="text"
                            value={Name}
                            onChange={(e) => setName(e?.target?.value)}
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
                rowId="recordGuid"
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                    minWidth: 300,
                    // editable: true,
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

                  // {
                  //   field: "actions",
                  //   headerName: "Actions",
                  //   flex: 1,
                  //   renderCell: (params) => {
                  //     return (
                  //       <>
                  //         <Tooltip title="Edit Operator">
                  //           <IconButton
                  //             onClick={() =>
                  //               handleEditMangeOperator(params?.row)
                  //             }
                  //             size="small"
                  //             id="editOperator"
                  //           >
                  //             <Edit />
                  //           </IconButton>
                  //         </Tooltip>
                  //         <Tooltip title="Delete Operator">
                  //           <IconButton
                  //             onClick={() => DeleteState(params?.row)}
                  //             size="small"
                  //             id="DeleteState"
                  //           >
                  //             <Delete />
                  //           </IconButton>
                  //         </Tooltip>
                  //       </>
                  //     );
                  //   },
                  // },
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

      {modalOpenSwitchPrefixes && (
        <ConfirmationModal
          open={modalOpenSwitchPrefixes}
          onClose={handleModalCloseSwitchStatus}
          title={selectedPrefix?.isActive ? "Deactivate " : "Activate"}
          text={`Are you sure you want to ${
            selectedPrefix?.isActive ? "deactivate " : "activate"
          } this Country?`}
          onButtonClick={handleModalConfirmSwitchState}
        />
      )}
    </Box>
  );
}

export default withTranslation("translation")(Country);
