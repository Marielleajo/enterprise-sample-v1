import React from "react"
import {Box, FormControlLabel} from "@mui/material"
import MuiSwitch from "./MuiSwitch.jsx"

const StatusSwitch = ({isActive, onChange, disabled = false, labels = ["Active", "Inactive"]}) => {
    return (
        <Box direction="row" spacing={2}>
            <FormControlLabel
                control={
                    <MuiSwitch sx={{mr: 1}} checked={isActive} onChange={onChange} disabled={disabled}/>
                }
                label={isActive ? labels[0] : labels[1]}
            />
        </Box>
    )
}

export default StatusSwitch
