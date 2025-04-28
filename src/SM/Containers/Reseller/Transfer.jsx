import {
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  GET_ADMIN_RESELLER_API,
  GET_ALL_CLIENT_RESELLER_API,
} from "../../../APIs/Resellers";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { HandleApiError } from "../../Utils/Functions";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

const TransferComponent = ({
  isOpen,
  type = null,
  closeModal,
  resellerId,
  t,
}) => {
  const [isLoading, SetLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [transferBalanceModal, setTransferBalanceModal] = useState(false);
  let { token } = useSelector((state) => state?.authentication);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [totalRows, SetTotalRows] = useState(0);

  const handleCloseModal = () => {
    // Call the closeModal function to close the modal
    closeModal();
  };

  const getAdminUsers = async ({ search = null }) => {
    SetLoading(true);
    try {
      let resellersResponse = await GET_ADMIN_RESELLER_API({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ParentGuid: resellerId,
      });
      SetData(resellersResponse?.data?.data?.users);
      SetTotalRows(resellersResponse?.data?.data?.totalRows);
    } catch (e) {
      HandleApiError(e);
    } finally {
      SetLoading(false);
    }
  };

  const getClientResellers = async ({ search = null }) => {
    SetLoading(true);
    try {
      let resellersResponse = await GET_ALL_CLIENT_RESELLER_API({
        token,
        search,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ParentGuid: resellerId,
      });
      SetData(resellersResponse?.data?.data?.clients);
      SetTotalRows(resellersResponse?.data?.data?.totalRows);
    } catch (e) {
      HandleApiError(e);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && type === "AdminUsers") {
      getAdminUsers({});
    } else if (isOpen && type === "Client") {
      getClientResellers({});
    }
  }, [paginationModel, isOpen]);

  let titleUsed = "";
  if (type === "AdminUsers") {
    titleUsed = "Reseller Admins";
  } else if (type === "Client") {
    titleUsed = "Reseller Clients";
  } else {
    titleUsed = "Reseller Rates";
  }

  return (
    <>
      <MuiModal
        title={titleUsed}
        open={isOpen}
        width="800px"
        handleClose={handleCloseModal} // Pass the function to handle modal closure
      >
        {type === "AdminUsers" && (
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item md={12} className="mb-2">
                <Typography variant="h5" className="pb-3">
                  <Grid item xs={12} marginTop={2}>
                    <MuiTable
                      rowId={"recordGuid"}
                      columns={[
                        {
                          field: "accountId",
                          headerName: "Account Id",
                          flex: 1,
                        },
                        {
                          field: "firstName",
                          headerName: "First Name",
                          flex: 1,
                        },
                        { field: "lastName", headerName: "Last Name", flex: 1 },
                        { field: "email", headerName: "Email", flex: 1 },
                        { field: "balance", headerName: "Balance", flex: 1 },
                        {
                          field: "balance",
                          headerName: "Balance",
                          flex: 1,
                          renderCell: (params) => {
                            return (
                              <>
                                <Tooltip title="Transfer Balance">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setTransferBalanceModal(true)
                                    }
                                  >
                                    <CurrencyExchangeIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            );
                          },
                        },
                      ]}
                      data={Data}
                      loading={isLoading}
                      setPaginationModel={setPaginationModel}
                      paginationModel={paginationModel}
                      totalRows={totalRows}
                    />
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}

        {type === "Client" && (
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item md={12} className="mb-2">
                <Typography variant="h5" className="pb-3">
                  <Grid item xs={12} marginTop={2}>
                    <MuiTable
                      rowId={"recordGuid"}
                      columns={[
                        {
                          field: "accountId",
                          headerName: "Account Id",
                          flex: 1,
                        },
                        { field: "balance", headerName: "Balance", flex: 1 },
                        {
                          field: "firstName",
                          headerName: "First Name",
                          flex: 1,
                        },
                        { field: "lastName", headerName: "Last Name", flex: 1 },
                        { field: "email", headerName: "Email", flex: 1 },
                        {
                          field: "accountType",
                          headerName: "Account Type",
                          flex: 1,
                        },
                      ]}
                      data={Data}
                      loading={isLoading}
                      setPaginationModel={setPaginationModel}
                      paginationModel={paginationModel}
                      totalRows={totalRows}
                    />
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        {type === "Rates" && (
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item md={12} className="mb-2">
                <Typography variant="h5" className="pb-3">
                  <Grid item xs={12} marginTop={2}>
                    <MuiTable
                      rowId={"recordGuid"}
                      columns={[
                        {
                          field: "countryCode",
                          headerName: "Country Code",
                          flex: 1,
                        },
                        {
                          field: "countryName",
                          headerName: "Country Name",
                          flex: 1,
                        },
                        {
                          field: "operatorName",
                          headerName: "Operator Name",
                          flex: 1,
                        },
                        {
                          field: "companyRate",
                          headerName: "Company Rate",
                          flex: 1,
                        },
                      ]}
                      data={Data}
                      loading={isLoading}
                      setPaginationModel={setPaginationModel}
                      paginationModel={paginationModel}
                      totalRows={totalRows}
                    />
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
      </MuiModal>

      <MuiModal
        title={"Transfer Balance"}
        open={transferBalanceModal}
        width={400}
        handleClose={() => setTransferBalanceModal(false)} // Pass the function to handle modal closure
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth variant="standard" label={t("Balance")} />
          </Grid>
          <Grid className="mt-2" item xs={12}>
            <Button className="mui-btn secondary outlined">
              Transfer
            </Button>
          </Grid>
        </Grid>
      </MuiModal>
    </>
  );
};

export default withTranslation("translation")(TransferComponent);
