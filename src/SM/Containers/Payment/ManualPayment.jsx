import ApartmentIcon from "@mui/icons-material/Apartment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  ADD_DOWN_PAYMENT_CLIENT,
  GET_ALL_CLIENTS,
  GET_ALL_RESELLER_API,
} from "../../../APIs/Postpaid";
import CustomAsyncPaginate from "../../../Components/CustomAsyncPaginate/CustomAsyncPaginate";
import { useSnackbar } from "../../../Contexts/SnackbarContext";
import {
  convertToEpochTimestamp,
  handleMessageError,
} from "../../Utils/Functions";
import CardOption from "../../../Components/CardOption/CardOption";
import { AttachMoney, CreditCard, MonetizationOn } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import GetActions from "../../Utils/GetActions";

const addValidation = Yup.object().shape({
  downPayment: Yup.number()
    .required("Payment amount is required")
    .typeError("Payment amount must be a number"),
  referenceNumber: Yup.number()
    .required("Rreference number is required")
    .typeError("Reference number must be a number"),
  // paymentMethod: Yup.number().required("Rreference number is required"),
  date: Yup.date().required("Payment date is required"),
});

const ManualPayment = () => {
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [showOther, setShowOther] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [showAccountHistory, setShowAccountHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const inputRef = useRef(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 1,
    referenceNumber: null,
    date: null,
    notes: null,
  });

  // get reseller accounts
  const getAllAccounts = async () => {
    setLoading(true);
    try {
      let response = await GET_ALL_CLIENTS({
        search: "",
        pageSize: paginationModel?.pageSize,
        pageNumber: parseInt(paginationModel?.page) + 1,
        ParentGuid: selectedReseller?.value,
        ParentIncluded: true,
      });

      const data = response?.data?.data?.accounts ?? [];
      setData(data);
      setSelectedAccount(data?.find((item) => item?.isPrimary));

      //   setPaymentData((prev) => ({
      //     ...prev,
      //     amount: Number(data[0]?.balanceLimit),
      //     referenceNumber: Number(data[0]?.threshold),
      //   }));
      setTotalRows(response?.data?.data?.totalRows ?? 0);
    } catch (e) {
      showSnackbar(handleMessageError({ e }), "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      downPayment: null,
      paymentMethod: 1,
      referenceNumber: null,
      date: null,
      notes: null,
    },
    validationSchema: addValidation,
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleSave = async (values) => {
    setAddLoading(true);
    try {
      const payload = {
        DownPaymentAmount: values.downPayment,
        ClientAccountGuid: selectedAccount?.recordGuid,
        ReferenceNumber: values?.referenceNumber,
        // PaymentMethod: values?.paymentMethod,
        PaymentDate: convertToEpochTimestamp(values?.date),
        // notes: values?.notes,
      };
      let response = await ADD_DOWN_PAYMENT_CLIENT({ postData: payload });
      if (response?.data?.success) {
        showSnackbar(response?.data?.message, "success");
        setData((prevData) =>
          prevData.map((acc) =>
            acc.recordGuid === selectedAccount.recordGuid
              ? {
                  ...acc,
                  currentBalance:
                    Number(selectedAccount?.currentBalance) +
                    Number(values?.downPayment),
                }
              : acc
          )
        );
        formik?.resetForm();
      }
    } catch (e) {
      showSnackbar(handleMessageError({ e, type: "validation" }), "error");
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReseller) {
      getAllAccounts();
    }
  }, [selectedReseller]);

  return (
    <Box className="page_container" sx={{ p: 0 }}>
      <Box
        className="section_container scroll"
        mt={2}
        gap={2}
        sx={{ px: "1rem !important" }}
      >
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ width: "100%" }} mt={1}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <CustomAsyncPaginate
                    value={selectedReseller}
                    onChange={(value) => {
                      setSelectedReseller(value);
                      formik?.resetForm();
                    }}
                    placeholder="Select Reseller"
                    label="Reseller"
                    apiFunction={GET_ALL_RESELLER_API}
                    dataPath={"data.data.clients"}
                    params={{ TypeTag: "RESELLER", StatusTag: "APPROVED" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        {selectedReseller && (
          <>
            {!loading ? (
              <Grid container spacing={3} mt={1}>
                {selectedAccount ? (
                  <>
                    {/* Select Account Section */}
                    <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold" mb={4}>
                          <ApartmentIcon sx={{ pl: 1, fontSize: "2rem" }} />{" "}
                          Select Postpaid Account
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {data?.map((item, index) => {
                            return (
                              <Card
                                key={index}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderColor:
                                    selectedAccount?.recordGuid ===
                                    item?.recordGuid
                                      ? "#1976D2"
                                      : "",
                                  borderRadius: 2,
                                  position: "relative",
                                  "&:hover": { boxShadow: 3 },
                                }}
                                onClick={() => {
                                  setSelectedAccount(item);
                                }}
                              >
                                <Typography fontWeight="bold">
                                  {item?.accountNumber}
                                </Typography>
                                <Typography color="text.secondary">
                                  Balance: {item?.currentBalance}
                                  {" " + item?.currencyCode} -{" "}
                                  {item?.accountTypeTag}
                                </Typography>

                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor:
                                      item?.accountStatusTag !== "ACTIVE"
                                        ? "gold"
                                        : "lightgreen",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography fontSize="0.75rem">
                                    {!item?.accountStatusTag
                                      ? "Not Active"
                                      : item?.accountStatusTag !== "ACTIVE"
                                      ? item?.accountStatusTag
                                      : "Active"}{" "}
                                  </Typography>
                                </Box>
                                {item?.isPrimary && (
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      bottom: 10,
                                      right: 10,
                                      backgroundColor: "green",
                                      color: "white",
                                      cursor: "pointer",
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography fontSize="0.75rem">
                                      Primary
                                    </Typography>
                                  </Box>
                                )}
                              </Card>
                            );
                          })}
                        </Box>
                      </Card>
                    </Grid>
                    {selectedAccount?.accountTypeTag?.toLowerCase() ===
                      "postpaid" && (
                      <>
                        {/* Balance Limits Section */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 1,
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold" px={2}>
                                Payment Details
                              </Typography>
                            </Box>
                            <CardContent>
                              <TextField
                                fullWidth
                                id="paymentAmount"
                                name="paymentAmount"
                                label="Payment Amount"
                                variant="standard"
                                type="number"
                                value={formik?.values?.downPayment ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*\.?\d*$/.test(value)) {
                                    formik.setFieldValue("downPayment", value);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (["e", "E", "+"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <>
                                      <InputAdornment position="start">
                                        <AttachMoneyIcon
                                          sx={{ color: "#757575" }}
                                        />
                                        {/* <Typography variant="subtitle2">
                                          {"(+" +
                                            selectedAccount?.currentBalance +
                                            ") "}
                                        </Typography> */}
                                      </InputAdornment>
                                    </>
                                  ),
                                }}
                                disabled={addLoading}
                                sx={{ mb: 2 }}
                                error={
                                  formik.touched.downPayment &&
                                  Boolean(formik.errors.downPayment)
                                }
                                helperText={
                                  formik.touched.downPayment &&
                                  formik.errors.downPayment
                                }
                              />

                              {/* Payment method field */}
                              {/* <Typography
                                variant="subtitle2"
                                sx={{ mt: 2, mb: 1 }}
                                color="#858585"
                                fontWeight={"400"}
                              >
                                Payment Method
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                  mb: 2,
                                }}
                              >
                                <CardOption
                                  title="Bank Transfer"
                                  icon={<CreditCard />}
                                  selected={formik?.values?.paymentMethod == 1}
                                  onClick={() =>
                                    formik.setFieldValue("paymentMethod", 1)
                                  }
                                />
                                <CardOption
                                  title="Check"
                                  icon={<AttachMoney />}
                                  selected={formik?.values?.paymentMethod == 2}
                                  onClick={() =>
                                    formik.setFieldValue("paymentMethod", 2)
                                  }
                                />
                                <CardOption
                                  title="Cash"
                                  icon={<MonetizationOn />}
                                  selected={formik?.values?.paymentMethod == 3}
                                  onClick={() =>
                                    formik.setFieldValue("paymentMethod", 3)
                                  }
                                />
                              </Box> */}

                              <TextField
                                fullWidth
                                id="referenceNumber"
                                name="referenceNumber"
                                label="Reference Number"
                                variant="standard"
                                type="number"
                                value={formik?.values?.referenceNumber ?? ""}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "referenceNumber",
                                    e.target.value
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (["e", "E", "+"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Typography
                                        variant="h6"
                                        fontWeight={"bold"}
                                        pl={"0.3rem"}
                                      >
                                        #
                                      </Typography>
                                    </InputAdornment>
                                  ),
                                }}
                                disabled={addLoading}
                                sx={{ mb: 2 }}
                                error={
                                  formik.touched.referenceNumber &&
                                  Boolean(formik.errors.referenceNumber)
                                }
                                helperText={
                                  formik.touched.referenceNumber &&
                                  formik.errors.referenceNumber
                                }
                              />
                              <TextField
                                fullWidth
                                id="paymentDate"
                                name="paymentDate"
                                label="Payment Date"
                                variant="standard"
                                type="date"
                                inputRef={inputRef}
                                value={formik?.values?.date || ""}
                                onClick={() =>
                                  inputRef.current?.showPicker?.() ||
                                  inputRef.current?.focus()
                                }
                                onChange={(e) =>
                                  formik.setFieldValue("date", e.target.value)
                                }
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarMonthIcon
                                        onClick={() =>
                                          inputRef.current?.showPicker?.() ||
                                          inputRef.current?.focus()
                                        }
                                        sx={{ cursor: "pointer" }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                disabled={addLoading}
                                sx={{
                                  mb: 2,
                                  "& input::-webkit-calendar-picker-indicator":
                                    {
                                      display: "none",
                                      WebkitAppearance: "none",
                                    },
                                  '& input[type="date"]': {
                                    MozAppearance: "textfield", // For Firefox
                                  },
                                }}
                                error={
                                  formik.touched.date &&
                                  Boolean(formik.errors.date)
                                }
                                helperText={
                                  formik.touched.date && formik.errors.date
                                }
                              />

                              {/* <TextField
                                fullWidth
                                multiline
                                id="paymentNotes"
                                name="paymentNotes"
                                label="Notes"
                                variant="standard"
                                type="text"
                                value={formik?.values?.notes ?? ""}
                                onChange={(e) => {
                                  formik.setFieldValue("notes", e.target.value);
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <DescriptionIcon
                                        sx={{ color: "#757575" }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                disabled={addLoading}
                                sx={{ mb: 2 }}
                              /> */}

                              <Button
                                className="mui-btn primary filled"
                                onClick={formik?.submitForm}
                                disabled={addLoading}
                                sx={{ width: "100%" }}
                              >
                                Process Payment
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5" color="#ccc" mt={2}>
                        This Reseller Doesn&apos;t Have Any Account
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Box className="Loader">
                <CircularProgress />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default GetActions(ManualPayment);
