import {Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField,} from "@mui/material";
import {useFormik} from "formik";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ADD_EXCHANGERATE, EDIT_EXCHANGERATE,} from "../../../APIs/ExchangeRate";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import {getCurrenciesData, handleMessageError} from "../../Utils/Functions";
import addValidationSchema from "./addValidation";

function ManageExchangeRate({
                                type,
                                loading,
                                setLoading,
                                setManageAddExchangeRate,
                                getAllExchangeRates,
                                setSelectedExchangeRate,
                                selectedExchangeRate,
                            }) {
    const {showSnackbar} = useSnackbar();
    const {token} = useSelector((state) => state.authentication);
    const [randomValue, setRandomValue] = useState("");
    const [currencyOptions, setCurrencyOptions] = useState([]);


    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue(e.target.name, value);
        }
    };

    const formik = useFormik({
        initialValues: {
            currency: "",
            currentRate: "",
            currentRateInverse: "",
        },
        validationSchema: addValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let data = {};
                if (type == "add") {
                    data = {
                        CurrencyGuid: values.currency,
                        Rate: values.currentRate,
                        CurrentRateInverse: values.currentRateInverse,
                    };
                } else {
                    data = {
                        CurrencyGuid: values.currency,
                        CurrentRate: values.currentRate,
                        CurrentRateInverse: values.currentRateInverse,
                        ExchangeRateGuid: selectedExchangeRate?.recordGuid,
                    };
                }

                let response =
                    type == "add"
                        ? await ADD_EXCHANGERATE({postData: data})
                        : await EDIT_EXCHANGERATE({postData: data});


                if (response?.data?.success) {
                    showSnackbar(response?.data?.message, "success");
                    setManageAddExchangeRate(false);
                    getAllExchangeRates();
                } else {
                    showSnackbar(response?.data?.message, "error");
                }
            } catch (e) {
                console.error("Error adding exchange rate:", e);
                showSnackbar(handleMessageError({e, type: "validation"}), "error");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (selectedExchangeRate) {
            formik?.setFieldValue(
                "currency",
                selectedExchangeRate?.currencyRecordGuid
            );
            formik?.setFieldValue("currentRate", selectedExchangeRate?.currentRate);
            formik?.setFieldValue(
                "currentRateInverse",
                selectedExchangeRate?.currentRateInverse
            );
        }
    }, [selectedExchangeRate]);

    useEffect(() => {
        getCurrenciesData(token)
            .then((currency) => {
                if (currency && Array.isArray(currency)) {
                    setCurrencyOptions(currency);
                } else {
                    console.error("Currency data is not in the expected format.");
                }
            })
            .catch((error) => {
                console.error("Error fetching currency data: ", error);
            });
    }, [token]);

    function isPositiveNumber(value) {
        if (/^\d*\.?\d+$/.test(value) && parseFloat(value) > 0) {
            formik.setFieldValue("currentRate", value);
            formik.setFieldValue("currentRateInverse", 1 / value);
        }
        if (value === "") {
            formik.setFieldValue("currentRate", "");
            formik.setFieldValue("currentRateInverse", "");
        }
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container>
                <Grid item xs={12} key={randomValue} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        sx={{m: 0, minWidth: 250}}
                        error={formik.touched.currency && Boolean(formik.errors.currency)}
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Currency *
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="currency"
                            name="currency"
                            disabled={type !== "add"}
                            onChange={formik.handleChange}
                            value={formik.values.currency}
                            label="Select Payment Type"
                        >
                            {currencyOptions.map((option, index) => (
                                <MenuItem key={index} value={option.recordGuid}>
                                    {option.tag}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.currency && formik.errors.currency && (
                            <FormHelperText>{formik.errors.currency}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{marginTop: "10px"}}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key="currentRate"
                            fullWidth
                            id="currentRate"
                            name="currentRate"
                            label="Current Rate *"
                            variant="standard"
                            type="text"
                            value={formik.values.currentRate}
                            onChange={(e) => isPositiveNumber(e.target.value)}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.currentRate && Boolean(formik.errors.currentRate)
                            }
                            helperText={
                                formik.touched.currentRate && formik.errors.currentRate
                            }
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{marginTop: "10px"}}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key="currentRateInverse"
                            fullWidth
                            id="currentRateInverse"
                            name="currentRateInverse"
                            label="Rate Inverse *"
                            variant="standard"
                            type="text"
                            value={formik.values.currentRateInverse}
                            onChange={handleNumberChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.currentRateInverse &&
                                Boolean(formik.errors.currentRateInverse)
                            }
                            helperText={
                                formik.touched.currentRateInverse &&
                                formik.errors.currentRateInverse
                            }
                        />
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{marginTop: "20px"}}
                    display="flex"
                    justifyContent="end"
                    alignItems="center"
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

export default withTranslation("translations")(ManageExchangeRate);
