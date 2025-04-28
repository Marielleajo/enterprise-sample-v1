import React from "react";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const ApproveModal = ({ open, onClose, options, formik, loading }) => {
  const handleNumberChange = (e) => {
    let value = e.target.value;

    // If the value is empty or just a negative sign, allow it
    if (value === "" || value === "-") {
      formik.setFieldValue("BalanceLimit", value);
      return;
    }

    // Ensure the value starts with a negative sign and follows the number pattern
    if (/^-?\d*\.?\d*$/.test(value)) {
      if (!value.startsWith("-")) {
        value = `-${value}`;
      }
      formik.setFieldValue("BalanceLimit", value);
      formik.validateField("BalanceLimit");
    }
  };
  const handleThreshholdChange = (e) => {
    let value = e.target.value;
    if (value === "" || value === "-") {
      formik.setFieldValue("Threshold", value);
      return;
    }

    // Ensure valid number
    if (/^-?\d*\.?\d*$/.test(value)) {
      formik.setFieldValue("Threshold", value);
      formik.validateField("Threshold");
    }
  };

  return (
    <MuiModal
      title={"Approve Reseller"}
      open={open}
      width="500px"
      id="edit-contact-form"
      handleClose={onClose}
    >
      <Grid item xs={4}>
        <Autocomplete
          clearIcon={null}
          name="resellerCategoryGuid"
          id="combo-box-demo"
          options={options}
          getOptionLabel={(option) =>
            option?.clientCategoryDetails[0]?.name || ""
          }
          onChange={(e, newValue) => {
            formik.setFieldValue("resellerCategoryGuid", newValue?.recordGuid);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Reseller Category"
              name="resellerCategoryGuid"
              error={
                formik.touched.resellerCategoryGuid &&
                Boolean(formik.errors.resellerCategoryGuid)
              }
              helperText={
                formik.touched.resellerCategoryGuid &&
                formik.errors.resellerCategoryGuid
              }
            />
          )}
        />
        <Autocomplete
          sx={{ mt: 3 }}
          clearIcon={null}
          name={"AccountTypeTag"}
          multiple
          id="combo-box-demo"
          options={[
            { label: "POSTPAID", value: "POSTPAID" },
            { label: "PREPAID", value: "PREPAID" },
          ].filter(
            (option) => !formik.values.AccountTypeTag.includes(option.value)
          )}
          getOptionLabel={(option) => option?.label || ""}
          onChange={(e, newValue) => {
            formik.setFieldValue(
              "AccountTypeTag",
              newValue.map((item) => item.value)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Account Type"
              name="AccountTypeTag"
              error={
                formik.touched.AccountTypeTag &&
                Boolean(formik.errors.AccountTypeTag)
              }
              helperText={
                formik.touched.AccountTypeTag && formik.errors.AccountTypeTag
              }
            />
          )}
        />
        {formik?.values?.AccountTypeTag?.includes("POSTPAID") && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600 }}>
              PostPaid Details
            </Typography>
            <Grid item xs={12} mt={1}>
              <TextField
                fullWidth
                id={"BalanceLimit"}
                name={"BalanceLimit"}
                label={"Balance Limit"}
                variant="standard"
                type="text"
                value={formik.values.BalanceLimit}
                onChange={handleNumberChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.BalanceLimit &&
                  Boolean(formik.errors.BalanceLimit)
                }
                helperText={
                  formik.touched.BalanceLimit && formik.errors.BalanceLimit
                }
                // disabled={unlimetedBalance}
              />
            </Grid>
            <Grid item xs={12} mt={3}>
              <TextField
                fullWidth
                variant="standard"
                name="Threshold"
                label="Threshold"
                // value={formik?.values?.Threshold}
                value={formik.values.Threshold}
                onChange={handleThreshholdChange}
                type="text"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.Threshold && Boolean(formik.errors.Threshold)
                }
                helperText={formik.touched.Threshold && formik.errors.Threshold}
                InputProps={{
                  endAdornment: <Typography>%</Typography>, // Show "%" but store number
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          className="mui-btn primary filled"
          id="add-Industry"
          onClick={formik.handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size="23px" /> : "Approve"}
        </Button>
      </Box>
    </MuiModal>
  );
};

export default ApproveModal;
