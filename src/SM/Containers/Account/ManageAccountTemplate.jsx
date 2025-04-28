import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { useFormik } from "formik";
import React from "react";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import {
  ADD_ACCOUNT_TEMPLATE,
  UPDATE_ACCOUNT_TEMPLATE
} from "../../../APIs/Account";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";

function ManageAccountTemplate({
  type,
  loading,
  setLoading,
  accountTypeChoices,
  fees,
  discounts,
  limits,
  selectedAccountTemplate,
  accountCategoryChoices,
  getAllAccountTemplate,
  setAddAccountTemplate,
  setEditAccountTemplate,
}) {
  const { showSnackbar } = useSnackbar();

  const ValidationSchema = Yup.object({
    TypeId: Yup.string().required("Type is required"),
    CategoryId: Yup.string().required("Category is required"),
    Description: Yup.string().required("Description is required"),
    Services: Yup.array()
      .of(Yup.string())
      .min(1, "Services is required")
      .required("Services is required"),
    Limits: Yup.array()
      .of(Yup.string())
      .min(1, "Limits is required")
      .required("Limits is required"),
    Discounts: Yup.array()
      .of(Yup.string())
      .min(1, "Discounts is required")
      .required("Discounts is required"),
    Fees: Yup.array()
      .of(Yup.string())
      .min(1, "Fees is required")
      .required("Fees is required"),
  });

  const { services } = useSelector((state) => state.system);

  const formik = useFormik({
    initialValues: {
      TypeId: type == "add" ? "" : selectedAccountTemplate?.accountTypeId || "",
      CategoryId:
        type == "add" ? "" : selectedAccountTemplate?.accountCategoryId || "",
      Description:
        type === "add" ? "" : selectedAccountTemplate?.description || "",
      Services:
        type == "add"
          ? []
          : selectedAccountTemplate?.clientAccountServices.map(
              (s) => s.service.recordGuid
            ) || [],
      Limits:
        type == "add"
          ? []
          : selectedAccountTemplate?.limits.map((item) => item.recordGuid) ||
            [],
      Discounts:
        type == "add"
          ? []
          : selectedAccountTemplate?.discounts.map((item) => item.recordGuid) ||
            [],
      Fees:
        type == "add"
          ? []
          : selectedAccountTemplate?.fees.map((item) => item.recordGuid) || [],
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let editData = {
          RecordGuid: selectedAccountTemplate?.recordGuid,
          ...values,
        };
        let response;
        if (type == "add") {
          response = await ADD_ACCOUNT_TEMPLATE({ postData: values });
        } else {
          response = await UPDATE_ACCOUNT_TEMPLATE({
            postData: editData,
          });
        }
        if (response?.data?.success) {
          if (type == "add") {
            showSnackbar("Account Template Added Successfully!");
            setAddAccountTemplate(false);
          } else {
            showSnackbar("Account Template Updated Successfully!");
            setEditAccountTemplate(false);
          }
          getAllAccountTemplate();
        }
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["TypeId"] && Boolean(formik?.errors["TypeId"])
            }
            helperText={formik?.touched["TypeId"] && formik?.errors["TypeId"]}
          >
            <InputLabel id="AccountType-label">Account Type *</InputLabel>
            <Select
              key="TypeId"
              id="TypeId"
              name="TypeId"
              label="TypeId"
              labelId="AccountType-label"
              onChange={(e) => {
                formik?.setFieldValue("TypeId", e.target.value);
              }}
              error={
                formik?.touched["TypeId"] && Boolean(formik?.errors["TypeId"])
              }
              helperText={formik?.touched["TypeId"] && formik?.errors["TypeId"]}
              value={formik?.values?.TypeId || ""}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {accountTypeChoices?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched?.TypeId && formik?.errors?.TypeId && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors?.TypeId}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["CategoryId"] &&
              Boolean(formik?.errors["CategoryId"])
            }
            helperText={
              formik?.touched["CategoryId"] && formik?.errors["CategoryId"]
            }
          >
            <InputLabel id="CategoryId-label">Account Category *</InputLabel>
            <Select
              key="CategoryId"
              id="CategoryId"
              name="CategoryId"
              label="CategoryId"
              labelId="CategoryId-label"
              onChange={(e) => {
                formik?.setFieldValue("CategoryId", e.target.value);
              }}
              error={
                formik?.touched["CategoryId"] &&
                Boolean(formik?.errors["CategoryId"])
              }
              helperText={
                formik?.touched["CategoryId"] && formik?.errors["CategoryId"]
              }
              value={formik?.values?.CategoryId || ""}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {accountCategoryChoices?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  {item?.clientCategoryDetails[0]?.name ?? "No Title"}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched?.CategoryId && formik?.errors?.CategoryId && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors?.CategoryId}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Services"] &&
              formik.values.Services.length == 0 &&
              Boolean(formik?.errors["Services"])
            }
          >
            <InputLabel id="Services-label">Services *</InputLabel>
            <Select
              multiple
              key="Services"
              id="Services"
              name="Services"
              label="Services"
              labelId="Services-label"
              onChange={(e) => {
                formik?.setFieldValue("Services", e.target.value);
              }}
              value={formik?.values?.Services || []}
              renderValue={(selected) =>
                selected
                  .map(
                    (rg) =>
                      services?.find((service) => service.recordGuid == rg)?.tag
                  )
                  .join(", ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {services?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  <Checkbox
                    checked={formik?.values?.Services?.includes(
                      item?.recordGuid
                    )}
                    sx={{
                      color: "#d32f2f",
                      "&.Mui-checked": {
                        color: "#d32f2f",
                      },
                    }}
                  />
                  {item?.tag}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Services"] && formik?.errors["Services"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Services"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Services"] &&
              formik.values.Services.length == 0 &&
              Boolean(formik?.errors["Services"])
            }
          >
            <InputLabel id="Services-label">Services *</InputLabel>
            <Select
              multiple
              key="Services"
              id="Services"
              name="Services"
              label="Services"
              labelId="Services-label"
              onChange={(e) => {
                formik?.setFieldValue("Services", e.target.value);
              }}
              value={formik?.values?.Services || []}
            >
              {services?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  {item?.tag}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Services"] && formik?.errors["Services"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Services"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Fees"] &&
              formik.values.Fees.length == 0 &&
              Boolean(formik?.errors["Fees"])
            }
          >
            <InputLabel id="Fees-label">Fees *</InputLabel>
            <Select
              multiple
              key="Fees"
              id="Fees"
              name="Fees"
              label="Fees"
              labelId="Fees-label"
              onChange={(e) => {
                formik?.setFieldValue("Fees", e.target.value);
              }}
              value={formik?.values?.Fees || []}
              renderValue={(selected) =>
                selected
                  .map((rg) => fees?.find((fee) => fee.recordGuid == rg)?.name)
                  .join(", ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {fees?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  <Checkbox
                    checked={formik?.values?.Fees?.includes(item?.recordGuid)}
                    sx={{
                      color: "#d32f2f",
                      "&.Mui-checked": {
                        color: "#d32f2f",
                      },
                    }}
                  />
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Fees"] && formik?.errors["Fees"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Fees"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Limits"] &&
              formik.values.Limits.length == 0 &&
              Boolean(formik?.errors["Limits"])
            }
          >
            <InputLabel id="Limits-label">Limits *</InputLabel>
            <Select
              multiple
              key="Limits"
              id="Limits"
              name="Limits"
              label="Limits"
              labelId="Limits-label"
              onChange={(e) => {
                formik?.setFieldValue("Limits", e.target.value);
              }}
              value={formik?.values?.Limits || []}
              renderValue={(selected) =>
                selected
                  .map(
                    (rg) =>
                      limits?.find((limit) => limit.recordGuid == rg)?.name
                  )
                  .join(", ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {limits?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  <Checkbox
                    checked={formik?.values?.Limits?.includes(item?.recordGuid)}
                    sx={{
                      color: "#d32f2f",
                      "&.Mui-checked": {
                        color: "#d32f2f",
                      },
                    }}
                  />
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Limits"] && formik?.errors["Limits"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Limits"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Discounts"] &&
              formik.values.Discounts.length == 0 &&
              Boolean(formik?.errors["Discounts"])
            }
          >
            <InputLabel id="Discounts-label">Discounts *</InputLabel>
            <Select
              multiple
              key="Discounts"
              id="Discounts"
              name="Discounts"
              label="Discounts"
              labelId="Discounts-label"
              onChange={(e) => {
                formik?.setFieldValue("Discounts", e.target.value);
              }}
              value={formik?.values?.Discounts || []}
              renderValue={(selected) =>
                selected
                  .map(
                    (rg) =>
                      discounts?.find((discount) => discount.recordGuid == rg)
                        ?.name
                  )
                  .join(", ")
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {discounts?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  <Checkbox
                    checked={formik?.values?.Discounts?.includes(
                      item?.recordGuid
                    )}
                    sx={{
                      color: "#d32f2f",
                      "&.Mui-checked": {
                        color: "#d32f2f",
                      },
                    }}
                  />
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Discounts"] && formik?.errors["Discounts"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Discounts"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="standard"
            error={
              formik?.touched["Discounts"] &&
              formik.values.Discounts.length == 0 &&
              Boolean(formik?.errors["Discounts"])
            }
          >
            <InputLabel id="Discounts-label">Discounts *</InputLabel>
            <Select
              multiple
              key="Discounts"
              id="Discounts"
              name="Discounts"
              label="Discounts"
              labelId="Discounts-label"
              onChange={(e) => {
                formik?.setFieldValue("Discounts", e.target.value);
              }}
              value={formik?.values?.Discounts || []}
            >
              {discounts?.map((item) => (
                <MenuItem key={item?.recordGuid} value={item?.recordGuid}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
            {formik?.touched["Discounts"] && formik?.errors["Discounts"] && (
              <FormHelperText style={{ color: "#d32f2f" }}>
                {formik?.errors["Discounts"]}
              </FormHelperText>
            )}
          </FormControl>
        </Grid> */}

        <Grid item xs={12}>
          <FormControl fullWidth variant="standard">
            <TextField
              multiline
              rows={4}
              key="Description"
              id="Description"
              name="Description"
              label="Description *"
              variant="standard"
              value={formik.values.Description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.Description && formik.errors.Description
              }
              error={
                formik.touched.Description && Boolean(formik.errors.Description)
              }
            />
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ marginTop: "20px" }}
          display="flex"
          justifyContent="end"
          alignItems="center"
        >
          <Button
            type="submit"
            className="mui-btn primary filled"
            id="add-Industry"
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default withTranslation("translations")(ManageAccountTemplate);
