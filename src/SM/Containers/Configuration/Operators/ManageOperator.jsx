import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { ADD_OPERATOR, EDIT_OPERATOR } from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function ManageOperator({
  type,
  loading,
  setLoading,
  setManageAddOperator,
  getAllOperators,
  selectedOperator,
}) {
  const { showSnackbar } = useSnackbar();
  // const [countries, SetCountries] = useState([]);

  // Get all countries
  // const GetAllCountries = async () => {
  //   try {
  //     let countriesResponse = await GET_ALL_COUNTRIES_API({});
  //     SetCountries(countriesResponse?.data?.data?.countries);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const handleMccChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("mcc", value);
    }
  };

  const handleMncChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("mnc", value);
    }
  };

  const formik = useFormik({
    initialValues: {
      mnc: "",
      mcc: "",
      name: type == "add" ? "" : selectedOperator?.name,
      country: "",
    },
    validationSchema:
      type == "add" ? addValidationSchema : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            Name: values?.name,
            CountryGuid: values?.country.value,
            IsActive: true,
            Mnc: values?.mnc,
            Mcc: values?.mcc,
          };

          let response = await ADD_OPERATOR({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Operator Added Successfully!");
            setManageAddOperator(false);
            getAllOperators({});
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          let data = {
            Name: values?.name,
            recordGuid: selectedOperator?.recordGuid,
          };

          let response = await EDIT_OPERATOR({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Operator Updated Successfully!");
            setManageAddOperator(false);
            getAllOperators({});
          }
        } catch (e) {
          showSnackbar(handleMessageError({ e, type: "validation" }), "error");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  useEffect(() => {
    // GetAllCountries();
  }, []);

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"name"}
              fullWidth
              id={"name"}
              name={"name"}
              label={"Operator Name*"}
              variant="standard"
              type="text"
              value={formik?.values?.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>
        </Grid>
        {type == "add" && (
          <>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              {/* <FormControl
                fullWidth
                variant="standard"
                error={formik.touched.country && Boolean(formik.errors.country)}
              >
                <InputLabel id="country-label">Country *</InputLabel>
                <Select
                  key="country"
                  id="country"
                  name="country"
                  label="Country"
                  labelId="country-label"
                  onChange={(e) => {
                    formik.setFieldValue("country", e.target.value);
                  }}
                  value={formik.values.country}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem
                      key={country.recordGuid}
                      value={country.recordGuid}
                    >
                      {country.name}
                    </MenuItem>
                  ))}
                </Select> */}
              <CustomAsyncPaginate
                apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                value={formik?.values?.country}
                onChange={(value) => {
                  formik.setFieldValue("country", value);
                }}
                placeholder="Country *"
                pageSize={10}
                dataPath="data.data.countries" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style`}
              />
              {formik.touched.country && formik.errors.country && (
                <FormHelperText>{formik.errors.country}</FormHelperText>
              )}
              {formik.touched.country && formik.errors.country && (
                <FormHelperText>{formik.errors.country}</FormHelperText>
              )}
              {/* </FormControl> */}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              <FormControl variant="standard" fullWidth>
                <TextField
                  key={"mcc"}
                  fullWidth
                  id={"mcc"}
                  name={"mcc"}
                  label={"MCC*"}
                  variant="standard"
                  type="text"
                  value={formik?.values?.mcc}
                  onChange={handleMccChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mcc && Boolean(formik.errors.mcc)}
                  helperText={formik.touched.mcc && formik.errors.mcc}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              <FormControl variant="standard" fullWidth>
                <TextField
                  key={"mnc"}
                  fullWidth
                  id={"mnc"}
                  name={"mnc"}
                  label={"MNC*"}
                  variant="standard"
                  type="text"
                  value={formik?.values?.mnc}
                  onChange={handleMncChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mnc && Boolean(formik.errors.mnc)}
                  helperText={formik.touched.mnc && formik.errors.mnc}
                />
              </FormControl>
            </Grid>
          </>
        )}
        <Grid
          item
          xs={12}
          sx={{ marginTop: "20px" }}
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="send-service-provider-id"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageOperator);
