import {
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
    useTheme,
} from "@mui/material";
import {useFormik} from "formik";
import React, {useEffect, useState} from "react";
import {
    ADD_TAX,
    EDIT_TAX,
    GET_ALL_COUNTRIES_API,
    GET_ALL_TAX_CATEGORY_API,
    GET_ALL_TAX_TYPE_API,
} from "../../../APIs/Taxes";
import {handleMessageError} from "../../Utils/Functions";
import {useSnackbar} from "../../../Contexts/SnackbarContext";
import addValidation from "./addValidation";
import editValidation from "./editValidation";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

export default function ManageTaxes({
                                        type,
                                        getAllTaxes,
                                        setmanageAddTax,
                                        selectedTax,
                                        setmanageEditTax,
                                    }) {
    const [countryOptions, setCountryOptions] = useState([]);
    const [taxTypeOptions, setTaxTypeOptions] = useState([]);
    const [taxCategoryOptions, setTaxCategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const {showSnackbar} = useSnackbar();
    const [isForDisplayOnly, setIsForDisplayOnly] = useState(false);
    const theme = useTheme();

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `0${d.getMonth() + 1}`.slice(-2);
        const day = `0${d.getDate()}`.slice(-2);
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };


    const formik = useFormik({
        initialValues: {
            country:
                type === "add"
                    ? ""
                    : {
                        label: selectedTax.countryName,
                        value: selectedTax.countryRecordGuid,
                    },
            taxRate: type === "add" ? "" : selectedTax?.rate,
            taxType: type === "add" ? "" : selectedTax?.taxTypeRecordGuid,
            taxCategory: type === "add" ? "" : selectedTax?.taxCategoryRecordGuid,
            description: type === "add" ? "" : selectedTax?.detail?.description,
            name: type === "add" ? "" : selectedTax?.detail?.name,
            fromDate: type === "add" ? "" : formatDate(selectedTax?.fromDate),
            toDate: type === "add" ? "" : formatDate(selectedTax?.toDate),
        },
        validationSchema: type === "add" ? addValidation : editValidation,
        onSubmit: async (values) => {
            if (type === "add") {
                const payload = {
                    CountryGuid: values.country.value,
                    TaxTypeGuid: values.taxType,
                    Rate: values.taxRate,
                    IsForDisplayOnly: isForDisplayOnly || false,
                    FromDate: values.fromDate,
                    ToDate: values.toDate,
                    Details: [
                        {
                            LanguageCode: "en",
                            Name: values.name,
                            Description: values.description,
                        },
                    ],
                };

                setLoading(true);
                try {
                    await ADD_TAX({postData: payload});
                    showSnackbar("Tax added successfully!", "success");
                    setmanageAddTax(false);
                    getAllTaxes();
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            } else {
                const payload = {
                    recordGuid: selectedTax?.recordGuid,
                    CountryGuid: values.country.value,
                    TaxTypeGuid: values.taxType,
                    Rate: values.taxRate,
                    IsForDisplayOnly: isForDisplayOnly,
                    FromDate: values.fromDate,
                    ToDate: values.toDate,
                    Details: [
                        {
                            LanguageCode: "en",
                            Name: values.name,
                            Description: values.description,
                        },
                    ],
                };

                setLoading(true);
                try {
                    let response = await EDIT_TAX({postData: payload});

                    if (response?.data?.message === "Success") {
                        showSnackbar("Tax updated successfully!", "success");
                        setmanageEditTax(false);
                        getAllTaxes();
                    }
                } catch (e) {
                    showSnackbar(handleMessageError({e, type: "validation"}), "error");
                } finally {
                    setLoading(false);
                }
            }
        },
    });

    const getAllCountries = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_COUNTRIES_API({});
            const options = response?.data?.data?.countries?.map((item) => ({
                value: item?.recordGuid,
                label: item?.name,
            }));
            setCountryOptions(options);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getAllTaxTypes = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_TAX_TYPE_API();
            const options = response?.data?.data?.taxTypes?.map((item) => ({
                value: item?.typeId,
                label: item?.name,
            }));
            setTaxTypeOptions(options);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const getAllTaxCategory = async () => {
        setLoading(true);
        try {
            let response = await GET_ALL_TAX_CATEGORY_API();
            const options = response?.data?.data?.categories?.map((item) => ({
                value: item?.categoryId,
                label: item?.name,
            }));
            setTaxCategoryOptions(options);
        } catch (e) {
            showSnackbar(handleMessageError({e, type: "validation"}), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            formik.setFieldValue("taxRate", value);
        }
    };

    useEffect(() => {
        getAllCountries();
        getAllTaxTypes();
        getAllTaxCategory();
    }, []);

    useEffect(() => {
        if (selectedTax) {
            setIsForDisplayOnly(selectedTax?.isForDisplayOnly);
        }
    }, [selectedTax]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <CustomAsyncPaginate
                        apiFunction={GET_ALL_COUNTRIES_API}
                        value={formik?.values?.country}
                        onChange={(value) => {
                            formik.setFieldValue("country", value);
                        }}
                        placeholder="Country *"
                        pageSize={10}
                        dataPath="data.data.countries"
                        totalRowsPath="data.data.totalRows"
                        method="GET"
                        id={`async-menu-style-accounts`}
                    />
                    {formik.touched.country && formik.errors.country && (
                        <FormHelperText style={{color: theme?.palette?.error?.main}}>
                            {formik.errors.country}
                        </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"taxRate"}
                            fullWidth
                            id={"taxRate"}
                            name={"taxRate"}
                            label={"Tax Rate"}
                            variant="standard"
                            type="text"
                            value={formik.values.taxRate}
                            onChange={handleNumberChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                            helperText={formik.touched.taxRate && formik.errors.taxRate}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel
                            id="taxType-label"
                            error={
                                formik.touched["taxType"] && Boolean(formik.errors["taxType"])
                            }
                        >
                            Tax Type
                        </InputLabel>
                        <Select
                            key="taxType"
                            id="taxType"
                            name="taxType"
                            label="Tax Type"
                            labelId="taxType-label"
                            value={formik.values.taxType}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {taxTypeOptions?.map((item) => (
                                <MenuItem key={item?.value} value={item?.value}>
                                    {item?.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {formik.touched.taxType && formik.errors.taxType && (
                        <FormHelperText style={{color: theme?.palette?.error?.main}}>
                            {formik.errors.taxType}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel
                            id="taxCategory-label"
                            error={
                                formik.touched["taxCategory"] &&
                                Boolean(formik.errors["taxCategory"])
                            }
                        >
                            Tax Category
                        </InputLabel>
                        <Select
                            key="taxCategory"
                            id="taxCategory"
                            name="taxCategory"
                            label="Tax Category"
                            labelId="taxCategory-label"
                            value={formik.values.taxCategory}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {taxCategoryOptions?.map((item) => (
                                <MenuItem key={item?.value} value={item?.value}>
                                    {item?.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {formik.touched.taxCategory && formik.errors.taxCategory && (
                        <FormHelperText style={{color: theme?.palette?.error?.main}}>
                            {formik.errors.taxCategory}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="standard"
                        type="date"
                        label="From Date"
                        name="fromDate"
                        value={formik.values.fromDate}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: {
                                min: new Date().toISOString().split("T")[0],
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={formik.touched.fromDate && Boolean(formik.errors.fromDate)}
                        helperText={formik.touched.fromDate && formik.errors.fromDate}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="standard"
                        type="date"
                        label="To Date"
                        name="toDate"
                        value={formik.values.toDate}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: {
                                min: formik.values.fromDate,
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={formik.touched.toDate && Boolean(formik.errors.toDate)}
                        helperText={formik.touched.toDate && formik.errors.toDate}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"name"}
                            fullWidth
                            id={"name"}
                            name={"name"}
                            label={"Name"}
                            variant="standard"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl variant="standard" fullWidth>
                        <TextField
                            key={"description"}
                            fullWidth
                            id={"description"}
                            name={"description"}
                            label={"Description"}
                            variant="standard"
                            type="text"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.description && Boolean(formik.errors.description)
                            }
                            helperText={
                                formik.touched.description && formik.errors.description
                            }
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={12}>
                    <InputLabel sx={{fontSize: "12px"}}>Is For Display Only</InputLabel>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isForDisplayOnly}
                                onChange={() => setIsForDisplayOnly(!isForDisplayOnly)}
                            />
                        }
                        label={isForDisplayOnly ? "Active" : "Inactive"}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    display={"flex"}
                    justifyContent={"end"}
                    alignItems={"center"}
                >
                    <Button
                        type="submit"
                        className="mui-btn primary filled"
                        id="send-service-provider-id"
                        disabled={loading}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
