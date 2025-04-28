import { Box, Grid } from "@mui/material";
import React from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ServiceUnavailable from "../../../Subscribe/ServiceUnavailable";
import NewSMSService from "./Services/NewSMS";
import ResellerNewSMSService from "./Services/ResellerNewSMS";
import GetActions from "../../../Utils/GetActions";

const APIsPage = ({ t, actions }) => {
  const page = "apis";
  let { services } = useSelector((state) => state?.system);
  const isAnySubscribed = services?.some((obj) => obj.isSubscribed === true);
  const { typeTag } = useSelector((state) => state?.authentication);

  return (
    <Box id="APIs" className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        {isAnySubscribed ? (
          typeTag == "RESELLER" ? (
            <ResellerNewSMSService
              actions={actions}
              services={services}
              pageType={page}
            />
          ) : (
            <NewSMSService
              actions={actions}
              services={services}
              pageType={page}
            />
          )
        ) : (
          <ServiceUnavailable services={services} />
        )}
      </Grid>
    </Box>
  );
};

export default withTranslation("translation")(GetActions(APIsPage));
