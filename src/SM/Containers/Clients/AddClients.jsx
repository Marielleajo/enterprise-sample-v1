import {
    Box,
    Button,
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
import {useSelector} from "react-redux";
import {ADD_NEW_CLIENT, GET_ALL_RESELLERS} from "../../../APIs/Clients";
import {GET_ALL_CITIES_API, GET_ALL_COUNTRIES_API,} from "../../../APIs/Criteria";
import AccordionComponent from "../../../Components/Accordion/AccordionComponent";
import Notification from "../../../Components/Notification/Notification";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {GET_ALL_POLICIEs_API} from "../../../Roles/Apis";
import {ROLES} from "../../Utils/Constants";
import {HandleApiError, handleMessageError, removeNullKeys, updateState,} from "../../Utils/Functions";
import OpeningModal from "./OpeningModal";
import validationSchema from "./validation";
import GetActions from "../../Utils/GetActions";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {useLocation, useNavigate} from "react-router-dom";

const AddClient = ({t}) => {
    const {showSnackbar} = useSnackbar();
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resellerOptions, setResellerOptions] = useState([]);

    const [randomValue, setRandomValue] = useState("");
    const [selectedReseller, setSelectedReseller] = useState([]);
    const navigate = useNavigate();
    const {token, role} = useSelector((state) => state.authentication);
    const [GlobalData, SetGlobalData] = useState({
        steps: [
            {
                label: "Account Information",
            },
            {
                label: "Engagement",
            },
        ],
        activeStep: 0,
    });
    const {steps, activeStep} = GlobalData;

    const [username, setUsername] = useState("");

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            clientName: "",
            email: "",
            username: "",
            password: "",
            role: "",
            businesswebsite: "",
            phone: "",
            category: "",
            account_manager: "",
            country: "",
            street: "",
            city: "",
            region: "",
            state: "",
            zip: null,
            building: null,
            floor: null,
            room: null,
            address1: null,
            address2: null,
            Info: {
                IndustryTag: null,
                // "IndustryTag": "54c8ddb8-6bc1-4c95-a24a-f2cc2ec2b6f1"
            },
            accountType: null,

            alertemail: false,
            "Allow number lookup customization": false,
            "Allow viber customization": false,
            "Allow sms rate customization": false,
            "Allow sign up": false,
            "Alerts via email": "",

            BillingEmail: null,
            TechnicalEmail: null,
            AlertsEmail: null,
            logoUrl: null,
            BusinessWebUrl: "",
        },
        validationSchema: validationSchema[activeStep],
        onSubmit: async (values) => {
            if (activeStep === steps.length - 1) {
                let data = {
                    TitleTag: "",
                    TypeTag: "BUSINESS",
                    Username: username ? username : values["email"],
                    Password: values["password"],
                    Name: values["clientName"],
                    ParentId: selectedReseller?.value,
                    logoUrl: values["logoUrl"],
                    PolicyId: values?.role || null,
                    Contacts: [
                        {
                            TelephoneNumber: values["phone"],
                            MobileNumber: values["phone"],
                            Email: values["email"],
                            CountryGuid: values["country"].value,
                            ContactType: "HOME",
                            FirstName: values["clientName"],
                            // LastName: values["lastName"],
                            CompanyWebsite: values["businesswebsite"],
                            CompanyName: values["businesswebsite"],
                        },
                    ],
                    Addresses: [
                        {
                            Street: values["street"] || null,
                            CityGuid: values["city"].value || null,
                            Region: values["region"] || null,
                            State: values["state"] || null,
                            Zip: values["zip"] || null,
                            Building: values["building"] || null,
                            Floor: values["floor"] || null,
                            RoomNumber: values["room"] || null,
                            Address1: values["address1"] || null,
                            Address2: values["address2"] || null,
                        },
                    ],
                    Info: {
                        BillingEmail: values?.BillingEmail || null,
                        TechnicalEmail: values?.TechnicalEmail || null,
                        AlertsEmail: values?.AlertsEmail || null,
                        BusinessWebUrl: values?.BusinessWebUrl || null,
                    },
                };

                data = removeNullKeys(data);

                if (Object.keys(data?.Info)?.length == 0) delete data?.Info;
                if (Object.keys(data?.Addresses[0])?.length == 0)
                    delete data?.Addresses;

                try {
                    let recordResponse = await ADD_NEW_CLIENT({
                        token,
                        formData: data,
                    });
                    if (recordResponse?.data?.success) {
                        showSnackbar("Client added successfully", "success");
                        // Notification?.success("Reseller added successfully");
                        SetGlobalData(updateState(GlobalData, "path", "main"));
                        navigate("/client/client-management");
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                }
            } else
                SetGlobalData(updateState(GlobalData, "activeStep", activeStep + 1));
        },
    });

    const GetPolicies = async () => {
        try {
            let policiesResponse = await GET_ALL_POLICIEs_API({token});
            if (ROLES?.includes(role[0])) {
                setRoles(policiesResponse?.data?.data?.policies);
            } else {
                setRoles(
                    policiesResponse?.data?.data?.policies?.filter(
                        (item) => !ROLES?.includes(item?.name)
                    )
                );
            }
        } catch (e) {
            HandleApiError(e);
        }
    };

    const [Countries, SetCountries] = useState([]);
    const [Cities, SetCities] = useState([]);

    const handleBack = () => {
        if (activeStep == 0) {
            navigate({
                pathname: "/client/client-management",
                state: {selectedReseller: selectedReseller},
            });
        } else SetGlobalData(updateState(GlobalData, "activeStep", activeStep - 1));
    };

    const GetAllCountries = async () => {
        try {
            let countriesResponse = await GET_ALL_COUNTRIES_API({});
            SetCountries(countriesResponse?.data?.data?.countries);
        } catch (e) {
            Notification.error(e);
        }
    };

    const getCities = async ({country}) => {
        try {
            let citiesResponse = await GET_ALL_CITIES_API({country});
            SetCities(citiesResponse?.data?.data?.cities);
        } catch (e) {
            HandleApiError(e);
        }
    };

    const getAllResellers = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_RESELLERS();
            setResellerOptions(
                response?.data?.data?.clients?.map((item) => ({
                    label: item.firstName ? item.firstName : "",
                    value: item.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };


    useEffect(() => {
        GetAllCountries();
        GetPolicies();
        getAllResellers();
        setSelectedReseller(location?.state?.selectedReseller || "");
    }, []);

    const theme = useTheme();

    return selectedReseller == "" ? (
        <OpeningModal
            resellerOptions={resellerOptions}
            loading={loading}
            setSelectedReseller={setSelectedReseller}
        />
    ) : (
        <Grid container id="Client" className="page_container">
            <Grid container className="section_container scroll">
                <Grid item xs={2}>
                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        className="pt-4"
                    >
                        {steps.map((step, index) => {
                            return (
                                <Step key={step.label}>
                                    <StepLabel
                                        optional={
                                            index === steps.length - 1 ? (
                                                <Typography variant="caption">Last step</Typography>
                                            ) : null
                                        }
                                    >
                                        {step.label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Grid>

                <Grid item xs={10} className="sub_section_container">
                    <Box className="pt-4">
                        <Typography variant="h5"> {steps[activeStep].label}</Typography>
                    </Box>
                    <form onSubmit={formik?.handleSubmit}>
                        {activeStep === 0 && (
                            <Box>
                                <Grid container columnGap={2} rowGap={0.5}>
                                    <Grid container direction={"row"} columnGap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"clientName"}
                                                    fullWidth
                                                    id={"clientName"}
                                                    name={"clientName"}
                                                    label={"Client Name"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["clientName"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["clientName"] &&
                                                        Boolean(formik.errors["clientName"])
                                                    }
                                                    helperText={
                                                        formik.touched["clientName"] &&
                                                        formik.errors["clientName"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"username"}
                                                    fullWidth
                                                    id={"username"}
                                                    name={"username"}
                                                    label={"Username"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={username}
                                                    onChange={(e) => setUsername(e?.target?.value)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl fullWidth variant="standard">
                                                <InputLabel
                                                    error={
                                                        formik.touched["category"] &&
                                                        Boolean(formik.errors["category"])
                                                    }
                                                    id="category"
                                                >
                                                    Role
                                                </InputLabel>
                                                <Select
                                                    id="role" // Add an id for accessibility
                                                    name="role" // Name should match the field name in initialValues
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["role"] &&
                                                        Boolean(formik.errors["role"])
                                                    }
                                                    value={formik.values.role}
                                                    labelId="role"
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {roles?.map((item, idx) => (
                                                        <MenuItem key={idx} value={item?.id}>
                                                            {item?.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {formik.touched.role && formik.errors.role && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.role}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid container direction={"row"} columnGap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"email"}
                                                    fullWidth
                                                    id={"email"}
                                                    name={"email"}
                                                    label={"Email Sender"}
                                                    variant="standard"
                                                    type={"email"}
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
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"password"}
                                                    fullWidth
                                                    id={"password"}
                                                    name={"password"}
                                                    label={"Password"}
                                                    variant="standard"
                                                    type={"password"}
                                                    value={formik.values["password"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["password"] &&
                                                        Boolean(formik.errors["password"])
                                                    }
                                                    helperText={
                                                        formik.touched["password"] &&
                                                        formik.errors["password"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction={"row"} columnGap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"businesswebsite"}
                                                    fullWidth
                                                    id={"businesswebsite"}
                                                    name={"businesswebsite"}
                                                    label={"Business Website"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["businesswebsite"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["businesswebsite"] &&
                                                        Boolean(formik.errors["businesswebsite"])
                                                    }
                                                    helperText={
                                                        formik.touched["businesswebsite"] &&
                                                        formik.errors["businesswebsite"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"phone"}
                                                    fullWidth
                                                    id={"phone"}
                                                    name={"phone"}
                                                    label={"Mobile Number"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["phone"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["phone"] &&
                                                        Boolean(formik.errors["phone"])
                                                    }
                                                    helperText={
                                                        formik.touched["phone"] && formik.errors["phone"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction={"row"} columnGap={2} marginTop={2}>
                                        <Grid item xs={12}>
                                            <AccordionComponent
                                                outsideExpanded={true}
                                                title="Address Information"
                                                style={{width: "85%", boxShadow: "none"}}
                                            >
                                                <Grid
                                                    container
                                                    direction="row"
                                                    columnSpacing={2}
                                                    rowSpacing={0.5}
                                                >
                                                    <Grid item xs={12}>
                                                        {/* <FormControl fullWidth variant="standard">
                              <InputLabel
                                error={
                                  formik.touched["country"] &&
                                  Boolean(formik.errors["country"])
                                }
                                id="country"
                              >
                                Country
                              </InputLabel>
                              <Select
                                key="country"
                                id="country" // Add an id for accessibility
                                name="country" // Name should match the field name in initialValues
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  getCities({ country: e?.target?.value });
                                }}
                                error={
                                  formik.touched["country"] &&
                                  Boolean(formik.errors["country"])
                                }
                                onBlur={formik.handleBlur}
                                value={formik.values.country}
                                labelId="country"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {Countries?.map((country) => (
                                  <MenuItem value={country?.recordGuid}>
                                    {country?.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {formik.touched.country &&
                              formik.errors.country && (
                                <FormHelperText
                                  style={{ color: theme.palette.error.main }}
                                >
                                  {formik.errors.country}
                                </FormHelperText>
                              )} */}
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
                                                            id={`async-menu-style`}
                                                        />
                                                        {formik.touched.country &&
                                                            formik.errors.country && (
                                                                <FormHelperText>
                                                                    {formik.errors.country}
                                                                </FormHelperText>
                                                            )}
                                                    </Grid>
                                                    <Grid item xs={6}>
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
                                                    <Grid item xs={6}>
                                                        {/* <FormControl fullWidth variant="standard">
                              <InputLabel id="city">City</InputLabel>
                              <Select
                                key="city"
                                id="city" // Add an id for accessibility
                                name="city" // Name should match the field name in initialValues
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.city}
                                labelId="city"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {Cities?.map((city) => (
                                  <MenuItem value={city?.recordGuid}>
                                    {city?.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl> */}
                                                        <CustomAsyncPaginate
                                                            apiFunction={GET_ALL_CITIES_API} // Pass the function directly
                                                            key={randomValue}
                                                            value={formik?.values?.city}
                                                            onChange={(value) => {
                                                                formik.setFieldValue("city", value);
                                                            }}
                                                            placeholder="City *"
                                                            pageSize={10}
                                                            dataPath="data.data.locations" // Adjust path based on API response structure
                                                            totalRowsPath="data.data.totalRows"
                                                            method="GET"
                                                            params={{country: formik.values.country.value}}
                                                            id={`async-menu-style-accounts`}
                                                        />

                                                        {formik.touched.city && formik.errors.city && (
                                                            <FormHelperText style={{color: "red"}}>
                                                                {formik.errors.city}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    <Grid item xs={6}>
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
                                                    <Grid item xs={6}>
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

                                                    <Grid item xs={6}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <TextField
                                                                key={"zip"}
                                                                fullWidth
                                                                id={"zip"}
                                                                name={"zip"}
                                                                label={"zip"}
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
                                                    <Grid item xs={6}>
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
                                                    <Grid item xs={6}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <TextField
                                                                key={"floor"}
                                                                fullWidth
                                                                id={"floor"}
                                                                name={"floor"}
                                                                label={"Floor"}
                                                                variant="standard"
                                                                type={"number"}
                                                                value={formik.values["floor"]}
                                                                onChange={formik.handleChange}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "e" || e.key === "E") {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
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
                                                    <Grid item xs={6}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <TextField
                                                                key={"room"}
                                                                fullWidth
                                                                id={"room"}
                                                                name={"room"}
                                                                label={"Room"}
                                                                variant="standard"
                                                                type={"number"}
                                                                value={formik.values["room"]}
                                                                onChange={formik.handleChange}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "e" || e.key === "E") {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
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
                                                    <Grid item xs={6}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <TextField
                                                                key={"address1"}
                                                                fullWidth
                                                                id={"address1"}
                                                                name={"address1"}
                                                                label={"Address Line 1"}
                                                                variant="standard"
                                                                type={"text"}
                                                                value={formik.values["address1"]}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched["address1"] &&
                                                                    Boolean(formik.errors["address1"])
                                                                }
                                                                helperText={
                                                                    formik.touched["address1"] &&
                                                                    formik.errors["address1"]
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <TextField
                                                                key={"address2"}
                                                                fullWidth
                                                                id={"address2"}
                                                                name={"address2"}
                                                                label={"Address Line 2"}
                                                                variant="standard"
                                                                type={"text"}
                                                                value={formik.values["address2"]}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                error={
                                                                    formik.touched["address2"] &&
                                                                    Boolean(formik.errors["address2"])
                                                                }
                                                                helperText={
                                                                    formik.touched["address2"] &&
                                                                    formik.errors["address2"]
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </AccordionComponent>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                <Grid container gap={2}>
                                    <Grid container direction={"row"} gap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"BillingEmail"}
                                                    fullWidth
                                                    id={"BillingEmail"}
                                                    name={"BillingEmail"}
                                                    label={"Billing Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values.BillingEmail}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.BillingEmail &&
                                                        Boolean(formik.errors.BillingEmail)
                                                    }
                                                    helperText={
                                                        formik.touched.BillingEmail &&
                                                        formik.errors.BillingEmail
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"TechnicalEmail"}
                                                    fullWidth
                                                    id={"TechnicalEmail"}
                                                    name={"TechnicalEmail"}
                                                    label={"Technical Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values.TechnicalEmail}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.TechnicalEmail &&
                                                        Boolean(formik.errors.TechnicalEmail)
                                                    }
                                                    helperText={
                                                        formik.touched.TechnicalEmail &&
                                                        formik.errors.TechnicalEmail
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container direction={"row"} gap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"AlertsEmail"}
                                                    fullWidth
                                                    id={"AlertsEmail"}
                                                    name={"AlertsEmail"}
                                                    label={"Alerts Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values.AlertsEmail}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.AlertsEmail &&
                                                        Boolean(formik.errors.AlertsEmail)
                                                    }
                                                    helperText={
                                                        formik.touched.AlertsEmail &&
                                                        formik.errors.AlertsEmail
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"BusinessWebUrl"}
                                                    fullWidth
                                                    id={"BusinessWebUrl"}
                                                    name={"BusinessWebUrl"}
                                                    label={"BusinessWebUrl"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values.BusinessWebUrl}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.BusinessWebUrl &&
                                                        Boolean(formik.errors.BusinessWebUrl)
                                                    }
                                                    helperText={
                                                        formik.touched.BusinessWebUrl &&
                                                        formik.errors.BusinessWebUrl
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        <Grid
                            display={"flex"}
                            flexDirection={"row"}
                            style={{width: "85%", marginTop: 20}}
                            justifyContent={"space-between"}
                        >
                            <Button onClick={handleBack} className="mui-btn secondary filled">
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                className="mui-btn primary filled"
                                onClick={formik?.handleSubmit}
                            >
                                {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withTranslation("translation")(GetActions(AddClient));
