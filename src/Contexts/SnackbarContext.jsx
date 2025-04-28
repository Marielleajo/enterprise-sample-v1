import MuiAlert from "@mui/material/Alert";
import React, { createContext, useContext, useState } from "react";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // Default severity is success

  const showSnackbar = (newMessage, newSeverity = "success") => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);

    // Automatically close the Snackbar after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      closeSnackbar();
    }, 3000);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ open, message, severity, showSnackbar, closeSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};
