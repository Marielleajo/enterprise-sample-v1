import {
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
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {GET_ALL_CHANNELS, GET_CURRENCIES} from "../../../APIs/Criteria";
import {EDIT_SERVICE, GET_ALL_SERVICE_CATEGORY, GET_ALL_SERVICE_TYPE, GET_PRICING_TYPES,} from "../../../APIs/Services";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError, removeNullKeys} from "../../Utils/Functions";
import addValidationSchema from "./addValidationSchema";

const EditService = ({
                         t,
                         getAllServices,
                         selectedService,
                         setShowEditService,
                     }) => {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [serviceCategoryOptions, setServiceCategoryOptions] = useState([]);
    const [serviceTypeOptions, setServiceTypeOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [channelOptions, setChannelOptions] = useState([]);
    const [pricingTypeOptions, setPricingTypeOptions] = useState([]);
    const {token} = useSelector((state) => state?.authentication);

    const getServiceCategories = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_SERVICE_CATEGORY();
            setServiceCategoryOptions(
                response?.data?.data?.items?.map((item) => ({
                    label: item?.serviceCategoryDetails[0]?.name,
                    value: item?.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getServiceTypes = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_SERVICE_TYPE();
            setServiceTypeOptions(
                response?.data?.data?.items?.map((item) => ({
                    label: item?.serviceTypeDetails[0]?.name,
                    value: item?.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getCurrencies = async () => {
        setLoading(true);
        try {
            let response = await GET_CURRENCIES();
            setCurrencyOptions(
                response?.data?.data?.currencies?.map((item) => ({
                    label: item?.name,
                    value: item?.code,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getChannels = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_CHANNELS(token);
            setChannelOptions(
                response?.data?.data?.channels?.map((item) => ({
                    label: item?.name,
                    value: item?.recordGuid,
                }))
            );
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getPricingTypes = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["SERVICE_PRICING_TYPE"],
            };
            let response = await GET_PRICING_TYPES({data});
            setPricingTypeOptions(
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
        getServiceCategories();
        getServiceTypes();
        getCurrencies();
        getChannels();
        getPricingTypes();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: selectedService?.serviceDetails[0]?.name
                ? selectedService?.serviceDetails[0]?.name
                : "",
            description: selectedService?.serviceDetails[0]?.description
                ? selectedService?.serviceDetails[0]?.description
                : "",
            serviceCategory: selectedService?.serviceCategoryGuid
                ? selectedService?.serviceCategoryGuid
                : "",
            serviceType: selectedService?.serviceType?.recordGuid
                ? selectedService?.serviceType?.recordGuid
                : "",
            currency: selectedService?.currency?.code
                ? selectedService?.currency?.code
                : "",
            channel: selectedService?.channelGuid ? selectedService?.channelGuid : "",
            pricingType: selectedService?.servicePricingType
                ? selectedService?.servicePricingType
                : "",
            defaultCost: selectedService?.cost ? selectedService?.cost : 0,
            defaultSell: selectedService?.price ? selectedService?.price : 0,
            broadcast:
                selectedService?.serviceConfig?.find((x) => x?.key === "isBroadcast")
                    ?.value === "true"
                    ? true
                    : false,
            integration:
                selectedService?.serviceConfig?.find((x) => x?.key === "isIntegration")
                    ?.value === "true"
                    ? true
                    : false,
            api:
                selectedService?.serviceConfig?.find((x) => x?.key === "IsAPI")
                    ?.value === "true"
                    ? true
                    : false,
            generateApi:
                selectedService?.serviceConfig?.find((x) => x?.key === "IsGenerateCDR")
                    ?.value === "true"
                    ? true
                    : false,
            template:
                selectedService?.serviceConfig?.find((x) => x?.key === "IsTemplate")
                    ?.value === "true"
                    ? true
                    : false,
            channelManagement:
                selectedService?.serviceConfig?.find(
                    (x) => x?.key === "IsChannelManagement"
                )?.value === "true"
                    ? true
                    : false,
            analyze:
                selectedService?.serviceConfig?.find((x) => x?.key === "IsAnalayze")
                    ?.value === "true"
                    ? true
                    : false,
            report:
                selectedService?.serviceConfig?.find((x) => x?.key === "IsReport")
                    ?.value === "true"
                    ? true
                    : false,
        },
        validationSchema: addValidationSchema[0],
        onSubmit: async (values) => {

            setLoading(true);
            try {
                let data = {};
                if (values?.pricingType !== "TRAFFIC") {
                    data = {
                        recordGuid: selectedService?.recordGuid,
                        serviceCategoryGuid: values?.serviceCategory,
                        ServiceTypeGuid: values?.serviceType,
                        currencyCode: values?.currency,
                        ChannelGuid: values?.channel,
                        PriceTypeTag: values?.pricingType,
                        price: values?.defaultSell,
                        cost: values?.defaultCost,
                        ServiceInfo: {
                            NumberOfSubscription: 0,
                            NumberOfUnSubscription: 0,
                        },
                        serviceDetails: [
                            {
                                languageCode: "en",
                                name: values?.name,
                                description: values?.description,
                            },
                        ],
                        ServiceConfig: [
                            {
                                key: "isBroadcast",
                                value: values?.broadcast ? "true" : "false",
                            },
                            {
                                key: "isIntegration",
                                value: values?.integration ? "true" : "false",
                            },
                            {
                                key: "IsAPI",
                                value: values?.api ? "true" : "false",
                            },
                            {
                                key: "IsGenerateCDR",
                                value: values?.generateApi ? "true" : "false",
                            },
                            {
                                key: "IsTemplate",
                                value: values?.template ? "true" : "false",
                            },
                            {
                                key: "IsChannelManagement",
                                value: values?.channelManagement ? "true" : "false",
                            },
                            {
                                key: "IsAnalyze",
                                value: values?.analyze ? "true" : "false",
                            },
                            {
                                key: "IsReport",
                                value: values?.report ? "true" : "false",
                            },
                        ],
                    };
                } else {
                    data = {
                        recordGuid: selectedService?.recordGuid,
                        serviceCategoryGuid: values?.serviceCategory,
                        ServiceTypeGuid: values?.serviceType,
                        currencyCode: values?.currency,
                        ChannelGuid: values?.channel,
                        PriceTypeTag: values?.pricingType,
                        ServiceInfo: {
                            NumberOfSubscription: 0,
                            NumberOfUnSubscription: 0,
                        },
                        serviceDetails: [
                            {
                                languageCode: "en",
                                name: values?.name,
                                description: values?.description,
                            },
                        ],
                        ServiceConfig: [
                            {
                                key: "isBroadcast",
                                value: values?.broadcast ? "true" : "false",
                            },
                            {
                                key: "isIntegration",
                                value: values?.integration ? "true" : "false",
                            },
                            {
                                key: "IsAPI",
                                value: values?.api ? "true" : "false",
                            },
                            {
                                key: "IsGenerateCDR",
                                value: values?.generateApi ? "true" : "false",
                            },
                            {
                                key: "IsTemplate",
                                value: values?.template ? "true" : "false",
                            },
                            {
                                key: "IsChannelManagement",
                                value: values?.channelManagement ? "true" : "false",
                            },
                            {
                                key: "IsAnalyze",
                                value: values?.analyze ? "true" : "false",
                            },
                            {
                                key: "IsReport",
                                value: values?.report ? "true" : "false",
                            },
                        ],
                    };
                }
                let response = await EDIT_SERVICE({postData: removeNullKeys(data)});
                if (response?.data?.success) {
                    showSnackbar("Service Updated Successfully!");
                    setShowEditService(false);
                    getAllServices();
                }
            } catch (e) {
                showSnackbar(handleMessageError({e, type: "validation"}), "error");
            } finally {
                setLoading(false);
            }
        },
    });

    const theme = useTheme();

    return (
        <Grid container id="Reseller" className="page_container">
            <Grid container>
                <Grid item xs={12} className="pt-4">
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                        <Typography
                            style={{
                                cursor: "pointer",
                            }}
                            className="BreadcrumbsPage"
                            onClick={() => setShowEditService(false)}
                        >
                            Services
                        </Typography>
                        <Typography className="breadcrumbactiveBtn">
                            Update Service Details
                        </Typography>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <Grid container className="section_container">
                <Grid item xs={12} className="sub_section_container">
                    <Grid
                        container
                        className="pt-4"
                        paddingRight={2.5}
                        display={"flex"}
                        justifyContent={"start"}
                        alignItems={"center"}
                    >
                        <form onSubmit={formik?.handleSubmit}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"name"}
                                                fullWidth
                                                id={"name"}
                                                name={"name"}
                                                label={"Name*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formik.values["name"]}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["name"] &&
                                                    Boolean(formik.errors["name"])
                                                }
                                                helperText={
                                                    formik.touched["name"] && formik.errors["name"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"description"}
                                                fullWidth
                                                id={"description"}
                                                name={"description"}
                                                label={"Description*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formik.values["description"]}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["description"] &&
                                                    Boolean(formik.errors["description"])
                                                }
                                                helperText={
                                                    formik.touched["description"] &&
                                                    formik.errors["description"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formik.touched["serviceCategory"] &&
                                                    Boolean(formik.errors["serviceCategory"])
                                                }
                                                id="serviceCategory"
                                            >
                                                Service Category*
                                            </InputLabel>
                                            <Select
                                                id="serviceCategory"
                                                name="serviceCategory"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["serviceCategory"] &&
                                                    Boolean(formik.errors["serviceCategory"])
                                                }
                                                value={formik.values.serviceCategory}
                                                labelId="serviceCategory"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {serviceCategoryOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.serviceCategory &&
                                            formik.errors.serviceCategory && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.serviceCategory}
                                                </FormHelperText>
                                            )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formik.touched["serviceType"] &&
                                                    Boolean(formik.errors["serviceType"])
                                                }
                                                id="serviceType"
                                            >
                                                Service Type*
                                            </InputLabel>
                                            <Select
                                                id="serviceType"
                                                name="serviceType"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["serviceType"] &&
                                                    Boolean(formik.errors["serviceType"])
                                                }
                                                value={formik.values.serviceType}
                                                labelId="serviceType"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {serviceTypeOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.serviceType &&
                                            formik.errors.serviceType && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.serviceType}
                                                </FormHelperText>
                                            )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formik.touched["currency"] &&
                                                    Boolean(formik.errors["currency"])
                                                }
                                                id="currency"
                                            >
                                                Currency*
                                            </InputLabel>
                                            <Select
                                                id="currency"
                                                name="currency"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["currency"] &&
                                                    Boolean(formik.errors["currency"])
                                                }
                                                value={formik.values.currency}
                                                labelId="currency"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {currencyOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.currency && formik.errors.currency && (
                                            <FormHelperText
                                                style={{color: theme?.palette?.error?.main}}
                                            >
                                                {formik.errors.currency}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formik.touched["channel"] &&
                                                    Boolean(formik.errors["channel"])
                                                }
                                                id="channel"
                                            >
                                                Channel*
                                            </InputLabel>
                                            <Select
                                                id="channel"
                                                name="channel"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["channel"] &&
                                                    Boolean(formik.errors["channel"])
                                                }
                                                value={formik.values.channel}
                                                labelId="channel"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {channelOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.channel && formik.errors.channel && (
                                            <FormHelperText
                                                style={{color: theme?.palette?.error?.main}}
                                            >
                                                {formik.errors.channel}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formik.touched["pricingType"] &&
                                                    Boolean(formik.errors["pricingType"])
                                                }
                                                id="pricingType"
                                            >
                                                Pricing Type*
                                            </InputLabel>
                                            <Select
                                                id="pricingType"
                                                name="pricingType"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={
                                                    formik.touched["pricingType"] &&
                                                    Boolean(formik.errors["pricingType"])
                                                }
                                                value={formik.values.pricingType}
                                                labelId="pricingType"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {pricingTypeOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formik.touched.pricingType &&
                                            formik.errors.pricingType && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formik.errors.pricingType}
                                                </FormHelperText>
                                            )}
                                    </Grid>
                                    {formik.values.pricingType !== "TRAFFIC" &&
                                        formik.values.pricingType !== "" && (
                                            <>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"defaultCost"}
                                                            fullWidth
                                                            id={"defaultCost"}
                                                            name={"defaultCost"}
                                                            label={"Default Cost*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formik.values["defaultCost"]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched["defaultCost"] &&
                                                                Boolean(formik.errors["defaultCost"])
                                                            }
                                                            helperText={
                                                                formik.touched["defaultCost"] &&
                                                                formik.errors["defaultCost"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"defaultSell"}
                                                            fullWidth
                                                            id={"defaultSell"}
                                                            name={"defaultSell"}
                                                            label={"Default Sell*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formik.values["defaultSell"]}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched["defaultSell"] &&
                                                                Boolean(formik.errors["defaultSell"])
                                                            }
                                                            helperText={
                                                                formik.touched["defaultSell"] &&
                                                                formik.errors["defaultSell"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}

                                    {(formik.values.pricingType == "TRAFFIC" ||
                                        formik.values.pricingType == "") && <Grid item xs={8}/>}
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
                        Broadcast
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.broadcast}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "broadcast",
                                                                !formik?.values?.broadcast
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
                        Integration
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.integration}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "integration",
                                                                !formik?.values?.integration
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
                        API
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.api}
                                                        onChange={() =>
                                                            formik?.setFieldValue("api", !formik?.values?.api)
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
                        Generate API
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.generateApi}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "generateApi",
                                                                !formik?.values?.generateApi
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
                        Template
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.template}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "template",
                                                                !formik?.values?.template
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
                        Channel Management
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.channelManagement}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "channelManagement",
                                                                !formik?.values?.channelManagement
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
                        Analyze
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.analyze}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "analyze",
                                                                !formik?.values?.analyze
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
                        Report
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={formik?.values?.report}
                                                        onChange={() =>
                                                            formik?.setFieldValue(
                                                                "report",
                                                                !formik?.values?.report
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                display={"flex"}
                                flexDirection={"row"}
                                style={{marginTop: 20}}
                                justifyContent={"end"}
                            >
                                <Button
                                    className="mui-btn primary filled"
                                    onClick={formik?.handleSubmit}
                                    disabled={loading}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default withTranslation("translation")(EditService);
