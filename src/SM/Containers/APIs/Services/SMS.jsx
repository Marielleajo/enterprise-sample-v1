import { Add, Edit } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  DELETE_API_RECORD,
  EXPORT_ALL_SMS_API,
  GET_ALL_SMS_API,
  UPDATE_API_STATUS,
} from "../../../../APIs/SMSAPIS";
import SwipeableEdgeDrawer from "../../../../../Components/Drawer/Drawer";
import MuiModal from "../../../../../Components/MuiModal/MuiModal";
import MuiSwitch from "../../../../../Components/MuiSwitch";
import MuiTable from "../../../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../../../Components/SwalDeleteFunction";
import Notification from "../../../../Components/Notification/Notification";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import {
  HandleApiError,
  handleMessageError,
} from "../../../../Utils/Functions";
import { get_YYYY_MM_DD_HH_MM_SS } from "../../../util/functions";
import AddRequestAPI from "../AddRequestAPI";
import EditRequestAPI from "../EditRequestAPI";
import TestIntegratedAPI from "../TestIntegratedAPI";
import WhatsappTest from "../WhatsappTest";
import "./../Test.scss";

const SMSService = (props) => {
  let { token, clientId, typeTag } = useSelector(
    (state) => state?.authentication
  );
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

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [isLoading, setLoading] = useState(false);

  const [totalRows, setTotalRows] = useState(0);

  const [toggleAddIntegration, setToggleAddIntegration] = useState(false);

  const [toggleEditIntegration, setToggleEditIntegration] = useState(false);

  const [toggleTestIntegration, setToggleTestIntegration] = useState(false);
  const [whatsappTest, setwhatsappTest] = useState(false);

  const getAPIs = async ({ search = null }) => {
    setLoading(true);
    try {
      let response = await GET_ALL_SMS_API({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        clientId:
          typeTag == "RESELLER"
            ? props.resellerClient?.recordGuid != undefined &&
              props.resellerClient?.recordGuid != null &&
              props.resellerClient?.recordGuid != ""
              ? props.resellerClient?.recordGuid
              : ""
            : clientId,
        service: props?.service?.tag,
      });
      const data =
        response?.data?.data?.apiList?.map((data) => ({
          ...data,
          name: data?.apiListTag?.replace(/_/g, " ") ?? "",
          createdDate: data?.createdDate
            ? get_YYYY_MM_DD_HH_MM_SS(data?.createdDate, "-")
            : "",
          apiStatus: data?.isRegistered ? "ACTIVE" : "INACTIVE",
        })) || [];
      setState((prevState) => ({
        ...prevState,
        tableData:
          typeTag == "RESELLER"
            ? props.resellerClient?.recordGuid != undefined &&
              props.resellerClient?.recordGuid != null &&
              props.resellerClient?.recordGuid != ""
              ? data
              : []
            : data,
      }));
      setTotalRows(
        typeTag == "RESELLER"
          ? props.resellerClient?.recordGuid != undefined &&
            props.resellerClient?.recordGuid != null &&
            props.resellerClient?.recordGuid != ""
            ? response?.data?.data?.totalRows
            : 0
          : response?.data?.data?.totalRows
      );
    } catch (e) {
      HandleApiError(e);
    } finally {
      setLoading(false);
    }
  };

  const DeleteRecord = async (params) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        let deleteResponse = await DELETE_API_RECORD({
          ApiGuid: params?.row?.recordGuid,
        });

        if (deleteResponse?.data?.success) {
          Notification?.success("Record deleted successfully");
          // Refresh your data or perform any necessary actions
          getAPIs({});
        }
      } catch (e) {
        showSnackbar(handleMessageError(e), "error");
      }
    }
  };

  const handleStatus = async (params) => {
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

        let updateResponse = await UPDATE_API_STATUS({
          ApiGuid: params?.row?.recordGuid,
          IsActive: params?.row?.isRegistered ? false : true,
        });

        if (updateResponse?.data?.success) {
          Notification?.success("API updated successfully");
          // Refresh your data or perform any necessary actions
          getAPIs({});
        }
      } catch (e) {
        showSnackbar(handleMessageError(e), "error");
      }
    }
  };

  useEffect(() => {
    if (props?.service) {
      getAPIs({});
    }
  }, [paginationModel, props?.service, props.resellerClient]);

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

  const [dataID, setDataID] = useState("");

  const setEditToggle = (value, data) => {
    setToggleEditIntegration(value);
    setDataID(data.row.recordGuid);
  };

  const setAddToggle = (value, data) => {
    setToggleAddIntegration(value);
    setDataID(data.row.apiListRecordGuid);
  };

  const exportCSV = async ({ search = null }) => {
    try {
      let response = await EXPORT_ALL_SMS_API({
        clientId:
          typeTag == "RESELLER" ? props.resellerClient?.recordGuid : clientId,
        service: props?.service?.tag,
      });

      if (response?.data?.data?.exportUrl) {
        window.open(
          response?.data?.data?.exportUrl,
          "_blank",
          "noopener,noreferrer"
        );
        showSnackbar("Export Successful", "success");
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
    }
  };

  const { t } = props;
  const { tableData, externalId, isMobile, isTablet } = state;
  return (
    <Grid
      item
      xs={props?.availableServices > 1 ? 9 : 12}
      paddingRight={2.5}
      className="sub_section_container"
    >
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
          display={isMobile || isTablet ? "flex" : ""}
          justifyContent={isMobile || isTablet ? "center" : ""}
          alignItems={isMobile || isTablet ? "center" : ""}
        >
          {/* {actions?.includes("Create APIS") && (
            <Button
              startIcon={<Add />}
              className="mui-btn primary filled"
              onClick={() => setToggleAddIntegration(true)}
            >
              {isMobile || isTablet ? t("Create") : t("Create ")}
            </Button>
          )} */}
          {
            <Button
              startIcon={<SportsScoreIcon />}
              className="mui-btn secondary filled"
              onClick={() => {
                if (props.service.tag === "WHATSAPP") {
                  setwhatsappTest(true);
                } else {
                  setToggleTestIntegration(true);
                }
              }}
            >
              {isMobile || isTablet ? t("Test API") : t("Test API")}
            </Button>
          }
          {
            <Button
              startIcon={<DownloadIcon />}
              className="mui-btn secondary filled"
              onClick={() => exportCSV({})}
            >
              {t("Export")}
            </Button>
          }
        </Grid>
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
                          params?.row?.isRegistered ? "Active" : "Inactive"
                        }
                        control={
                          <MuiSwitch
                            checked={params?.row?.isRegistered}
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
                headerName: t("Integration Name"),
                field: "name",
                flex: 1,
              },
              {
                headerName: t("API Key"),
                field: "apiListRecordGuid",
                flex: 1,
              },
              {
                headerName: t("Requested Date & Time"),
                field: "createdDate",
                flex: 1,
              },
              {
                headerName: t(""),
                field: "actions",
                flex: 1,
                renderCell: (params) => {
                  return (
                    <div>
                      {params?.row?.recordGuid !=
                        "00000000-0000-0000-0000-000000000000" && (
                        <IconButton
                          size="small"
                          onClick={() => setEditToggle(true, params)}
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {params?.row?.recordGuid ==
                        "00000000-0000-0000-0000-000000000000" && (
                        <Tooltip title="Create API">
                          <IconButton
                            size="small"
                            onClick={() => setAddToggle(true, params)}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
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
      </Grid>

      {whatsappTest && (
        <WhatsappTest
          apis={state?.tableData}
          open={whatsappTest}
          handleClose={() => setwhatsappTest(false)}
        />
      )}

      {(isMobile || isTablet) && toggleAddIntegration && (
        <SwipeableEdgeDrawer
          title="Create New API Integration"
          setToggleTestIntegration={setToggleAddIntegration}
          open={toggleAddIntegration}
          body={
            <AddRequestAPI
              setToggleAddIntegration={setToggleAddIntegration}
              toggleAddIntegration={toggleAddIntegration}
              setLoading={setLoading}
              loading={isLoading}
              getAPIs={getAPIs}
              dataID={dataID}
              isMobile={isMobile}
              externalId={externalId}
              service={props?.service}
            />
          }
        />
      )}

      {!isMobile && !isTablet && (
        <MuiModal
          open={toggleAddIntegration}
          width={1000}
          handleClose={() => setToggleAddIntegration(false)}
          title={"Create New API Integration"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AddRequestAPI
                dataID={dataID}
                setToggleAddIntegration={setToggleAddIntegration}
                toggleAddIntegration={toggleAddIntegration}
                setLoading={setLoading}
                loading={isLoading}
                isMobile={isMobile}
                getAPIs={getAPIs}
                externalId={externalId}
                service={props?.service}
              />
            </Grid>
          </Grid>
        </MuiModal>
      )}

      {(isMobile || isTablet) && toggleEditIntegration && (
        <SwipeableEdgeDrawer
          title="Edit API Integration"
          setToggleTestIntegration={setToggleEditIntegration}
          open={toggleEditIntegration}
          body={
            <EditRequestAPI
              setToggleEditIntegration={setToggleEditIntegration}
              toggleEditIntegration={toggleEditIntegration}
              setLoading={setLoading}
              loading={isLoading}
              dataID={dataID}
              isMobile={isMobile}
              getAPIs={getAPIs}
              externalId={externalId}
              service={props?.service}
            />
          }
        />
      )}

      {!isMobile && !isTablet && (
        <MuiModal
          open={toggleEditIntegration}
          width={1000}
          handleClose={() => setToggleEditIntegration(false)}
          title={"Edit API Integration"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EditRequestAPI
                setToggleEditIntegration={setToggleEditIntegration}
                toggleEditIntegration={toggleEditIntegration}
                setLoading={setLoading}
                isMobile={isMobile}
                loading={isLoading}
                dataID={dataID}
                getAPIs={getAPIs}
                externalId={externalId}
                service={props?.service}
              />
            </Grid>
          </Grid>
        </MuiModal>
      )}

      {(isMobile || isTablet) && toggleTestIntegration && (
        <SwipeableEdgeDrawer
          title="Test Integrated API"
          setToggleTestIntegration={setToggleTestIntegration}
          open={toggleTestIntegration}
          body={
            <TestIntegratedAPI
              setToggleTestIntegration={setToggleTestIntegration}
              toggleTestIntegration={toggleTestIntegration}
              setLoading={setLoading}
              loading={isLoading}
              getAPIs={getAPIs}
              isTablet={isTablet}
              isMobile={isMobile}
              Data={state?.tableData}
              externalId={externalId}
              service={props?.service}
            />
          }
        />
      )}

      {!isMobile && !isTablet && (
        <MuiModal
          open={toggleTestIntegration}
          width={"auto"}
          handleClose={() => setToggleTestIntegration(false)}
          title={"Test Integrated API"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TestIntegratedAPI
                setToggleTestIntegration={setToggleTestIntegration}
                toggleTestIntegration={toggleTestIntegration}
                setLoading={setLoading}
                loading={isLoading}
                getAPIs={getAPIs}
                Data={state?.tableData}
                externalId={externalId}
                service={props?.service}
              />
            </Grid>
          </Grid>
        </MuiModal>
      )}
    </Grid>
  );
};

export default withTranslation("translation")(SMSService);
