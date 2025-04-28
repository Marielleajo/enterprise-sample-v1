import {
  Close,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { REQUEST_OTP, RESET_PASSWORD } from "../APIs/Common";
import OTPInput from "./OTP";
import styled from "styled-components";

const ChangePassword = ({
  Done,
  FormData,
  isSmallerThanSmall,
  isSmallerThanMeduim,
  isSmallerThanlarge,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [Message, SetMessage] = useState(null);
  const [MessageType, SetMessageType] = useState(null);
  const [Loading, SetLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      Password: null,
      CPassword: null,
      otp: null,
    },
    validationSchema: Yup.object().shape({
      Password: Yup.string().required("Password is required"),
      CPassword: Yup.string()
        .oneOf([Yup.ref("Password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        let passwordChange = await RESET_PASSWORD({
          formData: {
            username: FormData?.username,
            Pin: values["otp"],
            NewPassword: values["Password"],
          },
        });
        if (passwordChange?.data?.success) {
          Done({
            username: FormData?.username,
            password: values["Password"],
          });
        }
      } catch (e) {
        SetMessageType("error");
        SetMessage(
          e?.response?.data?.message ||
            e?.response?.data?.errors?.Name[0] ||
            e?.response?.data?.result?.message ||
            "Something Went Wrong"
        );
      }
    },
  });

  const handleOTP = (data) => {
    formik?.setFieldValue("otp", data);
  };

  const RequestOTP = async () => {
    await REQUEST_OTP({ username: FormData?.username });
  };
  useEffect(() => {
    RequestOTP();
  }, []);

  return (
    <form onSubmit={formik?.handleSubmit} className="center">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <OTPInput length={6} onComplete={handleOTP} color="black" />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <TextField
            label="Password"
            className="input-password"
            sx={{
              width: isSmallerThanSmall
                ? "70vw"
                : isSmallerThanMeduim
                ? "50vw"
                : isSmallerThanlarge
                ? "35vw"
                : "24vw",
            }}
            name="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={formik?.values.Password}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            error={
              formik.touched["Password"] && Boolean(formik.errors["Password"])
            }
            helperText={formik.touched["Password"] && formik.errors["Password"]}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="password-icon"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} container className="center">
          <TextField
            label="Confirm Password"
            className="input-password"
            sx={{
              width: isSmallerThanSmall
                ? "70vw"
                : isSmallerThanMeduim
                ? "50vw"
                : isSmallerThanlarge
                ? "35vw"
                : "24vw",
            }}
            name="CPassword"
            id="CPassword"
            type={showPassword ? "text" : "password"}
            value={formik?.values.CPassword}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
            error={
              formik.touched["CPassword"] && Boolean(formik.errors["CPassword"])
            }
            helperText={
              formik.touched["CPassword"] && formik.errors["CPassword"]
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    id="CPassword-icon"
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="filled"
          />
        </Grid>
        {Message && (
          <Grid item xs={12}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  id="close-icon"
                  onClick={() => {
                    SetMessage(null);
                  }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              severity={MessageType}
            >
              {Message}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12} container className="center">
          <StyledButton
            loading={Loading}
            sx={{ width: isSmallerThanSmall ? "70vw" : "24vw" }}
            id="loading-submit"
            type="submit"
            className=" button-forget"
          >
            Submit
          </StyledButton>
        </Grid>
      </Grid>
    </form>
  );
};

const StyledButton = styled(LoadingButton)`
  background-color: ${import.meta.env.VITE_PRIMARY_COLOR} !important;
  color: ${import.meta.env.VITE_TEXT_WHITE} !important;
  height: 5.5vh !important;
  font-size: 2vh !important;
  font-weight: 400 !important;
  padding: 0px !important;

  &:hover {
    background-color: ${import.meta.env.VITE_PRIMARY_COLOR} !important;
  }

  &:disabled {
    cursor: not-allowed !important;
    opacity: 0.5 !important;
  }
`;

export default ChangePassword;
