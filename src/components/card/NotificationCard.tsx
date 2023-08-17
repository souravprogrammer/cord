import React from "react";

// import { Paper, Box, Typography, ButtonBase } from "@mui/material";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import Link from "next/dist/client/link";
import { Activity, ActivityActions, User } from "@/Type";

type Props = {
  user: any;
  activity?: Activity;
};

export default function NotifiactionCard({ user, activity }: Props) {
  return (
    <ButtonBase
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        textAlign: "left",
        borderRadius: "4px",
      }}
    >
      <Link
        href={(() => {
          return activity?.action === "follow" ? "/profile/" + user._id : "";
        })()}
        style={{ textDecoration: "none" }}
      >
        <Paper
          sx={{
            padding: "16px",
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            rowGap: "8px",
            columnGap: "10px",
            maxWidth: "100%",
            width: "100%",
            gridTemplateAreas: `
    'avatar name  email'
    'avatar content content'
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
            <Typography
              variant="body2"
              sx={{ color: "grey", gridArea: "email" }}
            >
              {user?.email}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ gridArea: "content" }}>
            {activity?.action === "follow" ? `started following you` : null}
            {activity?.action === "like" ? `likes your thread` : null}
          </Typography>
        </Paper>
      </Link>
    </ButtonBase>
  );
}
