import React from "react";
import {Box, Grid, IconButton, Typography} from "@mui/material";
// import { ColorPicker } from "material-ui-color";
import MenuIcon from "@mui/icons-material/Menu";
import Fab from "@mui/material/Fab";
import {Add} from "@mui/icons-material";

const ThemeSelector = ({
                           setPrimaryColor,
                           setSecondaryColor,
                           primaryColor,
                           secondaryColor,
                       }) => {
    const palette = {
        red: "#ff0000",
        blue: "#0000ff",
        green: "#00ff00",
        yellow: "yellow",
        cyan: "cyan",
        lime: "lime",
        gray: "gray",
        orange: "orange",
        purple: "purple",
        black: "black",
        white: "white",
        pink: "pink",
        darkblue: "darkblue",
    };

    // Function to calculate text color (white or black) based on background color
    const getTextColor = (backgroundColor) => {
        const r = parseInt(backgroundColor.slice(1, 3), 16);
        const g = parseInt(backgroundColor.slice(3, 5), 16);
        const b = parseInt(backgroundColor.slice(5, 7), 16);

        const relativeLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return relativeLuminance > 128 ? "black" : "white";
    };

    return (
        <Grid container>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={10} sm={10}>
                        <Typography variant="h6">Primary Color</Typography>
                        {/* <ColorPicker
              palette={palette}
              value={primaryColor}
              onChange={(color) => {
                setPrimaryColor(color)
              }}
            /> */}
                    </Grid>
                    <Grid item xs={10} sm={10}>
                        <Typography variant="h6">Secondary Color</Typography>
                        {/* <ColorPicker
              value={secondaryColor}
              onChange={(color) => {
                setSecondaryColor(color)
              }}
            /> */}
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                xs={6}
                style={{backgroundColor: "rgb(18, 18, 18)", height: "70vh"}}
                display={"flex"}
                alignItems={"flex-end"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                paddingBottom={2}
            >
                <Box
                    sx={{
                        backgroundColor: `${primaryColor || "#4203ee"}`,
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        width: "100%",
                    }}
                >
                    <IconButton
                        style={{color: getTextColor(`${primaryColor || "#4203ee"}`)}}
                        className="mr-4"
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h5"
                        style={{color: getTextColor(`${primaryColor || "#4203ee"}`)}} // Set text color
                    >
                        Hello World
                    </Typography>
                </Box>
                <Fab
                    size="small"
                    style={{
                        backgroundColor: `${secondaryColor || "#ED204C"}`,
                        marginRight: 20,
                    }}
                    aria-label="add"
                >
                    <Add
                        style={{color: getTextColor(`${secondaryColor || "#4203ee"}`)}}
                    />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default ThemeSelector;
