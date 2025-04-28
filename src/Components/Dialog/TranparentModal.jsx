import { IconButton, Paper, Zoom } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function TransparentModal({
  title,
  content,
  open,
  setOpen,
  firstActionBtnFct,
  firstActionBtnName,
  secondActionBtn,
  secondActionBtnName,
  size,
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
  const icon = (
    <Paper style={{ background: "transparent", boxShadow: "none" }}>
      {content}
    </Paper>
  );

  return (
    <React.Fragment>
      <Dialog
        // fullWidth={true}
        fullScreen={true}
        onClose={handleClose}
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "transparent!important",
            width: "186vh",
            boxShadow: "none",
          },
          "& .MuiDialog-container": {
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter:"blur(20px)"
            // opacity: "90%",
          },
        }}
        // title="Loading"
        titleStyle={{
          paddingTop: "0px",
          paddingLeft: "45px",
          fontSize: "15px",
          lineHeight: "40px",
        }}
        size="md"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* <Divider /> */}
        <DialogContent
          style={{
            overflow: "hidden",
          }}
        >
          <Zoom style={{ transitionDelay: open ? "200ms" : "0ms" }} in={open}>
            {icon}
          </Zoom>
        </DialogContent>
        {/* <Button onClick={firstActionBtnFct}>{firstActionBtnName}</Button> */}
        {/* 
        <DialogActions
          style={{ marginRight: "13px", margin: "10px 13px 10px 0px" }}
        >
          {firstActionBtnName && (
            <Button
              variant="contained"
              className="contained"
              autoFocus
              onClick={firstActionBtnFct}
            >
              {firstActionBtnName}
            </Button>
          )}
          {secondActionBtnName && (
            <Button
              variant="contained"
              className="contained"
              onClick={secondActionBtn}
            >
              {secondActionBtnName}
            </Button>
          )}
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
}
