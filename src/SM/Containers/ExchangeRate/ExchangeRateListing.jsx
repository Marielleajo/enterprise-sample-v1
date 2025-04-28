import { Add, Download, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import {
  EXPORT_ALL_EXCHANGERATES,
  GET_ALL_EXCHANGERATES,
} from "../../../APIs/ExchangeRate";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import ManageExchangeRate from "./ManageExchangeRate";
import { useLocation } from "react-router-dom";

function ExchangeRateListing({ t }) {
  const location = useLocation();
  const [service, setService] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [manageAddExchangeRate, setManageAddExchangeRate] = useState(false);
  const [manageEditExchangeRate, setManageEditExchangeRate] = useState(false);
  const [importExchangeRate, setImportExchangeRate] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [clientCategoryOptions, setClientCategoryOptions] = useState([]);
  const [clientCategoryOption, setClientCategoryOption] = useState([]);

  const [selectedExchangeRate, setSelectedExchangeRate] = useState([]);
  const [randomValue, setRandomValue] = useState("");
  const [file, setFile] = useState({
    file: null,
    fileName: "",
  });
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);

  const getAllClientCategory = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS_CATEGORY();
      const options = response?.data?.data?.clientCategory?.map((item) => ({
        value: item?.recordGuid,
        label: item?.clientCategoryDetails[0]?.name,
      }));
      setClientCategoryOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterReset = () => {
    setClientCategoryOption("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  const handleAddMangeExchangeRate = () => {
    setManageAddExchangeRate(true);
  };

  const handleEditMangeExchangeRate = (data) => {
    setSelectedExchangeRate(data);
    setManageEditExchangeRate(true);
  };

  const getAllExchangeRates = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_EXCHANGERATES({
        token,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ClientCategoryGuid: clientCategoryOption,
      });

      const data =
        response?.data?.data?.exchangeRates?.length > 0
          ? response?.data?.data?.exchangeRates.map((item) => ({
              ...item,
            }))
          : [];

      SetData(data);
      SetTotalRows(response?.data?.totalRows ?? 0);
    } catch (e) {
      console.error("Error fetching exchange rates:", e);
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportAllExchangeRates = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_EXCHANGERATES({
        token,
        search: "",
      });

      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ExchangeRates.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error("Error exporting exchange rates:", e);
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getAllClientCategory();
  // }, []);

  useEffect(() => {
    getAllExchangeRates();
  }, [paginationModel]);

  return (
    <>
      <Grid item xs={12} className="sub_section_container">
        <Grid
          container
          className=""
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Grid item xs={12} md={4}></Grid>
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
              id="export-exchangerate"
              onClick={() => exportAllExchangeRates()}
              startIcon={<Download />}
            >
              Export
            </Button>
            <Button
              className="mui-btn primary filled"
              id="add-exchangerate"
              onClick={() => handleAddMangeExchangeRate()}
              startIcon={<Add />}
            >
              Add ExchangeRate
            </Button>
            {/* <Button
              className="mui-btn secondary filled"
              id="filter-exchangerates"
              onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
            >
              <FilterAltIcon fontSize="small" />
            </Button> */}
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
                    <Grid item xs={6}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel id="clientCategory-label">
                          Client Category
                        </InputLabel>
                        <Select
                          key="clientCategory"
                          id="clientCategory"
                          name="clientCategory"
                          label="clientCategory"
                          labelId="clientCategory-label"
                          onChange={(e) => {
                            setClientCategoryOption(e.target.value);
                            setRandomValue(Math.random());
                          }}
                          value={clientCategoryOption || ""}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {clientCategoryOptions?.map((item) => (
                            <MenuItem key={item?.value} value={item?.value}>
                              {item?.label}
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
            <Card className="kpi-card">
              <MuiTable
                rowId="recordGuid"
                columns={[
                  {
                    field: "currencyCode",
                    headerName: "Currency Code",
                    flex: 1,
                  },
                  {
                    field: "currentRate",
                    headerName: "Current Rate",
                    flex: 1,
                  },
                  {
                    field: "currentRateInverse",
                    headerName: "Current Rate Inverse",
                    flex: 1,
                  },
                  {
                    field: "newRate",
                    headerName: "Next Rate",
                    flex: 1,
                  },
                  {
                    field: "effectiveDate",
                    headerName: "Effective Date",
                    flex: 1,
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 1,
                    renderCell: (params) => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "left",
                          width: "100%",
                        }}
                      >
                        <Tooltip title="Edit Exchange">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditMangeExchangeRate(params.row)
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  },
                ]}
                data={Data}
                loading={loading}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                totalRows={totalRows}
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {manageAddExchangeRate && (
        <MuiModal
          title="Add ExchangeRate"
          open={manageAddExchangeRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageAddExchangeRate(false)}
        >
          <ManageExchangeRate
            type="add"
            loading={loading}
            setLoading={setLoading}
            setManageAddExchangeRate={setManageAddExchangeRate}
            clientCategoryOptions={clientCategoryOptions}
            getAllExchangeRates={getAllExchangeRates}
          />
        </MuiModal>
      )}

      {manageEditExchangeRate && (
        <MuiModal
          title="Edit ExchangeRate"
          open={manageEditExchangeRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setManageEditExchangeRate(false)}
        >
          <ManageExchangeRate
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddExchangeRate={setManageEditExchangeRate}
            clientCategoryOptions={clientCategoryOptions}
            getAllExchangeRates={getAllExchangeRates}
            selectedExchangeRate={selectedExchangeRate}
            setSelectedExchangeRate={setSelectedExchangeRate}
          />
        </MuiModal>
      )}
    </>
  );
}

export default withTranslation("translations")(ExchangeRateListing);
