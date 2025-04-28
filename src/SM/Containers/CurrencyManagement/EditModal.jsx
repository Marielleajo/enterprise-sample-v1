import Box from "@mui/material/Box";
import MuiModal from "../../../Components/MuiModal/MuiModal";

export default function EditModal({
                                      open,
                                      handleClose,
                                      children,
                                      width,
                                      height,
                                      subtitle,
                                      title = null,
                                  }) {
    return (
        <MuiModal
            title="Edit ExchangeRate"
            open={open}
            width="500px"
            id="edit-contact-form"
            handleClose={handleClose}
        >
            <Box
                id="MuiModal"
                sx={{
                    width,
                    height,
                }}
            >
                {children}
            </Box>
        </MuiModal>
    );
}
