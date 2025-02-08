import React from "react";
import {
  IconButtonProps,
  useTheme,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";

const CustomIconButton = ({
  size,
  color,
  variant,
  tooltipPlacement,
  tooltipMessage,
  ...props
}) => {
  return (
    <Tooltip
      title={tooltipMessage}
      placement={tooltipPlacement || "bottom"}
      arrow
    >
      <IconButton
        size={size || "large"}
        color={color || "success"}
        {...props}
        sx = {{borderRadius : 1, border : 1,m : '2px'}}
      >
        {props.children}    
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
