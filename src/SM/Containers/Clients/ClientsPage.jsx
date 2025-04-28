import {
  Add,
  Edit,
  LockOpen,
  Visibility,
  VisibilityOff,
  VisibilityOutlined,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  GET_ALL_CLASSES,
  GET_ALL_CLIENT_ACCOUNT_API,
  GET_ALL_CLIENT_API,
  GET_CLIENT_ELIGIBLE_BUNDLE,
} from "../../../APIs/Clients";
import { GET_ADVANCED_SERVICES, RESET_PASSWORD } from "../../../APIs/Common";
import {
  DELETE_RESELLER,
  GET_ALL_RESELLER_API,
  GET_PIN,
  UPDATE_RESELLER_STATUS,
} from "../../../APIs/Resellers";
import AdvancedSearch from "../../../Components/AdvancedSearch/AdvancedSearch";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import MuiSwitch from "../../../Components/MuiSwitch";
import MuiTable from "../../../Components/MuiTable/MuiTable";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { HandleApiError, handleMessageError } from "../../Utils/Functions";
import GetActions from "../../Utils/GetActions";
import OpeningModal from "./OpeningModal";
import SubscriptionClient from "./SubscriptionClient";
import { useLocation, useNavigate } from "react-router-dom";

const ClientsPage = () => {
  const location = useLocation();
  const [selectedReseller, setSelectedReseller] = useState(
    location?.state?.selectedReseller ?? ""
  );
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [resellerOptions, setResellerOptions] = useState([]);
  let { token, username } = useSelector((state) => state?.authentication);
  const navigate = useNavigate();
  const [Data, SetData] = useState([]);
  const [clientAccount, setClientAccount] = useState([]);
  const [clientSubscriptions, setClientSubscriptions] = useState([]);
  const [isLoading, SetLoading] = useState(false);
  const [SearchQuery, SetSearchQuery] = useState("");
  const [randomValue, setRandomValue] = useState(null);
  const [advancedServices, setAdvancedServices] = useState([]);
  const [filterState, setFilterState] = useState({
    name: null,
    email: null,
    signupDate: null,
    mobileNumber: null,
    class: null,
    kyc: null,
    mobileVerified: null,
  });

  const kycOptions = [
    { label: "Not Approved", value: "1" },
    { label: "Pending", value: "2" },
    { label: "Approved", value: "3" },
  ];

  const mobileVerifyOptions = [
    { label: "None", value: null },
    { label: "Verirfied", value: 1 },
    { label: "Not Verified", value: 0 },
  ];

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showAdvancedServices, setShowAdvancedServices] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showClientAccounts, setShowClientAccounts] = useState(false);
  const [showClientSubscriptions, setShowClientSubscriptions] = useState(false);
  const [bundleName, setBundleName] = useState(null);
  const [bundleType, setBundleType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClientAccountsDetails, setShowClientAccountsDetails] =
    useState(false);

  const [totalRows, SetTotalRows] = useState(0);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [accountNumber, setAccountNumber] = useState("");
  const [accountTypeTag, setAccountTypeTag] = useState("");
  const [accountStatusTag, setAccountStatusTag] = useState("");
  const [fromCreatedDate, setFromCreatedDate] = useState("");
  const [toCreatedDate, setToCreatedDate] = useState("");
  const getAllClients = async ({
    mobileNumber = null,
    clientName = null,
    clientClassName = null,
    fromSignupDate = null,
  }) => {
    SetLoading(true);
    SetData([]);
    try {
      let resellersResponse = await GET_ALL_CLIENT_API({
        token,
        search: SearchQuery,
        name: filterState?.name?.label,
        Email: filterState?.email,
        CreatedDate: filterState?.signupDate
          ? Math.floor(new Date(filterState?.signupDate).getTime() / 1000)
          : null,
        MobileNumber: filterState?.mobileNumber?.toString(),
        ClassGuid: filterState?.class?.value,
        Kyc: filterState?.kyc,
        IsMobileVerified:
          filterState?.mobileVerified == null
            ? null
            : filterState?.mobileVerified == 1
            ? "verified"
            : "unverified",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        type: "BUSINESS",
        ParentGuid: selectedReseller?.value,
        mobileNumber,
        clientName,
        clientClassName,
        fromSignupDate,
      });
      SetData(resellersResponse?.data?.data?.clients);
      SetTotalRows(resellersResponse?.data?.data?.totalRows);
    } catch (e) {
      HandleApiError(e);
    } finally {
      SetLoading(false);
    }
  };

  const handleViewClientSubscriptions = async ({
    bundleType,
    bundleName,
    classGuid,
  }) => {
    SetLoading(true);

    setClientSubscriptions([]);

    try {
      let clientAccountResponse = await GET_CLIENT_ELIGIBLE_BUNDLE({
        ClientGuid: selectedClient.recordGuid,
        BundleTypeTags: bundleType,
        bundleName: bundleName,
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ClassGuid: classGuid,
      });
      if (clientAccountResponse?.data?.success) {
        setClientSubscriptions([]);
        setClientSubscriptions(clientAccountResponse?.data?.data?.items);
        SetTotalRows(clientAccountResponse?.data?.data?.totalRows);
      }
    } catch (e) {
      HandleApiError(e);
    } finally {
      SetLoading(false);
    }
  };

  const handleFilterResetclientaccount = () => {
    if (showClientAccounts) {
      setAccountNumber("");
      setAccountTypeTag("");
      setAccountStatusTag("");
      setFromCreatedDate("");
      setToCreatedDate("");
    } else {
      SetSearchQuery("");

      setPaginationModel({ pageSize: 10, page: 0 });
      getAllClients({ search: "" });
    }
  };
  const handleFilterResetSubsciptions = () => {
    if (showClientSubscriptions) {
      setBundleName("");
      setBundleType("");
      handleViewClientSubscriptions({
        ClientGuid: selectedClient,
        classGuid: selectedClass,
      });
    } else {
      SetSearchQuery("");

      setPaginationModel({ pageSize: 10, page: 0 });
      handleViewClientSubscriptions({
        ClientGuid: selectedClient,
        classGuid: selectedClass,
      });
    }
  };

  const handleFilterSearchclientaccount = () => {
    if (showClientAccounts) {
      handleViewClientAccount({
        ClientGuid: selectedClient,
        AccountNumber: accountNumber,
        AccountTypeTag: accountTypeTag,
        AccountStatusTag: accountStatusTag,
        FromCreatedDate: fromCreatedDate,
        ToCreatedDate: toCreatedDate,
      });
    } else {
      // Apply the general client search filters with new filters included
      getAllClients({
        search: SearchQuery,
      });
    }
  };
  const handleFilterSearchclientSubscription = () => {
    if (showClientSubscriptions) {
      handleViewClientSubscriptions({
        ClientGuid: selectedClient,
        classGuid: selectedClass,
        bundleName: bundleName != null ? bundleName : null,
        bundleType: bundleType != null ? bundleType : null,
      });
    } else {
      // Apply the general client search filters with new filters included
      getAllClients({
        search: SearchQuery,
      });
    }
  };

  const loadClassOptions = async (
    ParentId,
    search = "",
    loadedOptions = [],
    { page = 1, recordGuid } = {}
  ) => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLASSES({
        token,
        search,
        ParentClientGuid: selectedReseller?.value,
        pageIndex: page,
        pageSize: 10,
      });
      const options = response?.data?.data?.classes?.map((item) => ({
        value: item?.recordGuid,
        label: item?.className,
      }));

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.clients?.length <
        response?.data?.data?.totalRows;
      return {
        options: options ?? [],
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

  const handleDeleteClick = async (id) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();

    // If the user confirms the deletion
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        SetLoading(true);

        // Perform the deletion operation
        let deleteResponse = await DELETE_RESELLER({
          token,
          id,
        });

        if (deleteResponse?.data?.success) {
          // Notification?.success("Reseller deleted successfully");
          showSnackbar("Client deleted successfully");

          // Refresh your data or perform any necessary actions
          getAllClients({});
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        // Set loading back to false when the operation is complete
        SetLoading(false);
      }
    }
  };

  const handleViewClientAccount = async ({
    ClientGuid,
    AccountNumber = null,
    AccountTypeTag = null,
    AccountStatusTag = null,
    FromCreatedDate = null,
    ToCreatedDate = null,
  }) => {
    SetLoading(true);

    setClientAccount([]);
    try {
      let clientAccountResponse = await GET_ALL_CLIENT_ACCOUNT_API({
        ClientGuid,
        AccountNumber,
        AccountTypeTag,
        AccountStatusTag,
        FromCreatedDate,
        ToCreatedDate,
      });
      if (clientAccountResponse?.data?.success) {
        setClientAccount([]);
        setClientAccount(clientAccountResponse?.data?.data?.clientAccounts);
        SetTotalRows(
          clientAccountResponse?.data?.data?.clientAccounts?.totalRows
        );
      }
    } catch (e) {
      HandleApiError(e);
    } finally {
      SetLoading(false);
    }
  };

  const handleStatus = async (recordGuid, newStatus) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",

      text: "Are you sure you want to update this client status?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress

        SetLoading(true);

        // Perform the deletion operation

        let updateResponse = await UPDATE_RESELLER_STATUS({
          token,
          formData: {
            ClientGuid: recordGuid,
            IsEnabled: newStatus,
          },
        });

        if (updateResponse?.data?.success) {
          showSnackbar("Client updated successfully");
          // Refresh your data or perform any necessary actions
          getAllClients({});
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e }), "error");
      } finally {
        // Set loading back to false when the operation is complete
        SetLoading(false);
      }
    }
  };

  const { showSnackbar } = useSnackbar();

  const loadResellerOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_RESELLER_API({
        pageNumber: page,
        pageSize: 10,
        search,
        type: "RESELLER",
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

  const getAdvancedServices = async (clientCategoryGuid, clientGuid) => {
    SetLoading(true);
    setAdvancedServices([]);
    try {
      const resp = await GET_ADVANCED_SERVICES({
        clientCategoryGuid,
        clientGuid,
      });
      const subscribedServices =
        resp?.data?.data?.items?.filter((item) => item.isSubscribed) || [];
      setAdvancedServices(subscribedServices);

      if (resp?.data?.success === 200) {
        SetLoading(false);
      }
    } catch (e) {
      console.error(e);
      SetLoading(false);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    if (!showClientSubscriptions) {
      getAllClients({});
    }
    if (showClientSubscriptions) {
      handleViewClientSubscriptions({
        ClientGuid: selectedClient,
        classGuid: selectedClass,
      });
    }
  }, [paginationModel, selectedReseller]);

  useEffect(() => {
    if (selectedClient && !showClientSubscriptions) {
      handleViewClientAccount({ ClientGuid: selectedClient });
    }
  }, [selectedClient]);
  useEffect(() => {
    if (selectedClient && showClientSubscriptions) {
      handleViewClientSubscriptions({
        ClientGuid: selectedClient,
        classGuid: selectedClass,
      });
    }
  }, [selectedClient, showClientSubscriptions]);

  const handleFilterReset = () => {
    SetSearchQuery("");
    setFilterState({
      name: null,
      email: null,
      signupDate: null,
      mobileNumber: null,
      class: null,
      kyc: null,
      mobileVerified: null,
    });
    setPaginationModel({ pageSize: 10, page: 0 });
  };

  const handleFilterSearch = () => {
    setPaginationModel({
      pageSize: 10,
      page: 0,
    });
  };

  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  const resetPasswordFunction = async (data) => {
    setLoading(true);
    try {
      let formData = {
        UserName: username,
      };
      let response = await GET_PIN({ formData });
      if (response?.data?.data?.success) {
        setResetPasswordModal(true);
        setLoading(false);
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordFormik = useFormik({
    initialValues: {
      pin: "",
      newPassword: "",
    },
    validationSchema: Yup.object().shape({
      pin: Yup.number().required("Pin is required"),
      newPassword: Yup.string().required("New Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {
          UserName: username,
          Pin: values?.pin,
          NewPassword: values?.newPassword,
        };
        let response = await RESET_PASSWORD({
          formData: data,
        });

        if (response?.data?.data?.success) {
          setResetPasswordModal(false);
          showSnackbar("Password Reset Successful!");
          getAllClients();
          resetPasswordFormik?.resetForm();
          setLoading(false);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return selectedReseller == "" ? (
    <OpeningModal
      resellerOptions={resellerOptions}
      loading={loading}
      setSelectedReseller={setSelectedReseller}
    />
  ) : (
    <Box container id="Client" className="page_container">
      <Box className="section_container scroll">
        <Grid
          container
          className="sub_section_container pt-4"
          alignContent={"flex-start"}
        >
          <Grid item xs={4} sx={{ zIndex: "100", mt: 2 }}>
            {selectedReseller != "" && selectedReseller != undefined ? (
              <InputLabel sx={{ fontSize: "12px", marginBottom: "-5px" }}>
                Reseller
              </InputLabel>
            ) : (
              <InputLabel sx={{ marginTop: "10px" }} />
            )}
            <AsyncPaginate
              id="async-menu-style"
              loadOptions={loadResellerOptions}
              additional={{
                page: 1,
              }}
              onChange={(value) => setSelectedReseller(value)}
              value={selectedReseller}
              placeholder="Reseller"
              classNamePrefix="react-select"
            />
          </Grid>
          <Grid item xs={8}>
            <Button
              startIcon={<Add />}
              className="mui-btn primary filled"
              onClick={() =>
                navigate({
                  pathname: "/client/new-client",
                  state: { selectedReseller: selectedReseller },
                })
              }
            >
              Add Client
            </Button>
            <Button
              className="mui-btn primary outlined"
              id="send-service-provider-id"
              onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}
            >
              <FilterAltIcon />
            </Button>
          </Grid>
          {showAdvanceSearch && (
            <Grid item xs={12}>
              {showClientAccounts ? (
                <AdvancedSearch
                  showAdvanceSearch={showAdvanceSearch}
                  handleFilterReset={handleFilterResetclientaccount}
                  handleFilterSearch={handleFilterSearchclientaccount}
                  setShowAdvanceSearch={setShowAdvanceSearch}
                  body={
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            variant="standard"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            label="Account Type"
                            value={accountTypeTag}
                            onChange={(e) => setAccountTypeTag(e.target.value)}
                            variant="standard"
                          >
                            <MenuItem value="PREPAID">Prepaid</MenuItem>
                            <MenuItem value="POSTPAID">Postpaid</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            label="Account Status"
                            value={accountStatusTag}
                            onChange={(e) =>
                              setAccountStatusTag(e.target.value)
                            }
                            variant="standard"
                          >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="CLOSED">Closed</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="From Created Date"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={fromCreatedDate}
                            onChange={(e) => setFromCreatedDate(e.target.value)}
                            variant="standard"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="To Created Date"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={toCreatedDate}
                            onChange={(e) => setToCreatedDate(e.target.value)}
                            variant="standard"
                          />
                        </Grid>
                      </Grid>
                    </>
                  }
                />
              ) : showClientSubscriptions ? (
                <AdvancedSearch
                  showAdvanceSearch={showAdvanceSearch}
                  handleFilterReset={handleFilterResetSubsciptions}
                  handleFilterSearch={handleFilterSearchclientSubscription}
                  setShowAdvanceSearch={setShowAdvanceSearch}
                  body={
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Bundle Name"
                            value={bundleName}
                            onChange={(e) => setBundleName(e.target.value)}
                            variant="standard"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth variant="standard">
                            <InputLabel id="client-label">
                              Bundle Type
                            </InputLabel>
                            <Select
                              key="bundleType"
                              id="bundleType"
                              name="bundleType"
                              label="Bundle Type"
                              labelId="bundleType-llabel"
                              value={bundleType}
                              onChange={(e) => setBundleType(e.target.value)}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {["FREE", "PAID"]?.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}></Grid>
                      </Grid>
                    </>
                  }
                />
              ) : (
                <AdvancedSearch
                  showAdvanceSearch={showAdvanceSearch}
                  handleFilterReset={handleFilterReset}
                  handleFilterSearch={handleFilterSearch}
                  setShowAdvanceSearch={setShowAdvanceSearch}
                  body={
                    <>
                      <Grid item xs={3}>
                        <CustomAsyncPaginate
                          apiFunction={GET_ALL_CLIENT_API} // Pass the function directly
                          value={filterState?.name}
                          onChange={(value) => {
                            setFilterState((prev) => ({
                              ...prev,
                              name: value,
                            }));
                            setRandomValue(Math.random());
                          }}
                          placeholder="Client Name"
                          pageSize={10}
                          dataPath="data.data.clients" // Adjust path based on API response structure
                          totalRowsPath="data.data.totalRows"
                          method="GET"
                          isDisabled={!selectedReseller}
                          id={`async-menu-style-accounts`}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={SearchQuery}
                          onChange={(e) => SetSearchQuery(e?.target?.value)}
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl fullWidth variant="standard">
                          <AsyncPaginate
                            key={randomValue}
                            id="async-menu-style-accounts"
                            value={filterState?.class}
                            loadOptions={(search, loadedOptions, additional) =>
                              loadClassOptions(
                                search,
                                loadedOptions,
                                additional
                              )
                            }
                            additional={{
                              page: 1,
                            }}
                            onChange={(value) => {
                              setFilterState((prev) => ({
                                ...prev,
                                class: value,
                              }));
                            }}
                            isDisabled={!selectedReseller?.value}
                            placeholder="Class Name"
                            classNamePrefix="react-select"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Mobile Number"
                          type="number"
                          value={filterState?.mobileNumber ?? ""}
                          onChange={(e) => {
                            setFilterState((prev) => ({
                              ...prev,
                              mobileNumber: e?.target?.value,
                            }));
                          }}
                          variant="standard"
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="mobileVerified">
                            Mobile Verified
                          </InputLabel>
                          <Select
                            labelId="mobileVerified"
                            id="mobileVerified"
                            name="mobileVerified"
                            value={filterState?.mobileVerified}
                            onChange={(e) => {
                              setFilterState((prev) => ({
                                ...prev,
                                mobileVerified: e.target?.value,
                              }));
                            }}
                          >
                            {mobileVerifyOptions?.map((option, index) => (
                              <MenuItem key={index} value={option?.value}>
                                {option?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl fullWidth variant="standard">
                          <InputLabel id="kyc">KYC</InputLabel>
                          <Select
                            multiple
                            labelId="kyc"
                            id="kyc"
                            name="kyc"
                            value={filterState?.kyc || []} // Ensure value is always an array
                            onChange={(e) => {
                              const { value } = e.target;

                              setFilterState((prev) => {
                                // If "None" is selected, clear all other selections
                                if (value.includes(null)) {
                                  return { ...prev, kyc: [null] };
                                }

                                // Filter out "None" if it's currently selected and adding other options
                                const newValue = prev.kyc?.includes(null)
                                  ? value.filter((v) => v !== null)
                                  : value;

                                return { ...prev, kyc: newValue };
                              });
                            }}
                          >
                            {kycOptions?.map((option, index) => (
                              <MenuItem key={index} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          variant="standard"
                          type="date"
                          label="Signup Date"
                          name="signupDate"
                          value={filterState?.signupDate ?? ""}
                          onChange={(e) => {
                            setFilterState((prev) => ({
                              ...prev,
                              signupDate: e?.target?.value,
                            }));
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </>
                  }
                />
              )}
            </Grid>
          )}
          <MuiModal
            title="View Subscribed Services"
            open={showAdvancedServices}
            width="700px"
            id="edit-contact-form"
            handleClose={() => setShowAdvancedServices(false)}
          >
            <Grid item xs={12} marginTop={2}>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "tag",
                      headerName: "Subscribed Services",
                      width: 200,
                      renderCell: (params) => {
                        return params?.row?.serviceDetails[0]?.name;
                      },
                    },
                  ]}
                  data={advancedServices}
                  loading={isLoading} // Adjust according to loading state if required
                  //   setPaginationModel={() => {}} // Define pagination if needed
                  //   paginationModel={{}} // Adjust pagination model if needed
                  totalRows={advancedServices?.length || 0} //
                />
              )}
            </Grid>
          </MuiModal>

          {
            // showClientAccounts ? (
            //   <Grid
            //     item
            //     xs={12}
            //     marginTop={2}
            //     sx={{
            //       display: "flex",
            //       flexDirection: "column",

            //       alignItems: "start",
            //       width: "100%",
            //     }}
            //   >
            //     <IconButton
            //       onClick={() => setShowClientAccounts(false)}
            //       sx={{ fontSize: "20px" }}
            //     >
            //       <ArrowBackIcon />
            //     </IconButton>

            //     {/* <ClientAccounts data={clientAccount} /> */}

            //   </Grid>
            // ) :
            showClientSubscriptions ? (
              <Grid
                item
                xs={12}
                marginTop={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",

                  alignItems: "start",
                  width: "100%",
                }}
              >
                <IconButton
                  onClick={() => setShowClientSubscriptions(false)}
                  sx={{ fontSize: "20px" }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <SubscriptionClient
                  selectedClient={selectedClient}
                  isLoading={isLoading}
                  data={clientSubscriptions}
                  SetLoading={SetLoading}
                  setClientSubscriptions={setClientSubscriptions}
                  totalRows={totalRows}
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                />
              </Grid>
            ) : (
              <Grid item xs={12} marginTop={2}>
                <MuiTable
                  rowId="recordGuid"
                  columns={[
                    {
                      field: "isActive",
                      headerName: "Active",
                      width: 150,
                      renderCell: (params) => {
                        return (
                          <div>
                            <FormControlLabel
                              control={
                                <MuiSwitch
                                  checked={params.row.isActive}
                                  onChange={() =>
                                    handleStatus(
                                      params.row.recordGuid,
                                      !params.row.isActive
                                    )
                                  }
                                />
                              }
                              label={`${
                                params.row.isActive ? "Active" : "Inactive"
                              }`}
                            />
                          </div>
                        );
                      },
                    },
                    {
                      field: "name",
                      headerName: "Name",
                      width: 200,
                      renderCell: (params) => {
                        return params?.row?.name;
                      },
                    },
                    { field: "email", headerName: "Email", width: 200 },
                    {
                      field: "mobileNumber",
                      headerName: "Mobile Number",
                      width: 200,
                    },
                    {
                      field: "classClassName",
                      headerName: "Class Name",
                      width: 200,
                      renderCell: (params) => {
                        return params?.row?.classClassName;
                      },
                    },
                    {
                      field: "createdDate",
                      headerName: "Created Date",
                      width: 200,
                      renderCell: (params) => {
                        return new Date(params?.value * 1000).toDateString();
                      },
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      width: 300,
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
                            <Tooltip title={"Get Services"} placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  getAdvancedServices(
                                    params.row.clientCategoryRecordGuid,
                                    params.row.recordGuid
                                  );
                                  setShowAdvancedServices(true);
                                }}
                              >
                                <MiscellaneousServicesIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={"View Subscriptions"}
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedClient(params.row);
                                  setSelectedClass(params.row.classRecordGuid);
                                  setShowClientSubscriptions(true);
                                }}
                              >
                                <ViewInArIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={"View Accounts"} placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedClient(params.row.recordGuid);
                                  setShowClientAccounts(true);
                                }}
                              >
                                <VisibilityOutlined />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={"Reset Password"} placement="top">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  !params.row?.isLocked &&
                                    resetPasswordFunction(params?.row);
                                }}
                              >
                                <RotateLeftIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Edit"} placement="top">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/client/edit/${params?.row?.recordGuid}`
                                  )
                                }
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          </Box>
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
            )
          }

          {resetPasswordModal && (
            <MuiModal
              title="Reset Password"
              open={resetPasswordModal}
              width="500px"
              id="edit-contact-form"
              handleClose={() => setResetPasswordModal(false)}
            >
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"pin"}
                    fullWidth
                    id={"pin"}
                    name={"pin"}
                    label={"Pin*"}
                    variant="standard"
                    type={"text"}
                    value={resetPasswordFormik.values["pin"]}
                    onChange={resetPasswordFormik.handleChange}
                    onBlur={resetPasswordFormik.handleBlur}
                    error={
                      resetPasswordFormik.touched["pin"] &&
                      Boolean(resetPasswordFormik.errors["pin"])
                    }
                    helperText={
                      resetPasswordFormik.touched["pin"] &&
                      resetPasswordFormik.errors["pin"]
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={2}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"newPassword"}
                    fullWidth
                    id={"newPassword"}
                    name={"newPassword"}
                    label={"New Password*"}
                    variant="standard"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      style: {
                        fontSize: "2.3vh",
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOpen />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={resetPasswordFormik.values["newPassword"]}
                    onChange={resetPasswordFormik.handleChange}
                    onBlur={resetPasswordFormik.handleBlur}
                    error={
                      resetPasswordFormik.touched["newPassword"] &&
                      Boolean(resetPasswordFormik.errors["newPassword"])
                    }
                    helperText={
                      resetPasswordFormik.touched["newPassword"] &&
                      resetPasswordFormik.errors["newPassword"]
                    }
                  />
                </FormControl>
              </Grid>
              <Grid container justifyContent="between" className="my-3">
                <Button
                  className="mui-btn secondary outlined"
                  onClick={() => setResetPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="mui-btn primary filled"
                  disabled={loading}
                  onClick={resetPasswordFormik?.handleSubmit}
                >
                  {loading ? "Loading..." : "Confirm"}
                </Button>
              </Grid>
            </MuiModal>
          )}
          <MuiModal
            title="View Accounts"
            open={showClientAccounts}
            width="500px"
            id="edit-contact-form"
            handleClose={() => setShowClientAccounts(false)}
          >
            <Grid xs={12}>
              {clientAccount?.map((account, index) => (
                <Grid item xs={12} marginTop={2} key={index}>
                  <List
                    sx={{
                      listStyleType: "disc",
                      px: 4, // Horizontal padding
                      pt: 2, // Top padding
                      pb: 1, // Bottom padding
                      border: "1px solid lightgrey",
                    }}
                  >
                    <ListItem
                      sx={{
                        display: "block",
                        textAlign: "center",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <ListItemText
                        primary={account?.accountTypeTag}
                        primaryTypographyProps={{
                          variant: "body1",
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                    {[
                      { label: "Name", value: account?.clientName },
                      {
                        label: "Account Number",
                        value: account?.accountNumber,
                      },
                      {
                        label: "Balance Limit",
                        value: account?.balanceLimit,
                      },
                      {
                        label: "Current Balance",
                        value: account?.currentBalance,
                      },
                      {
                        label: "Last Recharge",
                        value: account?.lastRecharge,
                      },
                      {
                        label: "Previous Balance",
                        value: account?.previousBalance,
                      },
                      {
                        label: "Currency",
                        value: account?.currencyCode,
                      },
                    ].map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{ display: "list-item", py: 0 }}
                      >
                        <ListItemText
                          primary={`${item.label}: ${item.value}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              ))}
            </Grid>
          </MuiModal>
        </Grid>
      </Box>
    </Box>
  );
};

export default withTranslation("translation")(GetActions(ClientsPage));
