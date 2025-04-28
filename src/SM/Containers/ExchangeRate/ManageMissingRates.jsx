import {Button, FormControl, Grid, TextField} from "@mui/material";
import {useFormik} from "formik";
import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ADD_EXCHANGERATE} from "../../../APIs/ExchangeRates";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../Utils/Functions";
import addValidationSchema from "./addValidation";

function ManageMissingExchangeRates({
                                        type,
                                        loading,
                                        setLoading,
                                        clientCategoryOptions,
                                        setManageAddExchangeRate,
                                        serviceGuid,
                                        channelGuid,
                                        getAllExchangeRates,
                                        selectedExchangeRate
                                    }) {
    const {showSnackbar} = useSnackbar();
    const {token} = useSelector((state) => state.authentication);
    const [randomValue, setRandomValue] = useState("");
    const [countries, SetCountries] = useState([]);
    const [operatorOption, setOperatorOption] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);


    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("exchangerate", value);
        }
    };

    const formik = useFormik({
        initialValues: {
            clientCategory: "",
            country: "",
            currency: "",
            operator: ""
        },
        validationSchema:
            type == addValidationSchema,
        onSubmit: async (values) => {

            setLoading(true);
            try {
                let data = {
                    ServiceGuid: serviceGuid,
                    ChannelGuid: channelGuid,
                    OperatorGuid: selectedExchangeRate?.operatorGuid,
                    CountryGuid: selectedExchangeRate?.countryGuid,
                    CurrencyCode: selectedExchangeRate?.currencyCode,
                    OperationTypeTag: "GENERAL",
                    ClientCategoryGuid: selectedExchangeRate?.clientCategoryGuid,
                    IsDefault: true,
                    ExchangeRate: values?.exchangerate,
                };

                let response = await ADD_EXCHANGERATE({postData: data});
                if (response?.data?.success) {
                    showSnackbar("ExchangeRate Added Successfully!");
                    setManageAddExchangeRate(false);
                    getAllExchangeRates();
                }
            } catch (e) {
                showSnackbar(handleMessageError({e, type: "validation"}), "error");
            } finally {
                setLoading(false);
            }

        },
    });

    return (
        <form onSubmit={formik?.handleSubmit}>
            <Grid container>


                <Grid item xs={12}>
                    <TextField
                        key={"clientCategory"}
                        fullWidth
                        id={"clientCategory"}
                        name={"clientCategory"}
                        label={"Client Category"}
                        variant="standard"
                        type="text"
                        value={selectedExchangeRate.clientCategoryName}
                        disabled={true}
                    />
                </Grid>

                <Grid item xs={12} sx={{marginTop: "20px"}}>
                    <TextField
                        key={"country"}
                        fullWidth
                        id={"country"}
                        name={"country"}
                        label={"Country"}
                        variant="standard"
                        type="text"
                        value={selectedExchangeRate.country}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} key={randomValue} sx={{marginTop: "20px"}}>
                    <TextField
                        key={"currency"}
                        fullWidth
                        id={"currency"}
                        name={"currency"}
                        label={"Currency"}
                        variant="standard"
                        type="text"
                        value={selectedExchangeRate.currency}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={12} sx={{marginTop: "20px"}}>
                    <TextField
                        key={"operator"}
                        fullWidth
                        id={"operator"}
                        name={"operator"}
                        label={"Operator"}
                        variant="standard"
                        type="text"
                        value={selectedExchangeRate.operator}
                        disabled={true}
                    />
                </Grid>

                <Grid item xs={12} sx={{marginTop: "10px"}}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"exchangerate"}
                            fullWidth
                            id={"exchangerate"}
                            name={"exchangerate"}
                            label={"ExchangeRate *"}
                            variant="standard"
                            type="text"
                            value={formik?.values?.exchangerate}
                            onChange={handleNumberChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.exchangerate && Boolean(formik.errors.exchangerate)}
                            helperText={formik.touched.exchangerate && formik.errors.exchangerate}
                        />
                    </FormControl>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sx={{marginTop: "20px"}}
                    display={"flex"}
                    justifyContent={"end"}
                    alignItems={"center"}
                >
                    <Button
                        type="submit"
                        className="mui-btn primary filled"
                        id="add-exchangerate"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default withTranslation("translations")(ManageMissingExchangeRates);
