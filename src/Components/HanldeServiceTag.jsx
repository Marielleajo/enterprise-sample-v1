export default function HandleServiceTag(service) {
  let tag = "";
  if (service == "sms") {
    tag = "ONE_WAY_SMS";
  } else if (service == "sms-two-way") {
    tag = "TWO_WAY_SMS";
  } else if (service == "hlr") {
    tag = "HLR";
  } else if (service == "mnp") {
    tag = "MNP";
  } else if (service == "push-notification") {
    tag = "PUSH_NOTIFICATION";
  } else if (service == "whatsapp") {
    tag = "WHATSAPP";
  } else if (service == "viber") {
    tag = "VIBER";
  } else if (service == "obd") {
    tag = "SIP";
  }
   else if (service == "email") {
    tag = "EMAIL";
  }
   else if (service == "instagram") {
    tag = "INSTAGRAM";
  }

  return tag;
}
