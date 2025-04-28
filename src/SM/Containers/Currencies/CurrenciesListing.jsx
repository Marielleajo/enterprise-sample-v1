import React, { useEffect, useState } from "react";
import { Delete, Download, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  EXPORT_ALL_CURRENCIES,
  GET_ALL_CURRENCIES,
  DELETE_CURRENCY,
  UPDATE_STATUS_CURRENCY,
} from "../../../APIs/Currencies";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import ManageCurrencies from "./ManageCurrencies";
import "./CurrenciesListing.scss";
import swalGeneralFunction from "../../../Components/swalGeneralFunction";

function CurrenciesListing({ t }) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageEditCurrencies, setManageEditCurrencies] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);

  useEffect(() => {
    getAllCurrencies();
  }, [paginationModel]);

  const handleEditMangeCurrencies = (data) => {
    setSelectedCurrencies(data);
    setManageEditCurrencies(true);
  };

  const handleDeleteCurrency = async (RecordGuid) => {
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      setLoading(true);
      try {
        if (!RecordGuid) {
          throw new Error("RecordGuid is undefined");
        }
        await DELETE_CURRENCY({
          token,
          currencyId: RecordGuid,
        });
        showSnackbar("Currency deleted successfully", "success");
        getAllCurrencies();
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const getAllCurrencies = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CURRENCIES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
      });
      const data =
        response?.data?.data?.currencies?.length > 0
          ? response?.data?.data?.currencies?.map((item) => ({
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

  const exportAllCurrencies = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_CURRENCIES({
        token,
        search: "",
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Currencies.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (recordGuid, currentStatus) => {
    const result = await swalGeneralFunction(
      "Change Status",
      `Are you sure you want to change the status of this currency to ${
        currentStatus ? "inactive" : "active"
      }?`
    );

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await UPDATE_STATUS_CURRENCY({
          recordGuid: recordGuid,
          isActive: !currentStatus,
        });
        showSnackbar("Currency status updated successfully", "success");
        getAllCurrencies();
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Grid item xs={12} className="sub_section_container">
        <Grid
          container
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Grid item xs={12} md={4} />
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
              id="export-rate"
              onClick={exportAllCurrencies}
              startIcon={<Download />}
            >
              Export
            </Button>
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <MuiTable
              rowId="recordGuid"
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                },
                {
                  field: "code",
                  headerName: "Code",
                  flex: 1,
                },
                {
                  field: "symbol",
                  headerName: "Symbol",
                  flex: 1,
                },
                {
                  field: "currencyEnum",
                  headerName: "Currency Enum",
                  flex: 1,
                },
                {
                  headerName: "Status",
                  field: "status",
                  renderCell: (params) => {
                    const data = params.row;
                    return (
                      <Box direction="row" spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data?.isActive}
                              onChange={() =>
                                handleStatusChange(
                                  data.recordGuid,
                                  data.isActive
                                )
                              }
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
                        <Tooltip title="Edit Currencies">
                          <IconButton
                            onClick={() =>
                              handleEditMangeCurrencies(params?.row)
                            }
                            size="small"
                            id="editCurrencies"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Currencies">
                          <IconButton
                            onClick={() =>
                              handleDeleteCurrency(params?.row.recordGuid)
                            }
                            size="small"
                            id="deleteCurrencies"
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

        {manageEditCurrencies && (
          <MuiModal
            title="Edit Currencies"
            open={manageEditCurrencies}
            width="500px"
            id="edit-currency-form"
            handleClose={() => setManageEditCurrencies(false)}
          >
            <ManageCurrencies
              loading={loading}
              setLoading={setLoading}
              setManageEditCurrencies={setManageEditCurrencies}
              getAllCurrencies={getAllCurrencies}
              selectedCurrencies={selectedCurrencies}
            />
          </MuiModal>
        )}
      </Grid>
    </>
  );
}

export default withTranslation("translations")(CurrenciesListing);
