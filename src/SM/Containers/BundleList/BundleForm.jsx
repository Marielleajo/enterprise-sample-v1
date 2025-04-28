import {
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Step,
    StepLabel,
    Stepper,
    Switch,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {useFormik} from "formik";
import React, {useRef, useState} from "react";
import {
    CREATE_BUNDLE,
    GET_ALL_BILLINGCYCLE,
    GET_ALL_COUNTRIES_API,
    GET_CURRENCIES_BY_TENANT,
    UPDATE_BUNDLE,
} from "../../../APIs/BundleListing";

import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {useSnackbar} from "../../../Contexts/SnackbarContext";

import {Clear} from "@mui/icons-material";
import {GET_ALL_CURRENCIES} from "../../../APIs/Currencies.jsx";
import {GET_ALL_PROVIDER_API} from "../../../APIs/Postpaid.jsx";
import {
    FROMDATEConvertToTimesStmp,
    FROMTimestmpToDATE,
    handleMessageError,
    TODATEConvertToTimesStmp,
    TOTimestmpToDATE,
} from "../../Utils/Functions.jsx";
import BunldePreview from "./BunldePreview.jsx";
import {stepValidationSchemas} from "./helpers/AddBundleValidation.js";

export default function BundleForm({
                                       bundle = null,
                                       close,
                                       category,
                                       validityPeriod,
                                   }) {
    const {showSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const isCreateFlag = bundle == null;
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["General Information", "Pricing", "Stock", "Preview"];

    const initialValues = {
        bundleCategory: bundle?.bundleCategory ?? {
            label: category?.name,
            value: category?.value,
        },
        bundleName: bundle?.bundleName || "",
        provider: bundle?.provider
            ? {
                label: bundle?.provider?.name || "",
                value: bundle?.provider?.recordGuid || "",
            }
            : "",
        costCurrency: bundle?.costCurrency
            ? {
                label: bundle?.costCurrency?.name || "",
                value: bundle?.costCurrency?.recordGuid || "",
            }
            : "",
        bundleMarketingName: bundle?.bundleMarketingName || "",
        description: bundle?.description || "",
        cost: bundle?.cost || "",
        price: bundle?.price || "",

        Unlimited: bundle?.unlimited || "",
        BundleCode: bundle?.bundleInfo?.bundleCode || "",
        DataUnit: bundle?.bundleInfo?.dataUnit || "",
        GprsLimit: bundle?.bundleInfo?.gprsLimit || "",
        isStockable: bundle?.bundleInfo?.isStockable || false,
        Quantity: bundle?.quantity || "",
        Threshold: bundle?.threshold || 0,
        MaxQuantity: bundle?.maxQuantity || 0,
        SoldQuantity: bundle?.soldQuantity || "",
        LockedQuantity: bundle?.lockedQuantity || "",
        ValidityPeriodGuid: bundle?.validityPeriodCycle?.details?.recordGuid || "",
        bundleType: bundle?.bundleType?.value || "ESIM",
        priceCurrency: bundle?.currency
            ? {
                label: bundle?.currency?.name || "",
                value: bundle?.currency?.recordGuid || "",
            }
            : "",
        validity: bundle?.validityPeriodCycle
            ? {
                label: bundle?.validityPeriodCycle?.details[0]?.name || "",
                value: bundle?.validityPeriodCycle?.recordGuid || "",
            }
            : "",
        pricingModel: bundle?.pricingType ?? {label: "Single", value: "SINGLE"},
        isActive: bundle ? !!bundle.isActive : true,
        isPublished: bundle?.isPublished || false,
        supportTopup: bundle?.bundleInfo?.supportTopup || false,
        IsAutoRenew: bundle?.isAutoRenew || false,
        IsOnetime: bundle?.IsOnetime || false,
        HasMultipleBillingCycle: bundle?.HasMultipleBillingCycle || false,
        AcceptNewSubscription: bundle?.AcceptNewSubscription || false,
        AllowMultipleSubscription: bundle?.AllowMultipleSubscription || false,
        PublishFrom: FROMTimestmpToDATE(bundle?.publishFrom) || null,
        PublishTo: TOTimestmpToDATE(bundle?.publishTo) || null,
        supportedCountries: bundle?.supportedCountries || [],
        PricingTypeTag: bundle?.PricingTypeTag || "PRICELIST",
    };

    const formik = useFormik({
        initialValues,
        validationSchema: stepValidationSchemas(category?.value)[activeStep],
        onSubmit: async (values) => {
            try {
                setLoading(true);

                const data = {
                    bundleDetails: [
                        {
                            languageCode: "en",
                            name: values?.bundleName,
                            description: values?.description,
                        },
                    ],
                    isActive: true,
                    provider: values?.provider?.value,
                    BundleInfo: {
                        BundleCode: values?.BundleCode,
                        DataUnit: values?.DataUnit || "GB",
                        GprsLimit: values?.GprsLimit || "3",
                        supportTopup: values?.supportTopup || false,
                        Unlimited: values?.Unlimited || false,
                        isStockable: values?.isStockable || false,
                    },
                    cost: values?.cost,
                    price: values?.price,
                    isPublished: values?.isPublished,
                    IsAutoRenew: false,
                    IsOnetime: false,
                    HasMultipleBillingCycle: false,
                    AcceptNewSubscription: false,
                    AllowMultipleSubscription: false,
                    ValidityPeriodGuid: values?.validity?.value,
                    bundleTypeTag: values?.bundleType,
                    bundleType: values?.bundleType,
                    bundleCategoryTag: values?.bundleCategory?.value,
                    currencyCode: values?.priceCurrency?.data?.code,
                    CostCurrencyCode: values?.costCurrency?.data?.code,
                    pricingTypeTag:
                        values?.pricingModel?.data?.tag ?? values?.pricingModel?.value,
                    supportedCountriesGuids: values?.supportedCountries.map(
                        (country) => country?.value
                    ),
                    Quantity: values?.Quantity || "",
                    ...(values?.isStockable && {
                        Threshold: values?.Threshold,
                        MaxQuantity: values?.MaxQuantity,
                    }),
                    SoldQuantity: values?.SoldQuantity || "",
                    LockedQuantity: values?.LockedQuantity || "",
                    ProviderGuid: values?.provider?.value,
                    ExternalId: values?.BundleCode || "",
                    ...(values?.isPublished && {
                        publishFrom: values?.PublishFrom == "" ? null : FROMDATEConvertToTimesStmp(values?.PublishFrom),
                        publishTo: values?.PublishTo == "" ? null : TODATEConvertToTimesStmp(values?.PublishTo),
                    }),
                };
                let response = isCreateFlag
                    ? await CREATE_BUNDLE({data})
                    : await UPDATE_BUNDLE({
                        data: {...data, recordGuid: bundle?.recordGuid},
                    });
                if (response?.data?.success) {
                    showSnackbar(
                        `Bundle ${isCreateFlag ? `Created` : `Updated`} Successfully`,
                        "success"
                    );
                    close();
                }
            } catch (e) {
                showSnackbar(handleMessageError({e}), "error");
            } finally {
                setLoading(false);
            }
        },
    });

    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    const handleOpenFromDateCalendar = () => {
        if (fromDateRef.current) {
            fromDateRef.current.showPicker();
        }
    };

    const handleOpenToDateCalendar = () => {
        if (toDateRef.current) {
            toDateRef.current.showPicker();
        }
    };

    if (loading) {
        return (
            <Box className="Loader">
                <CircularProgress/>
            </Box>
        );
    }

    const handleNext = async () => {
        const errors = await formik.validateForm(); // Validate current step
        formik.setTouched(
            Object.keys(errors).reduce((acc, key) => ({...acc, [key]: true}), {}),
            true
        ); // Mark all fields as touched

        if (Object.keys(errors).length === 0) {
            // No validation errors, proceed to next step
            setActiveStep((prev) => prev + 1);
        } else {
            console.log("Validation Errors:", errors); // Debugging
        }
    };

    return (
        <Card className="p-4">
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} className="mt-4">
                    {activeStep === 0 && (
                        <>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        value={formik.values.bundleCategory?.value ?? ""}
                                        label="Bundle Category"
                                        disabled={true}
                                        variant={"standard"}
                                    />
                                    {formik.touched.bundleCategory &&
                                        formik.errors.bundleCategory && (
                                            <FormHelperText sx={{color: "red"}}>
                                                {formik.errors.bundleCategory}
                                            </FormHelperText>
                                        )}
                                </FormControl>
                            </Grid>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="BundleCode"
                                        label="Bundle Code"
                                        value={formik.values.BundleCode}
                                        onChange={formik.handleChange}
                                        variant={"standard"}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.BundleCode && !!formik.errors.BundleCode
                                        }
                                        helperText={
                                            formik.touched.BundleCode && formik.errors.BundleCode
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <TextField
                                    fullWidth
                                    label="Bundle Name"
                                    name="bundleName"
                                    variant={"standard"}
                                    value={formik.values.bundleName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.bundleName &&
                                        Boolean(formik.errors.bundleName)
                                    }
                                    helperText={
                                        formik.touched.bundleName && formik.errors.bundleName
                                    }
                                />
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="description"
                                        variant={"standard"}
                                        label="Bundle Marketing Name"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.description && !!formik.errors.description
                                        }
                                        helperText={
                                            formik.touched.description && formik.errors.description
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <CustomAsyncPaginate
                                    value={formik.values.provider}
                                    onChange={(value) => {
                                        formik.setFieldValue("provider", value);
                                    }}
                                    label="Provider"
                                    method="POST"
                                    placeholder="Select Provider"
                                    apiFunction={GET_ALL_PROVIDER_API}
                                    labelPath={"bundleTypeDetails"}
                                    dataPath="data.data.providers"
                                    params={{typeTag: "GENERAL"}}
                                />

                                {formik.touched.provider && formik.errors.provider && (
                                    <FormHelperText sx={{color: "red"}}>
                                        {formik.errors.provider}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <CustomAsyncPaginate
                                    value={formik.values.supportedCountries}
                                    onChange={(value) => {
                                        formik.setFieldValue("supportedCountries", value);
                                    }}
                                    multiple={true}
                                    placeholder="Select Supported Countries"
                                    label="Supported Countries"
                                    apiFunction={GET_ALL_COUNTRIES_API}
                                    dataPath={"data.data.countries"}
                                    isMulti={true}
                                />
                                {formik.touched.supportedCountries &&
                                    formik.errors.supportedCountries && (
                                        <FormHelperText sx={{color: "red"}}>
                                            {formik.errors.supportedCountries}
                                        </FormHelperText>
                                    )}
                            </Grid>

                            {/* <Grid item size={{ xs: 12, sm: 6 }}>
                <CustomAsyncPaginate
                  value={formik.values.bundleType}
                  onChange={(value) => {
                    formik.setFieldValue("bundleType", value);
                  }}
                  label="Bundle Type"
                  placeholder="Select Bundle Type"
                  apiFunction={GET_BUNDLE_TYPES}
                  isNested={true}
                  labelPath={"bundleTypeDetails"}
                  dataPath="data.data.items"
                />
                {formik.touched.bundleType && formik.errors.bundleType && (
                  <FormHelperText sx={{ color: "red" }}>
                    {formik.errors.bundleType}
                  </FormHelperText>
                )}
              </Grid> */}
                            <Grid mt={2} item size={{xs: 12, sm: 12}}>
                                <FormControl>
                                    <FormLabel
                                        sx={{marginBottom: "14px !important"}}
                                        mb={3}
                                        id="demo-radio-buttons-group-label"
                                    >
                                        Bundle Type
                                    </FormLabel>
                                    {formik.values.bundleType}
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="ESIM"
                                        name="bundleType"
                                        row
                                        onChange={(event) => {
                                            formik.setFieldValue("bundleType", event.target.value);
                                        }}
                                        value={formik.values.bundleType}
                                    >
                                        <FormControlLabel
                                            value="ESIM"
                                            control={<Radio/>}
                                            label="By Bundle"
                                        />
                                        {/* <FormControlLabel
                      value="General"
                      control={<Radio />}
                      label="By Consumption"
                    /> */}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="GprsLimit"
                                        label="Gprs Limit"
                                        value={formik.values.GprsLimit}
                                        onChange={formik.handleChange}
                                        variant={"standard"}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.GprsLimit && !!formik.errors.GprsLimit
                                        }
                                        helperText={
                                            formik.touched.GprsLimit && formik.errors.GprsLimit
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="DataUnit"
                                        label="Data Unit"
                                        value={formik.values.DataUnit}
                                        onChange={formik.handleChange}
                                        variant={"standard"}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.DataUnit && !!formik.errors.DataUnit}
                                        helperText={
                                            formik.touched.DataUnit && formik.errors.DataUnit
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item size={{xs: 12, sm: 3}} mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.Unlimited}
                                            onChange={(event) => {
                                                formik.setFieldValue("Unlimited", event.target.checked);
                                            }}
                                            name="Unlimited"
                                            color="primary"
                                        />
                                    }
                                    label={"Unlimited"}
                                    labelPlacement="start"
                                />
                            </Grid>
                            <Grid item size={{xs: 12, sm: 3}} mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.isPublished}
                                            onChange={(event) => {
                                                formik.setFieldValue(
                                                    "isPublished",
                                                    event.target.checked
                                                );
                                                if (!bundle) {
                                                    formik.setFieldValue("PublishFrom", "");
                                                    formik.setFieldValue("PublishTo", "");
                                                }
                                            }}
                                            name="isActive"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        formik.values.isPublished ? "Published " : "Not published "
                                    }
                                    labelPlacement="start"
                                />
                            </Grid>
                            {formik.values.isPublished && (
                                <>
                                    <Grid item size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Publish From"
                                            onKeyDown={(e) => e.preventDefault()}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        onClick={() =>
                                                            formik.setFieldValue("PublishFrom", "")
                                                        }
                                                    >
                                                        <Clear/>
                                                    </IconButton>
                                                ),
                                            }}
                                            name="PublishFrom"
                                            value={formik.values.PublishFrom}
                                            onChange={(e) =>
                                                formik.setFieldValue("PublishFrom", e.target.value)
                                            }
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputRef={fromDateRef}
                                            onClick={handleOpenFromDateCalendar}
                                            error={
                                                formik.touched.PublishFrom &&
                                                !!formik.errors.PublishFrom
                                            }
                                            helperText={
                                                formik.touched.PublishFrom && formik.errors.PublishFrom
                                            }
                                            inputProps={{
                                                min: new Date().toISOString().split("T")[0],
                                            }}
                                        />
                                    </Grid>

                                    <Grid item size={{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            label="Publish To"
                                            onKeyDown={(e) => e.preventDefault()}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        onClick={() =>
                                                            formik.setFieldValue("PublishTo", "")
                                                        }
                                                    >
                                                        <Clear/>
                                                    </IconButton>
                                                ),
                                            }}
                                            name="PublishTo"
                                            value={formik.values.PublishTo}
                                            onChange={(e) =>
                                                formik.setFieldValue("PublishTo", e.target.value)
                                            }
                                            type="date"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputRef={toDateRef}
                                            onClick={handleOpenToDateCalendar}
                                            error={
                                                formik.touched.PublishTo && !!formik.errors.PublishTo
                                            }
                                            helperText={
                                                formik.touched.PublishTo && formik.errors.PublishTo
                                            }
                                            inputProps={{
                                                min:
                                                    formik.values.PublishFrom ||
                                                    new Date().toISOString().split("T")[0],
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                        </>
                    )}

                    {activeStep === 1 && (
                        <>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <CustomAsyncPaginate
                                    value={formik.values.costCurrency}
                                    onChange={(value) => {
                                        formik.setFieldValue("costCurrency", value);
                                    }}
                                    label="Cost Currency"
                                    placeholder="Select Cost Currency"
                                    apiFunction={GET_ALL_CURRENCIES}
                                    dataPath={"data.data.currencies"}
                                />
                                {formik.touched.costCurrency && formik.errors.costCurrency && (
                                    <FormHelperText sx={{color: "red"}}>
                                        {formik.errors.costCurrency}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Cost"
                                        name="cost"
                                        label="Cost"
                                        type="number"
                                        variant={"standard"}
                                        value={formik.values.cost}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.cost && !!formik.errors.cost}
                                        helperText={formik.touched.cost && formik.errors.cost}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <CustomAsyncPaginate
                                    value={formik.values.priceCurrency}
                                    onChange={(value) => {
                                        formik.setFieldValue("priceCurrency", value);
                                    }}
                                    label="Price Currency"
                                    placeholder="Select Price Currency"
                                    apiFunction={GET_CURRENCIES_BY_TENANT}
                                    dataPath={"data.data.tenantCurrencies"}
                                />
                                {formik.touched.priceCurrency &&
                                    formik.errors.priceCurrency && (
                                        <FormHelperText sx={{color: "red"}}>
                                            {formik.errors.priceCurrency}
                                        </FormHelperText>
                                    )}
                            </Grid>
                            <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="price"
                                        type="number"
                                        label="Price"
                                        variant={"standard"}
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.price && !!formik.errors.price}
                                        helperText={formik.touched.price && formik.errors.price}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item size={{xs: 12, sm: 6}}>
                                <CustomAsyncPaginate
                                    value={formik.values.validity}
                                    onChange={(value) => {
                                        formik.setFieldValue("validity", value);
                                    }}
                                    placeholder="Select Validty"
                                    label="Validty"
                                    apiFunction={(params) =>
                                        GET_ALL_BILLINGCYCLE({
                                            typeTag: "VALIDITY_PERIOD",
                                            ...params,
                                        })
                                    }
                                    dataPath={"data.data.items"}
                                    isNested={true}
                                    labelPath="details"
                                />
                                {formik.touched.validity && formik.errors.validity && (
                                    <FormHelperText sx={{color: "red"}}>
                                        {formik.errors.validity}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {/* <Grid item size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth variant="standard">
                  <TextField
                    value={formik.values.PricingTypeTag}
                    label="Pricing Type"
                    disabled={true}
                    variant={"standard"}
                  />
                  {formik.touched.PricingTypeTag &&
                    formik.errors.PricingTypeTag && (
                      <FormHelperText sx={{ color: "red" }}>
                        {formik.errors.PricingTypeTag}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid> */}
                            <Grid item size={{xs: 12, sm: 6}} mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.supportTopup}
                                            onChange={(event) => {
                                                formik.setFieldValue(
                                                    "supportTopup",
                                                    event.target.checked
                                                );
                                            }}
                                            name="supportTopup"
                                            color="primary"
                                        />
                                    }
                                    label={"Support Top Up"}
                                    labelPlacement="start"
                                />
                            </Grid>
                        </>
                    )}

                    {activeStep === 2 && (
                        <>
                            <Grid item size={{xs: 12, sm: 12}} mt={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formik.values.isStockable}
                                            onChange={(event) => {
                                                formik.setFieldValue(
                                                    "isStockable",
                                                    event.target.checked
                                                );
                                            }}
                                            name="isStockable"
                                            color="primary"
                                        />
                                    }
                                    label={"Is Stockable"}
                                    labelPlacement="start"
                                />
                            </Grid>
                            {formik.values.isStockable && (
                                <>
                                    <Grid item size={{xs: 12, sm: 6}}>
                                        <FormControl fullWidth variant="standard">
                                            <TextField
                                                fullWidth
                                                name="Threshold"
                                                type="number"
                                                label="Threshold"
                                                variant={"standard"}
                                                value={formik.values.Threshold}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.Threshold && !!formik.errors.Threshold}
                                                helperText={formik.touched.Threshold && formik.errors.Threshold}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item size={{xs: 12, sm: 6}}>
                                        <FormControl fullWidth variant="standard">
                                            <TextField
                                                fullWidth
                                                name="MaxQuantity"
                                                type="number"
                                                label="Max Quantity"
                                                variant={"standard"}
                                                value={formik.values.MaxQuantity}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.MaxQuantity && !!formik.errors.MaxQuantity}
                                                helperText={formik.touched.MaxQuantity && formik.errors.MaxQuantity}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )}


                            {/* <Grid item size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth variant="standard">
                                    <TextField
                                        fullWidth
                                        name="Quantity"
                                        type="number"
                                        label="Quantity"
                                        variant={"standard"}
                                        value={formik.values.Quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.Quantity && !!formik.errors.Quantity}
                                        helperText={
                                            formik.touched.Quantity && formik.errors.Quantity
                                        }
                                    />
                                </FormControl>
                            </Grid> */}
                        </>
                    )}
                    {activeStep === 3 && (
                        <>
                            <BunldePreview formik={formik}/>
                        </>
                    )}
                </Grid>

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={
                            activeStep === steps.length - 1 ? formik.handleSubmit : handleNext
                        }
                        className="mui-btn primary filled"
                        color="primary"
                    >
                        {activeStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                    {activeStep > 0 && (
                        <Button
                            onClick={() => setActiveStep(activeStep - 1)}
                            variant="outlined"
                        >
                            Back
                        </Button>
                    )}{" "}
                    {activeStep === 0 && (
                        <Button
                            onClick={close}
                            className="mui-btn primary outlined"
                            color="primary"
                        >
                            cancel
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
}
