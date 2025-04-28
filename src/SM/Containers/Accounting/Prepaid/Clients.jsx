import { Add } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  GET_ALL_CLIENT_API,
  GET_ALL_PREPAID_CLIENTS,
} from "../../../../APIs/Prepaid";
import AdvancedSearch from "../../../../Components/AdvancedSearch/AdvancedSearch";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import MuiTable from "../../../../Components/MuiTable/MuiTable";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import AccountActivity from "./AccountActivity";
import ManageClients from "./ManageClients";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate.jsx";
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
  const { token } = useSelector((state) => state.authentication);
  const [manageAddPrepaid, setmanageAddPrepaid] = useState(false);
  const [manageAccountActivity, setManageAccountActivity] = useState(false);
  const [selectedRow, setselectedRow] = useState([]);
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

  const getAllPrepaid = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_PREPAID_CLIENTS({
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

  const handleAddMangePrepaid = (data) => {
    setmanageAddPrepaid(true);
    setselectedRow(data);
  };
  const handleAddAccountActivity = (data) => {
    setManageAccountActivity(true);
    setselectedRow(data);
  };

  // const loadResellerOptions = async (search, loadedOptions, {page}) => {
  //     try {
  //         let response = await GET_ALL_RESELLER_API({
  //             pageNumber: page,
  //             pageSize: 10,
  //             search,
  //             TypeTag: "RESELLER",
  //         });
  //
  //         if (response.status !== 200) {
  //             throw new Error("Failed to fetch data");
  //         }
  //
  //         const hasMore =
  //             (page - 1) * 10 + response?.data?.data?.clients?.length <
  //             response?.data?.data?.totalRows;
  //
  //         return {
  //             options: response?.data?.data?.clients?.map((item) => ({
  //                 value: item?.recordGuid,
  //                 label: item?.name,
  //             })),
  //             hasMore,
  //             additional: {
  //                 page: page + 1,
  //             },
  //         };
  //     } catch (e) {
  //         showSnackbar(handleMessageError({e}), "error");
  //         return {options: [], hasMore: false}; // Return empty options and mark as no more data
  //     }
  // };

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

  // useEffect(() => {
  //   getAllReseller();
  // }, []);
  useEffect(() => {}, [formik.values.reseller]);
  useEffect(() => {
    getAllPrepaid();
  }, [paginationModel]);

  return (
    <Box className="page_container">
      {!manageAccountActivity && (
        <>
          <Grid container columnSpacing={3} className="section_container ">
            <Grid item xs={12} className="sub_section_container">
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
                    className="mui-btn primary outlined"
                    id="send-service-provider-id"
                    onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
                  >
                    <FilterAltIcon fontSize="small" />
                  </Button>
                  <Button
                    className="mui-btn primary filled"
                    id="send-service-provider-id"
                    onClick={() => handleAddMangePrepaid()}
                    startIcon={<Add />}
                  >
                    Add Prepaid Account
                  </Button>
                </Grid>
                {showAdvanceSearch && (
                  <Grid item xs={12}>
                    <AdvancedSearch
                      showAdvanceSearch={showAdvanceSearch}
                      handleFilterReset={handleFilterReset}
                      handleFilterSearch={handleFilterSearch}
                      setShowAdvanceSearch={setShowAdvanceSearch}
                      disabled={
                        !formik.values.reseller && !formik.values.client
                      }
                      loading={loading}
                      body={
                        <>
                          <Grid item xs={4}>
                            <CustomAsyncPaginate
                              key={randomValue}
                              apiFunction={GET_ALL_RESELLER_API}
                              value={formik?.values?.reseller}
                              onChange={(value) => {
                                formik.setFieldValue("reseller", value);
                                formik.setFieldValue("client", ""); // Reset client when reseller changes
                                setClientOptions([]); // Clear client options when reseller changes
                                setRandomValue(Math.random());
                              }}
                              placeholder="Reseller"
                              pageSize={10}
                              dataPath="data.data.clients"
                              totalRowsPath="data.data.totalRows"
                              params={{
                                type: "RESELLER",
                                StatusTag: "APPROVED",
                              }}
                              method="GET"
                              id={`async-menu-style-accounts`}
                              customLabel={(item) =>
                                `${item.firstName} - ${item.name}`
                              }
                            />
                          </Grid>
                          <Grid item xs={4}>
                            {formik?.values?.client != "" &&
                            formik?.values?.client != undefined ? (
                              <InputLabel
                                error={
                                  formik?.touched["client"] &&
                                  Boolean(formik?.errors["client"])
                                }
                                helperText={
                                  formik?.touched["client"] &&
                                  formik?.errors["client"]
                                }
                                className="asyncLabel1"
                              >
                                Client
                              </InputLabel>
                            ) : (
                              <InputLabel className="asyncLabel2" />
                            )}
                            <AsyncPaginate
                              key={randomValue}
                              id="async-menu-style-accounts"
                              value={formik?.values?.client}
                              loadOptions={(
                                search,
                                loadedOptions,
                                additional
                              ) =>
                                getAllClient(
                                  formik?.values?.reseller?.value,
                                  search,
                                  loadedOptions,
                                  additional
                                )
                              }
                              additional={{
                                page: 1,
                              }}
                              onChange={(value) => {
                                formik?.setFieldValue("client", value);
                              }}
                              isDisabled={!formik.values.reseller}
                              placeholder="Client"
                              classNamePrefix="react-select"
                            />
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
                                  <DisabledByDefaultIcon
                                    sx={{ color: "red" }}
                                  />
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
            </Grid>
          </Grid>

          {manageAddPrepaid && (
            <MuiModal
              title="Add Prepaid Account"
              open={manageAddPrepaid}
              width="500px"
              id="edit-contact-form"
              handleClose={() => setmanageAddPrepaid(false)}
            >
              <ManageClients
                type="add"
                loading={loading}
                setLoading={setLoading}
                setmanageAddPrepaid={setmanageAddPrepaid}
                selectedRow={selectedRow}
                setselectedRow={setselectedRow}
                getAllPrepaid={getAllPrepaid}
                reseller={formik.values.reseller}
                client={formik.values.client}
              />
            </MuiModal>
          )}
        </>
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
        />
        // </MuiModal>
      )}
    </Box>
  );
}
