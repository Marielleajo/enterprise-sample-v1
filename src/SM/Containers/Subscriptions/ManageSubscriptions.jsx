import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  GET_ALL_CLIENT_PARENT_API,
  GET_ALL_RESELLERS,
} from "../../../APIs/Clients";
import {
  GET_ADVANCED_SERVICES,
  SUBSCRIBE_TO_FEATURE,
  SUBSCRIBE_TO_SERVICE,
  UNSUBSCRIBE_TO_FEATURE,
  UNSUBSCRIBE_TO_SERVICE,
} from "../../../APIs/Common";
import MuiSwitch from "../../../Components/MuiSwitch";

import { HandleApiError, handleMessageError } from "../../Utils/Functions";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { GET_ALL_CLIENT_API } from "../../../APIs/Postpaid";
import GetActions from "../../Utils/GetActions";
import { GET_ALL_RESELLER_API } from "../../../APIs/Resellers";
import { AsyncPaginate } from "react-select-async-paginate";

function ManageSubscriptions() {
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [randomValue, setRandomValue] = useState("");
  const [loading, SetLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState([]);
  const [services, setServices] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [selectedTag, setSelectedTag] = useState();

  const getAllServices = async ({ search = null }) => {
    SetLoading(true);
    try {
      let resellersResponse = await GET_ADVANCED_SERVICES({
        clientCategoryGuid: formik?.values?.clientOption
          ? formik?.values?.clientOption?.clientCategoryRecordGuid
          : formik?.values?.reseller?.clientCategory,
        clientGuid: formik?.values?.clientOption
          ? formik?.values?.clientOption?.recordGuid
          : formik?.values?.reseller?.value,
      });
      setServices(resellersResponse?.data?.data?.items);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      SetLoading(false);
    }
  };
  const changeServiceStatus = async (recordGuid, isChecked) => {
    const result = await Swal.fire({
      title: "Confirm Update Service Subscription!",

      text: "Are you sure you want to update the subscription for this service?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      SetLoading(true);
      try {
        if (isChecked) {
          let response = await SUBSCRIBE_TO_SERVICE({
            postData: {
              ClientGuid: formik?.values?.clientOption
                ? formik?.values?.clientOption?.recordGuid
                : formik?.values?.reseller?.value,
              ServiceGuids: [recordGuid],
            },
          });
          showSnackbar("Subscribed Successfully");
        } else {
          let response = await UNSUBSCRIBE_TO_SERVICE({
            postData: {
              ClientGuid: formik?.values?.clientOption
                ? formik?.values?.clientOption?.recordGuid
                : formik?.values?.reseller?.value,
              ServiceGuids: [recordGuid],
            },
          });
          showSnackbar("Unsubscribed Successfully");
        }

        let serviceResponse = await GET_ADVANCED_SERVICES({
          clientCategoryGuid: formik?.values?.clientOption
            ? formik?.values?.clientOption?.clientCategoryRecordGuid
            : formik?.values?.reseller?.clientCategoryRecordGuid,
          clientGuid: formik?.values?.clientOption
            ? formik?.values?.clientOption?.recordGuid
            : formik?.values?.reseller?.recordGuid,
        });

        setServices(serviceResponse?.data?.data?.items);
      } catch (e) {
        console.log(e);
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        SetLoading(false);
      }
    }
  };

  const changeFeatureStatus = async (
    serviceRecordGuid,
    FeatureRecordGuid,
    isChecked
  ) => {
    const result = await Swal.fire({
      title: "Confirm Update Feature Subscription!",

      text: "Are you sure you want to update the subscription for this feature?",

      icon: "warning",

      showCancelButton: true,

      cancelButtonColor: "#dd3333",

      confirmButtonText: "Yes, update it!",

      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      SetLoading(true);
      try {
        if (isChecked) {
          let response = await SUBSCRIBE_TO_FEATURE({
            postData: {
              ClientGuid: formik?.values?.clientOption
                ? formik?.values?.clientOption?.recordGuid
                : formik?.values?.reseller?.recordGuid,
              FeatureGuids: [FeatureRecordGuid],
            },
          });
          showSnackbar("Subscribed Successfully");
        } else {
          // Get the selected service
          const selectedService = services?.find(
            (service) => service?.recordGuid == serviceRecordGuid
          );
          // Check if it has any other features
          const hasOtherFeatures = selectedService?.features
            ?.filter((item) => item?.parent !== null)
            ?.some(
              (feature) =>
                feature?.recordGuid !== FeatureRecordGuid &&
                feature?.isSubscribed
            );

          const hasOtherParentFeatures = selectedService?.features
            ?.filter((item) => item?.parent == null)
            ?.some(
              (feature) =>
                feature?.recordGuid !== FeatureRecordGuid &&
                feature?.isSubscribed
            );

          const currentFeatureParentID = selectedService?.features?.find(
            (feature) => feature?.recordGuid == FeatureRecordGuid
          )?.parent?.recordGuid;

          let response = await UNSUBSCRIBE_TO_FEATURE({
            postData: {
              ClientGuid: formik?.values?.clientOption
                ? formik?.values?.clientOption?.recordGuid
                : formik?.values?.reseller?.recordGuid,
              FeatureGuids: [FeatureRecordGuid],
            },
          });

          if (!hasOtherFeatures && currentFeatureParentID) {
            let response = await UNSUBSCRIBE_TO_FEATURE({
              postData: {
                ClientGuid: formik?.values?.clientOption
                  ? formik?.values?.clientOption?.recordGuid
                  : formik?.values?.reseller?.recordGuid,
                FeatureGuids: [currentFeatureParentID],
              },
            });
          }

          if (!hasOtherParentFeatures) {
            let response = await UNSUBSCRIBE_TO_SERVICE({
              postData: {
                ClientGuid: formik?.values?.clientOption
                  ? formik?.values?.clientOption?.recordGuid
                  : formik?.values?.reseller?.recordGuid,
                ServiceGuids: [serviceRecordGuid],
              },
            });
          }
          showSnackbar("Unsubscribed Successfully");
        }

        let serviceResponse = await GET_ADVANCED_SERVICES({
          clientCategoryGuid: formik?.values?.clientOption
            ? formik?.values?.clientOption?.clientCategoryRecordGuid
            : formik?.values?.reseller?.clientCategoryRecordGuid,
          clientGuid: formik?.values?.clientOption
            ? formik?.values?.clientOption?.recordGuid
            : formik?.values?.reseller?.recordGuid,
        });

        setServices(serviceResponse?.data?.data?.items);
      } catch (e) {
        console.log(e);
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        SetLoading(false);
      }
    }
  };

  const getAllResellers = async () => {
    try {
      const response = await GET_ALL_RESELLERS();
      setResellers(response?.data?.data?.clients); // Update state with resellers
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  const loadResellerOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_ALL_RESELLER_API({
        pageNumber: page,
        pageSize: 10,
        search,
        type: "RESELLER",
      });
      console.log("responser", response);
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
          clientCategory: item?.clientCategoryRecordGuid,
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

  const getAllClients = async ({ search = null }) => {
    setClientOptions([]);
    try {
      let resellersResponse = {};
      resellersResponse = await GET_ALL_CLIENT_API({
        search: search,
        pageSize: 10000,
        pageNumber: 1,
        ParentId: formik?.values?.reseller?.recordGuid ?? "",
      });
      setClientOptions(resellersResponse?.data?.data?.clients);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      clientOption: null,
      reseller: null,
    },
    validationSchema: Yup.object().shape({
      reseller: Yup.object().required("Reseller is required"),
    }),
    onSubmit: async (values) => {
      try {
        getAllServices({});
      } catch (e) {
        showSnackbar(HandleApiError({ e, type: "validation" }), "error");
      }
    },
  });
  useEffect(() => {
    getAllClients({});
  }, [formik?.values?.reseller?.recordGuid]);

  const [expanded, setExpanded] = React.useState(false);
  const [innerExpanded, setInnerExpanded] = React.useState(false);

  const handleChange = (index) => (event, isExpanded) => {
    if (event.target.classList.contains("MuiSwitch-input")) {
      return;
    }
    setExpanded(isExpanded ? index : null);
  };
  const handleInnerChange = (index) => (event, isExpanded) => {
    if (event.target.classList.contains("MuiSwitch-input")) {
      return;
    }
    setInnerExpanded(isExpanded ? index : null);
  };

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.clientID != undefined) {
      formik.setFieldValue("clientOption", location?.state?.clientID);
    }
    getAllResellers();
  }, []);

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            alignContent={"flex-start"}
          >
            <Grid item xs={12} md={12}>
              <Typography variant="h5">Manage Subscriptions</Typography>
            </Grid>
            <Grid item xs={12} md={12} marginY={2}>
              <form onSubmit={formik?.handleSubmit}>
                <Card className="kpi-card p-4" sx={{ overflow: "visible" }}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Grid item xs={5}>
                      <AsyncPaginate
                        id="async-menu-style-reseller"
                        value={formik?.values?.reseller}
                        loadOptions={loadResellerOptions}
                        additional={{
                          page: 1,
                        }}
                        onChange={(value) => {
                          formik.setFieldValue("reseller", value);
                          formik.setFieldValue("clientOption", null);
                          setRandomValue(Math.random());
                        }}
                        placeholder="Reseller"
                        classNamePrefix="react-select"
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: "100%",
                            backgroundColor: "transparent !important",
                            marginTop: "0.7rem",
                          }),
                          control: (base, state) => ({
                            ...base,
                            width: "100%",
                            backgroundColor: "transparent !important",
                            zIndex: state.isFocused ? 1 : 0,
                            border: "none", // Remove the default border
                            borderBottom: state.isFocused
                              ? "1px solid #949494"
                              : "1px solid #949494", // Custom underline color
                            borderRadius: 0, // No rounded corners
                            boxShadow: "none", // Remove box-shadow
                            "&:hover": {
                              borderBottom: "1px solid #949494", // Underline effect on hover with the custom color
                            },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "#6c757d", // Slightly grayish color for placeholder
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "#495057", // Default text color
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999, // Make sure it's above everything
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 1000, // Higher z-index to bring it above other elements
                          }),
                          backgroundColor: "transparent !important",
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Autocomplete
                        key={randomValue}
                        options={clientOptions?.length > 0 ? clientOptions : []}
                        getOptionLabel={(option) => option?.name}
                        onChange={(e, value) => {
                          formik.setFieldValue("clientOption", value);
                        }}
                        value={formik.values.clientOption}
                        id="select-app"
                        disabled={formik?.values?.reseller === null}
                        onInputChange={(e, newValue) => {
                          if (!newValue || e?.target?.value) {
                            getAllClients({ search: e?.target?.value });
                            setServices([]);
                          }
                        }}
                        onClose={(event, reason) => {
                          if (
                            reason === "toggleInput" ||
                            event?.target?.textContent == ""
                          ) {
                            getAllClients({});
                            setServices([]);
                          }
                        }}
                        filterOptions={(options, params) => {
                          return options;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Client"
                            variant="standard"
                            error={
                              formik.touched["clientOption"] &&
                              Boolean(formik.errors["clientOption"])
                            }
                            helperText={
                              formik.touched["clientOption"] &&
                              formik.errors["clientOption"]
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        type="submit"
                        className="mui-btn primary filled"
                        id="send-request-sender-id"
                        fullWidth
                      >
                        Get Services
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </form>
            </Grid>

            {loading ? (
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "30vh" }}
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                {services?.length > 0 &&
                  services.map((item, index) => (
                    <Accordion
                      key={index}
                      expanded={expanded === index}
                      onChange={handleChange(index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}bh-content`}
                        id={`panel${index}bh-header`}
                      >
                        <Typography sx={{ width: "5%", flexShrink: 0 }}>
                          <MuiSwitch
                            checked={item?.isSubscribed}
                            disabled={loading}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              changeServiceStatus(item?.recordGuid, isChecked);
                            }}
                          />
                        </Typography>
                        <Typography
                          sx={{
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item?.tag
                            ?.replace(/_/g, " ")
                            ?.toLowerCase()
                            ?.split(" ")
                            ?.map(
                              (word) =>
                                word?.charAt(0)?.toUpperCase() + word?.slice(1)
                            )
                            ?.join(" ")}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          {item?.features?.length > 0 &&
                            item.features
                              .filter(
                                (feature) =>
                                  ![
                                    "Bulk Excel",
                                    "Bulk From Contact",
                                    "DB Connection",
                                    "Short Code",
                                    "Long Code",
                                    "Blacklist URL",
                                    "Short URL",
                                    "Inbox",
                                    "Configuration",
                                  ].includes(feature?.featureDetails[0]?.name)
                              )
                              .map((feature, innerIndex) =>
                                item?.features?.some(
                                  (innerFeature) =>
                                    innerFeature?.recordGuid ===
                                      feature.recordGuid &&
                                    feature?.parent === null
                                ) &&
                                item?.features?.some(
                                  (innerFeature) =>
                                    innerFeature?.parent?.recordGuid ===
                                    feature.recordGuid
                                ) ? (
                                  <Grid item xs={4} key={innerIndex}>
                                    <Accordion
                                      expanded={innerExpanded === innerIndex}
                                      onChange={handleInnerChange(innerIndex)}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index}bh-content`}
                                        id={`panel${index}bh-header`}
                                        sx={{ alignItems: "center !important" }}
                                      >
                                        <Grid container alignItems="center">
                                          <Typography>
                                            <MuiSwitch
                                              disabled={
                                                !item?.isSubscribed ||
                                                (feature?.isRequired &&
                                                  feature?.isSubscribed) ||
                                                loading
                                              }
                                              name={
                                                feature?.featureDetails[0]?.name
                                              }
                                              onChange={(e) => {
                                                const isChecked =
                                                  e.target.checked;
                                                changeFeatureStatus(
                                                  item.recordGuid,
                                                  feature?.recordGuid,
                                                  isChecked
                                                );
                                              }}
                                              checked={feature?.isSubscribed}
                                            />
                                          </Typography>
                                          <Typography
                                            sx={{ alignItems: "center" }}
                                          >
                                            {feature?.tag
                                              ?.replace(/_/g, " ")
                                              ?.toLowerCase()
                                              ?.split(" ")
                                              ?.map(
                                                (word) =>
                                                  word
                                                    ?.charAt(0)
                                                    ?.toUpperCase() +
                                                  word?.slice(1)
                                              )
                                              ?.join(" ")}
                                          </Typography>
                                        </Grid>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            ml: 3,
                                          }}
                                        >
                                          {item?.features.map(
                                            (subFeature, subIndex) =>
                                              subFeature?.parent &&
                                              subFeature.parent.recordGuid ===
                                                feature.recordGuid && (
                                                <FormControlLabel
                                                  key={subIndex}
                                                  label={
                                                    subFeature
                                                      ?.featureDetails[0]?.name
                                                  }
                                                  disabled={
                                                    !item.isSubscribed ||
                                                    (feature.isRequired &&
                                                      feature.isSubscribed) ||
                                                    loading
                                                  }
                                                  checked={
                                                    subFeature?.isSubscribed
                                                  }
                                                  onChange={(e) => {
                                                    const isChecked =
                                                      e.target.checked;
                                                    changeFeatureStatus(
                                                      item.recordGuid,
                                                      subFeature?.recordGuid,
                                                      isChecked
                                                    );
                                                  }}
                                                  control={<Checkbox />}
                                                />
                                              )
                                          )}
                                        </Box>
                                      </AccordionDetails>
                                    </Accordion>
                                  </Grid>
                                ) : (
                                  <Grid item xs={4} key={innerIndex}>
                                    <Card>
                                      <CardContent
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px",
                                          padding: "12px !important",
                                        }}
                                      >
                                        <Typography>
                                          <MuiSwitch
                                            disabled={
                                              !item?.isSubscribed ||
                                              (feature?.isRequired &&
                                                feature?.isSubscribed) ||
                                              loading
                                            }
                                            name={
                                              feature?.featureDetails[0]?.name
                                            }
                                            onChange={(e) => {
                                              const isChecked =
                                                e.target.checked;
                                              changeFeatureStatus(
                                                item.recordGuid,
                                                feature?.recordGuid,
                                                isChecked
                                              );
                                            }}
                                            checked={feature?.isSubscribed}
                                          />
                                        </Typography>
                                        <Typography
                                          sx={{ alignItems: "center" }}
                                        >
                                          {feature?.tag
                                            ?.replace(/_/g, " ")
                                            ?.toLowerCase()
                                            ?.split(" ")
                                            ?.map(
                                              (word) =>
                                                word?.charAt(0)?.toUpperCase() +
                                                word?.slice(1)
                                            )
                                            ?.join(" ")}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                )
                              )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageSubscriptions;
