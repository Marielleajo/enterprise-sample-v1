import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import bankingDetailsValidationSchema from "./bankingDetailsValidationSchema";
import { GET_ALL_COUNTRIES_API } from "../../../APIs/Criteria";

const AddBankingDetails = ({ t }) => {
  const { showSnackbar } = useSnackbar();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const history = useHistory();

  const GetAllCountries = async () => {
    setLoading(true);
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      setCountryOptions(countriesResponse?.data?.data?.countries);
      setLoading(false);
    } catch (e) {
      Notification.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetAllCountries();
  }, []);

  const formik = useFormik({
    initialValues: {
      country: "",
      iban: "",
      codeSwiftBic: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
      street: "",
      phoneNumber: "",
      postCode: "",
      city: "",
      swiftCorrespondent: "",
    },
    validationSchema: bankingDetailsValidationSchema,
    onSubmit: async (values) => {
      // let data = {
      //   TitleTag: "",
      //   TypeTag: "BUSINESS",
      //   Username: username ? username : values["email"],
      //   Password: values["password"],
      //   Name: values["clientName"],
      //   ParentId: selectedReseller,
      //   logoUrl: values["logoUrl"],
      //   PolicyId: values?.role,
      //   Contacts: [
      //     {
      //       TelephoneNumber: values["phone"],
      //       MobileNumber: values["phone"],
      //       Email: values["email"],
      //       CountryGuid: values["country"],
      //       ContactType: "HOME",
      //       FirstName: values["clientName"],
      //       // LastName: values["lastName"],
      //       CompanyWebsite: values["businesswebsite"],
      //       CompanyName: values["businesswebsite"],
      //     },
      //   ],
      //   Addresses: [
      //     {
      //       Street: values["street"] || null,
      //       CityGuid: values["city"] || null,
      //       Region: values["region"] || null,
      //       State: values["state"] || null,
      //       Zip: values["zip"] || null,
      //       Building: values["building"] || null,
      //       Floor: values["floor"] || null,
      //       RoomNumber: values["room"] || null,
      //       Address1: values["address1"] || null,
      //       Address2: values["address2"] || null,
      //     },
      //   ],
      //   Info: {
      //     BillingEmail: values?.BillingEmail || null,
      //     TechnicalEmail: values?.TechnicalEmail || null,
      //     AlertsEmail: values?.AlertsEmail || null,
      //     BusinessWebUrl: values?.BusinessWebUrl || null,
      //   },
      // };
      // data = removeNullKeys(data);
      // if (Object.keys(data?.Info)?.length == 0) delete data?.Info;
      // if (Object.keys(data?.Addresses[0])?.length == 0) delete data?.Addresses;
      // try {
      //   let recordResponse = await ADD_NEW_CLIENT({
      //     token,
      //     formData: data,
      //   });
      //   if (recordResponse?.data?.success) {
      //     showSnackbar("Client added successfully", "success");
      //     // Notification?.success("Reseller added successfully");
      //     SetGlobalData(updateState(GlobalData, "path", "main"));
      //     history?.push("/client/client-management");
      //   }
      // } catch (e) {
      //   showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      // }
    },
  });

  const theme = useTheme();

  return (
    <Grid container id="Client" className="page_container">
      <Grid container className="section_container scroll">
        <Grid item xs={12} className="sub_section_container">
          <Box>
            <Grid container columnGap={2} rowGap={0.5}>
              <Grid container direction={"row"} columnGap={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      error={
                        formik.touched["country"] &&
                        Boolean(formik.errors["country"])
                      }
                      id="category"
                    >
                      Country*
                    </InputLabel>
                    <Select
                      id="country" // Add an id for accessibility
                      name="country" // Name should match the field name in initialValues
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["country"] &&
                        Boolean(formik.errors["country"])
                      }
                      value={formik.values.country}
                      labelId="country"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {countryOptions?.map((country) => (
                        <MenuItem value={country?.recordGuid}>
                          {country?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {formik.touched.country && formik.errors.country && (
                    <FormHelperText
                      style={{ color: theme?.palette?.error?.main }}
                    >
                      {formik.errors.country}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" fullWidth>
                    <TextField
                      key={"iban"}
                      fullWidth
                      id={"iban"}
                      name={"iban"}
                      label={"IBAN*"}
                      variant="standard"
                      type={"text"}
                      value={formik?.values?.iban}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" fullWidth>
                    <TextField
                      key={"iban"}
                      fullWidth
                      id={"iban"}
                      name={"iban"}
                      label={"Code Swift Bic*"}
                      variant="standard"
                      type={"text"}
                      value={formik?.values?.iban}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Grid
            display={"flex"}
            flexDirection={"row"}
            style={{ width: "85%", marginTop: 20 }}
            justifyContent={"space-between"}
          >
            <Button
              onClick={() => history.push("/client/client-management")}
              className="mui-btn secondary filled"
            >
              Back
            </Button>
            <Button
              variant="contained"
              className="mui-btn primary filled"
              onClick={formik?.handleSubmit}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation("translation")(AddBankingDetails);
