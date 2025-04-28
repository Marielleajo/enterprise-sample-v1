import { Add, ArrowBack } from "@mui/icons-material";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  GET_ALL_CLIENT_API,
  GET_ALL_CLIENTS,
  GET_THRESHOLD,
} from "../../../../APIs/Postpaid";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import AddPayment from "./AddPayment";
import BalanceLimit from "./BalanceLimit";
import ManageClients from "./ManageClients";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import AccountActivity from "./AccountActivity.jsx";
import { GET_ALL_RESELLER_API } from "../../../../APIs/Resellers.jsx";

export default function Clients() {
  const [loading, setLoading] = useState(false);
  const [Data, SetData] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [totalRows, SetTotalRows] = useState(0);
  const [resellerOptions, setResellerOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [manageAddPostpaid, setmanageAddPostpaid] = useState(false);
  const [manageSetNewLimit, setManageSetNewLimit] = useState(false);
  const [manageDownPayment, setManageDownPayment] = useState(false);
  const [manageAccountActivity, setManageAccountActivity] = useState(false);
  const [selectedRow, setselectedRow] = useState([]);
  const [valueThreshold, setValueThreshold] = useState("");
  const [randomValue, setRandomValue] = useState("");
  const [resellerBakcup, setResellerBackup] = useState("");
  const [clientBackup, setClientBackup] = useState("");
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      reseller: "",
      client: "",
    },
    onSubmit: (values) => {},
  });
  const theme = useTheme();

  const handleFilterReset = () => {
    formik.resetForm();
    setResellerBackup("");
    setClientBackup("");
    setPaginationModel({ pageSize: 10, page: 0 });
  };
  const handleFilterSearch = () => {
    setResellerBackup(formik.values.reseller);
    setClientBackup(formik.values.client);
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const getAllPostpaid = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS({
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ParentGuid: resellerBakcup?.value,
        ClientGuids: clientBackup?.value,
        ParentIncluded: true,
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

  const getAllConfiguration = async () => {
    setLoading(true);
    try {
      let response = await GET_THRESHOLD({ PageSize: "1000" });
      // setGlobalConfiguration(response?.data?.data?.globalConfigurations);
      setValueThreshold(
        response?.data?.data?.globalConfigurations?.find(
          (x) => x?.key === "BILLING.CLIENT_POSTPAID_THRESHOLD_PERCENTAGE"
        )?.value
      );
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMangePostpaid = (data) => {
    setmanageAddPostpaid(true);
    setselectedRow(data);
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

  const loadResellerOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_RESELLER_API({
        pageNumber: page,
        pageSize: 10,
        search,
        TypeTag: "RESELLER",
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.clients?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.clients?.map((item) => ({
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

  const getAllClient = async (
    ParentId,
    search = "",
    loadedOptions = [],
    { page = 1, recordGuid } = {}
  ) => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENT_API({
        ParentId: ParentId,
        pageNumber: page,
        search: search,
        pageSize: 10,
      });
      const options = response?.data?.data?.clients?.map((item) => ({
        value: item?.recordGuid,
        label: item?.name,
      }));

      setClientOptions(options);
      const hasMore =
        (page - 1) * 10 + response?.data?.data?.clients?.length <
        response?.data?.data?.totalRows;
      return {
        options: options,
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResellerChange = async (value) => {
    const selectedReseller = value;
    formik.setFieldValue("reseller", selectedReseller);
    formik.setFieldValue("client", "");

    setClientOptions([]);

    if (selectedReseller) {
      await getAllClient(selectedReseller, "", [], { page: 1 });
    }
  };
  useEffect(() => {
    // getAllReseller();
    getAllConfiguration();
  }, []);

  useEffect(() => {
    getAllPostpaid();
  }, [paginationModel]);

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  return (
    <Grid item xs={12} className="sub_section_container">
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
            {!showAdvanceSearch && (
              <Button
                className="mui-btn primary outlined"
                id="send-service-provider-id"
                onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
              >
                <FilterAltIcon fontSize="small" />
              </Button>
            )}
            <Button
              className="mui-btn primary filled"
              id="send-service-provider-id"
              onClick={() => handleAddMangePostpaid()}
              startIcon={<Add />}
            >
              Add Postpaid Account
            </Button>
          </Grid>
          {showAdvanceSearch && (
            <Grid item xs={12}>
              <AdvancedSearch
                showAdvanceSearch={showAdvanceSearch}
                handleFilterReset={handleFilterReset}
                handleFilterSearch={handleFilterSearch}
                setShowAdvanceSearch={setShowAdvanceSearch}
                disabled={!formik.values.reseller && !formik.values.client}
                loading={loading}
                body={
                  <>
                    <Grid item xs={4}>
                      <CustomAsyncPaginate
                        apiFunction={GET_ALL_RESELLER_API} // Pass the function directly
                        value={formik?.values?.reseller}
                        onChange={(value) => {
                          formik.setFieldValue("reseller", value);
                          formik.setFieldValue("client", ""); // Reset client when reseller changes
                          setClientOptions([]); // Clear client options when reseller changes
                          setRandomValue(Math.random());
                        }}
                        placeholder="Reseller"
                        pageSize={10}
                        dataPath="data.data.clients" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                        params={{ type: "RESELLER", StatusTag: "APPROVED" }}
                        customLabel={(item) =>
                          `${item.firstName} - ${item.name}`
                        }
                      />
                      {formik.touched.reseller && formik.errors.reseller && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.reseller}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={4}>
                      <CustomAsyncPaginate
                        key={randomValue}
                        apiFunction={GET_ALL_CLIENT_API} // Pass the function directly
                        value={formik?.values?.client}
                        onChange={(value) => {
                          formik?.setFieldValue("client", value);
                        }}
                        placeholder="Client"
                        pageSize={10}
                        dataPath="data.data.clients" // Adjust path based on API response structure
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                        isDisabled={!formik.values.reseller}
                        isNested={false}
                        params={{ ParentId: formik?.values?.reseller?.value }}
                      />
                      {formik.touched.reseller && formik.errors.reseller && (
                        <FormHelperText
                          style={{ color: theme?.palette?.error?.main }}
                        >
                          {formik.errors.reseller}
                        </FormHelperText>
                      )}
                    </Grid>
                  </>
                }
              />
            </Grid>
          )}
          <Grid item xs={12} marginTop={2}>
            <MuiTable
              rowId="recordGuid"
              columns={[
                {
                  field: "clientName",
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
                  field: "isPrimary",
                  headerName: "isPrimary",
                  width: 200,
                  renderCell: (params) => {
                    return (
                      <Box>
                        {params.row.isPrimary ? (
                          <>
                            <CheckBoxIcon sx={{ color: "green" }} />
                          </>
                        ) : (
                          <>
                            <DisabledByDefaultIcon sx={{ color: "red" }} />
                          </>
                        )}
                      </Box>
                    );
                  },
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
                        {/*<Tooltip title="Add Down Payment">*/}
                        {/*    <IconButton*/}
                        {/*        onClick={() =>*/}
                        {/*            handleAddMangeDownPayment(params?.row)*/}
                        {/*        }*/}
                        {/*        size="small"*/}
                        {/*        id="downPayment"*/}
                        {/*    >*/}
                        {/*        <AddCardIcon/>*/}
                        {/*    </IconButton>*/}
                        {/*</Tooltip>*/}
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

      {manageAddPostpaid && (
        <MuiModal
          title="Add Postpaid Account"
          open={manageAddPostpaid}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setmanageAddPostpaid(false)}
        >
          <ManageClients
            type="add"
            loading={loading}
            setLoading={setLoading}
            setmanageAddPostpaid={setmanageAddPostpaid}
            selectedRow={selectedRow}
            setselectedRow={setselectedRow}
            getAllPostpaid={getAllPostpaid}
            reseller={formik.values.reseller}
            client={formik.values.client}
            valueThreshold={valueThreshold}
          />
        </MuiModal>
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
          />
        </MuiModal>
      )}
    </Grid>
  );
}
