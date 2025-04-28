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
import {
  ADD_OPERATOR,
  ADD_PREFIX,
  EDIT_OPERATOR,
  EDIT_PREFIX,
} from "../../../../APIs/Configuration";
import { GET_ALL_COUNTRIES_API } from "../../../../APIs/Criteria";
import { useSnackbar } from "../../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../../Utils/Functions";
import addValidationSchema from "./addValidation";
import editValidationSchema from "./editValidation";
import { GET_OPERATORS } from "../../../../APIs/SMSAPIS";
import { AsyncPaginate } from "react-select-async-paginate";

function ManagePrefix({
  type,
  loading,
  setLoading,
  setManageAddPrefix,
  getAllPrefixes,
  selectedPrefix,
}) {
  const { showSnackbar } = useSnackbar();
  const [countries, SetCountries] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [randomValue, setRandomValue] = useState("");

  // Get all countries
  const GetAllCountries = async () => {
    try {
      let countriesResponse = await GET_ALL_COUNTRIES_API({
        pageSize: 500,
        pageNumber: 1,
      });
      SetCountries(countriesResponse?.data?.data?.countries);
    } catch (e) {
      Notification.error(e);
    }
  };

  const loadOperatorOptions = async (search, loadedOptions, { page }) => {
    try {
      let response = await GET_OPERATORS({
        iso: formik?.values?.country,
        pageNumber: page,
        pageSize: 10,
        search,
      });

      if (!response.status == "200") {
        throw new Error("Failed to fetch data");
      }

      const hasMore =
        (page - 1) * 10 + response?.data?.data?.items?.length <
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

  const handlePrefixChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("prefixNumber", value);
    }
  };

  const formik = useFormik({
    initialValues: {
      prefixNumber: type == "add" ? "" : selectedPrefix?.prefixNumber,
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
            PrefixNumber: values?.prefixNumber,
            OperatorGuid: values?.operator?.value,
            IsActive: values?.switchState,
          };

          let response = await ADD_PREFIX({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Prefix Added Successfully!");
            setManageAddPrefix(false);
            getAllPrefixes({});
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
            PrefixNumber: values?.prefixNumber,
            OperatorGuid: selectedPrefix?.operator?.recordGuid,
            IsActive: selectedPrefix?.isActive,
            recordGuid: selectedPrefix?.recordGuid,
          };

          let response = await EDIT_PREFIX({ postData: data });
          if (response?.data?.success) {
            showSnackbar("Prefix Updated Successfully!");
            setManageAddPrefix(false);
            getAllPrefixes({});
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
              key={"prefixNumber"}
              fullWidth
              id={"prefixNumber"}
              name={"prefixNumber"}
              label={"Prefix Number*"}
              variant="standard"
              type="text"
              value={formik?.values?.prefixNumber}
              onChange={handlePrefixChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.prefixNumber &&
                Boolean(formik.errors.prefixNumber)
              }
              helperText={
                formik.touched.prefixNumber && formik.errors.prefixNumber
              }
            />
          </FormControl>
        </Grid>
        {type == "add" && (
          <>
            <Grid item xs={12} sx={{ marginTop: "10px" }}>
              <FormControl
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
              </FormControl>
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

export default withTranslation("translations")(ManagePrefix);
