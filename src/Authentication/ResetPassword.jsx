import {
  AccountCircle,
  LockOpen,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { REQUEST_OTP, RESET_PASSWORD } from "../APIs/Common";
import CounterComponent from "../Components/Counter";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { handleMessageError } from "../SM/Utils/Functions";
import OTPInput from "./OTP";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const ResetPassword = ({
  Done,
  isSmallerThanSmall,
  isSmallerThanMeduim,
  isSmallerThanlarge,
}) => {
  const [Step, SetStep] = useState(0);
  const [Message, SetMessage] = useState(null);
  const [MessageType, SetMessageType] = useState(null);
  const [Loading, SetLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = React.useState(false);
  const [FormData, SetFormData] = useState({
    username: null,
    NewPassword: null,
    Pin: null,
    confirm: null,
  });
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const location = useLocation();

  const handleSubmit = async () => {
    if (Step == 0) {
      try {
        SetLoading(true);
        let otpResponse = await REQUEST_OTP({
          username: FormData?.username,
        });
        if (otpResponse?.data?.success) {
          SetStep(1);
          SetMessageType("success");
          SetMessage("An otp code has been sent to your email");
        } else {
          SetMessageType("error");
          SetMessage("Something Went Wrong");
        }
      } catch (e) {
        SetMessageType("error");
        SetMessage(
          (e?.response?.data?.message.toString() === "The user does not exist."
            ? "Something Went Wrong, please try again."
            : e?.response?.data?.message.toString()) ||
            e?.response?.data?.errors?.Name[0] ||
            e?.response?.data?.result?.message ||
            "Something Went Wrong"
        );
      } finally {
        SetLoading(false);
      }
    } else {
      // Check if passwords match
      if (FormData?.NewPassword !== FormData?.confirm) {
        SetMessageType("error");
        SetMessage("Passwords don't match");
      } else {
        try {
          SetLoading(true);
          let passwordChange = await RESET_PASSWORD({ formData: FormData });
          if (passwordChange?.data?.success) {
            if (location?.pathname == "/my-profile") {
              showSnackbar("Password has been updated successfully!");
              setTimeout(() => {
                SetStep(0);
                SetMessage(null);
              }, 1000);
            } else {
              Done({
                username: FormData?.username,
                password: FormData?.NewPassword,
              });
            }
          }
        } catch (e) {
          SetMessageType("error");
          SetMessage(handleMessageError({ e, type: "validation" }));
        } finally {
          SetLoading(false);
        }
      }
    }
  };

  const handleEnterPress = async (e) => {
    if (e.key === "Enter") {
      // Perform your action here
      await handleSubmit();
      // You can call a function or perform any other action here
    }
  };
  const [ResendOtpToggle, SetResendOtpToggle] = useState(false);
  const [ResetCount, SetResetCount] = useState(2);
  const counterRef = useRef(null);

  const ResendOtp = async () => {
    if (ResendOtpToggle && ResetCount > 0) {
      try {
        let otpResponse = await REQUEST_OTP({
          username: FormData?.username,
        });
        SetMessageType("success");
        SetMessage("Otp requested again");
        SetResendOtpToggle(false);
        if (ResetCount > 1) {
          if (counterRef.current) {
            counterRef.current.reset();
          }
        } else {
          window.location.reload();
        }
        SetResetCount((prev) => prev - 1);
      } catch (e) {
        SetMessageType("error");
        SetMessage(
          (e?.response?.data?.message.toString() === "The user does not exist."
            ? "Something Went Wrong, please try again."
            : e?.response?.data?.message.toString()) ||
            e?.response?.data?.errors?.Name[0] ||
            e?.response?.data?.result?.message ||
            "Something Went Wrong"
        );
      }
    }
  };
  useEffect(() => {
    if (ResetCount == 0) {
      SetResendOtpToggle(false);
    }
  }, [ResetCount]);

  return (
    <Grid container rowSpacing={2}>
      {Step == 0 && (
        <Grid item xs={12} className="form-container">
          <TextField
            onChange={(e) => {
              SetMessage(null);
              SetMessageType(null);

              SetFormData((prev) => {
                return { ...prev, username: e?.target?.value };
              });
            }}
            label="Username"
            id="username"
            className="input-username"
            sx={{
              width: isSmallerThanSmall
                ? "70vw"
                : isSmallerThanMeduim
                ? "50vw"
                : isSmallerThanlarge
                ? "35vw"
                : "24vw",
            }}
            InputProps={{
              style: {
                fontSize: "1.9vh",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="filled"
          />
        </Grid>
      )}
      {Step == 1 && (
        <>
          <Grid item xs={12}>
            <OTPInput
              color="black"
              length={6}
              onComplete={(data) =>
                SetFormData((prev) => {
                  return { ...prev, Pin: data };
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container columnSpacing={1} className="form-container">
              <Grid item>
                <Typography
                  variant="subtitle"
                  sx={
                    ResendOtpToggle &&
                    ResetCount > 0 && {
                      textDecoration: "underline",
                      cursor: "pointer",
                      "&:hover": { color: "red" },
                    }
                  }
                  onClick={ResendOtp}
                >
                  Resend Otp
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle" onClick={ResendOtp}>
                  {" "}
                  after{" "}
                </Typography>
              </Grid>
              <Grid item>
                <CounterComponent
                  ref={counterRef}
                  initialTime={30}
                  onTimeUp={() => SetResendOtpToggle(true)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className="form-container">
            <TextField
              onChange={(e) =>
                SetFormData((prev) => {
                  return { ...prev, NewPassword: e?.target?.value };
                })
              }
              label="Password"
              id="password"
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
              type={showPassword ? "text" : "password"}
              InputProps={{
                style: {
                  fontSize: "1.9vh",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
          <Grid item xs={12} className="form-container">
            <TextField
              onChange={(e) =>
                SetFormData((prev) => {
                  return { ...prev, confirm: e?.target?.value };
                })
              }
              label="New Password"
              id="new-password"
              className="input-form white no_autofill"
              sx={{
                width: isSmallerThanSmall
                  ? "70vw"
                  : isSmallerThanMeduim
                  ? "50vw"
                  : isSmallerThanlarge
                  ? "35vw"
                  : "24vw",
              }}
              type={showPassword ? "text" : "password"}
              InputProps={{
                style: {
                  fontSize: "1.9vh",
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
        </>
      )}
      {Message && (
        <Grid item xs={12}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                id="close-alert"
                onClick={() => {
                  SetMessage(null);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={MessageType}
          >
            {Message}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12} className="form-container">
        <StyledButton
          loading={Loading}
          fullWidth
          id="loading-submit"
          onClick={handleSubmit}
          sx={{ width: isSmallerThanSmall ? "75vw" : "25vw" }}
        >
          Submit
        </StyledButton>
      </Grid>
      {location?.pathname != "/my-profile" && (
        <Grid item xs={12} className="form-container">
          <Button
            id="cancel"
            fullWidth
            onClick={() => Done(null)}
            className="mui-btn grey button-cancel"
            sx={{ width: isSmallerThanSmall ? "75vw" : "25vw" }}
          >
            Cancel
          </Button>
        </Grid>
      )}
      {location?.pathname == "/my-profile" && Step == 1 && (
        <Grid item xs={12} className="form-container">
          <Button
            id="cancel"
            sx={{ width: isSmallerThanSmall ? "75vw" : "25vw" }}
            onClick={() => {
              SetStep(0);
              SetMessage(null);
            }}
            className="mui-btn grey"
          >
            Cancel
          </Button>
        </Grid>
      )}
    </Grid>
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

export default ResetPassword;
