import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, Grid, IconButton } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import React from "react";
import { withTranslation } from "react-i18next";
import "./DynamicFilters.scss";

const DynamicFilters = ({
  isOpen,
  toggle,
  loading,
  t,
  children,
  handleSearch,
  handleClearFilters,
}) => {
  return (
    <MuiDrawer
      anchor="right"
      open={isOpen}
      onClose={toggle}
      sx={{
        "& .MuiPaper-root": {
          width: 300,
        },
      }}
    >
      <Grid container padding={3} rowSpacing={2}>
        <Grid item xs={6} justify="flex-start" display="flex">
          <IconButton
            className="p-0"
            style={{
              borderRadius: "30px",
              width: "25px",
              height: "25px",
            }}
            id="close-icon"
            onClick={toggle}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <Button
            id="clear-filter"
            onClick={handleClearFilters}
            variant="outlined"
            className="mui-btn primary outlined"
            disabled={loading}
          >
            {t(loading ? "Loading..." : "Clear Filters")}
          </Button>
        </Grid>

        {/* Render filter components provided as children */}
        <Grid item xs={12}>
          {children}
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleSearch}
            disabled={loading}
            id="handle-search"
            variant="contained"
            className="mui-btn primary filled"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("Search")
            )}
          </Button>
        </Grid>
      </Grid>
    </MuiDrawer>
  );
};

export default withTranslation("translation")(DynamicFilters);
