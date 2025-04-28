import { Add } from "@mui/icons-material";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import curlconverter from "curlconverter";
import jwt from "jsonwebtoken";
import { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import SwipeableEdgeDrawer from "../../../../../../Components/Drawer/Drawer";
import MuiModal from "../../../../../../Components/MuiModal/MuiModal";
import MuiSwitch from "../../../../../../Components/MuiSwitch";
import MuiTable from "../../../../../../Components/MuiTable/MuiTable";
import TabsComponent from "../../../../../../Components/Tabs/Tabs";
import { GET_ALL_CLIENT_API } from "../../../../../APIs/Clients";
import {
  GET_ALL_SMS_API,
  GET_APIS_BY_GROUP,
  UPDATE_API_STATUS,
} from "../../../../../APIs/NewSMSAPIS";
import Notification from "../../../../../Components/Notification/Notification";
import { useSnackbar } from "../../../../../Contexts/SnackbarContext";
import {
  HandleApiError,
  handleMessageError,
} from "../../../../../Utils/Functions";
import serviceUnavailableLogo from "../../../../../assets/paymentFailed.jpg";
import CodeBlock from "../../../../SingleMessage/Simulate/CodeBlock";
import { get_YYYY_MM_DD_HH_MM_SS } from "../../../../util/functions";
import NewAddRequestAPI from "../NewAddRequestAPI";
import "./../../Test.scss";
import TokenInfo from "./TokenInfo";

const ResellerNewSMS = (props) => {
  let { token, clientId, typeTag } = useSelector(
    (state) => state?.authentication
  );
  const copyTextRef = useRef();
  const [Code, SetCode] = useState(null);
  const programmingLanguages = [
    {
      label: "cUrl",
      value: "bash",
      convert: (text) => {
        return text;
      },
    },
    {
      label: "Python",
      value: "python",
      convert: (text) => {
        return curlconverter?.toPython(text);
      },
    },
    {
      label: "PHP",
      value: "php",
      convert: (text) => {
        return curlconverter?.toPhp(text);
      },
    },
    {
      label: "NodeJs",
      value: "javascript",
      convert: (text) => {
        return curlconverter?.toNodeRequest(text);
      },
    },
  ];
  const [toggleScopesList, setToggleScopesList] = useState(false);
  const [toggleGenerateCURL, setToggleGenerateCURL] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [state, setState] = useState({
    addIntegration: props?.location?.addIntegration || false,
    tableData: [],
    loading: false,
    externalId: "5",
    showIntegrationResponse: false,
    row: {},
    isMobile: window.innerWidth <= 670,
    isTablet: window.innerWidth <= 860,
  });
  const { t, actions } = props;

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [isLoading, setLoading] = useState(false);

  const [totalRows, setTotalRows] = useState(0);

  const [toggleAddIntegration, setToggleAddIntegration] = useState(false);

  const getAPIs = async ({ search = null, recordGuid = null }) => {
    setLoading(true);
    try {
      let response = await GET_ALL_SMS_API({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        groupGuid: "",
        clientId: recordGuid ? recordGuid : clientOption?.recordGuid,
        service: props?.service?.tag,
        isAdmin: true,
      });
      const data =
        response?.data?.data?.groups?.map((data) => ({
          ...data,
          name: data?.name ?? "",
          createdDate: data?.createdDate
            ? get_YYYY_MM_DD_HH_MM_SS(data?.createdDate, "-")
            : "",
          expiryDate: data?.expiryDate
            ? get_YYYY_MM_DD_HH_MM_SS(data?.expiryDate, "-")
            : "",
        })) || [];
      setState((prevState) => ({
        ...prevState,
        tableData: data,
      }));
      setTotalRows(response?.data?.data?.totalRows);
    } catch (e) {
      HandleApiError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (params) => {
    setLoading(true);
    const result = await Swal.fire({
      title: "Confirm Status Update",

      text: "Are you sure you want to update this api status?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // Perform the deletion operation
        let data = {
          groupGuid: params?.row?.recordGuid,
          isEnabled: params?.row?.isActive ? false : true,
        };
        let updateResponse = await UPDATE_API_STATUS({ data });

        if (updateResponse?.data?.success) {
          Notification?.success("API status updated successfully");
          // Refresh your data or perform any necessary actions
          getAPIs({});
          setLoading(false);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      actions?.includes("apikey-service:group:getgroupbyclientid:get") &&
      selectedTab == 0 &&
      clientOption?.recordGuid
    ) {
      getAPIs({});
    }
  }, [paginationModel, props?.service]);

  useEffect(() => {
    const decodedToken = jwt.decode(token);
    setState((prevState) => ({
      ...prevState,
      externalId: decodedToken?.externalUserId,
    }));
    handleMobileResize();
    handleTabletResize();
    window.addEventListener("resize", handleMobileResize);
    window.addEventListener("resize", handleTabletResize);

    return () => {
      window.removeEventListener("resize", handleMobileResize);
      window.removeEventListener("resize", handleTabletResize);
    };
  }, []);

  const handleMobileResize = () => {
    setState((prevState) => ({
      ...prevState,
      isMobile: window.innerWidth <= 670,
    }));
  };

  const handleTabletResize = () => {
    setState((prevState) => ({
      ...prevState,
      isTablet: window.innerWidth <= 860,
    }));
  };

  const [scopesList, setScopesList] = useState([]);

  const getScopes = async ({ groupId = "" }) => {
    try {
      let response = await GET_APIS_BY_GROUP({
        groupId: groupId,
        clientGuid: clientOption ? clientOption?.recordGuid : "",
      });
      setScopesList(response.data.data.api);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
    }
  };

  const toggleGetScopeList = (data) => {
    getScopes({ groupId: data });
    setToggleScopesList(!toggleScopesList);
  };

  const [accessTokenURL, setAccessTokenURL] = useState("");

  const toggleOpenCurlGenerator = (url) => {
    setAccessTokenURL(url);
    SetCode("");
    setToggleGenerateCURL(true);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const options = actions?.includes(
    "apikey-service:api:getapibyaccesstoken:get"
  )
    ? ["API List", "Access token"]
    : ["API List"];
  const { tableData, externalId, isMobile, isTablet } = state;

  const [curlInfo, setCurlInfo] = useState({
    apiToken: "",
    programmingLanguageOption: "",
  });

  useEffect(() => {
    const base_url = `https://mm-omni-api-software-${
      import.meta.env.REACT_APP_QA_OR_DEV
    }.montylocal.net/${
      accessTokenURL?.split("/")?.pop()?.toLocaleLowerCase() == "mnp" ||
      accessTokenURL?.split("/")?.pop()?.toLocaleLowerCase() == "hlr"
        ? "hlrmnp"
        : "notification"
    }${accessTokenURL}`;

    let endpoint = "";
    const headers = {
      Tenant: process?.env?.VITE_TENANT,
    };

    endpoint = `${base_url}`;
    headers["Authorization"] = `${curlInfo?.apiToken}`;
    SetCode(
      programmingLanguages?.find(
        (item) => item?.value === curlInfo?.programmingLanguageOption
      )?.convert(`curl -X GET "${endpoint}" \t
          -H "Tenant: ${headers.Tenant}" \t
          -H "api-key: ${headers.Authorization}"`)
    );
  }, [curlInfo]);

  const handleCopyToClipboard = () => {
    const element = copyTextRef.current;

    try {
      // Create a range object
      const range = document.createRange();

      // Create a selection object
      const selection = window.getSelection();

      // Select the text content of the element
      range.selectNodeContents(element);

      // Remove any existing selections
      selection.removeAllRanges();

      // Add the new range to the selection
      selection.addRange(range);

      // Execute the 'copy' command
      document.execCommand("copy");

      // Clear the selection
      selection.removeAllRanges();
      showSnackbar("Code copied successfully", "success");
    } catch (e) {
      console.log(e);
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  // Function to redirect to the Postman application
  const redirectToPostman = () => {
    const curlCommand = "curl --version";
    // Encode the cURL command to be passed as a parameter in the URL
    const encodedCurlCommand = encodeURIComponent(curlCommand);

    // Construct the full URL with the cURL command as a parameter
    const postmanURL = `postman://import/curl?data=${encodedCurlCommand}`;

    // Open Postman by setting window.location.href
    window.location.href = postmanURL;
  };

  const [clients, setClients] = useState(null);
  const [clientOption, setClientOption] = useState(null);
  const [tempClientOption, setTempClientOption] = useState(null);

  useEffect(() => {
    getAllClients({});
  }, []);
  const { sass } = useSelector((state) => state);

  const getAllClients = async ({ search = null }) => {
    setClients([]);
    try {
      let resellersResponse = {};
      if (sass?.KYC_ENABLED === "true") {
        resellersResponse = await GET_ALL_CLIENT_API({
          name: search,
          pageSize: 50000,
          pageNumber: 1,
          ParentGuid: clientId,
          kyc: 3,
        });
      } else {
        resellersResponse = await GET_ALL_CLIENT_API({
          name: search,
          pageSize: 50000,
          pageNumber: 1,
          ParentGuid: clientId,
        });
      }
      setClients(resellersResponse?.data?.data?.clients);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  return tempClientOption == "" || tempClientOption == null ? (
    <Grid item xs={12} paddingRight={2.5} className="sub_section_container">
      <Grid
        container
        className="pt-4 h-100"
        alignContent={"flex-center"}
        justifyContent={"center"}
      >
        <Grid
          item
          xs={isMobile || isTablet ? 12 : 4}
          display={isMobile || isTablet ? "flex" : "flex"}
          justifyContent={isMobile || isTablet ? "center" : "center"}
          alignItems={isMobile || isTablet ? "center" : "center"}
        >
          <Card className="kpi-card p-5">
            <FormControl sx={{ width: "300px" }} variant="standard">
              <Autocomplete
                options={clients?.length > 0 ? clients : []}
                getOptionLabel={(option) => option?.firstName}
                onChange={(e, value) => {
                  setClientOption(value);
                  setTempClientOption(value);
                  setSelectedTab(0);
                  if (value != null && value != "") {
                    getAPIs({ recordGuid: value?.recordGuid });
                  } else {
                    setState((prevState) => ({
                      ...prevState,
                      tableData: [],
                    }));
                  }
                }}
                value={tempClientOption}
                id="select-app"
                onInputChange={(e, newValue) => {
                  if (!newValue || e?.target?.value) {
                    getAllClients({ search: e?.target?.value });
                  }
                }}
                onClose={(event, reason) => {
                  if (reason === "selectOption" || reason === "blur") {
                  } else if (
                    reason === "toggleInput" ||
                    event?.target?.textContent == ""
                  ) {
                    getAllClients({});
                  }
                }}
                filterOptions={(options, params) => {
                  return options;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Client"
                    variant="standard"
                  />
                )}
              />
            </FormControl>
            <Grid item xs={12} marginTop={2}>
              <Grid
                container
                columnSpacing={3}
                className="section_container scroll"
              >
                <Box
                  mx={5}
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    textAlign={"center"}
                  >
                    <img
                      src={serviceUnavailableLogo}
                      alt="Service Unavailable"
                      width={"250px"}
                      height={"250px"}
                    />

                    <Typography variant="h6">
                      Please select a client!
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid item xs={12} paddingRight={2.5} className="sub_section_container">
      <Grid container className="pt-4" alignContent={"flex-start"}>
        <Grid
          item
          xs={isMobile || isTablet ? 12 : 4}
          display={isMobile || isTablet ? "flex" : ""}
          justifyContent={isMobile || isTablet ? "center" : ""}
          alignItems={isMobile || isTablet ? "center" : ""}
        >
          <Typography variant="h5">
            {" "}
            API - {props?.service?.service} Integration{" "}
          </Typography>
        </Grid>
        <Grid
          item
          xs={isMobile || isTablet ? 12 : 8}
          display={isMobile || isTablet ? "flex" : "flex"}
          justifyContent={isMobile || isTablet ? "center" : "end"}
          alignItems={isMobile || isTablet ? "center" : "center"}
        >
          <FormControl sx={{ width: "300px" }} variant="standard">
            <Autocomplete
              options={clients?.length > 0 ? clients : []}
              getOptionLabel={(option) => option?.firstName}
              onChange={(e, value) => {
                setClientOption(value);
                setSelectedTab(0);
                if (value != null && value != "") {
                  getAPIs({ recordGuid: value?.recordGuid });
                } else {
                  setState((prevState) => ({
                    ...prevState,
                    tableData: [],
                  }));
                }
              }}
              value={clientOption}
              id="select-app"
              onInputChange={(e, newValue) => {
                if (!newValue || e?.target?.value) {
                  getAllClients({ search: e?.target?.value });
                }
              }}
              onClose={(event, reason) => {
                if (reason === "selectOption" || reason === "blur") {
                } else if (
                  reason === "toggleInput" ||
                  event?.target?.textContent == ""
                ) {
                  getAllClients({});
                }
              }}
              filterOptions={(options, params) => {
                return options;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Client"
                  variant="standard"
                />
              )}
            />
          </FormControl>
          {tableData?.length > 0 &&
            clientOption != "" &&
            clientOption != null && (
              <Button
                startIcon={<Add />}
                className="mui-btn primary filled"
                onClick={() => setToggleAddIntegration(true)}
              >
                {isMobile || isTablet ? t("Create") : t("Create ")}
              </Button>
            )}
        </Grid>
        {(clientOption == "" || clientOption == null) && (
          <Grid item xs={12} marginTop={2}>
            <Grid
              container
              columnSpacing={3}
              className="section_container scroll"
            >
              <Box
                mx={5}
                minHeight={"80vh"}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"start"}
                  textAlign={"center"}
                >
                  <img
                    src={serviceUnavailableLogo}
                    alt="Service Unavailable"
                    width={"250px"}
                    height={"250px"}
                  />

                  <Typography variant="h6">Please select a client!</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        {clientOption != "" && clientOption != null && (
          <Grid item xs={12} marginTop={2}>
            <TabsComponent
              option={selectedTab}
              onClick={(data) => {
                setSelectedTab(data);
                setToggleScopesList(false);
                setPaginationModel({
                  pageSize: paginationModel?.pageSize,
                  page: 0,
                });
              }}
              options={options?.map((item, index) => {
                return { value: index, text: item };
              })}
            />
          </Grid>
        )}
        {selectedTab == 0 &&
          clientOption != "" &&
          clientOption != null &&
          (!toggleScopesList ? (
            <Grid item xs={12} marginTop={2}>
              <MuiTable
                rowId={"recordGuid"}
                columns={[
                  {
                    headerName: t("Integration Status"),
                    field: "isActive",
                    flex: 1,
                    renderCell: (params) => {
                      return params?.row?.recordGuid !=
                        "00000000-0000-0000-0000-000000000000" ? (
                        <div>
                          <FormControlLabel
                            className="p-0 m-0"
                            label={
                              params?.row?.isActive ? "Active" : "Inactive"
                            }
                            control={
                              <MuiSwitch
                                checked={params?.row?.isActive}
                                onChange={(e) => handleStatus(params)}
                              />
                            }
                          />
                        </div>
                      ) : (
                        <></>
                      );
                    },
                  },
                  {
                    headerName: t("Token Name"),
                    field: "name",
                    flex: 1,
                  },
                  {
                    headerName: t("Created Date"),
                    field: "createdDate",
                    flex: 1,
                  },
                  {
                    headerName: t("Expires"),
                    field: "expiryDate",
                    flex: 1,
                  },
                  {
                    headerName: t("Action"),
                    field: "action",
                    flex: 1,
                    renderCell: (params) => {
                      return (
                        actions?.includes(
                          "apikey-service:group:getapibygroupid:get"
                        ) && (
                          <Tooltip title="Show List of Scopes">
                            <IconButton
                              size="small"
                              onClick={() =>
                                toggleGetScopeList(params.row.recordGuid)
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        )
                      );
                    },
                  },
                ]}
                data={tableData}
                loading={isLoading}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                totalRows={totalRows}
              />
            </Grid>
          ) : (
            <Grid item xs={12} marginTop={2}>
              {scopesList?.map((item, index) => (
                <>
                  <ListItem
                    key={index}
                    component="div"
                    sx={{ paddingY: "10px" }}
                  >
                    <Grid container>
                      <Grid item xs={8} display="flex" alignItems={"center"}>
                        <ListItemText
                          primary={
                            item?.tag
                              ?.replace(/_/g, " ")
                              ?.toLowerCase()
                              ?.split(" ")
                              ?.map(
                                (word) =>
                                  word?.charAt(0)?.toUpperCase() +
                                  word?.slice(1)
                              )
                              ?.join(" ") +
                            " - " +
                            item?.url
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        display="flex"
                        alignItems={"center"}
                        justifyContent={"end"}
                      >
                        <Tooltip title="Test Integration">
                          <Button
                            startIcon={<SportsScoreIcon />}
                            className="mui-btn secondary filled"
                            onClick={() => toggleOpenCurlGenerator(item?.url)}
                          >
                            {t("Test API")}
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider sx={{ borderColor: "#000" }} />
                </>
              ))}
            </Grid>
          ))}
        {selectedTab == 1 && clientOption != "" && clientOption != null && (
          <Grid item xs={12} marginTop={2}>
            <TokenInfo isMobile={isMobile} isTablet={isTablet} t={t} />
          </Grid>
        )}
      </Grid>

      {(isMobile || isTablet) && toggleAddIntegration && (
        <SwipeableEdgeDrawer
          title="Create New API Integration"
          setToggleTestIntegration={setToggleAddIntegration}
          open={toggleAddIntegration}
          body={
            <NewAddRequestAPI
              setToggleAddIntegration={setToggleAddIntegration}
              toggleAddIntegration={toggleAddIntegration}
              setLoading={setLoading}
              loading={isLoading}
              getAPIs={getAPIs}
              clientOption={clientOption?.recordGuid}
              isMobile={isMobile}
              externalId={externalId}
            />
          }
        />
      )}

      {!isMobile && !isTablet && (
        <MuiModal
          open={toggleAddIntegration}
          width={700}
          handleClose={() => setToggleAddIntegration(false)}
          title={"Create New API Integration"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <NewAddRequestAPI
                setToggleAddIntegration={setToggleAddIntegration}
                toggleAddIntegration={toggleAddIntegration}
                setLoading={setLoading}
                loading={isLoading}
                isMobile={isMobile}
                getAPIs={getAPIs}
                clientOption={clientOption?.recordGuid}
                externalId={externalId}
              />
            </Grid>
          </Grid>
        </MuiModal>
      )}

      <MuiModal
        open={toggleGenerateCURL}
        width={700}
        handleClose={() => setToggleGenerateCURL(false)}
        title={"Test API Integration"}
      >
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Implement</Typography>
              <Typography variant="p">
                Implement the message for actual delivery.
              </Typography>
              <Grid container rowSpacing={4}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    variant="standard"
                    name="token"
                    label="Api Token"
                    values={curlInfo?.apiToken}
                    onChange={(e) => {
                      setCurlInfo({
                        ...curlInfo,
                        apiToken: e?.target?.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={8}></Grid>

                <Grid item xs={4}>
                  <Autocomplete
                    clearIcon={null}
                    id="combo-box-demo"
                    options={programmingLanguages}
                    onChange={(e, newValue) => {
                      setCurlInfo({
                        ...curlInfo,
                        programmingLanguageOption: newValue?.value,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Select Endpoint type"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={12} ref={copyTextRef}>
                  <CodeBlock
                    language={curlInfo?.programmingLanguageOption}
                    code={Code}
                  />
                </Grid>
                <Grid item xs={12}>
                  {curlInfo?.programmingLanguageOption != "" && (
                    <>
                      <Button
                        className="mui-btn primary outlined"
                        onClick={handleCopyToClipboard}
                      >
                        Copy Curl
                      </Button>
                      {/* <Button
                        className="mui-btn primary outlined"
                        onClick={redirectToPostman}
                      >
                        Try in Postman
                      </Button> */}
                    </>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </MuiModal>
    </Grid>
  );
};

export default withTranslation("translation")(ResellerNewSMS);
