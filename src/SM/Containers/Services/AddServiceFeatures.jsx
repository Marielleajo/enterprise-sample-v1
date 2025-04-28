import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { getIn, useFormik } from "formik";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { GET_ALL_FEATURE_TYPE_TAG } from "../../../APIs/Providers";
import {
  ASSIGN_FEATURE_TO_SERVICE,
  DELETE_FEATURE,
  GET_ALL_FEATURES,
  MANAGE_FEATURE,
} from "../../../APIs/Services";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import serviceFeatureValidation from "./serviceFeatureValidation";
import Swal from "sweetalert2";
import swalDeleteFunction from "../../../Components/SwalDeleteFunction";

const AddServiceFeatures = ({
  t,
  selectedService,
  type,
  setManageViewFeatures,
  setViewFeatures,
}) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [featureTypeTagOptions, setFeatureTypeTagOptions] = useState([]);
  const [PrerequisiteFeatureOptions, setPrerequisiteFeatureOptions] = useState(
    []
  );

  const formik = useFormik({
    initialValues: {
      features: [
        {
          name: "",
          description: "",
          // valueType: "",
          prerequisiteFeature: [],
          featureTypeTag: "",
          active: false,
          required: false,
          added: false,
          recordGuid: "",
          parent: "",
        },
      ],
    },
    validationSchema: serviceFeatureValidation,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let data = {};
        if (values?.features[values?.features?.length - 1]?.parent === "") {
          data = {
            featureDetails: [
              {
                languageCode: "en",
                name: values?.features[values?.features?.length - 1]?.name,
                description:
                  values?.features[values?.features?.length - 1]?.description,
              },
            ],
            featureTypeTag:
              values?.features[values?.features?.length - 1]?.featureTypeTag,
            // valueType:
            //   values?.features[values?.features?.length - 1]?.valueType,
            isActive: values?.features[values?.features?.length - 1]?.active,
            prerequisiteFeatureGuids: values?.features[
              values?.features?.length - 1
            ]?.prerequisiteFeature?.map((item) => item),
            ServiceGuid: selectedService?.recordGuid
              ? selectedService?.recordGuid
              : selectedService,
            IsRequired:
              values?.features[values?.features?.length - 1]?.required,
          };
        } else {
          data = {
            featureDetails: [
              {
                languageCode: "en",
                name: values?.features[values?.features?.length - 1]?.name,
                description:
                  values?.features[values?.features?.length - 1]?.description,
              },
            ],
            featureTypeTag:
              values?.features[values?.features?.length - 1]?.featureTypeTag,
            // valueType:
            //   values?.features[values?.features?.length - 1]?.valueType,
            isActive: values?.features[values?.features?.length - 1]?.active,
            ParentGuid: values?.features[values?.features?.length - 1]?.parent,
            prerequisiteFeatureGuids: values?.features[
              values?.features?.length - 1
            ]?.prerequisiteFeature?.map((item) => item),
            ServiceGuid: selectedService?.recordGuid
              ? selectedService?.recordGuid
              : selectedService,
            IsRequired:
              values?.features[values?.features?.length - 1]?.required,
          };
        }
        let response = await MANAGE_FEATURE({ postData: data });
        if (response?.data?.success) {
          showSnackbar("Service Feature Added Successfully!");
          assignFeature(response?.data?.data?.feature?.recordGuid);
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const assignFeature = async (recordGuid) => {
    setLoading(true);
    try {
      let data = {
        serviceGuid: selectedService?.recordGuid
          ? selectedService?.recordGuid
          : selectedService,
        FeatureGuids: [recordGuid],
      };
      let response = await ASSIGN_FEATURE_TO_SERVICE({
        postData: data,
      });
      if (response?.data?.success) {
        getAllFeatures();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getAllFeatures = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_FEATURES({
        ServiceGuid: selectedService?.recordGuid
          ? selectedService?.recordGuid
          : selectedService,
      });
      const data =
        response?.data?.data?.items?.map((item) => ({
          name: item?.featureDetails[0]?.name || "",
          description: item?.featureDetails[0]?.description || "",
          // valueType: item?.valueType || "",
          prerequisiteFeature:
            item?.prerequistes?.map((item) => item?.recordGuid) || [],
          featureTypeTag: item?.featureTypeTag || "",
          active: item?.isActive || false,
          required: item?.isRequired || false,
          added: true,
          recordGuid: item?.recordGuid || "",
          parent: item?.parent?.recordGuid || "null",
        })) || [];
      formik.setFieldValue("features", data);

      setPrerequisiteFeatureOptions(
        response?.data?.data?.items?.map((x) => ({
          label: x?.featureDetails[0].name,
          value: x?.recordGuid,
        }))
      );
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const getFeatureTypeTag = async () => {
    setLoading(true);
    try {
      let data = {
        categoryTags: ["FEATURE_TYPE"],
      };
      let response = await GET_ALL_FEATURE_TYPE_TAG({ data });
      setFeatureTypeTagOptions(
        response?.data?.data?.criteria?.map((item) => ({
          label: item?.name,
          value: item?.tag,
        }))
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFeatures();
    getFeatureTypeTag();
  }, []);

  const addServiceFeatureList = () => {
    formik.setFieldValue("features", [
      ...formik?.values?.features,
      {
        name: "",
        description: "",
        // valueType: "",
        prerequisiteFeature: [],
        featureTypeTag: "",
        active: false,
        required: false,
        added: false,
        recordGuid: "",
        parent: "",
      },
    ]);
  };

  const removePricePlanList = async (index, RecordGuid) => {
    const { features } = formik?.values;
    if (!features[index]?.added) {
      features.splice(index, 1);
      formik.setFieldValue("features", features);
    } else {
      await handleDeleteFeature(index, RecordGuid);
    }
  };

  const handleDeleteFeature = async (index, RecordGuid) => {
    // Show a confirmation dialog using SweetAlert
    const result = await swalDeleteFunction();
    if (result.isConfirmed) {
      try {
        // Set loading to true while the deletion is in progress
        setLoading(true);

        // Execute all delete promises in parallel
        const deleteResponses = await DELETE_FEATURE({
          RecordGuid: RecordGuid,
        });

        if (deleteResponses?.data?.success) {
          Swal.fire({
            title: "Feature Deleted Successfully",
            icon: "success",
          });
        } else {
          // Handle failure, e.g., display an error message for each failed deletion
          Swal.fire({
            title: "Error Updating Status",
            text: "Unknown Error",
            icon: "error",
          });
        }

        const { features } = formik?.values;
        features.splice(index, 1);
        formik.setFieldValue("features", features);
        // Refresh your data or perform any necessary actions
        getAllFeatures();
      } catch (e) {
        Swal.fire({
          title: "Error Updating Status",
          text: handleMessageError({ e }),
          icon: "error",
        });
      } finally {
        // Set loading back to false when the operation is complete
        setLoading(false);
      }
    }
  };

  const theme = useTheme();

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Grid
            container
            className="pt-4"
            paddingRight={2.5}
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            {type == "edit" && (
              <Grid item xs={12} md={4}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography
                    style={{
                      cursor: "pointer",
                    }}
                    className="BreadcrumbsPage"
                    onClick={() => {
                      if (type == "edit") {
                        setManageViewFeatures(false);
                      } else {
                        setManageViewFeatures(false);
                        setViewFeatures(false);
                      }
                    }}
                  >
                    {type == "edit" ? "View Features" : "Services"}
                  </Typography>
                  <Typography className="breadcrumbactiveBtn">
                    Manage Features
                  </Typography>
                </Breadcrumbs>
              </Grid>
            )}
            <Grid
              item
              xs={type == "edit" ? 6 : 12}
              md={type == "edit" ? 8 : 12}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Button
                className="mui-btn primary filled"
                disabled={
                  formik?.values?.features?.length > 0 &&
                  !formik?.values?.features[
                    formik?.values?.features?.length - 1
                  ]?.added
                }
                id="send-service-provider-id"
                onClick={() => addServiceFeatureList()}
                startIcon={<Add />}
              >
                Add Feature
              </Button>
            </Grid>
          </Grid>
          {formik?.values?.features?.length > 0 &&
            formik?.values?.features?.map((item, index, array) => (
              <Grid
                key={index}
                container
                className="pt-4"
                paddingRight={2.5}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
              >
                <Grid item xs={11}>
                  {index === 0 ? (
                    <Accordion
                      defaultExpanded
                      style={{
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Grid container>
                          <Grid display={"flex"} item xs={11}>
                            <SettingsIcon
                              style={{
                                color: "#C41035",
                                fontSize: "25px",
                                marginRight: "5px",
                              }}
                            />
                            <Typography>Feature {index + 1}</Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid
                          container
                          spacing={2}
                          style={{ marginTop: "0px" }}
                        >
                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={"features.name"}
                                fullWidth
                                id={"features.name"}
                                name={"features.name"}
                                label={"Name*"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={item?.name}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].name`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched["features.name"] &&
                                  Boolean(formik.errors["features.name"])
                                }
                                helperText={
                                  formik.touched["features.name"] &&
                                  formik.errors["features.name"]
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={"features.description"}
                                fullWidth
                                id={"features.description"}
                                name={"features.description"}
                                label={"Description*"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={item?.description}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].description`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched["features.description"] &&
                                  Boolean(formik.errors["features.description"])
                                }
                                helperText={
                                  formik.touched["features.description"] &&
                                  formik.errors["features.description"]
                                }
                              />
                            </FormControl>
                          </Grid>
                          {/* <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={"features.valueType"}
                                fullWidth
                                id={"features.valueType"}
                                name={"features.valueType"}
                                label={"Value Type"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={item?.valueType}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].valueType`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched["features.valueType"] &&
                                  Boolean(formik.errors["features.valueType"])
                                }
                                helperText={
                                  formik.touched["features.valueType"] &&
                                  formik.errors["features.valueType"]
                                }
                              />
                            </FormControl>
                          </Grid> */}
                          <Grid item xs={4}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel
                                error={
                                  formik.touched["features.featureTypeTag"] &&
                                  Boolean(
                                    formik.errors["features.featureTypeTag"]
                                  )
                                }
                                id="features.featureTypeTag"
                              >
                                Feature Type*
                              </InputLabel>
                              <Select
                                id="features.featureTypeTag"
                                name="features.featureTypeTag"
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].featureTypeTag`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  formik.touched["features.featureTypeTag"] &&
                                  Boolean(
                                    formik.errors["features.featureTypeTag"]
                                  )
                                }
                                disabled={item?.added}
                                value={item?.featureTypeTag}
                                labelId="features.featureTypeTag"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {featureTypeTagOptions?.map((item, idx) => (
                                  <MenuItem key={idx} value={item?.value}>
                                    {item?.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {formik.touched["features.featureTypeTag"] &&
                              formik.errors["features.featureTypeTag"] && (
                                <FormHelperText
                                  style={{ color: theme?.palette?.error?.main }}
                                >
                                  {formik.errors["features.featureTypeTag"]}
                                </FormHelperText>
                              )}
                          </Grid>
                          <Grid item xs={2}>
                            <Box
                              sx={{
                                width: "100%",
                                marginBottom: "8px",
                                marginTop: "15px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#B3B3B3",
                                  fontSize: "15px",
                                  marginRight: "20px",
                                }}
                              >
                                Active
                              </span>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={item?.active}
                                    disabled={item?.added}
                                    onChange={() =>
                                      formik.setFieldValue(
                                        `features[${index}].active`,
                                        !formik?.values?.features[index]?.active
                                      )
                                    }
                                  />
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={2}>
                            <Box
                              sx={{
                                width: "100%",
                                marginBottom: "8px",
                                marginTop: "15px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#B3B3B3",
                                  fontSize: "15px",
                                  marginRight: "20px",
                                }}
                              >
                                Required
                              </span>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={item?.required}
                                    disabled={item?.added}
                                    onChange={() =>
                                      formik.setFieldValue(
                                        `features[${index}].required`,
                                        !formik?.values?.features[index]
                                          ?.required
                                      )
                                    }
                                  />
                                }
                              />
                            </Box>
                          </Grid>
                          {!item?.added && (
                            <Grid
                              item
                              xs={12}
                              display={"flex"}
                              flexDirection={"row"}
                              style={{ marginTop: 20 }}
                              justifyContent={"end"}
                            >
                              <Button
                                className="mui-btn primary filled"
                                onClick={formik?.handleSubmit}
                                disabled={loading}
                              >
                                Save Changes
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Accordion
                      defaultExpanded
                      style={{
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Grid container>
                          <Grid display={"flex"} item xs={11}>
                            <SettingsIcon
                              style={{
                                color: "#C41035",
                                fontSize: "25px",
                                marginRight: "5px",
                              }}
                            />
                            <Typography>Feature {index + 1}</Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid
                          container
                          spacing={2}
                          style={{ marginTop: "0px" }}
                        >
                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={`features[${index}].name`}
                                fullWidth
                                id={`features[${index}].name`}
                                name={`features[${index}].name`}
                                label={"Name*"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={formik.values.features[index]?.name}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].name`,
                                    e.target.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].name`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].name`
                                    )
                                  )
                                }
                                helperText={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].name`
                                  ) &&
                                  getIn(
                                    formik.errors,
                                    `features[${index}].name`
                                  )
                                }
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={"features.description"}
                                fullWidth
                                id={"features.description"}
                                name={"features.description"}
                                label={"Description*"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={item?.description}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].description`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].description`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].description`
                                    )
                                  )
                                }
                                helperText={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].description`
                                  ) &&
                                  getIn(
                                    formik.errors,
                                    `features[${index}].description`
                                  )
                                }
                              />
                            </FormControl>
                          </Grid>
                          {/* <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                              <TextField
                                key={"features.valueType"}
                                fullWidth
                                id={"features.valueType"}
                                name={"features.valueType"}
                                label={"Value Type*"}
                                variant="standard"
                                type={"text"}
                                disabled={item?.added}
                                value={item?.valueType}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].valueType`,
                                    e?.target?.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].valueType`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].valueType`
                                    )
                                  )
                                }
                                helperText={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].valueType`
                                  ) &&
                                  getIn(
                                    formik.errors,
                                    `features[${index}].valueType`
                                  )
                                }
                              />
                            </FormControl>
                          </Grid> */}
                          <Grid item xs={4}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].prerequisiteFeature`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].prerequisiteFeature`
                                    )
                                  )
                                }
                                id={`features[${index}].prerequisiteFeature-label`}
                              >
                                Prerequisite Feature
                              </InputLabel>
                              <Select
                                multiple
                                id={`features[${index}].prerequisiteFeature`}
                                name={`features[${index}].prerequisiteFeature`}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].prerequisiteFeature`,
                                    e.target.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].prerequisiteFeature`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].prerequisiteFeature`
                                    )
                                  )
                                }
                                disabled={item?.added}
                                value={
                                  formik.values.features[index]
                                    ?.prerequisiteFeature || ""
                                }
                                labelId={`features[${index}].prerequisiteFeature-label`}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {PrerequisiteFeatureOptions?.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {getIn(
                                formik.touched,
                                `features[${index}].prerequisiteFeature`
                              ) &&
                                getIn(
                                  formik.errors,
                                  `features[${index}].prerequisiteFeature`
                                ) && (
                                  <FormHelperText
                                    style={{
                                      color: theme?.palette?.error?.main,
                                    }}
                                  >
                                    {getIn(
                                      formik.errors,
                                      `features[${index}].prerequisiteFeature`
                                    )}
                                  </FormHelperText>
                                )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].featureTypeTag`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].featureTypeTag`
                                    )
                                  )
                                }
                                id={`features[${index}].featureTypeTag-label`}
                              >
                                Feature Type*
                              </InputLabel>
                              <Select
                                id={`features[${index}].featureTypeTag`}
                                name={`features[${index}].featureTypeTag`}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].featureTypeTag`,
                                    e.target.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].featureTypeTag`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].featureTypeTag`
                                    )
                                  )
                                }
                                disabled={item?.added}
                                value={
                                  formik.values.features[index]
                                    ?.featureTypeTag || ""
                                }
                                labelId={`features[${index}].featureTypeTag-label`}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {featureTypeTagOptions?.map((item, idx) => (
                                  <MenuItem key={idx} value={item?.value}>
                                    {item?.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {getIn(
                                formik.touched,
                                `features[${index}].featureTypeTag`
                              ) &&
                                getIn(
                                  formik.errors,
                                  `features[${index}].featureTypeTag`
                                ) && (
                                  <FormHelperText
                                    style={{
                                      color: theme?.palette?.error?.main,
                                    }}
                                  >
                                    {getIn(
                                      formik.errors,
                                      `features[${index}].featureTypeTag`
                                    )}
                                  </FormHelperText>
                                )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={4}>
                            <FormControl fullWidth variant="standard">
                              <InputLabel
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].parent`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].parent`
                                    )
                                  )
                                }
                                id={`features[${index}].parent-label`}
                              >
                                Parent
                              </InputLabel>
                              <Select
                                id={`features[${index}].parent`}
                                name={`features[${index}].parent`}
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `features[${index}].parent`,
                                    e.target.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                error={
                                  getIn(
                                    formik.touched,
                                    `features[${index}].parent`
                                  ) &&
                                  Boolean(
                                    getIn(
                                      formik.errors,
                                      `features[${index}].parent`
                                    )
                                  )
                                }
                                disabled={item?.added}
                                value={
                                  formik.values.features[index]?.parent || ""
                                }
                                labelId={`features[${index}].parent-label`}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {PrerequisiteFeatureOptions?.map(
                                  (item, idx) => (
                                    <MenuItem key={idx} value={item?.value}>
                                      {item?.label}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                              {getIn(
                                formik.touched,
                                `features[${index}].parent`
                              ) &&
                                getIn(
                                  formik.errors,
                                  `features[${index}].parent`
                                ) && (
                                  <FormHelperText
                                    style={{
                                      color: theme?.palette?.error?.main,
                                    }}
                                  >
                                    {getIn(
                                      formik.errors,
                                      `features[${index}].parent`
                                    )}
                                  </FormHelperText>
                                )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={2}>
                            <Box
                              sx={{
                                width: "100%",
                                marginBottom: "8px",
                                marginTop: "15px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#B3B3B3",
                                  fontSize: "15px",
                                  marginRight: "20px",
                                }}
                              >
                                Active
                              </span>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={item?.active}
                                    disabled={item?.added}
                                    onChange={() =>
                                      formik.setFieldValue(
                                        `features[${index}].active`,
                                        !formik?.values?.features[index]?.active
                                      )
                                    }
                                  />
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={2}>
                            <Box
                              sx={{
                                width: "100%",
                                marginBottom: "8px",
                                marginTop: "15px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#B3B3B3",
                                  fontSize: "15px",
                                  marginRight: "20px",
                                }}
                              >
                                Required
                              </span>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={item?.required}
                                    disabled={item?.added}
                                    onChange={() =>
                                      formik.setFieldValue(
                                        `features[${index}].required`,
                                        !formik?.values?.features[index]
                                          ?.required
                                      )
                                    }
                                  />
                                }
                              />
                            </Box>
                          </Grid>
                          {!item?.added && (
                            <Grid
                              item
                              xs={12}
                              display={"flex"}
                              flexDirection={"row"}
                              style={{ marginTop: 20 }}
                              justifyContent={"end"}
                            >
                              <Button
                                className="mui-btn primary filled"
                                onClick={formik?.handleSubmit}
                                disabled={loading}
                              >
                                Save Changes
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Grid>
                <Grid item xs={1}>
                  {index === 0 ? (
                    <Grid item xs={12}>
                      {array?.length > 0 && (
                        <Button
                          className="mui-btn primary filled"
                          onClick={() =>
                            removePricePlanList(index, item?.recordGuid)
                          }
                          disabled={loading}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      )}
                    </Grid>
                  ) : (
                    <Button
                      className="mui-btn primary filled"
                      onClick={() =>
                        removePricePlanList(index, item?.recordGuid)
                      }
                      disabled={loading}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation("translation")(AddServiceFeatures);
