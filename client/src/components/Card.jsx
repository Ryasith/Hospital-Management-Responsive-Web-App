import React from "react";
import { Box, BoxProps, useTheme } from "@mui/material";

const Card = ({ sx, ...props }) => {
  const theme = useTheme();
  return (
    <Box
      className={theme.palette.mode === "dark" ? "card-dark" : "card-light"}
      sx={{...sx }} 
    >
      {props.children}
    </Box>
  );
};

export default Card;
