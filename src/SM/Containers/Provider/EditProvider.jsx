import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {GET_ALL_CITIES_API, GET_ALL_COUNTRIES_API,} from "../../../APIs/Criteria";
import {EDIT_PROVIDER, GET_ALL_INDUSTRIES, GET_ALL_TITLES, GET_PROVIDER_ID,} from "../../../APIs/Providers";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError, removeNullKeys} from "../../Utils/Functions";
import editValidationSchema from "./editValidation";

const EditProvider = ({
                          t,
                          selectedProvider,
                          setShowEditProvider,
                          getAllProviders,
                      }) => {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);

    const [industryOptions, setIndustryOptions] = useState([]);
    const [firstLoading, setFirstLoading] = useState(true);

    const [randomValue, setRandomValue] = useState("");
    const [steps, setSteps] = useState([
        {
            label: "Provider Details",
        },
        {
            label: "Address Info",
        },
        {
            label: "Engagement",
        },
    ]);

    const [activeStep, setActiveStep] = useState(0);

    const handleBack = () => {
        if (activeStep == 0) {
            setShowEditProvider(false);
        } else {
            setActiveStep(activeStep - 1);
        }
    };

    const getTitles = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["CLIENT_TITLE"],
            };
            let response = await GET_ALL_TITLES({data});
            setTitles(
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

    const getIndustries = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_INDUSTRIES();
            setIndustryOptions(
                response?.data?.data?.industries?.map((item) => ({
                    label: item?.details[0]?.name,
                    value: item?.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const [providerDetails, setProviderDetails] = useState("");

    const getProviderById = async () => {
        setLoading(true);
        try {
            let response = await GET_PROVIDER_ID({
                providerGuid: selectedProvider?.recordGuid,
            });

            setProviderDetails(response?.data?.data?.provider);
            let provider = response?.data?.data?.provider;
            formik.setFieldValue("businessName", provider?.name || "");
            formik.setFieldValue("title", provider?.titleTag || "");
            formik.setFieldValue("TypeTag", provider?.TypeTag || "");
            formik.setFieldValue("accountType", provider?.BillingTag || "");
            formik.setFieldValue(
                "telephoneNumber",
                provider?.contact[0]?.telephoneNumber || ""
            );
            formik.setFieldValue(
                "mobileNumber",
                provider?.contact[0]?.mobileNumber || ""
            );
            formik.setFieldValue("firstName", provider?.contact[0]?.firstName || "");
            formik.setFieldValue("lastName", provider?.contact[0]?.lastName || "");
            formik.setFieldValue("email", provider?.contact[0]?.email || "");
            formik.setFieldValue(
                "companyEmail",
                provider?.contact[0]?.companyEmail || ""
            );
            formik.setFieldValue(
                "companyWebsite",
                provider?.contact[0]?.companyWebsite || ""
            );
            formik.setFieldValue("country", {
                value: provider?.contact[0]?.countryRecordGuid,
                label: provider?.contact[0]?.countryName,
            });
            formik.setFieldValue(
                "contactType",
                provider?.contact[0]?.contactTypeTag || ""
            );
            formik.setFieldValue(
                "engagementEmail",
                provider?.providerInfo?.engagementEmail || ""
            );
            formik.setFieldValue(
                "supportEmail",
                provider?.providerInfo?.supportEmail || ""
            );
            formik.setFieldValue(
                "billingEmail",
                provider?.providerInfo?.billingEmail || ""
            );
            formik.setFieldValue(
                "technicalEmail",
                provider?.providerInfo?.technicalEmail || ""
            );
            formik.setFieldValue(
                "alertsEmail",
                provider?.providerInfo?.alertsEmail || ""
            );
            formik.setFieldValue(
                "industry",
                provider?.providerInfo?.industryRecordGuid || ""
            );
            formik.setFieldValue(
                "businessWebURL",
                provider?.providerInfo?.businessWebUrl || ""
            );
            formik.setFieldValue("address", provider?.addresses[0]?.address1 || "");
            formik.setFieldValue("street", provider?.addresses[0]?.street || "");
            formik.setFieldValue("city", {
                value: provider?.addresses[0]?.cityRecordGuid,
                label: provider?.addresses[0]?.cityName,
            });
            formik.setFieldValue("region", provider?.addresses[0]?.region || "");
            formik.setFieldValue("state", provider?.addresses[0]?.state || "");
            formik.setFieldValue("zip", provider?.addresses[0]?.zip || "");
            formik.setFieldValue("building", provider?.addresses[0]?.building || "");
            formik.setFieldValue("floor", provider?.addresses[0]?.floor || "");
            formik.setFieldValue("room", provider?.addresses[0]?.roomNumber || "");
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        getProviderById();
    }, []);

    const formik = useFormik({
        initialValues: {
            businessName: "",
            title: "",
            category: "",
            accountType: "",
            contactType: "",
            telephoneNumber: "",
            mobileNumber: "",
            email: "",
            firstName: "",
            lastName: "",
            companyWebsite: "",
            companyEmail: "",
            region: "",
            country: "",
            city: "",
            address: "",
            street: "",
            state: "",
            zip: "",
            building: "",
            floor: "",
            room: "",
            engagementEmail: "",
            supportEmail: "",
            billingEmail: "",
            technicalEmail: "",
            alertsEmail: "",
            industry: "",
            businessWebURL: "",
        },
        validationSchema: editValidationSchema[activeStep],
        onSubmit: async (values) => {
            if (activeStep === steps?.length - 1) {
                setLoading(true);
                try {
                    let data = {
                        RecordGuid: selectedProvider?.recordGuid,
                        Name: values["businessName"],
                        titleTag: values["title"],
                        typeTag: "GENERAL",
                        firstName: values["firstName"],
                        lastName: values["lastName"],
                        companyWebsite: values["companyWebsite"],
                        CountryGuid: values["country"].value,
                        Contacts: [
                            {
                                Email: values["email"] || null,
                            },
                        ],
                        address: {
                            address1: values["address"] || null,
                            street: values["street"] || null,
                            cityGuid: values["city"].value || null,
                            region: values["region"] || null,
                            state: values["state"] || null,
                            zip: values["zip"] || null,
                            building: values["building"] || null,
                            floor: values["floor"] || null,
                            roomNumber: values["room"] || null,
                        },
                        info: {
                            engagementEmail: values?.engagementEmail || null,
                            supportEmail: values?.supportEmail || null,
                            billingEmail: values?.billingEmail || null,
                            technicalEmail: values?.technicalEmail || null,
                            alertsEmail: values?.alertsEmail || null,
                            industryGuid: values?.industry || null,
                            businessWebUrl: values?.businessWebURL || null,
                        },
                    };
                    let response = await EDIT_PROVIDER({
                        formData: removeNullKeys(data),
                    });
                    if (response?.data?.success) {
                        showSnackbar("Provider Updated Successfully!");
                        // setSelectedNewProvider(response?.data?.data?.provider?.recordGuid);
                        // setSelectedNewProviderData(response?.data?.data?.provider);
                        getAllProviders();
                        setShowEditProvider(false);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                setActiveStep(activeStep + 1);
            }
        },
    });

    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([getTitles(), getIndustries()]);
            setFirstLoading(false);
        };
        fetchData();
    }, []);

    if (firstLoading) {
        return (
            <Box className="Loader">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Card className="kpi-card p-5">
            <Grid container>
                <Grid item xs={12}>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                        <Typography className="breadcrumbactiveBtn">
                            {selectedProvider?.name}
                        </Typography>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <Grid container display="flex" sx={{flex: 1}}>
                <Grid item xs={2} mr={2}>
                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        className="pt-4"
                    >
                        {steps?.map((step, index) => {
                            return (
                                <Step key={step.label}>
                                    <StepLabel
                                        optional={
                                            index === steps.length - 1 ? (
                                                <Typography variant="caption">Last step</Typography>
                                            ) : null
                                        }
                                    >
                                        {step?.label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Grid>

                <Grid
                    item
                    xs={9}
                    style={{
                        backgroundColor: "white",
                        height: "60vh",
                        borderRadius: "5px",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <form
                        onSubmit={formik?.handleSubmit}
                        style={{display: "flex", flexDirection: "column", height: "100%"}}
                    >
                        <Box style={{flexGrow: 1, overflowY: "auto"}}>
                            {activeStep === 0 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"businessName"}
                                                    fullWidth
                                                    id={"businessName"}
                                                    name={"businessName"}
                                                    label={"Business Name*"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["businessName"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["businessName"] &&
                                                        Boolean(formik.errors["businessName"])
                                                    }
                                                    helperText={
                                                        formik.touched["businessName"] &&
                                                        formik.errors["businessName"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl fullWidth variant="standard">
                                                <InputLabel
                                                    error={
                                                        formik.touched["title"] &&
                                                        Boolean(formik.errors["title"])
                                                    }
                                                    id="title"
                                                >
                                                    Title
                                                </InputLabel>
                                                <Select
                                                    id="title" // Add an id for accessibility
                                                    name="title" // Name should match the field name in initialValues
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["title"] &&
                                                        Boolean(formik.errors["title"])
                                                    }
                                                    value={formik.values.title}
                                                    labelId="title"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {titles?.map((item, index) => (
                                                        <MenuItem key={index} value={item?.value}>
                                                            {item?.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {formik.touched.title && formik.errors.title && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.title}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"firstName"}
                                                    fullWidth
                                                    id={"firstName"}
                                                    name={"firstName"}
                                                    label={"First Name*"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["firstName"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["firstName"] &&
                                                        Boolean(formik.errors["firstName"])
                                                    }
                                                    helperText={
                                                        formik.touched["firstName"] &&
                                                        formik.errors["firstName"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"lastName"}
                                                    fullWidth
                                                    id={"lastName"}
                                                    name={"lastName"}
                                                    label={"Last Name"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["lastName"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["lastName"] &&
                                                        Boolean(formik.errors["lastName"])
                                                    }
                                                    helperText={
                                                        formik.touched["lastName"] &&
                                                        formik.errors["lastName"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"email"}
                                                    fullWidth
                                                    id={"email"}
                                                    name={"email"}
                                                    label={"Email*"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["email"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["email"] &&
                                                        Boolean(formik.errors["email"])
                                                    }
                                                    helperText={
                                                        formik.touched["email"] && formik.errors["email"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {activeStep === 1 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"region"}
                                                    fullWidth
                                                    id={"region"}
                                                    name={"region"}
                                                    label={"Region"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["region"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["region"] &&
                                                        Boolean(formik.errors["region"])
                                                    }
                                                    helperText={
                                                        formik.touched["region"] && formik.errors["region"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <CustomAsyncPaginate
                                                apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                                                value={formik?.values?.country}
                                                onChange={(value) => {
                                                    formik.setFieldValue("country", value);
                                                    formik.setFieldValue("city", "");
                                                    setRandomValue(Math.random());
                                                }}
                                                placeholder="Country *"
                                                pageSize={10}
                                                dataPath="data.data.countries" // Adjust path based on API response structure
                                                totalRowsPath="data.data.totalRows"
                                                method="GET"
                                                id={`async-menu-style-accounts`}
                                            />
                                            {formik.touched.country && formik.errors.country && (
                                                <FormHelperText>{formik.errors.country}</FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <CustomAsyncPaginate
                                                apiFunction={GET_ALL_CITIES_API} // Pass the function directly
                                                value={formik?.values?.city}
                                                key={randomValue}
                                                onChange={(value) => {
                                                    formik.setFieldValue("city", value);
                                                }}
                                                placeholder="City *"
                                                pageSize={10}
                                                dataPath="data.data.locations" // Adjust path based on API response structure
                                                totalRowsPath="data.data.totalRows"
                                                method="GET"
                                                isDisabled={!formik?.values?.country}
                                                params={{country: formik?.values?.country.value}}
                                                id={`async-menu-style-accounts`}
                                            />
                                            {formik.touched.city && formik.errors.city && (
                                                <FormHelperText>{formik.errors.city}</FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"address"}
                                                    fullWidth
                                                    id={"address"}
                                                    name={"address"}
                                                    label={"Address*"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["address"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["address"] &&
                                                        Boolean(formik.errors["address"])
                                                    }
                                                    helperText={
                                                        formik.touched["address"] &&
                                                        formik.errors["address"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"street"}
                                                    fullWidth
                                                    id={"street"}
                                                    name={"street"}
                                                    label={"Street"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["street"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["street"] &&
                                                        Boolean(formik.errors["street"])
                                                    }
                                                    helperText={
                                                        formik.touched["street"] && formik.errors["street"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"state"}
                                                    fullWidth
                                                    id={"state"}
                                                    name={"state"}
                                                    label={"State"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["state"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["state"] &&
                                                        Boolean(formik.errors["state"])
                                                    }
                                                    helperText={
                                                        formik.touched["state"] && formik.errors["state"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"zip"}
                                                    fullWidth
                                                    id={"zip"}
                                                    name={"zip"}
                                                    label={"ZIP"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["zip"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["zip"] &&
                                                        Boolean(formik.errors["zip"])
                                                    }
                                                    helperText={
                                                        formik.touched["zip"] && formik.errors["zip"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"building"}
                                                    fullWidth
                                                    id={"building"}
                                                    name={"building"}
                                                    label={"Building"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["building"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["building"] &&
                                                        Boolean(formik.errors["building"])
                                                    }
                                                    helperText={
                                                        formik.touched["building"] &&
                                                        formik.errors["building"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"floor"}
                                                    fullWidth
                                                    id={"floor"}
                                                    name={"floor"}
                                                    label={"Floor"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["floor"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["floor"] &&
                                                        Boolean(formik.errors["floor"])
                                                    }
                                                    helperText={
                                                        formik.touched["floor"] && formik.errors["floor"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"room"}
                                                    fullWidth
                                                    id={"room"}
                                                    name={"room"}
                                                    label={"room"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["room"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["room"] &&
                                                        Boolean(formik.errors["room"])
                                                    }
                                                    helperText={
                                                        formik.touched["room"] && formik.errors["room"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {activeStep === 2 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"engagementEmail"}
                                                    fullWidth
                                                    id={"engagementEmail"}
                                                    name={"engagementEmail"}
                                                    label={"Engagement Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["engagementEmail"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["engagementEmail"] &&
                                                        Boolean(formik.errors["engagementEmail"])
                                                    }
                                                    helperText={
                                                        formik.touched["engagementEmail"] &&
                                                        formik.errors["engagementEmail"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"supportEmail"}
                                                    fullWidth
                                                    id={"supportEmail"}
                                                    name={"supportEmail"}
                                                    label={"Support Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["supportEmail"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["supportEmail"] &&
                                                        Boolean(formik.errors["supportEmail"])
                                                    }
                                                    helperText={
                                                        formik.touched["supportEmail"] &&
                                                        formik.errors["supportEmail"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"billingEmail"}
                                                    fullWidth
                                                    id={"billingEmail"}
                                                    name={"billingEmail"}
                                                    label={"Billing Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["billingEmail"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["billingEmail"] &&
                                                        Boolean(formik.errors["billingEmail"])
                                                    }
                                                    helperText={
                                                        formik.touched["billingEmail"] &&
                                                        formik.errors["billingEmail"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"technicalEmail"}
                                                    fullWidth
                                                    id={"technicalEmail"}
                                                    name={"technicalEmail"}
                                                    label={"Technical Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["technicalEmail"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["technicalEmail"] &&
                                                        Boolean(formik.errors["technicalEmail"])
                                                    }
                                                    helperText={
                                                        formik.touched["technicalEmail"] &&
                                                        formik.errors["technicalEmail"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"alertsEmail"}
                                                    fullWidth
                                                    id={"alertsEmail"}
                                                    name={"alertsEmail"}
                                                    label={"Alerts Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["alertsEmail"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["alertsEmail"] &&
                                                        Boolean(formik.errors["alertsEmail"])
                                                    }
                                                    helperText={
                                                        formik.touched["alertsEmail"] &&
                                                        formik.errors["alertsEmail"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl fullWidth variant="standard">
                                                <InputLabel
                                                    error={
                                                        formik.touched["industry"] &&
                                                        Boolean(formik.errors["industry"])
                                                    }
                                                    id="industry"
                                                >
                                                    Industry
                                                </InputLabel>
                                                <Select
                                                    id="industry" // Add an id for accessibility
                                                    name="industry" // Name should match the field name in initialValues
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["industry"] &&
                                                        Boolean(formik.errors["industry"])
                                                    }
                                                    value={formik.values.industry}
                                                    labelId="industry"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {industryOptions?.map((item, index) => (
                                                        <MenuItem key={index} value={item?.value}>
                                                            {item?.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {formik.touched.industry && formik.errors.industry && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.industry}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"businessWebURL"}
                                                    fullWidth
                                                    id={"businessWebURL"}
                                                    name={"businessWebURL"}
                                                    label={"Business Web Url"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["businessWebURL"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["businessWebURL"] &&
                                                        Boolean(formik.errors["businessWebURL"])
                                                    }
                                                    helperText={
                                                        formik.touched["businessWebURL"] &&
                                                        formik.errors["businessWebURL"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>

                        <Grid className="Cancel_Save">
                            <Button onClick={handleBack} className="mui-btn primary outlined">
                                Back
                            </Button>
                            <Button
                                className="mui-btn primary filled"
                                onClick={formik?.handleSubmit}
                                disabled={loading}
                            >
                                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Card>
    );
};

export default withTranslation("translation")(EditProvider);
