import { Box, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../../Utils/Functions";

const ToolTipMenu = ({ item, IsActive }) => {
  return (
    <Tooltip
      key={item.recordGuid}
      title={
        <Box>
          {item.children.map((child) => (
            <ListItemButton
              key={child.recordGuid}
              to={`/${child.uri}`}
              component={Link}
              sx={{
                color: IsActive(child) ? "white" : "black",
                backgroundColor: IsActive(child) ? "var(--primary-color)" : "",
                "&:hover": {
                  color: "white",
                  backgroundColor: "var(--primary-color)",
                },
                fontSize: "13px",
                padding: "6px 14px",
              }}
            >
              <i className={`fa ${child.iconUri} menu-icon`} />
              <ListItemText
                className="px-3"
                primary={truncateText(child.menuDetail[0]?.name, 20)}
              />
            </ListItemButton>
          ))}
        </Box>
      }
      placement="right"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <ListItemButton
        sx={{
          color: IsActive(item) ? "white" : "black",
          backgroundColor: IsActive(item) ? "var(--primary-color)" : "",
          "&:hover": {
            color: "white",
            backgroundColor: "var(--primary-color)",
          },
          marginBottom: "1px",
          justifyContent: "center",
        }}
      >
        <i
          className={`fa ${item.iconUri} menu-icon`}
          style={{
            fontSize: "20px", // 🔥 Bigger icon when closed
          }}
        />
      </ListItemButton>
    </Tooltip>
  );
};

export default ToolTipMenu;
