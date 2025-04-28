import {
  Box,
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
import {ADD_PROVIDER, GET_ALL_INDUSTRIES, GET_ALL_PROVIDER_CATEGORIES, GET_ALL_TITLES,} from "../../../APIs/Providers";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError, removeNullKeys} from "../../Utils/Functions";
import AddProviderConfig from "./AddProviderConfig";
import addValidationSchema from "./addValidation";
import GetActions from "../../Utils/GetActions";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {useNavigate} from "react-router-dom";

const AddProvider = ({t}) => {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const navigate = useNavigate();
    const [titles, setTitles] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [accountTypeOptions, setAccountTypeOptions] = useState([]);
    const [contactTypeOptions, setContactTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);
    const [selectedNewProvider, setSelectedNewProvider] = useState([]);
    const [selectedNewProviderData, setSelectedNewProviderData] = useState([]);
    const [proceedModal, setProceedModal] = useState(false);
    const [goToConfigPage, setGoToConfigPage] = useState(false);

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
            navigate("/providers/providers-management");
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

    const getCategories = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_PROVIDER_CATEGORIES();
            setCategoryOptions(
                response?.data?.data?.providerCategories?.map((item) => ({
                    label: item?.providerCategoryDetails[0].name,
                    value: item?.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getAccountTypes = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["BILLING_TYPE"],
            };
            let response = await GET_ALL_TITLES({data});
            setAccountTypeOptions(
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

    const getContactTypes = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["CONTACT_TYPE"],
            };
            let response = await GET_ALL_TITLES({data});
            setContactTypeOptions(
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
        validationSchema: addValidationSchema[activeStep],
        onSubmit: async (values) => {
            if (activeStep === steps?.length - 1) {
                setLoading(true);
                try {
                    let data = {
                        TitleTag: values["title"] || null,
                        TypeTag: "GENERAL",
                        BillingTag: values["accountType"] || null,
                        ProviderCategoryGuid: values["category"].value || null,
                        Name: values["businessName"] || null,
                        Contacts: [
                            {
                                TelephoneNumber: values["telephoneNumber"] || null,
                                MobileNumber: values["mobileNumber"] || null,
                                Email: values["email"] || null,
                                CountryGuid: values["country"].value || null,
                                ContactType: values["contactType"] || null,
                                FirstName: values["firstName"] || null,
                                LastName: values["lastName"] || null,
                                CompanyWebsite: values["companyWebsite"] || null,
                                CompanyEmail: values["companyEmail"] || null,
                            },
                        ],
                        Addresses: [
                            {
                                Region: values["region"] || null,
                                Address1: values["address"] || null,
                                Street: values["street"] || null,
                                cityGuid: values["city"].value || null,
                                State: values["state"] || null,
                                Zip: values["zip"] || null,
                                Building: values["building"] || null,
                                Floor: values["floor"] || null,
                                RoomNumber: values["room"] || null,
                            },
                        ],
                        Info: {
                            EngagementEmail: values?.engagementEmail || null,
                            SupportEmail: values?.supportEmail || null,
                            BillingEmail: values?.billingEmail || null,
                            TechnicalEmail: values?.technicalEmail || null,
                            AlertsEmail: values?.alertsEmail || null,
                            IndustryGuid: values?.industry || null,
                            BusinessWebUrl: values?.businessWebURL || null,
                        },
                    };
                    let response = await ADD_PROVIDER({formData: removeNullKeys(data)});
                    if (response?.data?.success) {
                        showSnackbar("Provider Added Successfully!");
                        setSelectedNewProvider(response?.data?.data?.provider?.recordGuid);
                        setSelectedNewProviderData(response?.data?.data?.provider);
                        setProceedModal(true);
                        navigate("/providers/providers-management");
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

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue(e?.target?.name, value);
        }
    };

    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                getTitles(),
                getCategories(),
                getAccountTypes(),
                getContactTypes(),
                getIndustries(),
            ]);
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
        <Box className="page_container">
            <Box className="section_container scroll" mt={2}>
                <Grid
                    className={`sub_section_container `}
                    alignItems={"flex-start"}
                    paddingRight={2.5}
                >
                    {!goToConfigPage ? (
                        <Card
                            className="kpi-card p-5 "
                            sx={{
                                minHeight: "70vh",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box container display="flex" sx={{flex: 1}}>
                                <Grid item xs={2} mr={2}>
                                    <Stepper activeStep={activeStep} orientation="vertical">
                                        {steps?.map((step, index) => {
                                            return (
                                                <Step key={step.label}>
                                                    <StepLabel
                                                        optional={
                                                            index === steps.length - 1 ? (
                                                                <Typography variant="caption">
                                                                    Last step
                                                                </Typography>
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
                                    xs={10}
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
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                        }}
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
                                                            {/* <FormControl fullWidth variant="standard">
                          <InputLabel
                            error={
                              formik.touched["category"] &&
                              Boolean(formik.errors["category"])
                            }
                            id="category"
                          >
                            Category*
                          </InputLabel>
                          <Select
                            id="category" // Add an id for accessibility
                            name="category" // Name should match the field name in initialValues
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched["category"] &&
                              Boolean(formik.errors["category"])
                            }
                            value={formik.values.category}
                            labelId="category"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {categoryOptions?.map((item) => (
                              <MenuItem value={item?.value}>
                                {item?.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                                                            <CustomAsyncPaginate
                                                                apiFunction={GET_ALL_PROVIDER_CATEGORIES} // Pass the function directly
                                                                value={formik?.values?.category}
                                                                onChange={(value) => {
                                                                    formik?.setFieldValue("category", value);
                                                                }}
                                                                placeholder="Category"
                                                                pageSize={10}
                                                                dataPath="data.data.providerCategories" // Adjust path based on API response structure
                                                                totalRowsPath="data.data.totalRows"
                                                                isNested={true}
                                                                labelPath="providerCategoryDetails"
                                                                method="GET"
                                                                id={`async-menu-style-accounts`}
                                                                // isDisabled={!formik.values.reseller}
                                                            />
                                                            {formik.touched.category &&
                                                                formik.errors.category && (
                                                                    <FormHelperText
                                                                        style={{
                                                                            color: theme?.palette?.error?.main,
                                                                        }}
                                                                    >
                                                                        {formik.errors.category}
                                                                    </FormHelperText>
                                                                )}
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl fullWidth variant="standard">
                                                                <InputLabel
                                                                    error={
                                                                        formik.touched["accountType"] &&
                                                                        Boolean(formik.errors["accountType"])
                                                                    }
                                                                    id="accountType"
                                                                >
                                                                    Account Type*
                                                                </InputLabel>
                                                                <Select
                                                                    id="accountType" // Add an id for accessibility
                                                                    name="accountType" // Name should match the field name in initialValues
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["accountType"] &&
                                                                        Boolean(formik.errors["accountType"])
                                                                    }
                                                                    value={formik.values.accountType}
                                                                    labelId="accountType"
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {accountTypeOptions?.map((item, index) => (
                                                                        <MenuItem key={index} value={item?.value}>
                                                                            {item?.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            {formik.touched.accountType &&
                                                                formik.errors.accountType && (
                                                                    <FormHelperText
                                                                        style={{
                                                                            color: theme?.palette?.error?.main,
                                                                        }}
                                                                    >
                                                                        {formik.errors.accountType}
                                                                    </FormHelperText>
                                                                )}
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl fullWidth variant="standard">
                                                                <InputLabel
                                                                    error={
                                                                        formik.touched["contactType"] &&
                                                                        Boolean(formik.errors["contactType"])
                                                                    }
                                                                    id="contactType"
                                                                >
                                                                    Contact Type*
                                                                </InputLabel>
                                                                <Select
                                                                    id="contactType" // Add an id for accessibility
                                                                    name="contactType" // Name should match the field name in initialValues
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["contactType"] &&
                                                                        Boolean(formik.errors["contactType"])
                                                                    }
                                                                    value={formik.values.contactType}
                                                                    labelId="contactType"
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {contactTypeOptions?.map((item, index) => (
                                                                        <MenuItem key={index} value={item?.value}>
                                                                            {item?.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            {formik.touched.contactType &&
                                                                formik.errors.contactType && (
                                                                    <FormHelperText
                                                                        style={{
                                                                            color: theme?.palette?.error?.main,
                                                                        }}
                                                                    >
                                                                        {formik.errors.contactType}
                                                                    </FormHelperText>
                                                                )}
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl variant="standard" fullWidth>
                                                                <TextField
                                                                    key={"telephoneNumber"}
                                                                    fullWidth
                                                                    id={"telephoneNumber"}
                                                                    name={"telephoneNumber"}
                                                                    label={"Telephone Number"}
                                                                    variant="standard"
                                                                    type={"text"}
                                                                    value={formik.values["telephoneNumber"]}
                                                                    onChange={handleNumberChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["telephoneNumber"] &&
                                                                        Boolean(formik.errors["telephoneNumber"])
                                                                    }
                                                                    helperText={
                                                                        formik.touched["telephoneNumber"] &&
                                                                        formik.errors["telephoneNumber"]
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl variant="standard" fullWidth>
                                                                <TextField
                                                                    key={"mobileNumber"}
                                                                    fullWidth
                                                                    id={"mobileNumber"}
                                                                    name={"mobileNumber"}
                                                                    label={"Mobile Number*"}
                                                                    variant="standard"
                                                                    type={"text"}
                                                                    value={formik.values["mobileNumber"]}
                                                                    onChange={handleNumberChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["mobileNumber"] &&
                                                                        Boolean(formik.errors["mobileNumber"])
                                                                    }
                                                                    helperText={
                                                                        formik.touched["mobileNumber"] &&
                                                                        formik.errors["mobileNumber"]
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
                                                                        formik.touched["email"] &&
                                                                        formik.errors["email"]
                                                                    }
                                                                />
                                                            </FormControl>
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
                                                                    key={"companyWebsite"}
                                                                    fullWidth
                                                                    id={"companyWebsite"}
                                                                    name={"companyWebsite"}
                                                                    label={"Company Website"}
                                                                    variant="standard"
                                                                    type={"text"}
                                                                    value={formik.values["companyWebsite"]}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["companyWebsite"] &&
                                                                        Boolean(formik.errors["companyWebsite"])
                                                                    }
                                                                    helperText={
                                                                        formik.touched["companyWebsite"] &&
                                                                        formik.errors["companyWebsite"]
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                                            <FormControl variant="standard" fullWidth>
                                                                <TextField
                                                                    key={"companyEmail"}
                                                                    fullWidth
                                                                    id={"companyEmail"}
                                                                    name={"companyEmail"}
                                                                    label={"Company Email"}
                                                                    variant="standard"
                                                                    type={"text"}
                                                                    value={formik.values["companyEmail"]}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    error={
                                                                        formik.touched["companyEmail"] &&
                                                                        Boolean(formik.errors["companyEmail"])
                                                                    }
                                                                    helperText={
                                                                        formik.touched["companyEmail"] &&
                                                                        formik.errors["companyEmail"]
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
                                                                        formik.touched["region"] &&
                                                                        formik.errors["region"]
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
                                                                    setRandomValue(Math.random());
                                                                }}
                                                                placeholder="Country *"
                                                                pageSize={10}
                                                                dataPath="data.data.countries" // Adjust path based on API response structure
                                                                totalRowsPath="data.data.totalRows"
                                                                method="GET"
                                                                id={`async-menu-style-accounts`}
                                                            />
                                                            {formik.touched.country &&
                                                                formik.errors.country && (
                                                                    <FormHelperText
                                                                        style={{color: theme?.palette?.error?.main}}>
                                                                        {formik.errors.country}
                                                                    </FormHelperText>
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
                                                                placeholder="City"
                                                                pageSize={10}
                                                                dataPath="data.data.locations" // Adjust path based on API response structure
                                                                totalRowsPath="data.data.totalRows"
                                                                method="GET"
                                                                isDisabled={!formik?.values?.country}
                                                                params={{
                                                                    country: formik?.values?.country.value,
                                                                }}
                                                                id={`async-menu-style-accounts`}
                                                            />
                                                            {formik.touched.city && formik.errors.city && (
                                                                <FormHelperText>
                                                                    {formik.errors.city}
                                                                </FormHelperText>
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
                                                                        formik.touched["street"] &&
                                                                        formik.errors["street"]
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
                                                                        formik.touched["state"] &&
                                                                        formik.errors["state"]
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
                                                                        formik.touched["zip"] &&
                                                                        formik.errors["zip"]
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
                                                                        formik.touched["floor"] &&
                                                                        formik.errors["floor"]
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
                                                                        formik.touched["room"] &&
                                                                        formik.errors["room"]
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
                                                                    {industryOptions?.map((item, idx) => (
                                                                        <MenuItem key={idx} value={item?.value}>
                                                                            {item?.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                            {formik.touched.industry &&
                                                                formik.errors.industry && (
                                                                    <FormHelperText
                                                                        style={{
                                                                            color: theme?.palette?.error?.main,
                                                                        }}
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
                                                                    label={"Business Web Url*"}
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
                                            <Button
                                                onClick={handleBack}
                                                className="mui-btn primary outlined"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                className="mui-btn primary filled"
                                                onClick={formik?.handleSubmit}
                                                disabled={loading}
                                            >
                                                {activeStep === steps.length - 1
                                                    ? "Finish"
                                                    : "Continue"}
                                            </Button>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Box>
                        </Card>
                    ) : (
                        <AddProviderConfig
                            type={"add"}
                            selectedProvider={selectedNewProvider}
                        />
                    )}

                    {/* {proceedModal && (
        <MuiModal
          title="Pending Provider"
          open={proceedModal}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setProceedModal(false)}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography
                style={{
                  textAlign: "center",
                  marginBottom: "4px",
                }}
              >
                Provider is successfully created and will be pending
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography style={{ textAlign: "center" }}>
                Please add services configuration to activate
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ marginTop: "20px" }}
              display={"flex"}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <Button
                onClick={() => {
                  navigate("/providers/providers-management");
                  setProceedModal(false);
                }}
                className="mui-btn secondary filled"
                id="send-service-provider-id"
                disabled={loading}
              >
                Later
              </Button>
              <Button
                onClick={() => {
                  setGoToConfigPage(true);
                  setProceedModal(false);
                }}
                className="mui-btn primary filled"
                id="send-service-provider-id"
                disabled={loading}
              >
                Proceed
              </Button>
            </Grid>
          </Grid>
        </MuiModal>
      )} */}
                </Grid>
            </Box>
        </Box>
    );
};

export default withTranslation("translation")(GetActions(AddProvider));
