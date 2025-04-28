import { Autocomplete, Box, FormControl, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { GET_ALL_CLIENT_API } from "../../../APIs/Clients";
import ServicesComponent from "../../../../Components/Services/Services";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import ServiceUnavailable from "../../Subscribe/ServiceUnavailable";
import WhatsappSignUp from "../../Subscribe/WhatsappSignUp";
import SMSService from "./Services/SMS";

const APIsPage = ({ t }) => {
  const page = "apis";
  const { service } = useParams();
  let { services, whatsappConfig } = useSelector((state) => state?.system);
  const history = useHistory();
  const { clientId, typeTag } = useSelector((state) => state?.authentication);

  const [availableServices, setAvailableServices] = useState([]);
  const [SelectedService, SetSelectedService] = useState(null);
  const [clients, setClients] = useState(null);
  const [clientOption, setClientOption] = useState(null);
  const { showSnackbar } = useSnackbar();
  const { sass } = useSelector((state) => state);
  const getAllClients = async ({ search = null }) => {
    try {
      let resellersResponse = {};
      if (sass?.KYC_ENABLED === "true") {
        resellersResponse = await GET_ALL_CLIENT_API({
          name: search,
          pageSize: 50,
          pageNumber: 1,
          ParentGuid: clientId,
          kyc: 3,
        });
      } else {
        resellersResponse = await GET_ALL_CLIENT_API({
          name: search,
          pageSize: 50,
          pageNumber: 1,
          ParentGuid: clientId,
        });
      }
      setClients(resellersResponse?.data?.data?.clients);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (typeTag == "RESELLER") {
      if (location?.state?.resellerClientID != undefined) {
        setClientOption(location?.state?.resellerClientID);
      }
      getAllClients({});
    }
  }, []);

  return (
    <Box id="APIs" className="page_container">
      <Grid container columnSpacing={3} className="section_container scroll">
        {typeTag == "RESELLER" && (
          <>
            <Grid item xs="6" />
            <Grid item xs="2" display={"flex"} justifyContent={"end"}>
              <FormControl fullWidth variant="standard">
                <Autocomplete
                  options={clients?.length > 0 ? clients : []}
                  getOptionLabel={(option) => option?.firstName}
                  onChange={(e, value) => {
                    return setClientOption(value);
                  }}
                  value={clientOption}
                  id="select-app"
                  onInputChange={(e, newValue) => {
                    if (!newValue || e?.target?.value) {
                      getAllClients({ search: e?.target?.value });
                    }
                  }}
                  onClose={(event, reason) => {
                    if (reason === "selectOption" || reason === "blur") {
                    } else if (
                      reason === "toggleInput" ||
                      event?.target?.textContent == ""
                    ) {
                      getAllClients({});
                    }
                  }}
                  filterOptions={(options, params) => {
                    return options;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Client"
                      variant="standard"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs="4" />
          </>
        )}
        <ServicesComponent
          SelectedService={SelectedService}
          SetSelectedService={SetSelectedService}
          availableServices={availableServices}
          setAvailableServices={setAvailableServices}
          page={page}
        />

        {SelectedService?.isSubscribed ? (
          <>
            {SelectedService?.id == "whatsapp" ? (
              whatsappConfig?.length > 0 ? (
                <>
                  <SMSService
                    service={SelectedService}
                    availableServices={availableServices?.length}
                    pageType={page}
                    resellerClient={clientOption}
                  />
                </>
              ) : (
                <WhatsappSignUp
                  availableServices={availableServices?.length}
                  selectedService={SelectedService}
                  resellerClient={clientOption}
                />
              )
            ) : (
              <SMSService
                service={SelectedService}
                availableServices={availableServices?.length}
                pageType={page}
                resellerClient={clientOption}
              />
            )}
          </>
        ) : (
          <ServiceUnavailable
            availableServices={availableServices?.length}
            selectedService={SelectedService}
          />
        )}
      </Grid>
    </Box>
  );
};

export default withTranslation("translation")(APIsPage);
