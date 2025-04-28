import {Card, CardContent, Grid, Typography} from "@mui/material";
import React from "react";

const cardStyle = {
    border: "2px solid #3f51b5", // MUI primary color
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
};

const legendStyle = {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#3f51b5",
    borderBottom: "2px solid #3f51b5",
    paddingBottom: "4px",
    display: "inline-block",
};

const BundlePreview = ({formik}) => {

    return (
        <Grid container spacing={2} mt={2}>
            {/* General Info */}
            <Grid item xs={12}>
                <Card variant="outlined" sx={cardStyle}>
                    <CardContent>
                        <Typography sx={legendStyle}>General Information</Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Bundle Category:</strong>{" "}
                                    {formik.values.bundleCategory?.value}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Bundle Name:</strong>{" "}
                                    {formik.values.bundleName || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Bundle Marketing Name:</strong>{" "}
                                    {formik.values.description || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Provider:</strong>{" "}
                                    {formik.values.provider?.label || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Unlimited:</strong>{" "}
                                    {formik.values.Unlimited ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Bundle Code:</strong>{" "}
                                    {formik.values.BundleCode || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Data Unit:</strong> {formik.values.DataUnit || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Gprs Limit:</strong>{" "}
                                    {formik.values.GprsLimit || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Supported Countries:</strong>{" "}
                                    {formik.values.supportedCountries?.length > 0
                                        ? formik.values.supportedCountries
                                            .map((country) => country.label)
                                            .join(", ")
                                        : "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Active:</strong>{" "}
                                    {formik.values.isActive ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Is Published:</strong>{" "}
                                    {formik.values.isPublished ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                            {formik?.values?.isPublished && (<>

                                {formik?.values?.PublishFrom && (
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2">
                                            <strong>Publish From:</strong> {formik.values.PublishFrom}
                                        </Typography>
                                    </Grid>
                                )}

                                {/* Publish To */}
                                {formik?.values?.PublishTo && (
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2">
                                            <strong>Publish To:</strong> {formik.values.PublishTo}
                                        </Typography>
                                    </Grid>
                                )}
                            </>)}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Pricing & Currency */}
            <Grid item xs={12}>
                <Card variant="outlined" sx={cardStyle}>
                    <CardContent>
                        <Typography sx={legendStyle}>Pricing</Typography>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Cost Currency:</strong>{" "}
                                    {formik.values.costCurrency?.label || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Price Currency:</strong>{" "}
                                    {formik.values.priceCurrency?.label || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Cost:</strong> {formik.values.cost || "  -  "}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Price:</strong> {formik.values.price || "  -  "}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Validity:</strong>{" "}
                                    {formik.values.validity?.label || "  -  "}
                                </Typography>
                            </Grid>

                            {/* Support Top Up */}
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Support Top Up:</strong>{" "}
                                    {formik.values.supportTopup ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Bundle Details */}
            <Grid item xs={12}>
                <Card variant="outlined" sx={cardStyle}>
                    <CardContent>
                        <Typography sx={legendStyle}>Stock</Typography>
                        <Grid container spacing={2} mt={1}>
                            {formik?.values?.isStockable == true && (
                                <>
                                    {/* Threshold */}
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2">
                                            <strong>Threshold:</strong> {formik?.values?.Threshold}
                                        </Typography>
                                    </Grid>

                                    {/* Max Quantity */}
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle2">
                                            <strong>Max Quantity:</strong>{" "}
                                            {formik?.values?.MaxQuantity}
                                        </Typography>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">
                                    <strong>Is Stockable:</strong>{" "}
                                    {formik?.values?.isStockable == true ? "Yes" : "No"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default BundlePreview;
