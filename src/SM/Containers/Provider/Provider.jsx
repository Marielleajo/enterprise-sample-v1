import { Add, Download, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  ASSIGN_SERVICE_TO_PROVIDER,
  EXPORT_ALL_PROVIDERS,
  GET_ALL_PROVIDER_CATEGORIES,
  GET_ALL_PROVIDERS,
} from "../../../APIs/Providers";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import AddProviderConfig from "./AddProviderConfig";
import EditProvider from "./EditProvider";
import { useSelector } from "react-redux";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProviderAccounts from "./ProviderAccounts";
import GetActions from "../../Utils/GetActions";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import swalGeneralFunction from "../../../Components/swalGeneralFunction";
import { useNavigate } from "react-router-dom";

function Provider({ t, actions }) {
  const navigate = useNavigate();
  let { menus } = useSelector((state) => state);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [goToConfigPage, setGoToConfigPage] = useState(false);
  const [providerGuid, setProviderGuid] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [showProviderAccount, setShowProviderAccount] = useState(false);

  // Filter vars
  const [filteredEmail, setFilteredEmail] = useState("");
  const [filteredIndustryName, setFilteredIndustryName] = useState("");
  const providerStatusOptions = ["Active", "Inactive"];
  const [statusOption, setStatusOption] = useState(null);

  const { services, currency } = useSelector((state) => state.system);
  const [showEditProvider, setShowEditProvider] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState(0);

  const showOmniConfiguration = import.meta.env.VITE_SHOW_OMNI_CONFIGURATION;

  console.log(" showOmniConfiguration ", showOmniConfiguration);

  const handleFilterReset = () => {
    setBusinessName("");
    setCategoriesOption("");
    setPaginationModel({ pageSize: 10, page: 0 });

    setFilteredEmail("");
    setFilteredIndustryName("");
    setStatusOption("");
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };
  const getAllProviders = async () => {
    setLoading(true);
    try {
      let postData = {
        pageIndex: paginationModel?.page + 1,
        pageSize: paginationModel?.pageSize,
        name: businessName,
        typeTag: "GENERAL",
        Status: statusOption ? (statusOption == "Active" ? true : false) : null,
      };

      if (filteredEmail) {
        postData = {
          ...postData,
          Email: filteredEmail,
        };
      }

      if (filteredIndustryName) {
        postData = {
          ...postData,
          IndustryName: filteredIndustryName,
        };
      }

      if (categoriesOption?.value?.length > 0) {
        postData = {
          ...postData,
          CategoryRecordGuid: categoriesOption?.value,
        };
      }

      let response = await GET_ALL_PROVIDERS(postData);
      const data =
        response?.data?.data?.providers?.length > 0
          ? response?.data?.data?.providers?.map((item) => ({
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

  const exportAllProviders = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_PROVIDERS({
        name: businessName ? businessName : null,
        CategoryRecordGuid: categoriesOption ? categoriesOption?.value : null,
        Email: filteredEmail,

        IndustryName: filteredIndustryName,
        Status: statusOption ? (statusOption == "Active" ? true : false) : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Providers.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getProviderCategories = async () => {
    try {
      let response = await GET_ALL_PROVIDER_CATEGORIES({});
      setCategoriesOptions(
        response?.data?.data?.providerCategories?.map((item) => ({
          label: item?.providerCategoryDetails[0].name,
          value: item?.recordGuid,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleWhatsappConfig = async (params) => {
    let result = await swalGeneralFunction(
      "Manage Configurations",
      `Are you sure you want to Assign this service to ${params?.name} ?`
    );

    if (result.isConfirmed) {
      try {
        let data = {
          ProviderGuid: params.recordGuid,
          ServiceGuid: services?.find((x) => x?.tag === "WHATSAPP")?.recordGuid,
          CurrencyGuid: currency[0].recordGuid,
        };
        let response = await ASSIGN_SERVICE_TO_PROVIDER({ formData: data });
        if (response?.data?.success) {
          showSnackbar("Service Assigned");
        }
      } catch (error) {
        showSnackbar(handleMessageError({ error }), "error");
      }
    }
  };

  useEffect(() => {
    getProviderCategories();
  }, []);

  useEffect(() => {
    getAllProviders();
  }, [paginationModel]);

  //   return null;

  return (
    <Box className="page_container" sx={{ overflowY: "auto", height: "90vh" }}>
      <Grid
        container
        columnSpacing={3}
        className="section_container"
        sx={{ pt: 0 }}
      >
        <Grid
          item
          xs={12}
          className="sub_section_container"
          sx={{ overflowY: "auto", minHeight: "80vh" }}
        >
          {!showEditProvider && !showProviderAccount ? (
            <Grid
              container
              paddingRight={2.5}
              display={"flex"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Grid
                item
                xs={12}
                md={12}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                {actions.includes("Export") && (
                  <Button
                    className="mui-btn primary outlined"
                    id="send-service-provider-id"
                    onClick={() => exportAllProviders()}
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                )}

                <Button
                  className="mui-btn primary outlined"
                  id="send-service-provider-id"
                  onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                >
                  <FilterAltIcon fontSize="small" />
                </Button>
                {actions.includes("Add") && (
                  <Button
                    className="mui-btn primary filled"
                    id="send-service-provider-id"
                    startIcon={<Add />}
                    onClick={() => navigate("/providers/new-provider")}
                  >
                    Add Provider
                  </Button>
                )}
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
                              key={"name"}
                              fullWidth
                              id={"name"}
                              name={"name"}
                              label="Name"
                              variant="standard"
                              type="text"
                              value={businessName}
                              onChange={(e) =>
                                setBusinessName(e?.target?.value)
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <FormControl fullWidth variant="standard">
                            <TextField
                              key={"email"}
                              fullWidth
                              id={"email"}
                              name={"email"}
                              label="Email"
                              variant="standard"
                              type="text"
                              value={filteredEmail}
                              onChange={(e) =>
                                setFilteredEmail(e?.target?.value)
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <CustomAsyncPaginate
                            apiFunction={GET_ALL_CLIENTS_CATEGORY}
                            onChange={(value) => {
                              setCategoriesOption(value);
                            }}
                            value={categoriesOption || ""}
                            placeholder="Client Category"
                            pageSize={10}
                            dataPath="data.data.clientCategory"
                            totalRowsPath="data.data.totalRows"
                            labelPath={"clientCategoryDetails"}
                            isNested={true}
                            method="GET"
                            id={`async-menu-style-accounts`}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <FormControl fullWidth variant="standard">
                            <TextField
                              key={"industryName"}
                              fullWidth
                              id={"industryName"}
                              name={"industryName"}
                              label="Industry Name"
                              variant="standard"
                              type="text"
                              value={filteredIndustryName}
                              onChange={(e) =>
                                setFilteredIndustryName(e?.target?.value)
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                              key="status"
                              id="status"
                              name="status"
                              label="status"
                              labelId="status-label"
                              onChange={(e) => {
                                setStatusOption(e.target.value);
                              }}
                              value={statusOption || ""}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {providerStatusOptions?.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                  {item}
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
                      headerName: "Business Name",
                      minWidth: 180,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "firstName",
                      headerName: "First Name",
                      minWidth: 100,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "lastName",
                      headerName: "Last Name",
                      minWidth: 100,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "titleTag",
                      headerName: "Type Tag",
                      minWidth: 100,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "email",
                      headerName: "Email",
                      flex: 1,
                      minWidth: 300,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "telephoneNumber",
                      headerName: "Telephone Number",
                      flex: 1,
                      minWidth: 180,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "mobileNumber",
                      headerName: "Mobile",
                      flex: 1,
                      minWidth: 180,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "engagementEmail",
                      headerName: "Engagement Email",
                      minWidth: 180,
                      flex: 1,
                      renderCell: (params) => params.row?.info?.engagementEmail,
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "supportEmail",
                      headerName: "Support Email",
                      minWidth: 180,
                      flex: 1,
                      renderCell: (params) => params.row?.info?.supportEmail,
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "billingEmail",
                      headerName: "Billing Email",
                      minWidth: 180,
                      flex: 1,
                      renderCell: (params) => params.row?.info?.billingEmail,
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "technicalEmail",
                      headerName: "Technical Email",
                      minWidth: 180,
                      flex: 1,
                      renderCell: (params) => params.row?.info?.technicalEmail,
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "alertsEmail",
                      headerName: "Alerts Email",
                      minWidth: 130,
                      flex: 1,
                      renderCell: (params) => params.row?.info?.alertsEmail,
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "typeTag",
                      headerName: "Type ",
                      minWidth: 100,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "category",
                      headerName: "Category",
                      flex: 1,
                      minWidth: 150,
                      hideable: true,
                      hidden: false,
                      renderCell: (value) => {
                        const category =
                          categoriesOptions?.length !== 0 &&
                          categoriesOptions?.find(
                            (x) =>
                              x.value === value.row?.providerCategoryRecordGuid
                          );
                        return category ? category?.label : "";
                      },
                      sortComparator: (v1, v2) => {
                        return v1?.toString().localeCompare(v2?.toString());
                      },
                    },
                    {
                      field: "industryName",
                      headerName: "Industry Name",
                      minWidth: 150,
                      flex: 1,
                      renderCell: (value) => {
                        return value.row?.info?.industryName;
                      },
                      hideable: true,
                      hidden: true,
                    },
                    {
                      field: "recordGuid",
                      headerName: "RecordGuid",
                      minWidth: 350,
                      flex: 1,
                      hideable: true,
                      hidden: false,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      minWidth: 330,
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "left",
                              width: "100%",
                              flexWrap: "wrap", // optional, helps if items overflow
                              gap: 0.5, // spacing between buttons
                            }}
                          >
                            <Tooltip title="Edit Provider">
                              <IconButton
                                onClick={() => {
                                  setSelectedProvider(params?.row);
                                  setShowEditProvider(true);
                                }}
                                size="small"
                                id="editCost"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="View Provider Accounts">
                              <IconButton
                                onClick={() => {
                                  setSelectedProvider(params?.row);
                                  setShowProviderAccount(true);
                                }}
                                size="small"
                                id="viewAccounts"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            {showOmniConfiguration === true && (
                              <>
                                <Tooltip title="MNP Config">
                                  <IconButton
                                    onClick={() => {
                                      setShowModal(true);
                                      setProviderGuid(params.row.recordGuid);
                                      setValue(0);
                                    }}
                                    size="small"
                                    id="editConfigMNP"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: "bold" }}
                                      fontSize="small"
                                      className="secondary grey"
                                    >
                                      MNP
                                    </Typography>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="HLR Config">
                                  <IconButton
                                    onClick={() => {
                                      setShowModal(true);
                                      setProviderGuid(params.row.recordGuid);
                                      setValue(1);
                                    }}
                                    size="small"
                                    id="editConfigHLR"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: "bold" }}
                                      fontSize="small"
                                      className="secondary grey"
                                    >
                                      HLR
                                    </Typography>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="SMS Config">
                                  <IconButton
                                    onClick={() => {
                                      setShowModal(true);
                                      setProviderGuid(params.row.recordGuid);
                                      setValue(3);
                                    }}
                                    size="small"
                                    id="editConfigSMS"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: "bold" }}
                                      fontSize="small"
                                      className="secondary grey"
                                    >
                                      SMS
                                    </Typography>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Email Config">
                                  <IconButton
                                    onClick={() => {
                                      setShowModal(true);
                                      setProviderGuid(params.row.recordGuid);
                                      setValue(2);
                                    }}
                                    size="small"
                                    id="editConfigEmail"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: "bold" }}
                                      fontSize="small"
                                      className="secondary grey"
                                    >
                                      EMAIL
                                    </Typography>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Whatsapp Config">
                                  <IconButton
                                    onClick={() =>
                                      handleWhatsappConfig(params.row)
                                    }
                                    size="small"
                                    id="editConfigWhatsapp"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: "bold" }}
                                      fontSize="small"
                                      className="secondary grey"
                                    >
                                      WHATSAPP
                                    </Typography>
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        );
                      },
                    },
                  ]}
                  showManageColumns={true}
                  data={Data}
                  loading={loading}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  totalRows={totalRows}
                />
              </Grid>
            </Grid>
          ) : (
            selectedProvider !== "" &&
            (showEditProvider ? (
              <EditProvider
                getAllProviders={getAllProviders}
                selectedProvider={selectedProvider}
                setShowEditProvider={setShowEditProvider}
              />
            ) : (
              showProviderAccount && (
                <ProviderAccounts
                  selectedProvider={selectedProvider}
                  setShowProviderAccount={setShowProviderAccount}
                />
              )
            ))
          )}
        </Grid>

        {!showEditProvider && providerGuid != "" && (
          <MuiModal
            open={showModal}
            width={800}
            handleClose={() => setShowModal(false)}
            title={"Manage Configurations"}
            style={{
              Height: "fit-content",
              maxHeight: "60vh",
              overflowY: "scroll",
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography className="BreadcrumbsPage">
                  {value == 0
                    ? "MNP"
                    : value == 1
                    ? "HLR"
                    : value == 2
                    ? "Email"
                    : "SMS"}{" "}
                  Configuration
                </Typography>
              </Grid>

              <Grid item xs={12} sx={{ pt: 0 }}>
                <AddProviderConfig
                  type={"edit"}
                  selectedProvider={providerGuid}
                  setGoToConfigPage={setGoToConfigPage}
                  setValue={setValue}
                  value={value}
                />
              </Grid>
            </Grid>
          </MuiModal>
        )}
      </Grid>
    </Box>
  );
}

export default withTranslation("translations")(GetActions(Provider));
