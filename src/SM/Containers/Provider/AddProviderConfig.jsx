import {LockOpen, Visibility, VisibilityOff} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {
  ADD_MNP_CONFIG_PROVIDER,
  ADD_SMPP_CONFIG_PROVIDER,
  ADD_SMTP_CONFIG_PROVIDER,
  EDIT_MNP_CONFIG_PROVIDER,
  EDIT_SMPP_CONFIG_PROVIDER,
  EDIT_SMTP_CONFIG_PROVIDER,
  GET_ALL_TITLES,
  GET_MNPHLR_BY_ID,
  GET_SMPP_BY_ID,
  GET_SMTP_BY_ID,
  SMPP_CONFIG,
} from "../../../APIs/Providers";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError, removeNullKeys} from "../../Utils/Functions";
import {
  addLookupConfigurationENUMValidationSchema,
  addLookupConfigurationHTTPValidationSchema,
} from "./addLookupConfigurationValidationSchema";
import addSmppConfigurationValidationSchema from "./addSmppConfigurationValidationSchema";
import addSmtpConfigurationValidationSchema from "./addSmtpConfigurationValidationSchema";
import {TabContext} from "@mui/lab";
import {GET_CURRENCIES} from "../../../APIs/Criteria";

const AddProviderConfig = ({
                               t,
                               selectedProvider,
                               type,
                               setGoToConfigPage,
                               value,
                               setValue,
                           }) => {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [connectivityTypeOptions, setConnectivityTypeOptions] = useState([]);
    const [classLocationOptions, setClassLocationOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [MnpDetails, setMnpDetails] = useState([]);
    const [HlrDetails, setHlrDetails] = useState([]);
    const [SmtpDetails, setSmtpDetails] = useState([]);
    const [SmppDetails, setSmppDetails] = useState([]);
    const [openMessageAlert, setOpenMessageAlert] = useState(false);
    const [tempConnectivityType, setTempConnectivityType] = useState(false);
    const {services} = useSelector((state) => state.system);
    const {token, role} = useSelector((state) => state.authentication);
    const [connectionModeOptions, setConnectionModeOptions] = useState([
        {label: "None", value: 0},
        {label: "Transmitter", value: 1},
        {label: "Receiver", value: 2},
        {label: "Transceiver", value: 3},
    ]);

    const getConnectivityType = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["CONNECTIVITY_TYPE"],
            };
            let response = await GET_ALL_TITLES({data});
            setConnectivityTypeOptions(
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

    const getClassLocation = async () => {
        setLoading(true);
        try {
            let data = {
                categoryTags: ["LOOKUP_CLASS_LOCATION"],
            };
            let response = await GET_ALL_TITLES({data});
            setClassLocationOptions(
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

    const getCurrencies = async () => {
        setLoading(true);
        try {
            let currencyResponse = await GET_CURRENCIES(token);
            setCurrencyOptions(currencyResponse?.data?.data?.currencies || []);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getConnectivityType();
        getClassLocation();
        getCurrencies();
    }, []);

    const formikLookupConfigurationMNP = useFormik({
        initialValues: {
            connectivityType: "",
            numberofThreads: "",
            classLocation: "",
            currency: "",
            host: "",
            port: "",
            queryDns: "",
        },
        validationSchema:
            tempConnectivityType === "ENUM"
                ? addLookupConfigurationENUMValidationSchema
                : addLookupConfigurationHTTPValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            if ((type == "edit" || type == "add") && MnpDetails?.recordGuid) {
                try {
                    let dataHttp = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        ServiceLookupModeTag: "MNP",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        RecordGuid: MnpDetails?.recordGuid,
                        ServiceGuid: services?.find((x) => x?.tag === "MNP")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let dataEnum = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        Port: values["port"],
                        QueryDns: values["queryDns"],
                        ServiceLookupModeTag: "MNP",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        RecordGuid: MnpDetails?.recordGuid,
                        ServiceGuid: services?.find((x) => x?.tag === "MNP")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let response = await EDIT_MNP_CONFIG_PROVIDER({
                        formData:
                            values?.connectivityType === "ENUM"
                                ? removeNullKeys(dataEnum)
                                : removeNullKeys(dataHttp),
                    });
                    if (response?.data?.success) {
                        showSnackbar("MNP Configuration Updated Successfully!");
                        setOpenMessageAlert(true);
                        getMnpById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    let dataHttp = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        ServiceLookupModeTag: "MNP",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        ServiceGuid: services?.find((x) => x?.tag === "MNP")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let dataEnum = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        Port: values["port"],
                        QueryDns: values["queryDns"],
                        ServiceLookupModeTag: "MNP",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        ServiceGuid: services?.find((x) => x?.tag === "MNP")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let response = await ADD_MNP_CONFIG_PROVIDER({
                        formData:
                            values?.connectivityType === "ENUM"
                                ? removeNullKeys(dataEnum)
                                : removeNullKeys(dataHttp),
                    });
                    if (response?.data?.success) {
                        showSnackbar("MNP Configuration Added Successfully!");
                        setOpenMessageAlert(true);
                        getMnpById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const formikLookupConfigurationHlr = useFormik({
        initialValues: {
            connectivityType: "",
            numberofThreads: "",
            classLocation: "",
            currency: "",
            host: "",
            port: "",
            queryDns: "",
        },
        validationSchema:
            tempConnectivityType === "ENUM"
                ? addLookupConfigurationENUMValidationSchema
                : addLookupConfigurationHTTPValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            if ((type == "edit" || type == "add") && HlrDetails?.recordGuid) {
                try {
                    let dataHttp = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        ServiceLookupModeTag: "HLR",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        RecordGuid: HlrDetails?.recordGuid,
                        ServiceGuid: services?.find((x) => x?.tag === "HLR")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let dataEnum = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        Port: values["port"],
                        ServiceLookupModeTag: "HLR",
                        QueryDns: values["queryDns"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        RecordGuid: HlrDetails?.recordGuid,
                        ServiceGuid: services?.find((x) => x?.tag === "HLR")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let response = await EDIT_MNP_CONFIG_PROVIDER({
                        formData:
                            values?.connectivityType === "ENUM"
                                ? removeNullKeys(dataEnum)
                                : removeNullKeys(dataHttp),
                    });
                    if (response?.data?.success) {
                        showSnackbar("HLR Configuration Updated Successfully!");
                        setOpenMessageAlert(true);
                        getHlrById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    let dataHttp = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        ServiceLookupModeTag: "HLR",
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        ServiceGuid: services?.find((x) => x?.tag === "HLR")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let dataEnum = {
                        ConnectivityTypeTag: values["connectivityType"],
                        ClassLocationTag: values["classLocation"],
                        NumberOfThreads: values["numberofThreads"],
                        Host: values["host"],
                        Port: values["port"],
                        ServiceLookupModeTag: "HLR",
                        QueryDns: values["queryDns"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        ServiceGuid: services?.find((x) => x?.tag === "HLR")?.recordGuid,
                        CurrencyGuid: values?.currency,
                    };
                    let response = await ADD_MNP_CONFIG_PROVIDER({
                        formData:
                            values?.connectivityType === "ENUM"
                                ? removeNullKeys(dataEnum)
                                : removeNullKeys(dataHttp),
                    });
                    if (response?.data?.success) {
                        showSnackbar("HLR Configuration Added Successfully!");
                        setOpenMessageAlert(true);
                        getHlrById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const formikSmtpConfiguration = useFormik({
        initialValues: {
            smtpServer: "",
            smtpUser: "",
            smtpPassword: "",
            currency: "",
            smtpPort: "",
            smtpSwitch: false,
            fromAddress: "",
            replyAddress: "",
        },
        validationSchema: addSmtpConfigurationValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            if ((type == "edit" || type == "add") && SmtpDetails?.recordGuid) {
                try {
                    let data = {
                        SmtpServer: values["smtpServer"],
                        SmtpUser: values["smtpUser"],
                        SmtpPassword: values["smtpPassword"],
                        SmtpPort: values["smtpPort"],
                        SmtpSsl: values["smtpSwitch"],
                        FromAddress: values["fromAddress"],
                        ReplyAddress: values["replyAddress"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        smtpConfigurationGuid: SmtpDetails?.recordGuid,
                        CurrencyGuid: values?.currency,
                        ServiceGuid: services?.find((x) => x?.tag === "EMAIL")?.recordGuid,
                    };
                    let response = await EDIT_SMTP_CONFIG_PROVIDER({
                        formData: removeNullKeys(data),
                    });
                    if (response?.data?.success) {
                        showSnackbar("SMTP Configuration Updated Successfully!");
                        setOpenMessageAlert(true);
                        getSmtpById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    let data = {
                        SmtpServer: values["smtpServer"],
                        SmtpUser: values["smtpUser"],
                        SmtpPassword: values["smtpPassword"],
                        SmtpPort: values["smtpPort"],
                        SmtpSsl: values["smtpSwitch"],
                        FromAddress: values["fromAddress"],
                        ReplyAddress: values["replyAddress"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        CurrencyGuid: values?.currency,
                        ServiceGuid: services?.find((x) => x?.tag === "EMAIL")?.recordGuid,
                    };
                    let response = await ADD_SMTP_CONFIG_PROVIDER({
                        formData: removeNullKeys(data),
                    });
                    if (response?.data?.success) {
                        showSnackbar("SMTP Configuration Added Successfully!");
                        setOpenMessageAlert(true);
                        getSmtpById(selectedProvider !== "" ? selectedProvider : null);
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const formikSmppConfiguration = useFormik({
        initialValues: {
            smppUser: "",
            smppPassword: "",
            ipAddress: "",
            portAddress: "",
            currency: "",
            ServiceGuid: "",
            sourceTon: "",
            sourceNPI: "",
            destinationTon: "",
            destinationNPI: "",
            shortCodeTonNpi: "",
            maximumRetry: "",
            connectionToOpen: "",
            enquireLink: "",
            submitPerSecond: "",
            connectionMode: "",
            switchRegisteredDelivery: false,
            switchCanBind: true,
            switchOperator: false,
        },
        validationSchema: addSmppConfigurationValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            if ((type == "edit" || type == "add") && SmppDetails?.recordGuid) {
                try {
                    let data = {
                        portAddress: values["portAddress"],
                        Username: values["smppUser"],
                        Password: values["smppPassword"],
                        IpAddress: values["ipAddress"],
                        SourceTon: values["sourceTon"] ? values["sourceTon"] : "0",
                        SourceNpi: values["sourceNPI"] ? values["sourceNPI"] : "0",
                        DestinationTon: values["destinationTon"]
                            ? values["destinationTon"]
                            : "0",
                        DestinationNpi: values["destinationNPI"]
                            ? values["destinationNPI"]
                            : "0",
                        ShortCodeTonNpi: values["shortCodeTonNpi"],
                        MaximumRetry: values["maximumRetry"],
                        ConnectionToOpen: values["connectionToOpen"],
                        EnquireLink: values["enquireLink"],
                        SubmitPerSecond: values["submitPerSecond"],
                        ConnectionMode: values["connectionMode"],
                        IsRegisteredDelivery: values["switchRegisteredDelivery"],
                        CanBind: values["switchCanBind"],
                        IsOperatorEncoding: values["switchOperator"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        AccountMode: 1,
                        AccountType: 1,
                        RecordGuid: SmppDetails?.recordGuid,
                        CurrencyGuid: values?.currency,
                        ServiceGuid: services?.find((x) => x?.tag === "ONE_WAY_SMS")
                            ?.recordGuid,
                    };
                    let response = await EDIT_SMPP_CONFIG_PROVIDER({
                        formData: removeNullKeys(data),
                    });
                    if (response?.data?.success) {
                        showSnackbar("SMPP Configuration Updated Successfully!");
                        setOpenMessageAlert(true);
                        getSmppById(
                            selectedProvider !== ""
                                ? selectedProvider
                                : data?.selectedProviderGuid
                        );
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    let data = {
                        portAddress: values["portAddress"],
                        Username: values["smppUser"],
                        Password: values["smppPassword"],
                        IpAddress: values["ipAddress"],
                        SourceTon: values["sourceTon"] ? values["sourceTon"] : "0",
                        SourceNpi: values["sourceNPI"] ? values["sourceNPI"] : "0",
                        DestinationTon: values["destinationTon"]
                            ? values["destinationTon"]
                            : "0",
                        DestinationNpi: values["destinationNPI"]
                            ? values["destinationNPI"]
                            : "0",
                        ShortCodeTonNpi: values["shortCodeTonNpi"],
                        MaximumRetry: values["maximumRetry"],
                        ConnectionToOpen: values["connectionToOpen"],
                        EnquireLink: values["enquireLink"],
                        SubmitPerSecond: values["submitPerSecond"],
                        ConnectionMode: values["connectionMode"],
                        IsRegisteredDelivery: values["switchRegisteredDelivery"],
                        CanBind: values["switchCanBind"],
                        IsOperatorEncoding: values["switchOperator"],
                        ProviderGuid: selectedProvider !== "" ? selectedProvider : null,
                        AccountMode: 1,
                        AccountType: 1,
                        CurrencyGuid: values?.currency,
                        ServiceGuid: services?.find((x) => x?.tag === "ONE_WAY_SMS")
                            ?.recordGuid,
                    };
                    let response = await ADD_SMPP_CONFIG_PROVIDER({
                        formData: removeNullKeys(data),
                    });
                    if (response?.data?.success) {
                        showSnackbar("SMPP Configuration Added Successfully!");
                        setOpenMessageAlert(true);
                        getSmppById(
                            selectedProvider !== ""
                                ? selectedProvider
                                : data?.selectedProviderGuid
                        );
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    useEffect(() => {
        if (type == "edit") {
            getMnpById(selectedProvider !== "" ? selectedProvider : null);
            getHlrById(selectedProvider !== "" ? selectedProvider : null);
            getSmtpById(selectedProvider !== "" ? selectedProvider : null);
            getSmppById(selectedProvider !== "" ? selectedProvider : null);
            getSmppPass(selectedProvider !== "" ? selectedProvider : null);
        }
    }, []);

    const getMnpById = async (recordGuid) => {
        setLoading(true);
        try {
            let response = await GET_MNPHLR_BY_ID({
                ProviderGuid: recordGuid,
                ServiceGuid: services?.find((x) => x?.tag === "MNP")?.recordGuid,
            });

            if (response?.data?.success) {
                setMnpDetails(response?.data?.data?.items[0]);
                let mnpDetails = response?.data?.data?.items[0];
                if (response?.data?.data?.items?.length !== 0) {
                    formikLookupConfigurationMNP.setFieldValue(
                        "connectivityType",
                        mnpDetails?.connectivityType?.tag
                    );
                    formikLookupConfigurationMNP.setFieldValue(
                        "numberofThreads",
                        mnpDetails?.numberOfThreads
                    );
                    formikLookupConfigurationMNP.setFieldValue("host", mnpDetails?.host);
                    formikLookupConfigurationMNP.setFieldValue(
                        "classLocation",
                        mnpDetails?.classLocation?.tag
                    );
                    formikLookupConfigurationMNP.setFieldValue("port", mnpDetails?.port);
                    formikLookupConfigurationMNP.setFieldValue(
                        "queryDns",
                        mnpDetails?.queryDns
                    );
                }
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getHlrById = async (recordGuid) => {
        setLoading(true);
        try {
            let response = await GET_MNPHLR_BY_ID({
                ProviderGuid: recordGuid,
                ServiceGuid: services?.find((x) => x?.tag === "HLR")?.recordGuid,
            });

            if (response?.data?.success) {
                setHlrDetails(response?.data?.data?.items[0]);
                let HlrDetails = response?.data?.data?.items[0];
                if (response?.data?.data?.items?.length !== 0) {
                    formikLookupConfigurationHlr.setFieldValue(
                        "connectivityType",
                        HlrDetails?.connectivityType?.tag
                    );
                    formikLookupConfigurationHlr.setFieldValue(
                        "numberofThreads",
                        HlrDetails?.numberOfThreads
                    );
                    formikLookupConfigurationHlr.setFieldValue("host", HlrDetails?.host);
                    formikLookupConfigurationHlr.setFieldValue(
                        "classLocation",
                        HlrDetails?.classLocation?.tag
                    );
                    formikLookupConfigurationHlr.setFieldValue("port", HlrDetails?.port);
                    formikLookupConfigurationHlr.setFieldValue(
                        "queryDns",
                        HlrDetails?.queryDns
                    );
                }
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getSmtpById = async (recordGuid) => {
        setLoading(true);
        try {
            let response = await GET_SMTP_BY_ID({
                ProviderGuid: recordGuid,
            });

            if (response?.data?.success) {
                setSmtpDetails(response?.data?.data?.smtpConfigurations[0]);
                let smtpDetails = response?.data?.data?.smtpConfigurations[0];
                if (response?.data?.data?.smtpConfigurations?.length !== 0) {
                    formikSmtpConfiguration.setFieldValue(
                        "smtpServer",
                        smtpDetails?.smtpServer
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "smtpUser",
                        smtpDetails?.smtpUser
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "smtpPassword",
                        smtpDetails?.smtpPassword
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "smtpPort",
                        smtpDetails?.smtpPort
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "fromAddress",
                        smtpDetails?.fromAddress
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "replyAddress",
                        smtpDetails?.replyAddress
                    );
                    formikSmtpConfiguration.setFieldValue(
                        "smtpSwitch",
                        smtpDetails?.smtpSsl
                    );
                }
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getSmppById = async (recordGuid) => {
        setLoading(true);
        try {
            let response = await GET_SMPP_BY_ID({
                ProviderGuid: recordGuid,
            });

            if (response?.data?.success) {
                setSmppDetails(response?.data?.data?.items[0]);
                let smppDetails = response?.data?.data?.items[0];
                if (response?.data?.data?.items?.length > 0) {
                    getSmppPass(smppDetails?.recordGuid);
                    formikSmppConfiguration.setFieldValue(
                        "smppUser",
                        smppDetails?.username
                    );
                    formikSmppConfiguration.setFieldValue(
                        "ipAddress",
                        smppDetails?.ipAddress
                    );
                    formikSmppConfiguration.setFieldValue(
                        "sourceTon",
                        smppDetails?.sourceTon
                    );
                    formikSmppConfiguration.setFieldValue(
                        "sourceNPI",
                        smppDetails?.sourceNpi
                    );
                    formikSmppConfiguration.setFieldValue(
                        "destinationTon",
                        smppDetails?.destinationTon
                    );
                    formikSmppConfiguration.setFieldValue(
                        "destinationNPI",
                        smppDetails?.destinationNpi
                    );
                    formikSmppConfiguration.setFieldValue(
                        "shortCodeTonNpi",
                        smppDetails?.shortCodeTonNpi
                    );
                    formikSmppConfiguration.setFieldValue(
                        "maximumRetry",
                        smppDetails?.maximumRetry
                    );
                    formikSmppConfiguration.setFieldValue(
                        "connectionToOpen",
                        smppDetails?.connectionToOpen
                    );
                    formikSmppConfiguration.setFieldValue(
                        "enquireLink",
                        smppDetails?.enquireLink
                    );
                    formikSmppConfiguration.setFieldValue(
                        "submitPerSecond",
                        smppDetails?.submitPerSecond
                    );
                    formikSmppConfiguration.setFieldValue(
                        "connectionMode",
                        smppDetails?.connectionMode
                    );
                    formikSmppConfiguration.setFieldValue(
                        "switchRegisteredDelivery",
                        smppDetails?.isRegisteredDelivery
                    );
                    formikSmppConfiguration.setFieldValue(
                        "switchCanBind",
                        smppDetails?.canBind
                    );
                    formikSmppConfiguration.setFieldValue(
                        "switchOperator",
                        smppDetails?.isOperatorEncoding
                    );
                    formikSmppConfiguration.setFieldValue(
                        "portAddress",
                        smppDetails?.portAddress
                    );
                }
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const getSmppPass = async (recordGuid) => {
        setLoading(true);
        try {
            let response = await SMPP_CONFIG({
                RecordGuid: recordGuid,
            });

            if (response?.data?.success) {
                let smpp = response?.data?.data?.item;
                formikSmppConfiguration.setFieldValue("smppPassword", smpp?.password);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const theme = useTheme();

    return (
        <Grid container id="Reseller" className="page_container">
            <Grid container sx={{pt: 0}}>
                <Grid item xs={12} sx={{pt: 0}}>
                    <TabContext value={value}>
                        {value == 0 && (
                            <form>
                                <Grid
                                    style={{marginBottom: "10px", marginTop: "8px"}}
                                    container
                                    spacing={3}
                                >
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationMNP.touched[
                                                        "connectivityType"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors[
                                                            "connectivityType"
                                                            ]
                                                    )
                                                }
                                                id="connectivityType"
                                            >
                                                Connectivity Type*
                                            </InputLabel>
                                            <Select
                                                id="connectivityType" // Add an id for accessibility
                                                name="connectivityType" // Name should match the field name in initialValues
                                                onChange={(e) => {
                                                    formikLookupConfigurationMNP.handleChange(e);
                                                    setTempConnectivityType(e?.target?.value);
                                                }}
                                                onBlur={formikLookupConfigurationMNP.handleBlur}
                                                error={
                                                    formikLookupConfigurationMNP.touched[
                                                        "connectivityType"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors[
                                                            "connectivityType"
                                                            ]
                                                    )
                                                }
                                                value={
                                                    formikLookupConfigurationMNP.values.connectivityType
                                                }
                                                labelId="connectivityType"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {connectivityTypeOptions?.map((item, index) => (
                                                    <MenuItem key={index} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationMNP.touched.connectivityType &&
                                            formikLookupConfigurationMNP.errors.connectivityType && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationMNP.errors.connectivityType}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"numberofThreads"}
                                                fullWidth
                                                id={"numberofThreads"}
                                                name={"numberofThreads"}
                                                label={"Number of Threads*"}
                                                variant="standard"
                                                type={"text"}
                                                value={
                                                    formikLookupConfigurationMNP.values["numberofThreads"]
                                                }
                                                onChange={formikLookupConfigurationMNP.handleChange}
                                                onBlur={formikLookupConfigurationMNP.handleBlur}
                                                error={
                                                    formikLookupConfigurationMNP.touched[
                                                        "numberofThreads"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors[
                                                            "numberofThreads"
                                                            ]
                                                    )
                                                }
                                                helperText={
                                                    formikLookupConfigurationMNP.touched[
                                                        "numberofThreads"
                                                        ] &&
                                                    formikLookupConfigurationMNP.errors["numberofThreads"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationMNP.touched[
                                                        "classLocation"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors["classLocation"]
                                                    )
                                                }
                                                id="classLocation"
                                            >
                                                Class location*
                                            </InputLabel>
                                            <Select
                                                id="classLocation" // Add an id for accessibility
                                                name="classLocation" // Name should match the field name in initialValues
                                                onChange={formikLookupConfigurationMNP.handleChange}
                                                onBlur={formikLookupConfigurationMNP.handleBlur}
                                                error={
                                                    formikLookupConfigurationMNP.touched[
                                                        "classLocation"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors["classLocation"]
                                                    )
                                                }
                                                value={
                                                    formikLookupConfigurationMNP.values.classLocation
                                                }
                                                labelId="classLocation"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {classLocationOptions?.map((item, idx) => (
                                                    <MenuItem key={idx} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationMNP.touched.classLocation &&
                                            formikLookupConfigurationMNP.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationMNP.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationMNP.touched["currency"] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors["currency"]
                                                    )
                                                }
                                                id="currency"
                                            >
                                                Currency*
                                            </InputLabel>
                                            <Select
                                                id="currency"
                                                name="currency"
                                                onChange={formikLookupConfigurationMNP.handleChange}
                                                onBlur={formikLookupConfigurationMNP.handleBlur}
                                                error={
                                                    formikLookupConfigurationMNP.touched["currency"] &&
                                                    Boolean(
                                                        formikLookupConfigurationMNP.errors["currency"]
                                                    )
                                                }
                                                value={formikLookupConfigurationMNP.values.currency}
                                                labelId="currency"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {currencyOptions?.map((option, index) => (
                                                    <MenuItem key={index} value={option?.recordGuid}>
                                                        {option?.tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationMNP.touched.classLocation &&
                                            formikLookupConfigurationMNP.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationMNP.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    {formikLookupConfigurationMNP?.values?.connectivityType ===
                                        "HTTP" && (
                                            <>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"host"}
                                                            fullWidth
                                                            id={"host"}
                                                            name={"host"}
                                                            label={"Host*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formikLookupConfigurationMNP.values["host"]}
                                                            onChange={formikLookupConfigurationMNP.handleChange}
                                                            onBlur={formikLookupConfigurationMNP.handleBlur}
                                                            error={
                                                                formikLookupConfigurationMNP.touched["host"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationMNP.errors["host"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationMNP.touched["host"] &&
                                                                formikLookupConfigurationMNP.errors["host"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}

                                    {formikLookupConfigurationMNP.values.connectivityType ===
                                        "ENUM" && (
                                            <>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"host"}
                                                            fullWidth
                                                            id={"host"}
                                                            name={"host"}
                                                            label={"Host*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formikLookupConfigurationMNP.values["host"]}
                                                            onChange={formikLookupConfigurationMNP.handleChange}
                                                            onBlur={formikLookupConfigurationMNP.handleBlur}
                                                            error={
                                                                formikLookupConfigurationMNP.touched["host"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationMNP.errors["host"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationMNP.touched["host"] &&
                                                                formikLookupConfigurationMNP.errors["host"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"port"}
                                                            fullWidth
                                                            id={"port"}
                                                            name={"port"}
                                                            label={"Port*"}
                                                            onInput={(e) => {
                                                                const value = e.target.value;
                                                                e.target.value = value.replace(/[^0-9]/g, "");
                                                            }}
                                                            variant="standard"
                                                            type={"number"}
                                                            value={formikLookupConfigurationMNP.values["port"]}
                                                            onChange={formikLookupConfigurationMNP.handleChange}
                                                            onBlur={formikLookupConfigurationMNP.handleBlur}
                                                            error={
                                                                formikLookupConfigurationMNP.touched["port"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationMNP.errors["port"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationMNP.touched["port"] &&
                                                                formikLookupConfigurationMNP.errors["port"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"queryDns"}
                                                            fullWidth
                                                            id={"queryDns"}
                                                            name={"queryDns"}
                                                            label={"Query DNS"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={
                                                                formikLookupConfigurationMNP.values["queryDns"]
                                                            }
                                                            onChange={formikLookupConfigurationMNP.handleChange}
                                                            onBlur={formikLookupConfigurationMNP.handleBlur}
                                                            error={
                                                                formikLookupConfigurationMNP.touched[
                                                                    "queryDns"
                                                                    ] &&
                                                                Boolean(
                                                                    formikLookupConfigurationMNP.errors["queryDns"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationMNP.touched[
                                                                    "queryDns"
                                                                    ] &&
                                                                formikLookupConfigurationMNP.errors["queryDns"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}
                                </Grid>
                                <Grid
                                    style={{
                                        justifyContent: "end",
                                    }}
                                    container
                                    mt={3}
                                >
                                    <Grid item={12}>
                                        {" "}
                                        <Button
                                            className="mui-btn primary outline"
                                            onClick={() => formikLookupConfigurationMNP?.resetForm()}
                                            disabled={loading}
                                        >
                                            Clear All
                                        </Button>
                                        <Button
                                            className="mui-btn primary filled"
                                            onClick={formikLookupConfigurationMNP?.handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Save Changes"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}

                        {value == 1 && (
                            <form>
                                <Grid
                                    style={{marginBottom: "10px", marginTop: "8px"}}
                                    container
                                    spacing={3}
                                >
                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationHlr.touched[
                                                        "connectivityType"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors[
                                                            "connectivityType"
                                                            ]
                                                    )
                                                }
                                                id="connectivityType"
                                            >
                                                Connectivity Type*
                                            </InputLabel>
                                            <Select
                                                id="connectivityType" // Add an id for accessibility
                                                name="connectivityType" // Name should match the field name in initialValues
                                                onChange={formikLookupConfigurationHlr.handleChange}
                                                onBlur={formikLookupConfigurationHlr.handleBlur}
                                                error={
                                                    formikLookupConfigurationHlr.touched[
                                                        "connectivityType"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors[
                                                            "connectivityType"
                                                            ]
                                                    )
                                                }
                                                value={
                                                    formikLookupConfigurationHlr.values.connectivityType
                                                }
                                                labelId="connectivityType"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {connectivityTypeOptions?.map((item, index) => (
                                                    <MenuItem key={index} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationHlr.touched.connectivityType &&
                                            formikLookupConfigurationHlr.errors.connectivityType && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationHlr.errors.connectivityType}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"numberofThreads"}
                                                fullWidth
                                                id={"numberofThreads"}
                                                name={"numberofThreads"}
                                                label={"Number of Threads*"}
                                                variant="standard"
                                                type={"text"}
                                                value={
                                                    formikLookupConfigurationHlr.values["numberofThreads"]
                                                }
                                                onChange={formikLookupConfigurationHlr.handleChange}
                                                onBlur={formikLookupConfigurationHlr.handleBlur}
                                                error={
                                                    formikLookupConfigurationHlr.touched[
                                                        "numberofThreads"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors[
                                                            "numberofThreads"
                                                            ]
                                                    )
                                                }
                                                helperText={
                                                    formikLookupConfigurationHlr.touched[
                                                        "numberofThreads"
                                                        ] &&
                                                    formikLookupConfigurationHlr.errors["numberofThreads"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationHlr.touched[
                                                        "classLocation"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors["classLocation"]
                                                    )
                                                }
                                                id="classLocation"
                                            >
                                                Class location*
                                            </InputLabel>
                                            <Select
                                                id="classLocation" // Add an id for accessibility
                                                name="classLocation" // Name should match the field name in initialValues
                                                onChange={formikLookupConfigurationHlr.handleChange}
                                                onBlur={formikLookupConfigurationHlr.handleBlur}
                                                error={
                                                    formikLookupConfigurationHlr.touched[
                                                        "classLocation"
                                                        ] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors["classLocation"]
                                                    )
                                                }
                                                value={
                                                    formikLookupConfigurationHlr.values.classLocation
                                                }
                                                labelId="classLocation"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {classLocationOptions?.map((item, index) => (
                                                    <MenuItem key={index} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationHlr.touched.classLocation &&
                                            formikLookupConfigurationHlr.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationHlr.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikLookupConfigurationHlr.touched["currency"] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors["currency"]
                                                    )
                                                }
                                                id="currency"
                                            >
                                                Currency*
                                            </InputLabel>
                                            <Select
                                                id="currency"
                                                name="currency"
                                                onChange={formikLookupConfigurationHlr.handleChange}
                                                onBlur={formikLookupConfigurationHlr.handleBlur}
                                                error={
                                                    formikLookupConfigurationHlr.touched["currency"] &&
                                                    Boolean(
                                                        formikLookupConfigurationHlr.errors["currency"]
                                                    )
                                                }
                                                value={formikLookupConfigurationHlr.values.currency}
                                                labelId="currency"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {currencyOptions?.map((option, index) => (
                                                    <MenuItem key={index} value={option?.recordGuid}>
                                                        {option?.tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikLookupConfigurationHlr.touched.classLocation &&
                                            formikLookupConfigurationHlr.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikLookupConfigurationHlr.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    {formikLookupConfigurationHlr?.values?.connectivityType ===
                                        "HTTP" && (
                                            <>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"host"}
                                                            fullWidth
                                                            id={"host"}
                                                            name={"host"}
                                                            label={"Host*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formikLookupConfigurationHlr.values["host"]}
                                                            onChange={formikLookupConfigurationHlr.handleChange}
                                                            onBlur={formikLookupConfigurationHlr.handleBlur}
                                                            error={
                                                                formikLookupConfigurationHlr.touched["host"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationHlr.errors["host"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationHlr.touched["host"] &&
                                                                formikLookupConfigurationHlr.errors["host"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}

                                    {formikLookupConfigurationHlr.values.connectivityType ===
                                        "ENUM" && (
                                            <>
                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"host"}
                                                            fullWidth
                                                            id={"host"}
                                                            name={"host"}
                                                            label={"Host*"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={formikLookupConfigurationHlr.values["host"]}
                                                            onChange={formikLookupConfigurationHlr.handleChange}
                                                            onBlur={formikLookupConfigurationHlr.handleBlur}
                                                            error={
                                                                formikLookupConfigurationHlr.touched["host"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationHlr.errors["host"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationHlr.touched["host"] &&
                                                                formikLookupConfigurationHlr.errors["host"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"port"}
                                                            fullWidth
                                                            id={"port"}
                                                            name={"port"}
                                                            label={"Port*"}
                                                            onInput={(e) => {
                                                                const value = e.target.value;
                                                                e.target.value = value.replace(/[^0-9]/g, "");
                                                            }}
                                                            variant="standard"
                                                            type={"number"}
                                                            value={formikLookupConfigurationHlr.values["port"]}
                                                            onChange={formikLookupConfigurationHlr.handleChange}
                                                            onBlur={formikLookupConfigurationHlr.handleBlur}
                                                            error={
                                                                formikLookupConfigurationHlr.touched["port"] &&
                                                                Boolean(
                                                                    formikLookupConfigurationHlr.errors["port"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationHlr.touched["port"] &&
                                                                formikLookupConfigurationHlr.errors["port"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <TextField
                                                            key={"queryDns"}
                                                            fullWidth
                                                            id={"queryDns"}
                                                            name={"queryDns"}
                                                            label={"Query DNS"}
                                                            variant="standard"
                                                            type={"text"}
                                                            value={
                                                                formikLookupConfigurationHlr.values["queryDns"]
                                                            }
                                                            onChange={formikLookupConfigurationHlr.handleChange}
                                                            onBlur={formikLookupConfigurationHlr.handleBlur}
                                                            error={
                                                                formikLookupConfigurationHlr.touched[
                                                                    "queryDns"
                                                                    ] &&
                                                                Boolean(
                                                                    formikLookupConfigurationHlr.errors["queryDns"]
                                                                )
                                                            }
                                                            helperText={
                                                                formikLookupConfigurationHlr.touched[
                                                                    "queryDns"
                                                                    ] &&
                                                                formikLookupConfigurationHlr.errors["queryDns"]
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                        )}
                                </Grid>
                                <Grid
                                    style={{
                                        justifyContent: "end",
                                    }}
                                    container
                                    mt={3}
                                >
                                    <Grid item={12}>
                                        <Button
                                            className="mui-btn primary outline"
                                            onClick={() => formikLookupConfigurationHlr?.resetForm()}
                                            disabled={loading}
                                        >
                                            Clear All
                                        </Button>
                                        <Button
                                            className="mui-btn primary filled"
                                            onClick={formikLookupConfigurationHlr?.handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Save Changes"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}

                        {value == 2 && (
                            <form>
                                <Grid
                                    style={{marginBottom: "10px", marginTop: "8px"}}
                                    container
                                    spacing={3}
                                >
                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smtpServer"}
                                                fullWidth
                                                id={"smtpServer"}
                                                name={"smtpServer"}
                                                label={"Server*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmtpConfiguration.values["smtpServer"]}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["smtpServer"] &&
                                                    Boolean(formikSmtpConfiguration.errors["smtpServer"])
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["smtpServer"] &&
                                                    formikSmtpConfiguration.errors["smtpServer"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smtpUser"}
                                                fullWidth
                                                id={"smtpUser"}
                                                name={"smtpUser"}
                                                label={"Username*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmtpConfiguration.values["smtpUser"]}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["smtpUser"] &&
                                                    Boolean(formikSmtpConfiguration.errors["smtpUser"])
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["smtpUser"] &&
                                                    formikSmtpConfiguration.errors["smtpUser"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smtpPassword"}
                                                fullWidth
                                                id={"smtpPassword"}
                                                name={"smtpPassword"}
                                                label={"Password*"}
                                                variant="standard"
                                                value={formikSmtpConfiguration.values["smtpPassword"]}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["smtpPassword"] &&
                                                    Boolean(
                                                        formikSmtpConfiguration.errors["smtpPassword"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["smtpPassword"] &&
                                                    formikSmtpConfiguration.errors["smtpPassword"]
                                                }
                                                type={showPassword ? "text" : "password"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockOpen/>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff/>
                                                                ) : (
                                                                    <Visibility/>
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smtpPort"}
                                                fullWidth
                                                id={"smtpPort"}
                                                name={"smtpPort"}
                                                label={"Port*"}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, "");
                                                }}
                                                variant="standard"
                                                type={"number"}
                                                value={formikSmtpConfiguration.values.smtpPort}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["smtpPort"] &&
                                                    Boolean(formikSmtpConfiguration.errors["smtpPort"])
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["smtpPort"] &&
                                                    formikSmtpConfiguration.errors["smtpPort"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"fromAddress"}
                                                fullWidth
                                                id={"fromAddress"}
                                                name={"fromAddress"}
                                                label={"From Address*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmtpConfiguration.values["fromAddress"]}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["fromAddress"] &&
                                                    Boolean(formikSmtpConfiguration.errors["fromAddress"])
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["fromAddress"] &&
                                                    formikSmtpConfiguration.errors["fromAddress"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"replyAddress"}
                                                fullWidth
                                                id={"replyAddress"}
                                                name={"replyAddress"}
                                                label={"Reply Address*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmtpConfiguration.values["replyAddress"]}
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["replyAddress"] &&
                                                    Boolean(
                                                        formikSmtpConfiguration.errors["replyAddress"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmtpConfiguration.touched["replyAddress"] &&
                                                    formikSmtpConfiguration.errors["replyAddress"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikSmtpConfiguration.touched["currency"] &&
                                                    Boolean(formikSmtpConfiguration.errors["currency"])
                                                }
                                                id="currency"
                                            >
                                                Currency*
                                            </InputLabel>
                                            <Select
                                                id="currency"
                                                name="currency"
                                                onChange={formikSmtpConfiguration.handleChange}
                                                onBlur={formikSmtpConfiguration.handleBlur}
                                                error={
                                                    formikSmtpConfiguration.touched["currency"] &&
                                                    Boolean(formikSmtpConfiguration.errors["currency"])
                                                }
                                                value={formikSmtpConfiguration.values.currency}
                                                labelId="currency"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {currencyOptions?.map((option, index) => (
                                                    <MenuItem key={index} value={option?.recordGuid}>
                                                        {option?.tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikSmtpConfiguration.touched.classLocation &&
                                            formikSmtpConfiguration.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikSmtpConfiguration.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} lg={3}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                marginBottom: "8px",
                                                // marginTop: "15px",
                                            }}
                                        >
                      <span style={{color: "#B3B3B3", fontSize: "15px"}}>
                        SMTP SSL{" "}
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            formikSmtpConfiguration?.values?.smtpSwitch
                                                        }
                                                        onChange={() =>
                                                            formikSmtpConfiguration?.setFieldValue(
                                                                "smtpSwitch",
                                                                !formikSmtpConfiguration?.values?.smtpSwitch
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid
                                    style={{
                                        justifyContent: "end",
                                    }}
                                    container
                                    mt={3}
                                >
                                    <Grid item={12}>
                                        {" "}
                                        <Button
                                            className="mui-btn primary outline"
                                            onClick={() => formikSmtpConfiguration?.resetForm()}
                                            disabled={loading}
                                        >
                                            Clear All
                                        </Button>
                                        <Button
                                            className="mui-btn primary filled"
                                            onClick={formikSmtpConfiguration?.handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Save Changes"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}

                        {value == 3 && (
                            <form>
                                <Grid
                                    style={{marginBottom: "10px", marginTop: "8px"}}
                                    container
                                    spacing={3}
                                >
                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smppUser"}
                                                fullWidth
                                                id={"smppUser"}
                                                name={"smppUser"}
                                                label={"Username*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["smppUser"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["smppUser"] &&
                                                    Boolean(formikSmppConfiguration.errors["smppUser"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["smppUser"] &&
                                                    formikSmppConfiguration.errors["smppUser"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"smppPassword"}
                                                fullWidth
                                                id={"smppPassword"}
                                                name={"smppPassword"}
                                                label={"Password*"}
                                                variant="standard"
                                                value={formikSmppConfiguration.values["smppPassword"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["smppPassword"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["smppPassword"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["smppPassword"] &&
                                                    formikSmppConfiguration.errors["smppPassword"]
                                                }
                                                type={showPassword ? "text" : "password"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockOpen/>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff/>
                                                                ) : (
                                                                    <Visibility/>
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"ipAddress"}
                                                fullWidth
                                                id={"ipAddress"}
                                                name={"ipAddress"}
                                                label={"IP Address*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["ipAddress"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["ipAddress"] &&
                                                    Boolean(formikSmppConfiguration.errors["ipAddress"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["ipAddress"] &&
                                                    formikSmppConfiguration.errors["ipAddress"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"portAddress"}
                                                fullWidth
                                                id={"portAddress"}
                                                name={"portAddress"}
                                                label={"Port*"}
                                                variant="standard"
                                                type={"number"}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    e.target.value = value.replace(/[^0-9]/g, "");
                                                }}
                                                value={formikSmppConfiguration.values?.portAddress}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["portAddress"] &&
                                                    Boolean(formikSmppConfiguration.errors["portAddress"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["portAddress"] &&
                                                    formikSmppConfiguration.errors["portAddress"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"sourceTon"}
                                                fullWidth
                                                id={"sourceTon"}
                                                name={"sourceTon"}
                                                label={"Source Ton"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["sourceTon"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["sourceTon"] &&
                                                    Boolean(formikSmppConfiguration.errors["sourceTon"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["sourceTon"] &&
                                                    formikSmppConfiguration.errors["sourceTon"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"sourceNPI"}
                                                fullWidth
                                                id={"sourceNPI"}
                                                name={"sourceNPI"}
                                                label={"Source NPI"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["sourceNPI"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["sourceNPI"] &&
                                                    Boolean(formikSmppConfiguration.errors["sourceNPI"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["sourceNPI"] &&
                                                    formikSmppConfiguration.errors["sourceNPI"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"destinationTon"}
                                                fullWidth
                                                id={"destinationTon"}
                                                name={"destinationTon"}
                                                label={"Destination TON"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["destinationTon"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["destinationTon"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["destinationTon"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["destinationTon"] &&
                                                    formikSmppConfiguration.errors["destinationTon"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"destinationNPI"}
                                                fullWidth
                                                id={"destinationNPI"}
                                                name={"destinationNPI"}
                                                label={"Destination NPI"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["destinationNPI"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["destinationNPI"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["destinationNPI"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["destinationNPI"] &&
                                                    formikSmppConfiguration.errors["destinationNPI"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"shortCodeTonNpi"}
                                                fullWidth
                                                id={"shortCodeTonNpi"}
                                                name={"shortCodeTonNpi"}
                                                label={"ShortCode Ton Npi*"}
                                                variant="standard"
                                                type={"text"}
                                                value={
                                                    formikSmppConfiguration.values["shortCodeTonNpi"]
                                                }
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["shortCodeTonNpi"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["shortCodeTonNpi"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["shortCodeTonNpi"] &&
                                                    formikSmppConfiguration.errors["shortCodeTonNpi"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"maximumRetry"}
                                                fullWidth
                                                id={"maximumRetry"}
                                                name={"maximumRetry"}
                                                label={"Maximum Retry*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["maximumRetry"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["maximumRetry"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["maximumRetry"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["maximumRetry"] &&
                                                    formikSmppConfiguration.errors["maximumRetry"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"connectionToOpen"}
                                                fullWidth
                                                id={"connectionToOpen"}
                                                name={"connectionToOpen"}
                                                label={"Connection To Open*"}
                                                variant="standard"
                                                type={"text"}
                                                value={
                                                    formikSmppConfiguration.values["connectionToOpen"]
                                                }
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["connectionToOpen"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["connectionToOpen"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["connectionToOpen"] &&
                                                    formikSmppConfiguration.errors["connectionToOpen"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"enquireLink"}
                                                fullWidth
                                                id={"enquireLink"}
                                                name={"enquireLink"}
                                                label={"Enquire Link*"}
                                                variant="standard"
                                                type={"text"}
                                                value={formikSmppConfiguration.values["enquireLink"]}
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["enquireLink"] &&
                                                    Boolean(formikSmppConfiguration.errors["enquireLink"])
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["enquireLink"] &&
                                                    formikSmppConfiguration.errors["enquireLink"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <TextField
                                                key={"submitPerSecond"}
                                                fullWidth
                                                id={"submitPerSecond"}
                                                name={"submitPerSecond"}
                                                label={"Submit Per Second*"}
                                                variant="standard"
                                                type={"text"}
                                                value={
                                                    formikSmppConfiguration.values["submitPerSecond"]
                                                }
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["submitPerSecond"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["submitPerSecond"]
                                                    )
                                                }
                                                helperText={
                                                    formikSmppConfiguration.touched["submitPerSecond"] &&
                                                    formikSmppConfiguration.errors["submitPerSecond"]
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikSmppConfiguration.touched["connectionMode"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["connectionMode"]
                                                    )
                                                }
                                                id="connectionMode"
                                            >
                                                Connection Mode*
                                            </InputLabel>
                                            <Select
                                                id="connectionMode" // Add an id for accessibility
                                                name="connectionMode" // Name should match the field name in initialValues
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["connectionMode"] &&
                                                    Boolean(
                                                        formikSmppConfiguration.errors["connectionMode"]
                                                    )
                                                }
                                                value={formikSmppConfiguration.values.connectionMode}
                                                labelId="connectionMode"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {connectionModeOptions?.map((item, index) => (
                                                    <MenuItem key={index} value={item?.value}>
                                                        {item?.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikSmppConfiguration.touched.connectionMode &&
                                            formikSmppConfiguration.errors.connectionMode && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikSmppConfiguration.errors.connectionMode}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel
                                                error={
                                                    formikSmppConfiguration.touched["currency"] &&
                                                    Boolean(formikSmppConfiguration.errors["currency"])
                                                }
                                                id="currency"
                                            >
                                                Currency*
                                            </InputLabel>
                                            <Select
                                                id="currency"
                                                name="currency"
                                                onChange={formikSmppConfiguration.handleChange}
                                                onBlur={formikSmppConfiguration.handleBlur}
                                                error={
                                                    formikSmppConfiguration.touched["currency"] &&
                                                    Boolean(formikSmppConfiguration.errors["currency"])
                                                }
                                                value={formikSmppConfiguration.values.currency}
                                                labelId="currency"
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {currencyOptions?.map((option, index) => (
                                                    <MenuItem key={index} value={option?.recordGuid}>
                                                        {option?.tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {formikSmppConfiguration.touched.classLocation &&
                                            formikSmppConfiguration.errors.classLocation && (
                                                <FormHelperText
                                                    style={{color: theme?.palette?.error?.main}}
                                                >
                                                    {formikSmppConfiguration.errors.classLocation}
                                                </FormHelperText>
                                            )}
                                    </Grid>

                                    {/* <Grid item xs={4} /> */}
                                    <Grid item xs={4}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                marginBottom: "8px",
                                                marginTop: "15px",
                                            }}
                                        >
                      <span style={{color: "#B3B3B3", fontSize: "15px"}}>
                        Is Registered Delivery{" "}
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            formikSmppConfiguration?.values
                                                                ?.switchRegisteredDelivery
                                                        }
                                                        onChange={() =>
                                                            formikSmppConfiguration?.setFieldValue(
                                                                "switchRegisteredDelivery",
                                                                !formikSmppConfiguration?.values
                                                                    ?.switchRegisteredDelivery
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                marginBottom: "8px",
                                                marginTop: "15px",
                                            }}
                                        >
                      <span style={{color: "#B3B3B3", fontSize: "15px"}}>
                        Can Bind{" "}
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            formikSmppConfiguration?.values?.switchCanBind
                                                        }
                                                        onChange={() =>
                                                            formikSmppConfiguration?.setFieldValue(
                                                                "switchCanBind",
                                                                !formikSmppConfiguration?.values?.switchCanBind
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                marginBottom: "8px",
                                                marginTop: "15px",
                                            }}
                                        >
                      <span style={{color: "#B3B3B3", fontSize: "15px"}}>
                        Operator Encoding{" "}
                      </span>
                                            <br/>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={
                                                            formikSmppConfiguration?.values?.switchOperator
                                                        }
                                                        onChange={() =>
                                                            formikSmppConfiguration?.setFieldValue(
                                                                "switchOperator",
                                                                !formikSmppConfiguration?.values?.switchOperator
                                                            )
                                                        }
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid
                                    style={{
                                        justifyContent: "end",
                                    }}
                                    container
                                    mt={3}
                                >
                                    <Grid item={12}>
                                        <Button
                                            className="mui-btn primary outline"
                                            onClick={() => formikSmppConfiguration?.resetForm()}
                                            disabled={loading}
                                        >
                                            Clear All
                                        </Button>
                                        <Button
                                            className="mui-btn primary filled"
                                            onClick={formikSmppConfiguration?.handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Loading..." : "Save Changes"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </TabContext>
                </Grid>
            </Grid>

            {/* {openMessageAlert && (
        <MuiModal
          title="Configurations"
          open={openMessageAlert}
          width="500px"
          id="edit-contact-form"
          handleClose={() => setOpenMessageAlert(false)}
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
                Configurations have been updated successfully
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
                  history?.push("/providers/providers-management");
                  setOpenMessageAlert(false);
                }}
                className="mui-btn secondary filled"
                id="send-service-provider-id"
                disabled={loading}
              >
                Later
              </Button>
              <Button
                onClick={() => {
                  setOpenMessageAlert(false);
                }}
                className="mui-btn primary filled"
                id="send-service-provider-id"
                disabled={loading}
              >
                Continue Editing
              </Button>
            </Grid>
          </Grid>
        </MuiModal>
      )} */}
        </Grid>
    );
};

export default withTranslation("translation")(AddProviderConfig);
