import React from "react"
import {Box} from "@mui/material"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault"

export default function ReusableToogleStatusCell({value, onClick, activeLabel = "Active", inactiveLabel = "Inactive"}) {
    return (
        <Box display="flex" alignItems="center" onClick={onClick} sx={{cursor: "pointer"}}>
            {value ? (
                <>
                    <CheckBoxIcon sx={{fontSize: "18px !important", color: "#61B061"}}/>
                    <span style={{marginLeft: "8px", color: "#61B061"}}>{activeLabel}</span>
                </>
            ) : (
                <>
                    <DisabledByDefaultIcon sx={{fontSize: "18px !important", color: "red"}}/>
                    <span style={{marginLeft: "8px", color: "red"}}>{inactiveLabel}</span>
                </>
            )}
        </Box>
    )
}
