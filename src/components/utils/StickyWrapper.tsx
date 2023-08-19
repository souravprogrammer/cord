import React, { PropsWithChildren, CSSProperties } from "react";
import Box from "@mui/material/Box";

interface props extends PropsWithChildren {
  sx?: any;
}

function StickyWrapper({ children, sx }: props) {
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

export default React.memo(StickyWrapper);
