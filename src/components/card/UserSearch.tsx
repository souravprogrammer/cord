import React from "react";

import { Paper, Avatar, Box, Typography, ButtonBase } from "@mui/material";
import Link from "next/dist/client/link";
type Props = {
  user: any;
};

export default function UserSearch({ user }: Props) {
  return (
    <ButtonBase
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        textAlign: "left",
        borderRadius: "4px",
      }}
    >
      <Link href={"/profile/" + user._id} style={{ textDecoration: "none" }}>
        <Paper
          sx={{
            padding: "16px",
            display: "grid",
            gridTemplateColumns: "48px 1fr 32px",
            rowGap: "8px",
            columnGap: "10px",
            maxWidth: "100%",
            gridTemplateAreas: `
    'avatar name  button'
    'avatar email button'
    `,
          }}
        >
          <Avatar
            sx={{ bgcolor: "orange", gridArea: "avatar", placeSelf: "center" }}
            alt="profile picture"
            src={user?.image}
          >
            {user?.name
              ?.split(" ")
              .map((word: string) => word.charAt(0).toUpperCase())
              .join("")}
          </Avatar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gridArea: "name",
            }}
          >
            <Typography
              fontWeight={"bold"}
              variant="body2"
              sx={{ paddingRight: "4px" }}
            >
              {user?.name}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "grey", gridArea: "email" }}>
            {user?.email}
          </Typography>
        </Paper>
      </Link>
    </ButtonBase>
  );
}
