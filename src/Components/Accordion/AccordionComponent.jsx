import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { useState } from "react";
import "./AccordionComponent.scss";
import { Delete } from "@mui/icons-material";

const AccordionComponent = ({
  outsideExpanded,
  children,
  style,
  title,
  onDelete = null,
}) => {
  const [expanded, setExpanded] = useState(
    outsideExpanded ? outsideExpanded : false
  );

  const handleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <Accordion
      className={`custom-accordion ${expanded ? "expanded" : ""}`}
      expanded={expanded}
      onChange={handleExpand}
      elevation={0}
      square
      style={style}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        className="custom-summary d-flex flex-row"
      >
        <Box className="d-flex flex-row align-items-center">
          <Typography>{title}</Typography>
          <ArrowForwardIosSharpIcon className="expand-icon" />
        </Box>
        {onDelete && (
          <IconButton onClick={onDelete} size="small">
            <Delete />
          </IconButton>
        )}
      </AccordionSummary>
      <AccordionDetails className="custom-details">{children}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionComponent;
