import React, { PropsWithChildren, CSSProperties } from "react";
import Box from "@mui/material/Box";

interface props extends PropsWithChildren {
  sx?: any;
}

export default function StickyWrapper({ children, sx }: props) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: "79px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
