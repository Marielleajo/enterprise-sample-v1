import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import {useFormik} from "formik";
import {useCallback, useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {GET_CLIENT, UPDATE_ADVANCED_CLIENT} from "../../../APIs/Clients";
import {GET_ADDRESS} from "../../../APIs/Common";
import {GET_ALL_CITIES_API, GET_ALL_COUNTRIES_API,} from "../../../APIs/Criteria";
import AccordionComponent from "../../../Components/Accordion/AccordionComponent";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {HandleApiError, handleMessageError, updateState,} from "../../Utils/Functions";
import validationSchema from "./editvalidation";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {useNavigate, useParams} from "react-router-dom";

const EditClient = ({t}) => {
    const {clientId} = useParams();
    const {showSnackbar} = useSnackbar();

    const [randomValue, setRandomValue] = useState("");
    const navigate = useNavigate();

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
    const formik = useFormik({
        initialValues: {
            businessName: "",
            businessWebsite: "",
            mobileNumber: "",
            username: "",
            email: "",
            country: "",
            street: "",
            city: "",
            region: "",
            state: "",
            zip: "",
            building: "",
            floor: "",
            room: "",
            address1: "",
            address2: "",
            BillingEmail: "",
            TechnicalEmail: "",
            AlertsEmail: "",
            BusinessWebUrl: "",
        },
        enableReinitialize: true,
        validationSchema: validationSchema[activeStep],
        onSubmit: async (values) => {
            if (activeStep === steps.length - 1) {
                let data = {
                    RecordGuid: clientId,
                    Name: values["businessName"],
                    CountryGuid: values["country"].value,
                    CompanyWebsite: values["businessWebsite"],
                    Address: {
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
                    Info: {
                        BillingEmail:
                            values?.BillingEmail?.length > 0 ? values?.BillingEmail : null,
                        TechnicalEmail:
                            values?.TechnicalEmail?.length > 0
                                ? values?.TechnicalEmail
                                : null,
                        AlertsEmail:
                            values?.AlertsEmail?.length > 0 ? values?.AlertsEmail : null,
                        BusinessWebUrl:
                            values?.BusinessWebUrl?.length > 0
                                ? values?.BusinessWebUrl
                                : null,
                    },
                };

                if (Object.keys(data?.Info)?.length == 0) delete data?.Info;
                if (Object.keys(data?.Address)?.length == 0) delete data?.Address;

                try {
                    let recordResponse = await UPDATE_ADVANCED_CLIENT(data);
                    if (recordResponse?.data?.success) {
                        showSnackbar("Client updated successfully", "success");
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
    // console.log(formik.values);

    const fetchClientById = useCallback(async ({client}) => {
        try {
            let clientResponse = await GET_CLIENT({client});
            let _client = clientResponse?.data?.data?.client;
            // Account Information
            formik.setFieldValue("businessName", _client?.name);
            formik.setFieldValue("email", _client?.email);
            formik.setFieldValue("businessWebsite", _client?.companyWebsite);
            formik.setFieldValue("mobileNumber", _client?.mobileNumber);
            formik.setFieldValue("country", {
                value: _client?.countryRecordGuid,
                label: _client?.countryName,
            });
            formik.setFieldValue("username", _client?.username);

            // Engagement Feilds
            formik.setFieldValue(
                "BusinessWebUrl",
                _client?.clientInfo?.businessWebUrl
            );
            formik.setFieldValue("AlertsEmail", _client?.clientInfo?.alertsEmail);
            formik.setFieldValue(
                "TechnicalEmail",
                _client?.clientInfo?.technicalEmail
            );
            formik.setFieldValue("BillingEmail", _client?.clientInfo?.billingEmail);

            if (_client?.countryRecordGuid) {
                getCities({country: _client?.countryRecordGuid});
            }
        } catch (e) {
            console.log("in error");
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        }
    }, []);

    useEffect(() => {
        if (clientId) {
            fetchClientById({client: clientId});
        }
    }, [clientId]);

    const [Cities, SetCities] = useState([]);

    const handleBack = () => {
        if (activeStep == 0) navigate("/client/client-management");
        else SetGlobalData(updateState(GlobalData, "activeStep", activeStep - 1));
    };

    // const GetAllCountries = async () => {
    //   try {
    //     let countriesResponse = await GET_ALL_COUNTRIES_API({});
    //     SetCountries(countriesResponse?.data?.data?.countries);
    //   } catch (e) {
    //     Notification.error(e);
    //   }
    // };

    const getCities = async ({country}) => {
        try {
            let citiesResponse = await GET_ALL_CITIES_API({country});
            SetCities(citiesResponse?.data?.data?.cities);
        } catch (e) {
            HandleApiError(e);
        }
    };

    const getAddress = async () => {
        try {
            let response = await GET_ADDRESS({clientGuid: clientId});

            let address = response?.data?.data?.address;
            formik.setValues({
                ...formik.values,
                address1: address?.address1,
                address2: address?.address2,
                building: address?.building,
                floor: address?.floor,
                region: address?.region,
                state: address?.state,
                street: address?.street,
                zip: address?.zip,
                room: address?.roomNumber,
                city: {value: address?.cityRecordGuid, label: address?.cityName},
            });
            formik.setFieldValue("address1", address?.address1);
            formik.setFieldValue("address2", address?.address2);
            formik.setFieldValue("building", address?.building);
            formik.setFieldValue("floor", address?.floor);
            formik.setFieldValue("region", address?.region);
            formik.setFieldValue("state", address?.state);
            formik.setFieldValue("street", address?.street);
            formik.setFieldValue("zip", address?.zip);
            formik.setFieldValue("room", address?.roomNumber);
        } catch (e) {
            console.log(e);
            showSnackbar(handleMessageError({e}), "error");
        }
    };

    useEffect(() => {
        // GetAllCountries();
        getAddress();
    }, []);

    return (
        <Grid container id="Client" className="page_container">
            <Grid container className="section_container scroll">
                <Grid item xs={2}>
                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        className="pt-4"
                    >
                        {steps?.map((step, index) => {
                            return (
                                <Step key={step?.label}>
                                    <StepLabel
                                        optional={
                                            index === steps?.length - 1 ? (
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
                <Grid item xs={10} className="sub_section_container">
                    <Box className="pt-4">
                        <Typography variant="h5"> {steps[activeStep]?.label}</Typography>
                    </Box>
                    <form onSubmit={formik?.handleSubmit}>
                        {activeStep === 0 && (
                            <Box>
                                <Grid container columnGap={2} rowGap={0.5}>
                                    <Grid container direction={"row"} columnGap={2}>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"businessName"}
                                                    fullWidth
                                                    id={"businessName"}
                                                    name={"businessName"}
                                                    label={"Business Name"}
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
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"businessWebsite"}
                                                    fullWidth
                                                    id={"businessWebsite"}
                                                    name={"businessWebsite"}
                                                    label={"Business Website"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["businessWebsite"]}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["businessWebsite"] &&
                                                        Boolean(formik.errors["businessWebsite"])
                                                    }
                                                    helperText={
                                                        formik.touched["businessWebsite"] &&
                                                        formik.errors["businessWebsite"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"email"}
                                                    fullWidth
                                                    disabled
                                                    id={"email"}
                                                    name={"email"}
                                                    label={"Email"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["email"] || ""}
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
                                                    key={"username"}
                                                    fullWidth
                                                    disabled
                                                    id={"username"}
                                                    name={"username"}
                                                    label={"Username"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["username"] || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched["username"] &&
                                                        Boolean(formik.errors["username"])
                                                    }
                                                    helperText={
                                                        formik.touched["username"] &&
                                                        formik.errors["username"]
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControl variant="standard" fullWidth>
                                                <TextField
                                                    key={"mobileNumber"}
                                                    fullWidth
                                                    disabled
                                                    id={"mobileNumber"}
                                                    name={"mobileNumber"}
                                                    label={"Mobile Number"}
                                                    variant="standard"
                                                    type={"text"}
                                                    value={formik.values["mobileNumber"] || ""}
                                                    onChange={formik.handleChange}
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
                              <InputLabel id="country">Country*</InputLabel>
                              <Select
                                key="country"
                                id="country" // Add an id for accessibility
                                name="country" // Name should match the field name in initialValues
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  getCities({ country: e?.target?.value });
                                }}
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
                                <FormHelperText style={{ color: "red" }}>
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
                            </FormControl>
                            {formik.touched.city && formik.errors.city && (
                              <FormHelperText style={{ color: "red" }}>
                                {formik.errors.city}
                              </FormHelperText>
                            )} */}
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
                                disabled={!formik.values["businessName"]}
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

export default withTranslation("translation")(EditClient);
