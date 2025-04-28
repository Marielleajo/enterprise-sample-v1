import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AccountStatus from "./AccountStatus";
import AccountType from "./AccountType";
import ProfitMargin from "./ProfitMargin";
import GetActions from "../../Utils/GetActions";
import TabsComponent from "../../../Components/Tabs/Tabs";

function ConfigMainPage() {
  const [value, setValue] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [headerRight, setHeaderRight] = useState(null);
  const handleChange = (value) => {
    setHeaderRight(null);
    setSelectedTab(value);
  };

  const tabs = [
    { text: "Status", value: 0 },
    { text: "Type", value: 1 },
    { text: "Profit Margin", value: 2 },
  ];
  return (
    <>
      <Box className="page_container">
        <Grid container columnSpacing={3} className="section_container scroll">
          <Grid item xs={12} className="sub_section_container">
            <Grid
              container
              className="pt-4"
              paddingRight={2.5}
              paddingLeft={2.5}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <TabsComponent
                  options={tabs}
                  option={selectedTab}
                  onClick={handleChange}
                />
              </Grid>
              <Grid item>{headerRight}</Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              <TabPanel value={selectedTab} index={0}>
                <AccountStatus setHeaderRight={setHeaderRight} />
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                <AccountType setHeaderRight={setHeaderRight} />
              </TabPanel>
              <TabPanel value={selectedTab} index={2}>
                <ProfitMargin />
              </TabPanel>
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

export default GetActions(ConfigMainPage);
