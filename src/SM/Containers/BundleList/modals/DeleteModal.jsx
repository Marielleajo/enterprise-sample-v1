import { Button, Grid } from "@mui/material";
import React from "react";
import MuiModal from "../../../../Components/MuiModal/MuiModal";

export default function DeleteModal({ onClose, onConfirm, open , loading }) {
  return (
    <MuiModal open={open} handleClose={onClose} title="Delete Bundle">
      <>
        Are you sure you want to delete this bundle? This action cannot be
        undone.
        <Grid container className="Cancel_Save" mt={2}>
          <Button className="mui-btn primary outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="mui-btn primary filled">
            {loading ? "Loading..." :"Delete"}
          </Button>
        </Grid>
      </>
    </MuiModal>
  );
}
