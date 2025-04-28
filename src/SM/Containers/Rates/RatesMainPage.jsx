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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import GetActions from "../../Utils/GetActions";
import ConfiguredRates from "./ConfiguredRates";
import { useLocation } from "react-router-dom";

function RatesMainPage() {
  const location = useLocation();
  const [service, setService] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [value, setValue] = useState(0);

  const { services } = useSelector((state) => state.system);

  useEffect(() => {
    const pathService = location?.pathname?.split("/")[2];
    if (!pathService) {
      console.log("Service not found in URL, redirecting to default");
      window.location.href = `/rates/${service}`;
    } else {
      setService(pathService);
      const tag = HandleServiceTag(pathService);
      setServiceTag(tag);
    }
  }, [location.pathname, service]);

  useEffect(() => {
    const tagMapping = ["sms-one-way", "voice", "email"];
    const tag = tagMapping[value];
    setServiceTag(tag);
  }, [value]);

  const serviceGuid = services?.find((x) => x?.tag === serviceTag)?.recordGuid;
  const channelGuid = services?.find((x) => x?.tag === serviceTag)?.channelGuid;

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
                  <Typography className="BreadcrumbsPage">Rates</Typography>
                  <Typography className="breadcrumbactiveBtn">
                    {service?.length < 4
                      ? service?.toUpperCase()
                      : service
                          ?.split("-") // Split the string by hyphens
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize the first letter of each word
                          .join(" ")}
                  </Typography>
                </Breadcrumbs>
              </Grid> */}
              <Grid item xs={12} md={12}>
                {/* <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="service tabs"
                      className="tab-styling"
                    >
                      <Tab label="Configured Rates" /> */}
                {/* <Tab label="Missing Rates" /> */}
                {/* </Tabs> */}
                {/* <TabPanel value={value} index={0}> */}
                <ConfiguredRates
                  serviceGuid={serviceGuid}
                  channelGuid={channelGuid}
                />
                {/* </TabPanel> */}
                {/* <TabPanel value={value} index={1}>
                      <MissingRates
                        serviceGuid={serviceGuid}
                        channelGuid={channelGuid}
                      />
                    </TabPanel> */}
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

export default RatesMainPage;
