import { ArrowBack, Download } from "@mui/icons-material";
import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  EXPORT_ACCOUNT_TYPE,
  GET_ACCOUNT_TYPE,
  GET_PROFIT_MARGIN,
  POPULATE_RATE_PROFIT,
  POPULATE_WHATSAPP_RATE_PROFIT,
} from "../../../APIs/BillingConfig";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import { GET_PROVIDERS_BY_SERVICE } from "../../../APIs/Clients";
import { AsyncPaginate } from "react-select-async-paginate";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function ProfitMargin({}) {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.authentication);
  let { services } = useSelector((state) => state?.system);

  const [hideTable, setHideTable] = useState(true);
  const [serviceGuid, setServiceGuid] = useState("");
  const [providerOption, setProviderOption] = useState("");
  const [randomValue, setRandomValue] = useState(null);

  const getProfitMargin = async () => {
    setLoading(true);
    try {
      let response = await GET_PROFIT_MARGIN({
        token,
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ProviderGuid: providerOption?.value,
        ServiceGuid: serviceGuid?.recordGuid,
        ChannelGuid: serviceGuid?.channelGuid,
      });
      const data = response?.data?.data?.profitMargins ?? [];
      SetData(data);
      SetTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const populateRateProfit = async (value) => {
    setLoading(true);
    let data =
      serviceGuid?.tag == "WHATSAPP"
        ? {
            ClientCategoryGuid: value?.clientCategoryGuid,
            ChannelGuid: serviceGuid?.channelGuid,
          }
        : {
            ClientCategoryGuid: value?.clientCategoryGuid,
            ChannelGuid: serviceGuid?.channelGuid,
            ProviderGuid: providerOption?.value,
            ServiceGuid: serviceGuid?.recordGuid,
          };
    try {
      let response =
        serviceGuid?.tag == "WHATSAPP"
          ? await POPULATE_WHATSAPP_RATE_PROFIT({
              data,
            })
          : await POPULATE_RATE_PROFIT({
              data,
            });
      if (response?.data?.success) {
        showSnackbar(response?.data?.message, "success");
        handleSearchProfit();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const exportAllConfig = async () => {
    setLoading(true);
    try {
      let response = await EXPORT_ACCOUNT_TYPE({
        token,
        search: "",
      });
      const data = response?.data;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Config.csv`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const loadProviderOptions = async (
    search,
    loadedOptions,
    { page, recordGuid }
  ) => {
    try {
      let response = await GET_PROVIDERS_BY_SERVICE({
        search,
        token,
        pageNumber: 1,
        pageSize: 10000,
        RecordGuid: serviceGuid ? serviceGuid?.recordGuid : "undefined",
        ProviderCategoryGuid: null,
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

  const handleSearchProfit = () => {
    if (serviceGuid && providerOption) {
      getProfitMargin();
      setHideTable(false);
    } else {
      showSnackbar("Please select both service and provider", "error");
      setHideTable(true);
    }
  };

  useEffect(() => {
    if (!serviceGuid && !providerOption) {
      setHideTable(true);
    }
  }, [serviceGuid, providerOption]);

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
          <Grid item xs={12} marginTop={2}>
            <Grid container spacing={1} alignItems="center" mb={2} px={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="standard">
                  <InputLabel
                    sx={{ marginBottom: "1px !important" }}
                    id="service-label"
                  >
                    Service
                  </InputLabel>
                  <Select
                    key="service"
                    id="service"
                    name="service"
                    label="service"
                    labelId="service-label"
                    onChange={(e) => {
                      setServiceGuid(e.target.value);
                      setProviderOption("");
                      setRandomValue(Math.random());
                    }}
                    value={serviceGuid || ""}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {services
                      ?.filter(
                        (item) =>
                          item?.serviceDetails?.[0]?.name &&
                          item?.serviceDetails[0]?.name !== "WhatsApp"
                      )
                      .map((item) => (
                        <MenuItem key={item?.recordGuid} value={item}>
                          {item?.serviceDetails[0]?.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} key={randomValue}>
                <CustomAsyncPaginate
                  apiFunction={GET_PROVIDERS_BY_SERVICE} // Pass the function directly
                  value={providerOption}
                  onChange={(value) => {
                    setProviderOption(value);
                  }}
                  placeholder="Provider"
                  pageSize={10}
                  dataPath="data.data.items" // Adjust path based on API response structure
                  totalRowsPath="data.data.totalRows"
                  method="GET"
                  params={{
                    RecordGuid: serviceGuid
                      ? serviceGuid?.recordGuid
                      : "undefined",
                  }}
                  id={`async-menu-style`}
                  isDisabled={!serviceGuid}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  className="mui-btn primary filled"
                  id="export-rate"
                  onClick={() => handleSearchProfit()}
                  sx={{ marginLeft: "auto" }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            {!hideTable && (
              <MuiTable
                columns={[
                  {
                    field: "percentageRate",
                    headerName: "Estimated Profit",
                    flex: 1,
                    renderCell: (params) => `${params.value}%`,
                  },
                  {
                    field: "realProfitPercentage",
                    headerName: "Real Profit",
                    flex: 1,
                    renderCell: (params) => `${params.value}%`,
                  },
                  {
                    field: "clientCategoryName",
                    headerName: "Client Category",
                    flex: 1,
                  },
                  {
                    field: "actions",
                    headerName: "Actions",
                    flex: 1,
                    renderCell: (params) => (
                      <Button
                        className="mui-btn green filled"
                        sx={{ color: "green !important" }}
                        id="populate-rate"
                        onClick={() => populateRateProfit(params?.row)}
                      >
                        Populate
                      </Button>
                    ),
                  },
                ]}
                data={Data}
                loading={loading}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                totalRows={totalRows}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withTranslation("translations")(ProfitMargin);
