import { IconButton } from "@mui/material"

const MuiIconButton = ({ Icon, ButtonProps }) => {
    return <IconButton {...ButtonProps}> <Icon/> </IconButton>
}