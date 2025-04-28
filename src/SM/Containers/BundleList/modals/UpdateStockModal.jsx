import React, {useEffect, useState} from "react"
import MuiModal from "../../../../Components/MuiModal/MuiModal"
import {Box, Button, FormControl, FormHelperText, Grid, TextField, Typography} from "@mui/material"

export default function UpdateStockModal({
                                             open,
                                             onClose,
                                             onConfirm,
                                             isStockable,
                                             threshold,
                                             setThreshold,
                                             maxQuantity,
                                             setMaxQuantity,
                                             loading,
                                             bundle
                                         }) {

    const [error, setErrors] = useState({})
    useEffect(() => {
        setErrors({});
    }, [open]);

    const handleConfirm = () => {
        const newErrors = {}

        if (!isStockable) {
            if (threshold === "" || threshold === null || threshold === undefined) newErrors.threshold = "Threshold is required"
            else if (Number(threshold) < 0) newErrors.threshold = "Must be 0 or greater"

            if (maxQuantity === "" || maxQuantity === null || maxQuantity === undefined) newErrors.maxQuantity = "Max Quantity is required"
            else if (Number(maxQuantity) < 0) newErrors.maxQuantity = "Must be 0 or greater"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            onConfirm()
        }
    }

    return (
        <MuiModal open={open} handleClose={onClose} title="Update Stock Status">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>
                        {!isStockable ? (
                            <>
                                Are you sure you want to mark the bundle{" "}
                                <Box component="span" fontWeight="bold">
                                    {bundle?.bundleName}
                                </Box>{" "}
                                as stockable?
                            </>
                        ) : (
                            <>
                                Are you sure you want to disable stock for the bundle{" "}
                                <Box component="span" fontWeight="bold">
                                    {bundle?.bundleName}
                                </Box>
                                ?
                            </>
                        )}
                    </Typography>

                </Grid>

                {!isStockable && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Threshold"
                                    type="number"
                                    variant="standard"
                                    value={threshold}
                                    onChange={(e) => setThreshold(e.target.value)}
                                />
                                {error?.threshold && (
                                    <FormHelperText sx={{color: "red", marginLeft: "0px"}}>
                                        {error.threshold}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Max Quantity"
                                    type="number"
                                    variant="standard"
                                    value={maxQuantity}
                                    onChange={(e) => setMaxQuantity(e.target.value)}
                                />
                                {error?.maxQuantity && (
                                    <FormHelperText sx={{color: "red", marginLeft: "0px"}}>
                                        {error.maxQuantity}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </>
                )}
            </Grid>

            <Grid container justifyContent="flex-end" mt={2}>
                <Grid item>
                    <Button onClick={onClose} className="mui-btn primary outlined">
                        Cancel
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="mui-btn primary filled"
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </Grid>
            </Grid>
        </MuiModal>
    )
}
