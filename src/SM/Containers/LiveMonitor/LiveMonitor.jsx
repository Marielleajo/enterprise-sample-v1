import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./LiveMonitor.scss";
import MNPHLRService from "./MNPHLRService";
import SMSService from "./SMSService";
import WhatsAppService from "./WhatsAppService";

import { useSelector } from "react-redux";
import HandleServiceTag from "../../../Components/HanldeServiceTag";
import { useLocation, useParams } from "react-router-dom";

const LiveMonitor = () => {
  const page = "CDR/live-monitor";
  const location = useLocation();
  const [availableServices, setAvailableServices] = useState([]);
  const { service } = useParams();
  const [SelectedService, SetSelectedService] = useState(null);
  const [serviceTag, setServiceTag] = useState(null);

  const { services } = useSelector((state) => state.system);

  useEffect(() => {
    const pathService = location?.pathname?.split("/")[2];

    if (!pathService) {
      window.location.href = `/rates/${service}`;
    } else {
      const tag = HandleServiceTag(pathService);
      setServiceTag(pathService);
      const selectedServ = services?.find((x) => x?.tag === tag);
      SetSelectedService(selectedServ);
    }
  }, [location, service]);

  return (
    <Box className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        <>
          {serviceTag == "sms" && (
            <SMSService
              type={SelectedService}
              availableServices={availableServices?.length}
              selectedService={SelectedService}
              serviceTag={"one-way"}
            />
          )}

          {serviceTag == "two-way" && (
            <SMSService
              type={SelectedService}
              availableServices={availableServices?.length}
              selectedService={SelectedService}
              serviceTag={"two-way"}
            />
          )}
          {serviceTag == "mnp" && (
            <MNPHLRService
              availableServices={availableServices?.length}
              selectedService={SelectedService}
            />
          )}
          {serviceTag == "hlr" && (
            <MNPHLRService
              availableServices={availableServices?.length}
              selectedService={SelectedService}
            />
          )}
          {serviceTag == "whatsapp" && (
            <WhatsAppService
              availableServices={availableServices?.length}
              selectedService={SelectedService}
            />
          )}
        </>
      </Grid>
    </Box>
  );
};

export default LiveMonitor;
