import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SEND_CLIENT_INFO } from "../../../APIs/Clients";
import MuiModal from "../../../Components/MuiModal/MuiModal";
import { handleMessageError } from "../../Utils/Functions";
import { useSnackbar } from "../../../Contexts/SnackbarContext";

const SupportModal = ({ open, handleClose }) => {
  const { clientId } = useSelector((state) => state?.authentication);
  const { showSnackbar } = useSnackbar();

  const [loading,setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      subject: "REQUEST FOR SUPPORT",
      body: " ",
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let response = await SEND_CLIENT_INFO({ clientId, ...values });
        if (response?.data?.success) {
          formik?.resetForm();
          showSnackbar("Message was sent successfully", "success");
          return handleClose();
        }
        showSnackbar("Something went wrong", "error");
      } catch (e) {
        showSnackbar(handleMessageError({ e, type: "validation" }), "error");
      } finally {
        setLoading(false)
      }
    },
  });

  return (
    <MuiModal open={open} handleClose={handleClose} title={"Request Support"}>
      <Box className="p-2">
        <form onSubmit={formik.handleSubmit}>
          {/* <Box marginBottom={2}>
            <TextField
              variant="standard"
              fullWidth
              id="subject"
              name="subject"
              label="Subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              variant="standard"
              fullWidth
              id="body"
              name="body"
              label="Message"
              multiline
              rows={4}
              value={formik.values.body}
              onChange={formik.handleChange}
            />
          </Box> */}
          <Typography
            variant="h6"
            className=" mb-3"
            textAlign={"center"}
            paddingY={1}
          >
            Are you sure you want to share your account details with the support
            team?
          </Typography>
          <Button
            type="submit"
            color="primary"
            fullWidth
            className="mui-btn primary filled mb-3"
            disabled={loading}
          >
            {loading ? "Requesting Support..." : "Submit"}
          </Button>
        </form>
      </Box>
    </MuiModal>
  );
};

export default SupportModal;
