import React from "react";
import MuiModal from "../../../../Components/MuiModal/MuiModal";
import {Button, Grid} from "@mui/material";

export default function ConfirmToggleStatusModal({
                                                     onClose,
                                                     onConfirm,
                                                     open,
                                                     bundle = null,
                                                     loading
                                                 }) {
    return (
        <MuiModal
            open={open}
            handleClose={onClose}
            title={bundle?.isActive ? "Deactivate Bundle" : "Activate Bundle"}
        >
            <>
                {bundle?.isActive && (
                    <>
                        Are You Sure you want to Deactivate the bundle: <span
                        className="bold-text"> {bundle?.bundleName} </span> ?
                    </>
                )}

                {bundle?.isActive == false && (
                    <>Are You Sure you want to Activate the bundle <span
                        className="bold-text"> {bundle?.bundleName} </span> ?
                    </>
                )}
                <Grid container className="Cancel_Save" mt={2}>
                    <Button className="mui-btn primary outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={loading} onClick={onConfirm} className="mui-btn primary filled">
                        {loading ? "Loading..." : "Save"}
                    </Button>
                </Grid>
            </>
        </MuiModal>
    );
}
