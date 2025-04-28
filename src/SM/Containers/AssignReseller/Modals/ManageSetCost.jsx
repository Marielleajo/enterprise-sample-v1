import React, {useEffect, useState} from "react"
import MuiModal from "../../../../Components/MuiModal/MuiModal"
import {Box, Button, FormControl, FormHelperText, Grid, TextField, Tooltip, Typography} from "@mui/material"
import Swal from "sweetalert2"
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate.jsx";
import {GET_CURRENCIES_BY_TENANT} from "../../../../APIs/BundleListing.jsx";

export default function ManageSetCost({
                                          onClose,
                                          onConfirm,
                                          open,
                                          loading,
                                          bundle,
                                          reseller,
                                          setCost,
                                          cost,
                                          selectedTab,
                                          rate,
                                          Currency,
                                          setCurrency
                                      }) {


    const [errors, setErrors] = useState({})

    useEffect(() => {
        setErrors({});
    }, [open]);

    if (!open) return null

    const handleConfirm = () => {
        const newErrors = {}
        if (cost === "" || cost === null || cost === undefined) newErrors.cost = "Cost is required"
        else if (Number(cost) < 0) newErrors.cost = "Cost must be 0 or greater"

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) return

        if (Number(cost) < Number(rate)) {
            Swal.fire({
                icon: "warning",
                title: "Confirm Action",
                text: "Are you sure you want to assign a cost lower than the rate?",
                showCancelButton: true,
                confirmButtonText: "Yes, proceed",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    onConfirm()
                }
            })
        } else {
            onConfirm()
        }
    }

    const formatLabel = label => label?.length > 22 ? label.slice(0, 22) + '...' : label


    return (
        <MuiModal
            open={open}
            handleClose={onClose}
            title={
                <Tooltip title={reseller?.label || ""}>
                <span>
                {selectedTab == "Unassign"
                    ? `Add Cost to ${formatLabel(reseller?.label)}`
                    : `Edit Cost to ${formatLabel(reseller?.label)}`}
                </span>
                </Tooltip>
            }


        >
            <>
                <Box mb={2}>
                    <Typography>
                        You are setting a cost for bundle <strong>{bundle?.bundleDetails?.[0]?.name}</strong>. The
                        default Price is <strong>{rate} {bundle?.defaultCurrency?.currencyCode}</strong>.
                    </Typography>

                </Box>
                <Grid container spacing={2} mt={2}>
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
                        <FormControl fullWidth variant="standard">
                            <TextField
                                key="cost"
                                id="cost"
                                name="cost"
                                label="Cost"
                                variant="standard"
                                type="number"
                                required
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                            {errors.cost && (
                                <FormHelperText sx={{color: "red", marginLeft: "0px"}}>{errors.cost}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container className="Cancel_Save" mt={2}>
                    <Button className="mui-btn primary outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={loading || cost === null || cost === undefined || cost === "" || !Currency}
                        onClick={handleConfirm}
                        className="mui-btn primary filled"
                    >
                        {loading ? "Loading..." : "Save"}
                    </Button>
                </Grid>
            </>
        </MuiModal>
    )
}
