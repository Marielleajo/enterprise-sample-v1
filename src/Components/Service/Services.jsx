import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

const ServicesComponent = ({
  SelectedService,
  SetSelectedService,
  page,
  availableServices,
  setAvailableServices,
}) => {
  const history = useHistory();
  let { services } = useSelector((state) => state?.system);
  const { service } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let filteredServices = [];

    if (page == "broadcast") {
      filteredServices = services?.filter((item) =>
        item?.serviceConfig?.some(
          (itemConfig) =>
            itemConfig?.key?.toLowerCase() === "isbroadcast" &&
            itemConfig?.value == "true"
        )
      );
    } else if (page == "template") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "istemplate" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "CDR/live-monitor") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "islivemonitor" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "integration") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isintegration" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "apis") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isapi" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "channel-management") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "ischannelmanagement" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "single-message") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isbroadcast" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "CDR/generateCDR") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isgeneratecdr" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "analytics/analyse") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isanalyze" &&
              itemConfig?.value == "true"
          )
      );
    } else if (page == "analytics/report") {
      filteredServices = services?.filter(
        (item) =>
          item?.serviceConfig?.length > 0 &&
          item?.serviceConfig?.some(
            (itemConfig) =>
              itemConfig?.key?.toLowerCase() == "isreport" &&
              itemConfig?.value == "true"
          )
      );
    } else {
      filteredServices = services;
    }

    setAvailableServices(
      filteredServices?.map((item) => {
        return {
          id:
            item?.tag == "ONE_WAY_SMS"
              ? "one-way"
              : item?.tag == "TWO_WAY_SMS"
              ? "two-way"
              : item?.tag == "MNP"
              ? "mnp"
              : item?.tag == "HLR"
              ? "hlr"
              : item?.tag == "WHATSAPP"
              ? "whatsapp"
              : item?.tag == "PUSH_NOTIFICATION"
              ? "push-notification"
              : item?.tag == "EXTERNAL_SOURCE"
              ? "external-source"
              : item?.tag == "SIP"
              ? "sip"
              : item?.tag == "INBOX"
              ? "inbox"
              : "",
          service: item?.serviceDetails[0]?.name,
          description: item?.serviceDetails[0]?.description,
          icon:
            item?.tag == "ONE_WAY_SMS"
              ? "sms"
              : item?.tag == "TWO_WAY_SMS"
              ? "sms"
              : item?.tag == "MNP"
              ? "lookup"
              : item?.tag == "HLR"
              ? "lookup"
              : item?.tag == "WHATSAPP"
              ? "whatsapp"
              : item?.tag == "PUSH_NOTIFICATION"
              ? "push"
              : item?.tag == "EXTERNAL_SOURCE"
              ? "external-source"
              : item?.tag == "SIP"
              ? "sip"
              : item?.tag == "INBOX"
              ? "inbox"
              : "",
          path:
            item?.tag == "ONE_WAY_SMS"
              ? "one-way"
              : item?.tag == "TWO_WAY_SMS"
              ? "two-way"
              : item?.tag == "MNP"
              ? "mnp"
              : item?.tag == "HLR"
              ? "hlr"
              : item?.tag == "WHATSAPP"
              ? "whatsapp"
              : item?.tag == "PUSH_NOTIFICATION"
              ? "push-notification"
              : item?.tag == "EXTERNAL_SOURCE"
              ? "external-source"
              : item?.tag == "SIP"
              ? "sip"
              : item?.tag == "INBOX"
              ? "inbox"
              : "",
          tag: item?.tag,
          channel: item?.channel,
          recordGuid: item?.recordGuid,
          isSubscribed: item?.isSubscribed,
          features: item?.features,
        };
      })
    );
  }, []);

  useEffect(() => {
    SetSelectedService(null);
    if (!service) {
      if (availableServices?.length > 0) {
        SetSelectedService(availableServices[0]);
        history.push(`/${page}/` + availableServices[0]?.id);
      }
    } else if (service == "two-way" || service == "sms-two-way") {
      SetSelectedService(
        availableServices?.find((item) => item?.id == "two-way")
      );
    } else if (service == "one-way" || service == "sms-one-way") {
      SetSelectedService(
        availableServices?.find((item) => item?.id == "one-way")
      );
    } else if (service == "sip") {
      SetSelectedService(availableServices?.find((item) => item?.id == "sip"));
    } else if (service == "mnp") {
      SetSelectedService(availableServices?.find((item) => item?.id == "mnp"));
    } else if (service == "hlr") {
      SetSelectedService(availableServices?.find((item) => item?.id == "hlr"));
    } else if (service == "push-notification") {
      SetSelectedService(
        availableServices.find((item) => item?.id == "push-notification")
      );
    } else if (service == "sip") {
      SetSelectedService(availableServices.find((item) => item?.id == "sip"));
    } else if (
      service == "whatsapp" ||
      service == "add-whatsapp" ||
      service == "view-whatsapp"
    ) {
      SetSelectedService(
        availableServices?.find((item) => item?.id == "whatsapp")
      );
    } else if (service == "external-source") {
      SetSelectedService(
        availableServices?.find((item) => item?.id == "external-source")
      );
    } else if (service == "inbox") {
      SetSelectedService(
        availableServices?.find((item) => item?.id == "inbox")
      );
    }
  }, [availableServices, service]);

  return (
    <>
      {availableServices?.length > 1 && (
        <>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            className="left_container pt-4"
          >
            {/* <Box marginBottom={3}>
              <Typography variant="h5"> Hello </Typography>
              <Typography className="description" variant="p">
                {SelectedService?.description}
              </Typography>
            </Box> */}
            <Grid container gap={2}>
              {availableServices?.map((service) => (
                <Tooltip title={service?.service}>
                  <Grid
                    item
                    xs={12}
                    onClick={() => {
                      history.push(`/${page}/${service?.id}`);
                      // SetSelectedService(service);
                    }}
                    className={`service feature-show ${
                      service?.icon ?? "sms"
                    }-badge  ${SelectedService?.id == service?.id && "active"}`}
                  >
                    <Typography variant="p" fontWeight={"500"}>
                      {service?.service}
                    </Typography>
                  </Grid>
                </Tooltip>
              ))}
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={3}
            sx={{ display: { xs: "block", sm: "none" } }}
            className="responsive-container pt-4"
          >
            <Autocomplete
              id="combo-box-services"
              options={availableServices}
              value={SelectedService}
              getOptionLabel={(option) => option?.service}
              disableClearable={true}
              onChange={(e, value) => {
                history.push(`/${page}/${value?.id}`);
                SetSelectedService(value);
              }}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Service" variant="standard" />
              )}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default ServicesComponent;
