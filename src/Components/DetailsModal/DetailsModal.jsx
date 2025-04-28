import React from "react";
import MuiModal from "../MuiModal/MuiModal";

const DetailsModal = ({ title, open, data, handleClose }) => {
  return (
    <MuiModal
      title={title}
      open={open}
      width="500px"
      id="edit-contact-form"
      handleClose={handleClose}
    >
      {data?.map((item, index) => (
        <ul key={index}>
          <li>{item}</li>
        </ul>
      ))}
    </MuiModal>
  );
};

export default DetailsModal;
