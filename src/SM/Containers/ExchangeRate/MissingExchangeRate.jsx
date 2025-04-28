import { Add, Download, Edit } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
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
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import {
  EXPORT_MISSING_EXCHANGERATES,
  GET_ALL_MISSING_EXCHANGERATES,
} from "../../../APIs/ExchangeRate";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";
import { GET_OPERATORS } from "../../../APIs/SMSAPIS";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import ManageMissingExchangeRates from "./MissingExchangeRate";
import { AsyncPaginate } from "react-select-async-paginate";

function MissingExchangeRates({ t }) {
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
  const [importExchangeRate, setImportExchangeRate] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [clientCategoryOptions, setClientCategoryOptions] = useState([]);
  const [clientCategoryOption, setClientCategoryOption] = useState([]);
  const [manageMissingExchangeRate, setmanageMissingExchangeRate] =
    useState(false);
  const [selectedExchangeRate, setSelectedExchangeRate] = useState([]);
  const [randomValue, setRandomValue] = useState("");
  const [file, setFile] = useState({
    file: null,
    fileName: "",
  });
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);
  const [countries, SetCountries] = useState([]);
  const [operatorOption, setOperatorOption] = useState([]);
  const [country, setCountry] = useState([]);
  const [operator, setOperator] = useState([]);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/exchangerate/${service}`;
    }
    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
    getAllClientCategory();
  }, []);

  const handleFilterReset = () => {
    setClientCategoryOption("");
    setCountry("");
    setOperator("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

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

  const getAllExchangeRates = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_MISSING_EXCHANGERATES({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: clientCategoryOption ? clientCategoryOption : null,
        CountryRecordGuid: country ? country : "",
        OperatorRecordGuid: operator?.value ? operator?.value : "",
      });
      const data =
        response?.data?.data?.missingExchangeRatePlans?.length > 0
          ? response?.data?.data?.missingExchangeRatePlans?.map((item) => ({
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

  const exportAllExchangeRates = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_MISSING_EXCHANGERATES({
        token,
        search: "",
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ClientCategoryGuid: clientCategoryOption ? clientCategoryOption : null,
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ExchangeRates.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMangeExchangeRate = (data) => {
    setSelectedExchangeRate(data);
    setmanageMissingExchangeRate(true);
  };

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: country,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  useEffect(() => {
    if (serviceGuid && channelGuid) {
      getAllExchangeRates();
      GetAllCountries();
    }
  }, [serviceGuid, channelGuid, paginationModel]);

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
              className="mui-btn secondary filled"
              id="filter-exchangerates"
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
                handleFilterSearch={handleFilterSearch}
                setShowAdvanceSearch={setShowAdvanceSearch}
                body={
                  <>
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                          key="country"
                          id="country"
                          name="country"
                          label="Country"
                          labelId="country-label"
                          onChange={(e) => {
                            setCountry(e.target.value);
                            setRandomValue(Math.random());
                          }}
                          value={country}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {countries.map((country) => (
                            <MenuItem
                              key={country.recordGuid}
                              value={country.recordGuid}
                            >
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      {country != "" && country != undefined ? (
                        <InputLabel
                          sx={{ fontSize: "12px", marginBottom: "-5px" }}
                        >
                          Operator
                        </InputLabel>
                      ) : (
                        <InputLabel sx={{ marginTop: "10px" }} />
                      )}
                      <AsyncPaginate
                        key={randomValue}
                        id="async-menu-style"
                        onChange={(value) => {
                          setOperator(value);
                        }}
                        value={operator}
                        loadOptions={loadOperatorOptions}
                        additional={{
                          page: 1,
                        }}
                        isDisabled={country == "" || country == undefined}
                        placeholder="Operator"
                        classNamePrefix="react-select"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: 150, // Adjust height as needed
                            overflow: "hidden", // Hide scrollbar
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 150, // Adjust height as needed
                            overflowY: "auto", // Enable vertical scroll if needed
                          }),
                        }}
                      />
                    </Grid>
                  </>
                }
              />
            </Grid>
          )}
          <Grid item xs={12} marginTop={2}>
            <Card className="kpi-card">
              {service == "whatsapp" && (
                <MuiTable
                  columns={[
                    {
                      field: "clientCategoryName",
                      headerName: "Client Category",
                      flex: 1,
                    },
                    {
                      field: "countryCode",
                      headerName: "Country ISO",
                      flex: 1,
                    },
                    {
                      field: "country",
                      headerName: "Country",
                      flex: 1,
                    },
                    {
                      field: "operationTypeTag",
                      headerName: "Operation Type",
                      flex: 1,
                    },
                    {
                      field: "cost",
                      headerName: "Cost",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <>
                            <Tooltip title="Edit ExchangeRate">
                              <IconButton
                                onClick={() => console.log("df")}
                                size="small"
                                id="editExchangeRate"
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </>
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
              )}
              {service != "whatsapp" && (
                <MuiTable
                  columns={[
                    {
                      field: "clientCategoryName",
                      headerName: "Client Category",
                      flex: 1,
                    },
                    {
                      field: "countryCode",
                      headerName: "Country ISO",
                      flex: 1,
                    },
                    {
                      field: "country",
                      headerName: "Country",
                      flex: 1,
                    },
                    {
                      field: "operator",
                      headerName: "Operator",
                      flex: 1,
                    },
                    {
                      field: "cost",
                      headerName: "Cost",
                      flex: 1,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      flex: 1,
                      renderCell: (params) => {
                        return (
                          <>
                            <Tooltip title="Add Missing ExchangeRate">
                              <IconButton
                                onClick={() =>
                                  handleEditMangeExchangeRate(params?.row)
                                }
                                size="small"
                                id="editExchangeRate"
                              >
                                <Add />
                              </IconButton>
                            </Tooltip>
                          </>
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
              )}
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {manageMissingExchangeRate && (
        <MuiModal
          title="Add Missing ExchangeRate"
          open={manageMissingExchangeRate}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageMissingExchangeRate(false)}
        >
          <ManageMissingExchangeRates
            type="edit"
            loading={loading}
            setLoading={setLoading}
            setManageAddExchangeRate={setmanageMissingExchangeRate}
            clientCategoryOptions={clientCategoryOptions}
            serviceGuid={serviceGuid}
            channelGuid={channelGuid}
            getAllExchangeRates={getAllExchangeRates}
            selectedExchangeRate={selectedExchangeRate}
            setSelectedExchangeRate={setSelectedExchangeRate}
          />
        </MuiModal>
      )}
    </>
  );
}

export default withTranslation("translations")(MissingExchangeRates);
