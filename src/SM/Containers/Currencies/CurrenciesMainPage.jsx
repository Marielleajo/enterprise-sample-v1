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
import CurrenciesListing from "./CurrenciesListing";
import GetActions from "../../Utils/GetActions";

function CurrenciesMainPage() {
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
              justifyContent={"end"}
              alignItems={"center"}
            >
              {/* <Grid item xs={12} md={4}>
                <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
                  <Typography className="BreadcrumbsPage">Billing</Typography>
                  <Typography className="breadcrumbactiveBtn">
                    Currencies
                  </Typography>
                </Breadcrumbs>
              </Grid> */}
              <Grid item xs={12} md={12}>
                {/* <Card variant="outlined"> */}
                {/* <CardContent className="card-styling"> */}
                {/* <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="service tabs"
                      className="tab-styling"
                    > */}
                {/* <Tab label="Listing" /> */}
                {/* <Tab label="Without Missing Exchange Rate" /> */}
                {/* </Tabs> */}
                {/* <TabPanel value={value} index={0}> */}
                <CurrenciesListing />
                {/* </TabPanel>
                    <TabPanel value={value} index={1}></TabPanel>
                  </CardContent> */}
                {/* </Card> */}
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

export default GetActions(CurrenciesMainPage);
