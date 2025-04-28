import React from "react";
import { Button, Typography, IconButton, Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
const ConfirmationModal = ({
  open,
  onClose,
  title,
  text,
  onButtonClick,
  content,
  disableBtn,
  loading,
}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xs"}
      open={open}
      onClose={onClose}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      // style={{ borderBottomLeftRadius:'32px !important',borderBottomRightRadius:'32px' }}
      className="modal-styling"
    >
      <DialogTitle
        style={{
          fontWeight: "600",
          color: "#fff",
          background: localStorage.getItem("primary") || "#c41035",
          textAlign: "center",
        }}
      >
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#ffffff !important",
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider />
      <DialogContent>
        <Typography sx={{ textAlign: "center" }}>{text}</Typography>
        {content && content}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", margin: "10px 0px" }}>
        <Button
          disabled={loading}
          onClick={onButtonClick}
          className="mui-btn primary filled"
        >
          <Typography sx={{ fontSize: "18px" }}>Confirm</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
