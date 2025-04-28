import {Button, FormControl, Grid, TextField} from "@mui/material";
import {useFormik} from "formik";
import React, {useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ADD_RATE} from "../../../APIs/Rates";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {handleMessageError} from "../../Utils/Functions";
import addValidationSchema from "./addValidation";

function ManageMissingRates({
                                type,
                                loading,
                                setLoading,
                                clientCategoryOptions,
                                setManageAddRate,
                                serviceGuid,
                                channelGuid,
                                getAllRates,
                                selectedRate,
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
            formik.setFieldValue("rate", value);
        }
    };

    const formik = useFormik({
        initialValues: {
            clientCategory: "",
            country: "",
            currency: "",
            operator: "",
        },
        validationSchema: type == addValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let data = {
                    ServiceGuid: serviceGuid,
                    ChannelGuid: channelGuid,
                    OperatorGuid: selectedRate?.operatorGuid,
                    CountryGuid: selectedRate?.countryGuid,
                    CurrencyCode: selectedRate?.currencyCode,
                    OperationTypeTag: "GENERAL",
                    ClientCategoryGuid: selectedRate?.clientCategoryGuid,
                    IsDefault: true,
                    Rate: values?.rate,
                };

                let response = await ADD_RATE({postData: data});
                if (response?.data?.success) {
                    showSnackbar("Rate Added Successfully!");
                    setManageAddRate(false);
                    getAllRates();
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
                        value={selectedRate.clientCategoryName}
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
                        value={selectedRate.country}
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
                        value={selectedRate.currency}
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
                        value={selectedRate.operator}
                        disabled={true}
                    />
                </Grid>

                <Grid item xs={12} sx={{marginTop: "10px"}}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"rate"}
                            fullWidth
                            id={"rate"}
                            name={"rate"}
                            label={"Rate *"}
                            variant="standard"
                            type="text"
                            value={formik?.values?.rate}
                            onChange={handleNumberChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rate && Boolean(formik.errors.rate)}
                            helperText={formik.touched.rate && formik.errors.rate}
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
                        id="add-rate"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default withTranslation("translations")(ManageMissingRates);
