import { Download } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  InputLabel,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  GET_ALL_CLIENTS_CATEGORY,
  GET_PROVIDERS_BY_SERVICE,
} from "../../../APIs/Clients";
import { GET_ALL_PROVIDERS_CATEGORY } from "../../../APIs/Costs";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";
import {
  EXPORT_ALL_RATE_COST,
  GET_ALL_RATE_COST,
} from "../../../APIs/ProfitLoss";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import { useLocation } from "react-router-dom";

function RatevCost({ t }) {
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
  const [providerCategoryOptions, setProviderCategoryOptions] = useState([]);
  const [providerCategoryOption, setProviderCategoryOption] = useState([]);
  const [provider, setProvider] = useState([]);
  const [randomValue, setRandomValue] = useState("");

  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  const { services } = useSelector((state) => state.system);

  const [country, setCountry] = useState(null);
  const [countries, setCountries] = useState([]);

  const [client, setClient] = useState(null);

  const [clientCategories, setClientCategories] = useState([]);
  const [clientCategory, setClientCategory] = useState(""); // Selected client category

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

  const [confirmedFilters, setConfirmedFilters] = useState({
    ProviderCategoryGuid: null,
    ProviderGuid: null,
    CountryGuid: null,
    ClientCategoryGuid: null,
  });

  useEffect(() => {
    if (location?.pathname?.split("/")[2] == undefined) {
      window.location.href = `/cost/${service}`;
    }
    setService(location?.pathname?.split("/")[2]);
    setServiceTag(HandleServiceTag(location?.pathname?.split("/")[2]));
  }, [location]);

  const handleFilterReset = () => {
    setProviderCategoryOption("");
    setProvider(null);
    setCountry(null);
    setClientCategory(null);
    setPaginationModel({ pageSize: 10, page: 0 });
    setConfirmedFilters({
      ProviderCategoryGuid: null,
      ProviderGuid: null,
      CountryGuid: null,
      ClientCategoryGuid: null,
    });
  };

  const handleFilterSearch = () => {
    if (providerCategoryOption && !provider) {
      showSnackbar("Please select a Provider", "error");
    } else {
      setConfirmedFilters({
        ProviderCategoryGuid: providerCategoryOption?.value || null,
        ProviderGuid: provider?.value || null,
        CountryGuid: country.value || null,
        ClientCategoryGuid: clientCategory?.value || null,
      });
      setPaginationModel({ pageSize: 10, page: 0 });
    }
  };

  const getAllProvidersCategory = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PROVIDERS_CATEGORY();
      const options = response?.data?.data?.providerCategories?.map((item) => ({
        value: item?.recordGuid,
        label: item?.providerCategoryDetails[0]?.name,
      }));
      setProviderCategoryOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProviderCategoryOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_ALL_PROVIDERS_CATEGORY({
        pageNumber: page,
        pageSize: 10,
        search: search,
      });
      const options = response?.data?.data?.providerCategories?.map((item) => ({
        value: item?.recordGuid,
        label: item?.providerCategoryDetails[0]?.name,
      }));

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: options,
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

  const loadProviderOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        token,
        pageNumber: page,
        pageSize: 10,
        search: search,
        typeTag: "",
        RecordGuid: serviceGuid ? serviceGuid : "undefined",
        ProviderCategoryGuid: recordGuid
          ? recordGuid
          : providerCategoryOption?.value,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
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

  const getAllRateCost = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_RATE_COST({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ProviderCategoryGuid: confirmedFilters.ProviderCategoryGuid,
        ProviderGuid: confirmedFilters.ProviderGuid,
        CountryGuid: confirmedFilters.CountryGuid?.value,
        ClientCategoryGuid: confirmedFilters.ClientCategoryGuid,
      });
      const data =
        response?.data?.data?.rateCostPlans?.map((item) => ({ ...item })) || [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadClientCategoryOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_CLIENTS_CATEGORY({
        pageNumber: page,
        pageSize: 5,
        search,
      });
      const options = response?.data?.data?.clientCategory?.map((item) => ({
        value: item?.recordGuid,
        label: item?.clientCategoryDetails[0]?.name,
      }));
      setClientCategories(options); // Save the categories to the state

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.clientCategory?.length <
        response?.data?.data?.totalRows;

      return {
        options: options,
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

  const exportAllCosts = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ALL_RATE_COST({
        token,
        search: "",
        ChannelGuid: channelGuid ? channelGuid : null,
        ServiceGuid: serviceGuid ? serviceGuid : null,
        ProviderCategoryGuid: confirmedFilters.ProviderCategoryGuid,
        ProviderGuid: confirmedFilters.ProviderGuid,
        CountryGuid: confirmedFilters.CountryGuid,
        ClientCategoryGuid: confirmedFilters.ClientCategoryGuid,
      });

      const data = response?.data;
      const url = window.URL.createObjectURL(
        new Blob([data], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Rate-Vs-Cost.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log(e);
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceGuid && channelGuid) {
      getAllRateCost();
    }
  }, [serviceGuid, channelGuid, paginationModel]);

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
            {/* <Grid item xs={12} md={4}>
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                <Typography className="BreadcrumbsPage">
                  Cost vs Rate
                </Typography>
                <Typography className="breadcrumbactiveBtn">
                  {service?.length < 4
                    ? service?.toUpperCase()
                    : service
                        ?.split("-") // Split the string by hyphens
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        ) // Capitalize the first letter of each word
                        .join(" ")}
                </Typography>
              </Breadcrumbs>
            </Grid> */}
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
                id="send-service-provider-id"
                onClick={() => exportAllCosts()}
                startIcon={<Download />}
              >
                Export
              </Button>
              <Button
                className="mui-btn secondary filled"
                id="send-service-provider-id"
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
                      <Grid item xs={6}>
                        {providerCategoryOption != "" &&
                        providerCategoryOption != undefined ? (
                          <InputLabel
                            sx={{ fontSize: "12px", marginBottom: "-5px" }}
                          >
                            Provider Category
                          </InputLabel>
                        ) : (
                          <InputLabel sx={{ marginTop: "10px" }} />
                        )}
                        <AsyncPaginate
                          id="async-menu-style"
                          label="providerCategory"
                          loadOptions={loadProviderCategoryOptions}
                          onChange={(value) => {
                            setProviderCategoryOption(value);
                            setProvider(null);
                            setRandomValue(Math.random());
                          }}
                          value={providerCategoryOption || ""}
                          additional={{
                            page: 1,
                          }}
                          placeholder={"Provider Category"}
                          classNamePrefix="react-select"
                        />
                      </Grid>
                      <Grid item xs={6} key={randomValue}>
                        {providerCategoryOption != "" &&
                        providerCategoryOption != undefined ? (
                          <InputLabel
                            sx={{ fontSize: "12px", marginBottom: "-5px" }}
                          >
                            Provider
                          </InputLabel>
                        ) : (
                          <InputLabel sx={{ marginTop: "10px" }} />
                        )}
                        <AsyncPaginate
                          id="async-menu-style"
                          value={provider}
                          loadOptions={loadProviderOptions}
                          onChange={(value) => {
                            setProvider(value);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isDisabled={
                            providerCategoryOption == "" ||
                            providerCategoryOption == undefined
                          }
                          placeholder={"Provider"}
                          classNamePrefix="react-select"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                          value={country}
                          onChange={(value) => {
                            setCountry(value);
                            setRandomValue(Math.random());
                          }}
                          placeholder="Country *"
                          pageSize={10}
                          dataPath="data.data.countries" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          id={`async-menu-style-accounts`}
                        />
                      </Grid>

                      {/* <Grid item xs={6}>
                        {clientCategory != "" && clientCategory != undefined ? (
                          <InputLabel sx={{ fontSize: "12px" }}>
                            Client Category
                          </InputLabel>
                        ) : (
                          <InputLabel sx={{ marginTop: "10px" }} />
                        )}
                        <AsyncPaginate
                          id="async-menu-style"
                          loadOptions={loadClientCategoryOptions}
                          additional={{
                            page: 1,
                          }}
                          value={clientCategory || ""}
                          onChange={(value) => {
                            setClientCategory(value); // Set the selected client category
                          }}
                          placeholder="Client Category"
                          classNamePrefix="react-select"
                        />
                      </Grid> */}
                      <Grid item xs={6}>
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_CLIENTS_CATEGORY}
                          value={clientCategory || ""}
                          onChange={(value) => {
                            setClientCategory(value);
                          }}
                          placeholder="Client Category"
                          pageSize={10}
                          dataPath="data.data.clientCategory"
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          isNested={true}
                          labelPath={"clientCategoryDetails"}
                          id={`async-menu-style-accounts`}
                        />
                      </Grid>
                    </>
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} marginTop={2}>
              <MuiTable
                columns={[
                  {
                    field: "clientCategoryName",
                    headerName: "Client Category",
                    flex: 1,
                  },
                  {
                    field: "countryName",
                    headerName: "Country Name",
                    flex: 1,
                  },
                  {
                    field: "costOperatorName",
                    headerName: "Operator",
                    flex: 1,
                  },
                  {
                    field: "rate",
                    headerName: "Rate",
                    flex: 1,
                  },
                  {
                    field: "cost",
                    headerName: "Cost",
                    flex: 1,
                  },
                  {
                    field: "delta",
                    headerName: "Delta",
                    flex: 1,
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default withTranslation("translations")(GetActions(RatevCost));
