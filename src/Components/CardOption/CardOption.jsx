import { Button } from "@mui/material";
import React from "react";

const CardOption = ({ title, icon, selected, onClick }) => {
  return (
    <Button
      variant={selected ? "outlined" : "text"}
      startIcon={icon}
      onClick={onClick}
      sx={{
        borderRadius: "10px !important",
        borderColor: selected
          ? "var(--primary-color) !important"
          : "#ccc !important",
        border: "1px solid",
        p: "12px !important",
        textTransform: "none",
        minWidth: 120,
        color: selected && "var(--primary-color) !important",
      }}
    >
      {title}
    </Button>
  );
};

export default CardOption;
