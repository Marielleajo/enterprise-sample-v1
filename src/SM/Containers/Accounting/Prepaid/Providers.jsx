import { Add } from "@mui/icons-material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_ALL_PROVIDERS } from "../../../../APIs/Prepaid";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import AccountActivity from "./AccountActivity";
import ManageProvider from "./ManageProvider";

export default function Providers() {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const [manageAddPrepaid, setmanageAddPrepaid] = useState(false);
  const [manageAccountActivity, setManageAccountActivity] = useState(false);
  const [selectedRow, setselectedRow] = useState([]);

  const getAllPrepaid = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PROVIDERS({
        token,
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
  const handleAddAccountActivity = (data) => {
    setManageAccountActivity(true);
    setselectedRow(data);
  };
  const handleAddMangePrepaid = () => {
    setmanageAddPrepaid(true);
  };

  useEffect(() => {
    getAllPrepaid();
  }, [paginationModel]);

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <Grid item xs={12} md={4}></Grid>
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
                onClick={() => handleAddMangePrepaid()}
                startIcon={<Add />}
              >
                Add Prepaid Account
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
                // rowSelectionModel={rowSelectionModel}
                // setRowSelectionModel={setRowSelectionModel}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {manageAddPrepaid && (
        <MuiModal
          title="Add Prepaid"
          open={manageAddPrepaid}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageAddPrepaid(false)}
        >
          <ManageProvider
            type="add"
            loading={loading}
            setLoading={setLoading}
            setmanageAddPrepaid={setmanageAddPrepaid}
            getAllPrepaid={getAllPrepaid}
            selectedRow={selectedRow}
            setselectedRow={setselectedRow}
          />
        </MuiModal>
      )}
      {manageAccountActivity && (
        // <MuiModal
        //     title="Account Activity"
        //     open={manageAccountActivity}
        //     width="1200px"
        //     id="edit-contact-form"
        //     handleClose={() => setManageAccountActivity(false)}
        // >
        <AccountActivity
          loading={loading}
          setLoading={setLoading}
          setManageAccountActivity={setManageAccountActivity}
          getAllPrepaid={getAllPrepaid}
          selectedRow={selectedRow}
          type="provider"
        />
        // </MuiModal>
      )}
    </Box>
  );
}
