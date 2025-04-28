import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { CssBaseline, Grid } from "@mui/material";
import { Global } from "@emotion/react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function SwipeableEdgeDrawer(props) {
  const { window, title, body, open, setToggleTestIntegration } = props;

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            // height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={setToggleTestIntegration(false)}
        onOpen={setToggleTestIntegration(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Grid container>
            <Grid item xs={10} display="flex" justifyContent={"start"}>
              <Typography variant="h5" sx={{ p: 2, color: "text.secondary" }}>
                {title}
              </Typography>
            </Grid>
            {<Grid item xs={2} display="flex" justifyContent={"center"}>
              <button
                style={{ background: "transparent", border: "none" }}
                onClick={() => setToggleTestIntegration(false)}
              >
                <HighlightOffIcon />
              </button>
            </Grid>}
          </Grid>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            py: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          {body}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
