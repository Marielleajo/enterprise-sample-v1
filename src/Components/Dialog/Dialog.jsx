import CloseIcon from "@mui/icons-material/Close";

import { Divider, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

export default function CustomizedDialogs({
  title,
  content,
  open,
  setOpen,
  firstActionBtnFct,
  firstActionBtnName,
  secondActionBtn,
  secondActionBtnName,
  size,
  overflowHidden,
  disableFirstBtn,
  disableSecondtBtn,
  titleColor,
  backgroundColor,
  TransitionComponent,
  keepMounted,
  removeCloseBtn,
}) {
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
  };
  const styles = {
    rootStyle: {
      borderRadius: 15,
    },
  };
  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={size ? size : "xs"}
        open={open}
        onClose={!removeCloseBtn && handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        id="dialog-style"
        TransitionComponent={TransitionComponent}
        keepMounted={keepMounted}
        // style={{minHeight:"500px"}}
      >
        <DialogTitle
          style={{
            fontWeight: "600",
            color: titleColor ? titleColor : "#fff",
            background: backgroundColor
              ? backgroundColor
              : localStorage.getItem("primary") || "#c41035",
            textAlign: "center",
          }}
        >
          {title}
        </DialogTitle>
        {!removeCloseBtn && (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffffff",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Divider />
        <DialogContent style={{ overflow: overflowHidden ? "hidden" : "auto" }}>
          {content}
        </DialogContent>
        {/* <Button onClick={firstActionBtnFct}>{firstActionBtnName}</Button> */}

        <DialogActions
          style={{ marginRight: "13px", margin: "10px 13px 10px 0px" }}
        >
          {firstActionBtnName && (
            <Button
              variant="contained"
              className={ disableFirstBtn ?  'contained-disabled' :'contained' }
              autoFocus
              onClick={firstActionBtnFct}
              disabled={disableFirstBtn}
            >
              {firstActionBtnName}
            </Button>
          )}
          {secondActionBtnName && (
            <Button
              variant="contained"
              className="contained"
              onClick={secondActionBtn}
              disabled={disableSecondtBtn}

            >
              {secondActionBtnName}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
