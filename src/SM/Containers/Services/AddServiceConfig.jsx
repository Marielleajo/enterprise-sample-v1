import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSnackbar } from "../../../Contexts/SnackbarContext";

const AddServiceConfig = ({ t, selectedService, type, setGoToConfigPage }) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  return (
    <Grid container id="Reseller" className="page_container">
      <Grid container className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Box className="pt-4">
            <Grid
              style={{ marginBottom: "20px" }}
              item
              xs={12}
              md={12}
              className="centerresponsive"
            >
              <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                <Typography
                  style={{
                    cursor: "pointer",
                  }}
                  className="BreadcrumbsPage"
                  onClick={() => setGoToConfigPage(false)}
                >
                  Service
                </Typography>
                <Typography className="breadcrumbactiveBtn">
                  Manage Configuration
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation("translation")(AddServiceConfig);
