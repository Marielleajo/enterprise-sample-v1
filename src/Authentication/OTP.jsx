import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { Grid, useMediaQuery } from "@mui/material";

const OTPInput = ({ isSmallerThanSmall, length, onComplete, color = "black" }) => {
  const [otp, setOTP] = useState(Array(length).fill(""));
  const [responsiveOtp, setResponsiveOtp] = useState("");
  const mobileResponsive = useMediaQuery("(max-width:680px)");
  const inputRefs = [];
  const useStyles = makeStyles((theme) => ({
    otpInput: {
      width: "50px", // Adjust the width as needed
      height: "40px", // Make it square by setting the same width and height
      fontSize: "1.2rem", // Adjust the font size as needed
      textAlign: "center", // Center the text
      margin: "5px", // Add spacing between input fields
      borderColor: "white",
      "& input": {
        color: color,
        textAlign: "center",
      },
      "& fieldset": {
        borderColor: color,
      },
    },
  }));
  
  const classes = useStyles(); // Get the styles from the hook

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && !isNaN(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (index === length - 1) {
        const otpValue = newOTP.join("");
        onComplete(otpValue);
      } else if (value !== "") {
        inputRefs[index + 1].focus();
      }
    } else if (value === "") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
      if (index > 0) {
        inputRefs[index - 1].focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    const pastedData = e.clipboardData.getData("Text");
    if (pastedData.length === length) {
      const newOTP = pastedData.split("");
      setOTP(newOTP);
      onComplete(pastedData);
    }
  };

  useEffect(() => {
    if (inputRefs[0]) {
      inputRefs[0].focus();
    }
  }, []);

  useEffect(() => {
    if (responsiveOtp.length == 6) {
      onComplete(responsiveOtp);
    }
  }, [responsiveOtp]);

  return (
    <Grid
      container
      justifyContent={"space-between"}
      sx={{ marginBottom: isSmallerThanSmall ? "0" : "4vh" }}
    >
      {mobileResponsive ? (
        <TextField
          key={"responsiveField"}
          type="text"
          id="responsiveField"
          value={responsiveOtp}
          inputProps={{ maxLength: "6" }}
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              setResponsiveOtp(e.target.value);
            }
          }}
          fullWidth
          sx={{
            padding: "0px",
            margin: "0px",
            "& input": {
              color: color,
              textAlign: "center",
              fontSize: "3vh",
              height: "3vh",
              padding: "2vh",
              margin: "0px",
            },
            "& fieldset": {
              borderColor: "black",
            },
          }}
        />
      ) : (
        otp.map((digit, index) => (
          <TextField
            key={index}
            type="text"
            id="digit"
            value={digit}
            onPaste={(e) => handlePaste(e, index)} // Add the onPaste handler
            onChange={(e) => handleChange(e, index)}
            inputRef={(ref) => (inputRefs[index] = ref)}
            className={classes.otpInput} // Apply the custom styles
          />
        ))
      )}
    </Grid>
  );
};

export default OTPInput;
