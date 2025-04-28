import React, {useRef} from "react"
import MuiModal from "../../../../Components/MuiModal/MuiModal.jsx"
import {Button, Grid, IconButton, TextField} from "@mui/material"
import {Clear} from "@mui/icons-material"

export default function ConfirmTogglePublishModal({
                                                      onClose,
                                                      onConfirm,
                                                      open,
                                                      bundle = null,
                                                      loading,
                                                      publishFrom,
                                                      publishTo,
                                                      setPublishFrom,
                                                      setPublishTo,
                                                  }) {
    const fromDateRef = useRef(null)
    const toDateRef = useRef(null)


    const handleSetPublishFrom = (value) => {
        setPublishFrom(value)
        if (publishTo && value && new Date(value) > new Date(publishTo)) {
            setPublishTo("")
        }
    }

    const handleSetPublishTo = (value) => {
        if (!publishFrom || new Date(value) >= new Date(publishFrom)) {
            setPublishTo(value)
        }
    }

    return (
        <MuiModal
            open={open}
            handleClose={onClose}
            title={bundle?.isPublished ? "Unpublish Bundle" : "Publish Bundle"}
        >
            <>
                {bundle?.isPublished ? (
                    <>Are you sure you want to Unpublish the bundle: <span className="bold-text">
                        {bundle?.bundleDetails?.[0]?.name}</span>?</>
                ) : (
                    <>
                        <div>Are you sure you want to Publish the bundle: <span className="bold-text">
                            {bundle?.bundleDetails?.[0]?.name}
                        </span>?
                        </div>
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Publish From"
                                    type="date"
                                    variant="standard"
                                    value={publishFrom || ""}
                                    onChange={(e) => handleSetPublishFrom(e.target.value)}
                                    inputRef={fromDateRef}
                                    onClick={() => fromDateRef.current?.showPicker()}
                                    InputLabelProps={{shrink: true}}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setPublishFrom("")}>
                                                <Clear/>
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Publish To"
                                    type="date"
                                    variant="standard"
                                    value={publishTo || ""}
                                    onChange={(e) => handleSetPublishTo(e.target.value)}
                                    inputRef={toDateRef}
                                    onClick={() => toDateRef.current?.showPicker()}
                                    InputLabelProps={{shrink: true}}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setPublishTo("")}>
                                                <Clear/>
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}

                <Grid container className="Cancel_Save" mt={3}>
                    <Button className="mui-btn primary outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={loading} onClick={onConfirm} className="mui-btn primary filled">
                        {loading ? "Loading..." : "Save"}
                    </Button>
                </Grid>
            </>
        </MuiModal>
    )
}
