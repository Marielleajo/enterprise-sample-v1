import { useState } from "react";

const useDetailsModal = () => {
  const [viewDetails, setViewDetails] = useState({
    title: "",
    data: null,
    open: false,
  });

  const openModal = ({ title, data }) => {
    setViewDetails({
      title,
      data,
      open: true,
    });
  };

  const closeModal = () => {
    setViewDetails({
      title: "",
      data: null,
      open: false,
    });
  };

  return { viewDetails, openModal, closeModal };
};

export default useDetailsModal;
