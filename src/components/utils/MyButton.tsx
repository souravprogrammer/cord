import React from "react";

import { ButtonBase, Grid, Typography, CircularProgress } from "@mui/material";

type Props = {
  Icon: any;
  label: string;
  sx?: any;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function MyButton({
  label,
  Icon,
  sx,
  disabled,
  isLoading,
}: Props) {
  return (
    <ButtonBase
      disabled={disabled}
      color="error"
      sx={(theme: any) => ({
        height: "40px",
        display: "flex",

        gap: 1,

        borderRadius: "4px",
        bgcolor: `#8b8e9d60`,
        width: "100%",
        transition: "all 0.3s",
        "&:hover": {
          bgcolor: `#8b8e9d70`,
        },
        ...sx,
      })}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {Icon}
            {/* <RoomPreferencesIcon sx={{ ml: "15px" }} /> */}
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Roboto,sans-serif",
                pr: "30px",
                textTransform: "capitalize",
              }}
            >
              {label}
            </Typography>
          </Grid>
        </>
      )}
    </ButtonBase>
  );
}
