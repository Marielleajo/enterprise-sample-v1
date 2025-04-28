import { Check, Close } from "@mui/icons-material";
import SyncIcon from "@mui/icons-material/Sync";
import { Button, Chip } from "@mui/material";

const MuiStatus = ({
  label,
  onClick,
  statuses = { warning: "warning", success: "success", error: "error" },
  disable = []
}) => {
  // Map the label to the corresponding color based on the statuses object
  const color = statuses[label];
  let icon = null;
  if (color == "warning") icon = <SyncIcon fontSize="small" />;
  else if (color == "success") icon = <Check fontSize="small" />;
  else if (color == "error") icon = <Close fontSize="small" />;
  // Default to "default" color if no match is found
  const defaultColor = "default";

  return (
    <Button disabled={disable?.includes(label)} className="MuiStatus" onClick={onClick}>
      <Chip
        sx={{ padding: 1 }}
        icon={icon}
        variant={label==="Pending" && !disable?.includes(label) ? "contained" : "outlined"}
        label={label}
        color={color || defaultColor} // Set the color dynamically
        size="small"
      />
    </Button>
  );
};

export default MuiStatus;
