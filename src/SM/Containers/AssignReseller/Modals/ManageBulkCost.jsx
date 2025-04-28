import React, {useEffect, useState} from "react";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import {Box, Button, CircularProgress, FormControl, FormHelperText, Grid, TextField,} from "@mui/material";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import {
    GET_ALL_ASSIGNED_BUNDLES,
    GET_ALL_BASIC_BUNDLES,
    GET_ALL_UNASSIGNED_BUNDLES,
    GET_CURRENCIES_BY_TENANT,
} from "../../../../APIs/BundleListing";
import {GET_ALL_RESELLER_API} from "../../../../APIs/Postpaid";

export default function ManageBulkCost({
                                           onClose,
                                           onConfirm,
                                           open,
                                           loading,
                                           setBundleIds,
                                           bundleIds,
                                           reseller,
                                           rowSelectionModel,
                                           setRowSelectionModel,
                                           costPercentage,
                                           setCostPercentage,
                                           selectedTab,
                                           provider,
                                           paginationModel,
                                           setCurrency,
                                           Currency,
                                           category,
                                       }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const [errors, setErrors] = useState({})

    useEffect(() => {
        setErrors({});
    }, [open]);

    const fetchSelectedBundles = async () => {
        setIsLoading(true);
        try {
            const response = await GET_ALL_BASIC_BUNDLES({pageSize: 10000});
            const allBundles = response?.data?.data?.items || [];

            const selected = allBundles
                .filter((bundle) => rowSelectionModel.includes(bundle.recordGuid))
                .map((bundle) => ({
                    value: bundle.recordGuid, // <-- must match option.value
                    label: bundle.bundleDetails[0]?.name,
                }));

            setBundleIds(selected);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Failed to fetch selected bundles:", error);
        }
    };
    React.useEffect(() => {
        open && fetchSelectedBundles();
    }, [open]);

    const handleConfirm = () => {
        if (selectedTab === "Unassign") {
            const newErrors = {};
            if (costPercentage === "" || costPercentage === null || costPercentage === undefined) newErrors.rate = "Rate is required";
            else if (Number(costPercentage) < 0) newErrors.rate = "Rate must be 0 or greater";

            setErrors(newErrors);
            if (Object.keys(newErrors).length === 0) onConfirm();
        } else {
            onConfirm();
        }
    };


    return (
        <MuiModal
            open={open}
            handleClose={onClose}
            title={selectedTab == "Assign" ? "Unset Bulk Cost" : "Set Bulk Cost"}
        >
            {isLoading ? (<Box display="flex" justifyContent="center" sx={{width: '100%'}}>
                    <CircularProgress size={24} color="inherit"/>
                </Box>
            ) : (
                <>
                    <Box sx={{maxHeight: "40vh", overflowY: "auto"}}>
                        <CustomAsyncPaginate
                            value={reseller}
                            placeholder="Reseller"
                            label="Reseller"
                            apiFunction={GET_ALL_RESELLER_API}
                            dataPath={"data.data.clients"}
                            params={{TypeTag: "RESELLER"}}
                            isDisabled={true}
                        />
                        <Box mt={2} mb={2}>
                            <CustomAsyncPaginate
                                value={bundleIds}
                                onChange={(value) => {
                                    setBundleIds(value);
                                    const selectedIds = value?.map((item) => item.value) || [];
                                    setRowSelectionModel(selectedIds);
                                }}
                                placeholder="Select Bundles"
                                label="Bundles"
                                apiFunction={
                                    selectedTab == "Unassign"
                                        ? GET_ALL_UNASSIGNED_BUNDLES
                                        : GET_ALL_ASSIGNED_BUNDLES
                                }
                                dataPath={"data.data.items"}
                                method="GET"
                                isMulti={true}
                                isNested={true}
                                labelPath={"bundleDetails"}
                                params={{
                                    // pageIndex: paginationModel.page + 1,
                                    // pageSize: paginationModel.pageSize,
                                    ProviderGuid: provider.value,
                                    ClientGuid: reseller.value,
                                    BundleCategoryTag: category?.data?.tag,
                                }}
                            />
                        </Box>
                        {selectedTab == "Unassign" && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <CustomAsyncPaginate
                                        value={Currency}
                                        onChange={(value) => {
                                            setCurrency(value);
                                        }}
                                        label="Price Currency*"
                                        placeholder="Select Currency*"
                                        apiFunction={GET_CURRENCIES_BY_TENANT}
                                        dataPath={"data.data.tenantCurrencies"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="standard" mb={3}>
                                        <TextField
                                            key="cost"
                                            id="cost"
                                            name="cost"
                                            label="Rate Percentage *"
                                            variant="standard"
                                            type={"number"}
                                            value={costPercentage}
                                            onChange={(e) => setCostPercentage(e.target.value)}
                                        />
                                        {errors.rate && (
                                            <FormHelperText
                                                sx={{color: "red", marginLeft: "0px"}}>{errors.rate}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                    </Box>

                    <Grid container className="Cancel_Save" mt={2}>
                        <Button className="mui-btn primary outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                loading ||
                                (selectedTab === "Unassign" &&
                                    (costPercentage === "" || costPercentage === null || costPercentage === undefined || !Currency))
                            }
                            onClick={handleConfirm}
                            className="mui-btn primary filled"
                        >
                            {loading
                                ? "Loading..."
                                : selectedTab == "Unassign"
                                    ? "Add"
                                    : "Remove"}
                        </Button>
                    </Grid>
                </>
            )}
        </MuiModal>
    );
}
