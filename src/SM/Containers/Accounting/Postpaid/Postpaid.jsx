import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import HandleServiceTag from "../../../../Components/HanldeServiceTag";
import Clients from "./Clients";
import Providers from "./Providers";
import GetActions from "../../../Utils/GetActions";
import TabsComponent from "../../../../Components/Tabs/Tabs.jsx";

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
  }, [location, service]);

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
            <Grid item xs={12} md={12}>
              <Box>
                <TabsComponent
                  options={[
                    { text: "Clients", value: 0 },
                    { text: "Providers", value: 1 },
                  ]}
                  option={value}
                  onClick={setValue}
                />
              </Box>
              {value === 0 && (
                <Clients serviceGuid={serviceGuid} channelGuid={channelGuid} />
              )}
              {value === 1 && (
                <Providers
                  serviceGuid={serviceGuid}
                  channelGuid={channelGuid}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
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
