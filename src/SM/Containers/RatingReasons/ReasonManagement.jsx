import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ReasonDetails from "./ReasonDetails";
import GetActions from "../../Utils/GetActions";

function RatingReasonManagement() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              display={"flex"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <Grid item xs={12} md={4} mb={2}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">
                    Rating Reasons
                  </Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item xs={12} md={12}>
                <Card variant="outlined">
                  <CardContent className="card-styling">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="service tabs"
                      className="tab-styling"
                    >
                      <Tab label="Lock Rate" />
                      <Tab label="Unlock Rate" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                      <ReasonDetails ReasonTag="BILLING_RATE_PLAN_LOCK_REASONS" />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <ReasonDetails ReasonTag="BILLING_RATE_PLAN_UNLOCK_REASONS" />
                    </TabPanel>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default GetActions(RatingReasonManagement);
