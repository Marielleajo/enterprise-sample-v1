import {Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField,} from "@mui/material";
import {useFormik} from "formik";
import React from "react";
import {withTranslation} from "react-i18next";
import * as Yup from "yup";
//   import { ADD_INDUSTRY, UPDATE_INDUSTRY } from "../../../APIs/Industry";
import {useSelector} from "react-redux";

import {ADD_FEE, UPDATE_FEE} from "../../../../APIs/EWallet.jsx";
import {useSnackbar} from "../../../../Contexts/SnackbarContext.jsx";
import {handleMessageError} from "../../../Utils/Functions.jsx";

function ManageFees({
                        isEdit,
                        loading,
                        setLoading,
                        setManageAdd,
                        setManageEdit,
                        getAllFees,
                        selectedFee,
                        countries,
                        currencies,
                        feeCategoryChoices,
                        handleCancel,
                        FeeType
                    }) {
    const {showSnackbar} = useSnackbar();

    const {language} = useSelector((state) => state?.system);
    const IndustryValidationSchema = Yup.object({
        Name: Yup.string().required("Name is required"),
        MinValue: Yup.number()
            .required("Minimum value is required")
            .test(
                "lessThanMaxValue",
                "Minimum value should be less than maximum value",
                function (value) {
                    return value < this.parent.MaxValue;
                }
            ),
        MaxValue: Yup.number()
            .required("Maximum value is required")
            .test(
                "greaterThanMinValue",
                "Maximum value should be greater than minimum value",
                function (value) {
                    return value > this.parent.MinValue;
                }
            ),
        SourceCountryId: Yup.string().required("Source Country is required"),
        DestinationCountryId: Yup.string().required(
            "Destination Country is required"
        ),
        SourceCurrencyId: Yup.string().required("Source Currency is required"),
        DestinationCurrencyId: Yup.string().required(
            "Destination Currency is required"
        ),
        FeeCurrencyId: Yup.string().required("Fee Currency is required"),
        FeePercentage: Yup.number()
            .required("Fee Percentage is required")
            .min(0, "Fee Percentage must be at least 0")
            .max(100, "Fee Percentage must be at most 100"),
        FeeTypeId: Yup.string().required("FeeType is required"),
        FeeCategoryId: Yup.string().required("FeeCategory is required"),
    });

    const formik = useFormik({
        initialValues: {
            Name: !isEdit ? "" : selectedFee?.name || "",
            MinValue: !isEdit ? "" : selectedFee?.minValue || "",
            MaxValue: !isEdit ? "" : selectedFee?.maxValue || "",
            SourceCountryId: !isEdit ? "" : selectedFee?.sourceCountryId || "",
            DestinationCountryId:
                !isEdit ? "" : selectedFee?.destinationCountryId || "",
            SourceCurrencyId:
                !isEdit ? "" : selectedFee?.sourceCurrencyId || "",
            DestinationCurrencyId:
                !isEdit ? "" : selectedFee?.destinationCurrencyId || "",
            FeeCurrencyId: !isEdit ? "" : selectedFee?.feeCurrencyId || "",
            FeePercentage: !isEdit ? "" : selectedFee?.feePercentage || "",
            FeeTypeId: !isEdit ? FeeType?.tag : selectedFee?.tag || "", // need the send feetypeid
            FeeCategoryId: !isEdit ? "" : selectedFee?.feeCategoryId || "",
        },
        validationSchema: IndustryValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                let data = {
                    ...values,
                    FeeValue: null,
                };

                let editData = {
                    RecordGuid: selectedFee?.recordGuid,
                    ...values,
                };
                let response;
                if (!isEdit) {
                    response = await ADD_FEE({postData: data});
                } else {
                    response = await UPDATE_FEE({
                        postData: editData,
                    });
                }
                if (response?.data?.success) {
                    if (!isEdit) {
                        showSnackbar("Fee Added Successfully!");
                        setManageAdd(false);
                    } else {
                        showSnackbar("Fee Updated Successfully!");
                        setManageEdit(false);
                    }
                    getAllFees();
                }
            } catch (e) {
                showSnackbar(handleMessageError({e, type: "validation"}), "error");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl fullWidth variant="standard">
                        <TextField
                            key="Name"
                            id="Name"
                            name="Name"
                            label="Name *"
                            variant="standard"
                            value={formik.values.Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.Name && formik.errors.Name}
                            error={formik.touched.Name && Boolean(formik.errors.Name)}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth variant="standard">
                        <TextField
                            key="MaxValue"
                            id="MaxValue"
                            name="MaxValue"
                            label="Maximum Value *"
                            variant="standard"
                            inputProps={{step: "1", min: "0"}}
                            type="number"
                            value={formik.values.MaxValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.MaxValue && formik.errors.MaxValue}
                            error={formik.touched.MaxValue && Boolean(formik.errors.MaxValue)}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth variant="standard">
                        <TextField
                            key="MinValue"
                            id="MinValue"
                            name="MinValue"
                            label="Minimum Value *"
                            inputProps={{step: "1", min: "0"}}
                            variant="standard"
                            type="number"
                            value={formik.values.MinValue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.MinValue && formik.errors.MinValue}
                            error={formik.touched.MinValue && Boolean(formik.errors.MinValue)}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth variant="standard">
                        <TextField
                            key="FeePercentage"
                            id="FeePercentage"
                            name="FeePercentage"
                            label="Fee Percentage *"
                            inputProps={{step: "1", min: "0", max: "100"}}
                            variant="standard"
                            type="number"
                            value={formik.values.FeePercentage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={
                                formik.touched.FeePercentage && formik.errors.FeePercentage
                            }
                            error={
                                formik.touched.FeePercentage &&
                                Boolean(formik.errors.FeePercentage)
                            }
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        error={
                            formik.touched.SourceCountryId &&
                            Boolean(formik.errors.SourceCountryId)
                        }
                    >
                        <InputLabel id="SourceCountryId-label">Source Country *</InputLabel>
                        <Select
                            key="SourceCountryId"
                            id="SourceCountryId"
                            name="SourceCountryId"
                            label="SourceCountryId"
                            labelId="SourceCountryId-label"
                            onChange={(e) => {
                                formik.setFieldValue("SourceCountryId", e.target.value);
                            }}
                            value={formik.values.SourceCountryId}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {countries?.map((country) => (
                                <MenuItem key={country.recordGuid} value={country.recordGuid}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.SourceCountryId &&
                            formik.errors.SourceCountryId && (
                                <FormHelperText>{formik.errors.SourceCountryId}</FormHelperText>
                            )}
                    </FormControl>
                </Grid>
                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        error={
                            formik.touched.DestinationCountryId &&
                            Boolean(formik.errors.DestinationCountryId)
                        }
                    >
                        <InputLabel id="DestinationCountryId-label">
                            Destination Country *
                        </InputLabel>
                        <Select
                            key="DestinationCountryId"
                            id="DestinationCountryId"
                            name="DestinationCountryId"
                            label="DestinationCountryId"
                            labelId="DestinationCountryId-label"
                            onChange={(e) => {
                                formik.setFieldValue("DestinationCountryId", e.target.value);
                            }}
                            value={formik.values.DestinationCountryId}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {countries?.map((country) => (
                                <MenuItem key={country.recordGuid} value={country.recordGuid}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.DestinationCountryId &&
                            formik.errors.DestinationCountryId && (
                                <FormHelperText>
                                    {formik.errors.DestinationCountryId}
                                </FormHelperText>
                            )}
                    </FormControl>
                </Grid>

                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        sx={{m: 0}}
                        id="SourceCurrencyId"
                        name="SourceCurrencyId"
                        error={
                            formik.touched["SourceCurrencyId"] &&
                            Boolean(formik.errors["SourceCurrencyId"])
                        }
                        helperText={
                            formik.touched["SourceCurrencyId"] &&
                            formik.errors["SourceCurrencyId"]
                        }
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Source Currency *
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="SourceCurrencyId"
                            name="SourceCurrencyId"
                            onChange={(e) => {
                                formik.setFieldValue("SourceCurrencyId", e.target.value);
                            }}
                            value={formik.values.SourceCurrencyId}
                            label="Source Currency"
                            error={
                                formik.touched["SourceCurrencyId"] &&
                                Boolean(formik.errors["SourceCurrencyId"])
                            }
                            helperText={
                                formik.touched["SourceCurrencyId"] &&
                                formik.errors["SourceCurrencyId"]
                            }
                        >
                            {currencies?.map((option, index) => (
                                <MenuItem key={index} value={option?.recordGuid}>
                                    {option?.tag}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.SourceCurrencyId &&
                            formik.errors.SourceCurrencyId && (
                                <FormHelperText>
                                    {formik.errors.SourceCurrencyId}
                                </FormHelperText>
                            )}
                    </FormControl>
                </Grid>
                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        sx={{m: 0}}
                        id="DestinationCurrencyId"
                        name="DestinationCurrencyId"
                        error={
                            formik.touched["DestinationCurrencyId"] &&
                            Boolean(formik.errors["DestinationCurrencyId"])
                        }
                        helperText={
                            formik.touched["DestinationCurrencyId"] &&
                            formik.errors["DestinationCurrencyId"]
                        }
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Destination Currency *
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="DestinationCurrencyId"
                            name="DestinationCurrencyId"
                            onChange={(e) => {
                                formik.setFieldValue("DestinationCurrencyId", e.target.value);
                            }}
                            value={formik.values.DestinationCurrencyId}
                            label="Destination Currency"
                            error={
                                formik.touched["DestinationCurrencyId"] &&
                                Boolean(formik.errors["DestinationCurrencyId"])
                            }
                            helperText={
                                formik.touched["DestinationCurrencyId"] &&
                                formik.errors["DestinationCurrencyId"]
                            }
                        >
                            {currencies?.map((option, index) => (
                                <MenuItem key={index} value={option?.recordGuid}>
                                    {option?.tag}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.DestinationCurrencyId &&
                            formik.errors.DestinationCurrencyId && (
                                <FormHelperText>
                                    {formik.errors.DestinationCurrencyId}
                                </FormHelperText>
                            )}
                    </FormControl>
                </Grid>

                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        sx={{m: 0}}
                        id="FeeCurrencyId"
                        name="FeeCurrencyId"
                        error={
                            formik.touched["FeeCurrencyId"] &&
                            Boolean(formik.errors["FeeCurrencyId"])
                        }
                        helperText={
                            formik.touched["FeeCurrencyId"] && formik.errors["FeeCurrencyId"]
                        }
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Fee Currency *
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="FeeCurrencyId"
                            name="FeeCurrencyId"
                            onChange={(e) => {
                                formik.setFieldValue("FeeCurrencyId", e.target.value);
                            }}
                            value={formik.values.FeeCurrencyId}
                            label="Fee Currency"
                            error={
                                formik.touched["FeeCurrencyId"] &&
                                Boolean(formik.errors["FeeCurrencyId"])
                            }
                            helperText={
                                formik.touched["FeeCurrencyId"] &&
                                formik.errors["FeeCurrencyId"]
                            }
                        >
                            {currencies?.map((option, index) => (
                                <MenuItem key={index} value={option?.recordGuid}>
                                    {option?.tag}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.FeeCurrencyId && formik.errors.FeeCurrencyId && (
                            <FormHelperText>{formik.errors.FeeCurrencyId}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl fullWidth variant="standard">
                        <TextField
                            key="FeeTypeId"
                            id="FeeTypeId"
                            name="FeeTypeId"
                            label="Fee Type *"
                            variant="standard"
                            type="text"
                            disabled={true}
                            value={formik.values.FeeTypeId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.FeeTypeId && formik.errors.FeeTypeId}
                            error={formik.touched.FeeTypeId && Boolean(formik.errors.FeeTypeId)}
                        />
                    </FormControl>

                </Grid>

                <Grid item xs={6} sx={{marginTop: "20px"}}>
                    <FormControl
                        fullWidth
                        variant="standard"
                        sx={{m: 0}}
                        id="FeeCategoryId"
                        name="FeeCategoryId"
                        error={
                            formik.touched["FeeCategoryId"] &&
                            Boolean(formik.errors["FeeCategoryId"])
                        }
                        helperText={
                            formik.touched["FeeCategoryId"] && formik.errors["FeeCategoryId"]
                        }
                    >
                        <InputLabel id="demo-simple-select-standard-label">
                            Fee Category *
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="FeeCategoryId"
                            name="FeeCategoryId"
                            onChange={(e) => {
                                formik.setFieldValue("FeeCategoryId", e.target.value);
                            }}
                            value={formik.values.FeeCategoryId}
                            label="Fee Category"
                            error={
                                formik.touched["FeeCategoryId"] &&
                                Boolean(formik.errors["FeeCategoryId"])
                            }
                            helperText={
                                formik.touched["FeeCategoryId"] &&
                                formik.errors["FeeCategoryId"]
                            }
                        >
                            {feeCategoryChoices?.map((option, index) => (
                                <MenuItem key={index} value={option?.value}>
                                    {option?.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.FeeCategoryId && formik.errors.FeeCategoryId && (
                            <FormHelperText>{formik.errors.FeeCategoryId}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                    className="Cancel_Save"
                >
                    <Button className="mui-btn primary outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="mui-btn primary filled"
                        id="add-Industry"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default withTranslation("translations")(ManageFees);
