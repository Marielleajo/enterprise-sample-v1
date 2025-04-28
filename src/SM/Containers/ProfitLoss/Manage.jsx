import {
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
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  GET_ALL_OPERATION,
  POST_PROFIT_LOSS,
  POST_PROFIT_LOSS_CLIENT,
  UPDATE_PROFIT_LOSS,
  UPDATE_PROFIT_LOSS_CLIENT,
} from "../../../APIs/ProfitLoss";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import { handleMessageError } from "../../Utils/Functions";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { GET_ALL_CLIENTS_CATEGORY } from "../../../APIs/Clients";

const addValidation = Yup.object().shape({
  operationTypeTagName: Yup.string().required(
    "Operation Type Tag Name is required"
  ),
  percentageRate: Yup.number()
    .typeError("Percentage Rate must be a number")
    .required("Percentage Rate is required")
    .min(0, "Percentage Rate must be at least 0")
    .max(100, "Percentage Rate cannot be more than 100"),
});
const addValidationClient = Yup.object().shape({
  client: Yup.object().required("Client is required"),
  percentageRate: Yup.number()
    .typeError("Percentage Rate must be a number")
    .required("Percentage Rate is required")
    .min(0, "Percentage Rate must be at least 0")
    .max(100, "Percentage Rate cannot be more than 100"),
});
const editValidation = Yup.object().shape({
  percentageRate: Yup.number()
    .typeError("Percentage Rate must be a number")
    .required("Percentage Rate is required")
    .min(0, "Percentage Rate must be at least 0")
    .max(100, "Percentage Rate cannot be more than 100"),
});
const editValidationClient = Yup.object().shape({
  percentageRate: Yup.number()
    .typeError("Percentage Rate must be a number")
    .required("Percentage Rate is required")
    .min(0, "Percentage Rate must be at least 0")
    .max(100, "Percentage Rate cannot be more than 100"),
});
export default function Manage({
  getAllProfitLoss,
  setManageAdd,
  selectedRow,
  type,
  channelGuid,
  serviceGuid,
  serviceTag,
}) {
  const validationSchema =
    type === "add" && serviceTag === "WHATSAPP"
      ? addValidation
      : type === "add"
      ? addValidationClient
      : serviceTag === "WHATSAPP"
      ? editValidation
      : editValidationClient;
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [operationTypeTagNameOptions, setOperationTypeTagNameOptions] =
    useState([]);
  const [clientOptions, setcCientOptions] = useState([]);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      operationTypeTagName: type == "add" ? "" : selectedRow?.operationTypeTag,
      percentageRate: type == "add" ? "" : selectedRow?.percentageRate,
      client: type == "add" ? "" : selectedRow?.ClientCategoryGuid,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (type == "add") {
        if (serviceTag == "WHATSAPP") {
          const payload = {
            ChannelGuid: channelGuid,
            ServiceGuid: serviceGuid,
            OperationTypeTagName: values.operationTypeTagName,
            PercentageRate: values.percentageRate,
          };
          setLoading(true);
          try {
            let response = await POST_PROFIT_LOSS({ postData: payload });
            if (response?.data?.success) {
              getAllProfitLoss();
              showSnackbar(response?.data?.message);
              setManageAdd(false);
            } else {
              showSnackbar(response?.data?.message);
            }
          } catch (e) {
            showSnackbar(
              handleMessageError({ e, type: "validation" }),
              "error"
            );
          } finally {
            setLoading(false);
          }
        } else {
          const payload = {
            ChannelGuid: channelGuid,
            ClientCategoryGuid: values.client,
            PercentageRate: values.percentageRate,
          };
          setLoading(true);
          try {
            let response = await POST_PROFIT_LOSS_CLIENT({ postData: payload });
            if (response?.data?.success) {
              getAllProfitLoss();
              showSnackbar(response?.data?.message);
              setManageAdd(false);
            } else {
              showSnackbar(response?.data?.message);
            }
          } catch (e) {
            showSnackbar(
              handleMessageError({ e, type: "validation" }),
              "error"
            );
          } finally {
            setLoading(false);
          }
        }
      } else {
        if (serviceTag == "WHATSAPP") {
          const payload = {
            OperationTypeProfitMarginGuid: selectedRow.recordGuid,
            // ChannelGuid: channelGuid,
            // ServiceGuid: serviceGuid,
            // OperationTypeTagName: values.operationTypeTagName,
            PercentageRate: values.percentageRate,
          };
          setLoading(true);
          try {
            let response = await UPDATE_PROFIT_LOSS({ postData: payload });
            if (response?.data?.success) {
              getAllProfitLoss();
              showSnackbar(response?.data?.message);
              setManageAdd(false);
            } else {
              showSnackbar(response?.data?.message);
            }
          } catch (e) {
            showSnackbar(
              handleMessageError({ e, type: "validation" }),
              "error"
            );
          } finally {
            setLoading(false);
          }
        } else {
          const payload = {
            ClientCategoryProfitMarginGuid: selectedRow.recordGuid,
            // ChannelGuid: channelGuid,
            // ClientCategoryGuid: "",
            PercentageRate: values.percentageRate,
          };
          setLoading(true);
          try {
            let response = await UPDATE_PROFIT_LOSS_CLIENT({
              postData: payload,
            });
            if (response?.data?.success) {
              getAllProfitLoss();
              showSnackbar(response?.data?.message);
              setManageAdd(false);
            } else {
              showSnackbar(response?.data?.message);
            }
          } catch (e) {
            showSnackbar(
              handleMessageError({ e, type: "validation" }),
              "error"
            );
          } finally {
            setLoading(false);
          }
        }
      }
    },
  });

  const handlePercentageRateChange = (e) => {
    const { value } = e.target;
    if (value === "" || /^\d*$/.test(value)) {
      formik.setFieldValue("percentageRate", value);
    }
  };

  const getAllOperation = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_OPERATION();
      const options = response?.data?.data?.criteria?.map((item) => ({
        value: item?.tag,
        label: item?.name,
      }));
      setOperationTypeTagNameOptions(options);
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type == "add") {
      if (serviceTag == "WHATSAPP") {
        getAllOperation();
      }
    }
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      {type === "add" && (
        <>
          {serviceTag === "WHATSAPP" ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel
                    id="operationTypeTagName-label"
                    error={
                      formik.touched["operationTypeTagName"] &&
                      Boolean(formik.errors["operationTypeTagName"])
                    }
                  >
                    Operation Type Tag Name
                  </InputLabel>
                  <Select
                    key="operationTypeTagName"
                    id="operationTypeTagName"
                    name="operationTypeTagName"
                    label="Operation Type Tag Name"
                    labelId="operationTypeTagName-label"
                    value={formik.values.operationTypeTagName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.operationTypeTagName &&
                      Boolean(formik.errors.operationTypeTagName)
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {operationTypeTagNameOptions?.map((item) => (
                      <MenuItem key={item?.value} value={item?.value}>
                        {item?.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.operationTypeTagName &&
                    formik.errors.operationTypeTagName && (
                      <FormHelperText
                        style={{ color: theme?.palette?.error?.main }}
                      >
                        {formik.errors.operationTypeTagName}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"percentageRate"}
                    fullWidth
                    id={"percentageRate"}
                    name={"percentageRate"}
                    label={"Percentage Rate"}
                    variant="standard"
                    type="text"
                    value={formik.values.percentageRate}
                    onBlur={formik.handleBlur}
                    onChange={handlePercentageRateChange}
                    error={
                      formik.touched.percentageRate &&
                      Boolean(formik.errors.percentageRate)
                    }
                    helperText={
                      formik.touched.percentageRate &&
                      formik.errors.percentageRate
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  type="submit"
                  className="mui-btn primary filled"
                  id="send-service-feature-id"
                  disabled={loading}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} mt={1}>
                <CustomAsyncPaginate
                  apiFunction={GET_ALL_CLIENTS_CATEGORY}
                  value={formik?.values?.client}
                  onChange={(value) => {
                    formik.setFieldValue("client", value);
                  }}
                  placeholder="Client Category"
                  pageSize={10}
                  dataPath="data.data.clientCategory"
                  totalRowsPath="data.data.totalRows"
                  labelPath={"clientCategoryDetails"}
                  isNested={true}
                  method="GET"
                  id={`async-menu-style`}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"percentageRate"}
                    fullWidth
                    id={"percentageRate"}
                    name={"percentageRate"}
                    label={"Percentage Rate"}
                    variant="standard"
                    type="text"
                    value={formik.values.percentageRate}
                    onBlur={formik.handleBlur}
                    onChange={handlePercentageRateChange}
                    error={
                      formik.touched.percentageRate &&
                      Boolean(formik.errors.percentageRate)
                    }
                    helperText={
                      formik.touched.percentageRate &&
                      formik.errors.percentageRate
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  type="submit"
                  className="mui-btn primary filled"
                  id="send-service-feature-id"
                  disabled={loading}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </>
      )}
      {type === "edit" && (
        <>
          {serviceTag === "WHATSAPP" ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"percentageRate"}
                    fullWidth
                    id={"percentageRate"}
                    name={"percentageRate"}
                    label={"Percentage Rate"}
                    variant="standard"
                    type="text"
                    value={formik.values.percentageRate}
                    onBlur={formik.handleBlur}
                    onChange={handlePercentageRateChange}
                    error={
                      formik.touched.percentageRate &&
                      Boolean(formik.errors.percentageRate)
                    }
                    helperText={
                      formik.touched.percentageRate &&
                      formik.errors.percentageRate
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  type="submit"
                  className="mui-btn primary filled"
                  id="send-service-feature-id"
                  disabled={loading}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    key={"percentageRate"}
                    fullWidth
                    id={"percentageRate"}
                    name={"percentageRate"}
                    label={"Percentage Rate"}
                    variant="standard"
                    type="text"
                    value={formik.values.percentageRate}
                    onBlur={formik.handleBlur}
                    onChange={handlePercentageRateChange}
                    error={
                      formik.touched.percentageRate &&
                      Boolean(formik.errors.percentageRate)
                    }
                    helperText={
                      formik.touched.percentageRate &&
                      formik.errors.percentageRate
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"end"}
                alignItems={"center"}
              >
                <Button
                  type="submit"
                  className="mui-btn primary filled"
                  id="send-service-feature-id"
                  disabled={loading}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </form>
  );
}
