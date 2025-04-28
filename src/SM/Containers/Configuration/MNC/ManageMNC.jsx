import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { ADD_MNC, EDIT_MNC } from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import { GET_OPERATORS } from "../../../../APIs/SMSAPIS";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import { AsyncPaginate } from "react-select-async-paginate";
import CustomAsyncPaginate from "../../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";

function ManageMNC({
  type,
  loading,
  setLoading,
  setManageAddMNC,
  getAllMNC,
  selectedMNC,
}) {
  const { showSnackbar } = useSnackbar();
  const [countries, SetCountries] = useState([]);
  const [randomValue, setRandomValue] = useState("");

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({});
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      console.log(e);
      // Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: formik?.values?.country.value,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 5 + response?.data?.data?.items?.length <
        response?.data?.data?.totalRows;

      return {
        options: response?.data?.data?.items?.map((item) => ({
          value: item?.recordGuid,
          label: item?.name,
        })),
        hasMore,
        additional: {
          page: page + 1,
        },
      };
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
      return { options: [], hasMore: false }; // Return empty options and mark as no more data
    }
  };

  const handleMNCChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("MNCNumber", value);
    }
  };

  const handleMCCChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("MCCNumber", value);
    }
  };

  const formik = useFormik({
    initialValues: {
      MNCNumber: type == "add" ? "" : selectedMNC?.mnc,
      MCCNumber: type == "add" ? "" : selectedMNC?.mcc,
      country: "",
      operator: "",
      switchState: false,
    },
    validationSchema:
      type == "add" ? addValidationSchema : editValidationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        setLoading(true);
        try {
          let data = {
            Mnc: values?.MNCNumber,
            Mcc: values?.MCCNumber,
            OperatorGuid: values?.operator?.value,
            IsActive: values?.switchState,
          };

          let response = await ADD_MNC({ postData: data });
          if (response?.data?.success) {
            showSnackbar("MNC Added Successfully!");
            setManageAddMNC(false);
            getAllMNC({});
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
            Mnc: values?.MNCNumber,
            Mcc: values?.MCCNumber,
            OperatorGuid: selectedMNC?.operator?.recordGuid,
            IsActive: selectedMNC?.isActive,
            recordGuid: selectedMNC?.recordGuid,
          };

          let response = await EDIT_MNC({ postData: data });
          if (response?.data?.success) {
            showSnackbar("MNC Updated Successfully!");
            setManageAddMNC(false);
            getAllMNC({});
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
    GetAllCountries();
  }, []);

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Grid container>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"MCCNumber"}
              fullWidth
              id={"MCCNumber"}
              name={"MCCNumber"}
              label={"MCC Number*"}
              variant="standard"
              type="text"
              value={formik?.values?.MCCNumber}
              onChange={handleMCCChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.MCCNumber && Boolean(formik.errors.MCCNumber)
              }
              helperText={formik.touched.MCCNumber && formik.errors.MCCNumber}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "10px" }}>
          <FormControl variant="standard" fullWidth>
            <TextField
              key={"MNCNumber"}
              fullWidth
              id={"MNCNumber"}
              name={"MNCNumber"}
              label={"MNC Number*"}
              variant="standard"
              type="text"
              value={formik?.values?.MNCNumber}
              onChange={handleMNCChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.MNCNumber && Boolean(formik.errors.MNCNumber)
              }
              helperText={formik.touched.MNCNumber && formik.errors.MNCNumber}
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
                    setRandomValue(Math.random());
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
                </Select>
                {formik.touched.country && formik.errors.country && (
                  <FormHelperText>{formik.errors.country}</FormHelperText>
                )}
              </FormControl> */}
              <CustomAsyncPaginate
                apiFunction={GET_ALL_COUNTRIES_API} // Pass the function directly
                value={formik.values.country}
                onChange={(value) => {
                  formik.setFieldValue("country", value);
                  setRandomValue(Math.random());
                }}
                placeholder="Country *"
                pageSize={10}
                dataPath="data.data.countries" // Adjust path based on API response structure
                totalRowsPath="data.data.totalRows"
                method="GET"
                id={`async-menu-style-accounts`}
              />
              {formik.touched.country && formik.errors.country && (
                <FormHelperText>{formik.errors.country}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              {formik.touched.country != "" &&
              formik.touched.country != undefined ? (
                <InputLabel
                  error={
                    formik?.touched["operator"] &&
                    Boolean(formik?.errors["operator"])
                  }
                  helperText={
                    formik?.touched["operator"] && formik?.errors["operator"]
                  }
                  sx={{ fontSize: "12px", marginBottom: "-5px" }}
                >
                  Operator
                </InputLabel>
              ) : (
                <InputLabel sx={{ marginTop: "10px" }} />
              )}
              <AsyncPaginate
                key={randomValue}
                id="async-menu-style"
                onChange={(value) => {
                  formik.setFieldValue("operator", value);
                }}
                value={formik?.values?.operator}
                loadOptions={loadOperatorOptions}
                additional={{
                  page: 1,
                }}
                isDisabled={
                  formik?.values?.country == "" ||
                  formik?.values?.country == undefined
                }
                placeholder="Operator"
                classNamePrefix="react-select"
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    maxHeight: 150, // Adjust height as needed
                    overflow: "hidden", // Hide scrollbar
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 150, // Adjust height as needed
                    overflowY: "auto", // Enable vertical scroll if needed
                  }),
                }}
              />
              {formik?.touched?.operator && formik?.errors?.operator && (
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {formik?.errors?.operator}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "20px" }}>
              <InputLabel id="country-label">Status</InputLabel>
              <FormControlLabel
                control={
                  <>
                    <Switch
                      checked={formik?.values.switchState}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "switchState",
                          !formik?.values.switchState
                        );
                      }}
                    />
                  </>
                }
                label={formik?.values.switchState ? "Active" : "Inactive"}
              />
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

export default withTranslation("translations")(ManageMNC);
