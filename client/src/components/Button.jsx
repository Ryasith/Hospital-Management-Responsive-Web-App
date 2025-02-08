import React from "react";
import {
  Button as MaterialButton,
  ButtonProps,
  useTheme,
  Typography,
  Tooltip,
} from "@mui/material";

const Button = ({ size, color,variant, tooltipPlacement, tooltipMessage, ...props }) => {
  const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  return (
    <Tooltip title={tooltipMessage} placement={tooltipPlacement || 'bottom'} arrow>
    <MaterialButton
      size={size || "large"}
      color={color || "success"}
      variant={variant || "contained"}
      {...props}
    >
      <Typography >
        {props.children}
      </Typography>
    </MaterialButton>
    </Tooltip>
  );
};

export default Button;
