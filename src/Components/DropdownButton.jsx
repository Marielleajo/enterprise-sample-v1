import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import PopupState, {
  bindHover,
  bindToggle,
  bindPopover,
} from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { IconButton, MenuItem } from "@mui/material";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import Popover from "@material-ui/core/Popover";

export default function DropdownButton({
  Options,
  ButtonText,
  ButtonProps,
  OnHover = false,
  onMenuClick
}) {
  const isString = typeof ButtonText === "string";
  // Define the props for bindHover
  const bindHoverProps = (popupState) =>
    OnHover
      ? {
          ...bindHover(popupState),
        }
      : {
          ...bindToggle(popupState),
        };

  return (
    <PopupState variant="popover" popupId="demo-popup-popper">
      {(popupState) => (
        <div>
          {isString ? (
            // Render a Button component if Button is a component
            <Button {...ButtonProps} {...bindHoverProps(popupState)} > {ButtonText} </Button>
          ) : (
            // Render an IconButton if Button is a string
            <IconButton {...ButtonProps} {...bindHoverProps(popupState)}>
              {ButtonText}
            </IconButton>
          )}

          {OnHover ? 
            <HoverPopover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              onClose={()=>{popupState.close();}}
            >
              {Options?.map((item) => (
                <MenuItem onClick={(e) => {
                  onMenuClick(item?.value)
                  popupState.close(); // Close the popover
                }} value={item?.value}> {item?.text} </MenuItem>
              ))}
            </HoverPopover>
          : <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            onClose={()=>{popupState.close();}}
          >
            {Options?.map((item) => (
              <MenuItem onClick={(e) => {
                onMenuClick(item?.value)
                popupState.close(); // Close the popover
              }} value={item?.value}> {item?.text} </MenuItem>
            ))}
          </Popover>}
        </div>
      )}
    </PopupState>
  );
}
