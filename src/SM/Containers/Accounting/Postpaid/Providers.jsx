import { Add, ArrowBack } from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_ALL_PROVIDERS, GET_THRESHOLD } from "../../../../APIs/Postpaid";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import AddPayment from "./AddPayment";
import BalanceLimit from "./BalanceLimit";
import ManageProvider from "./ManageProvider";
import AccountActivity from "./AccountActivity.jsx";

export default function Providers() {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [manageAddPostpaid, setmanageAddPostpaid] = useState(false);
  const [manageSetNewLimit, setManageSetNewLimit] = useState(false);
  const [manageDownPayment, setManageDownPayment] = useState(false);
  const [manageAccountActivity, setManageAccountActivity] = useState(false);
  const [selectedRow, setselectedRow] = useState([]);
  const [valueThreshold, setValueThreshold] = useState("");

  const getAllPostpaid = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PROVIDERS({
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        // ParentGuid: formik.values.reseller
      });

      const data =
        response?.data?.data?.accounts?.length > 0
          ? response?.data?.data?.accounts?.map((item) => ({
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

  const handleSetNewLimitMange = (data) => {
    setManageSetNewLimit(true);
    setselectedRow(data);
  };
  const handleAddMangeDownPayment = (data) => {
    setManageDownPayment(true);
    setselectedRow(data);
  };
  const handleAddAccountActivity = (data) => {
    setManageAccountActivity(true);
    setselectedRow(data);
  };
  const handleAddMangePostpaid = () => {
    setmanageAddPostpaid(true);
  };

  const getAllConfiguration = async () => {
    setLoading(true);
    try {
      let response = await GET_THRESHOLD({ PageSize: "1000" });
      // setGlobalConfiguration(response?.data?.data?.globalConfigurations);
      setValueThreshold(
        response?.data?.data?.globalConfigurations?.find(
          (x) => x?.key === "BILLING.PROVIDER_POSTPAID_THRESHOLD_PERCENTAGE"
        )?.value
      );
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPostpaid();
  }, [paginationModel]);
  useEffect(() => {
    getAllConfiguration();
  }, []);

  return (
    <Grid item xs={12} className="sub_section_container" sx={{ width: "100%" }}>
      {manageAccountActivity ? (
        <Box display="flex" alignItems="start" flexDirection="column" mt={2}>
          <IconButton onClick={() => setManageAccountActivity(false)}>
            <Box sx={{ fontSize: "1rem" }}>
              <ArrowBack sx={{ fontSize: 20, mr: 0.5 }} />
              Account Activity
            </Box>
          </IconButton>
          <AccountActivity
            loading={loading}
            setLoading={setLoading}
            setManageAccountActivity={setManageAccountActivity}
            getAllPostpaid={getAllPostpaid}
            selectedRow={selectedRow}
            type="provider"
          />
        </Box>
      ) : (
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
            <Button
              className="mui-btn primary filled"
              id="send-service-provider-id"
              onClick={() => handleAddMangePostpaid()}
              startIcon={<Add />}
            >
              Add Postpaid Account
            </Button>
          </Grid>
          <Grid item xs={12} marginTop={2}>
            <MuiTable
              rowId="recordGuid"
              columns={[
                {
                  field: "providerName",
                  headerName: "Name",
                  width: 200,
                },
                {
                  field: "accountNumber",
                  headerName: "Account Number",
                  width: 200,
                },
                {
                  field: "balanceLimit",
                  headerName: "Balance Limit",
                  width: 200,
                },
                {
                  field: "currentBalance",
                  headerName: "Current Balance",
                  width: 200,
                },
                {
                  field: "lastRecharge",
                  headerName: "Last Recharge",
                  width: 200,
                },
                {
                  field: "previousBalance",
                  headerName: "Previous Balance",
                  width: 200,
                },
                {
                  field: "currencyCode",
                  headerName: "Currency",
                  width: 200,
                },
                {
                  field: "actions",
                  headerName: "Actions",
                  width: 200,
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
                        <Tooltip title="Set New Balance Limit">
                          <IconButton
                            onClick={() => handleSetNewLimitMange(params?.row)}
                            size="small"
                            id="setNewLimit"
                          >
                            <AlarmOnIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Down Payment">
                          <IconButton
                            onClick={() =>
                              handleAddMangeDownPayment(params?.row)
                            }
                            size="small"
                            id="downPayment"
                          >
                            <AddCardIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Account Activity">
                          <IconButton
                            onClick={() =>
                              handleAddAccountActivity(params?.row)
                            }
                            size="small"
                            id="accountActivity"
                          >
                            <SyncAltIcon />
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
      )}

      {manageSetNewLimit && (
        <MuiModal
          title="Balance Limit"
          open={manageSetNewLimit}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageSetNewLimit(false)}
        >
          <BalanceLimit
            loading={loading}
            setLoading={setLoading}
            setManageSetNewLimit={setManageSetNewLimit}
            getAllPostpaid={getAllPostpaid}
            selectedRow={selectedRow}
            setselectedRow={setselectedRow}
            type="provider"
          />
        </MuiModal>
      )}
      {manageAddPostpaid && (
        <MuiModal
          title="Add Postpaid"
          open={manageAddPostpaid}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageAddPostpaid(false)}
        >
          <ManageProvider
            type="add"
            loading={loading}
            setLoading={setLoading}
            setmanageAddPostpaid={setmanageAddPostpaid}
            getAllPostpaid={getAllPostpaid}
            valueThreshold={valueThreshold}
          />
        </MuiModal>
      )}

      {manageDownPayment && (
        <MuiModal
          title="Add Down Payment"
          open={manageDownPayment}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageDownPayment(false)}
        >
          <AddPayment
            loading={loading}
            setLoading={setLoading}
            setManageDownPayment={setManageDownPayment}
            getAllPostpaid={getAllPostpaid}
            selectedRow={selectedRow}
            type="provider"
          />
        </MuiModal>
      )}
    </Grid>
  );
}
