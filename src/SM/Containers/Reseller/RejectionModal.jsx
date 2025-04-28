import React from "react";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const RejectionModal = ({
  open,
  onClose,
  options,
  onChange,
  onClick,
  error,
  loading,
}) => {
  return (
    <MuiModal
      title={"Reject Reseller"}
      open={open}
      width="500px"
      id="edit-contact-form"
      handleClose={onClose}
    >
      <Grid item xs={4}>
        <Autocomplete
          clearIcon={null}
          id="combo-box-demo"
          options={options}
          getOptionLabel={(option) => option.name || ""}
          onChange={onChange}
          disabled={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Rejection Reason"
            />
          )}
        />
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: "4px", display: "block" }}
          >
            Reason is required
          </Typography>
        )}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          className="mui-btn primary filled"
          id="add-Industry"
          onClick={onClick}
          disabled={error || loading}
        >
          {loading ? <CircularProgress size="23px" /> : "Reject"}
        </Button>
      </Box>
    </MuiModal>
  );
};

export default RejectionModal;
