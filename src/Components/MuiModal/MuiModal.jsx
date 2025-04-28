import {Grid, IconButton, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./MuiModal.scss";
import {Close} from "@mui/icons-material";

export default function MuiModal({
                                     open,
                                     handleClose,
                                     children,
                                     width = 500,
                                     title = null,
                                     style = {},
                                 }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id="MuiModal" sx={{width}}>
                {title && (
                    <Grid
                        className="Header"
                        container
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Grid item xs={10}>
                            <Typography variant="h5">{title}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={handleClose}>
                                <Close color="white"/>
                            </IconButton>
                        </Grid>
                    </Grid>
                )}
                <Box className="Body" style={style}>
                    {children}
                </Box>
            </Box>
        </Modal>
    );
}
