import React from "react";

import Box from "@mui/material/Box";
import { Typography, Avatar } from "@mui/material";
import { User } from "@/Type";
import Link from "next/link";

type Props = {
  user: User;
};

export default function ProfileSide({ user }: Props) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "45px 4fr",
          maxHeight: "75px",
          gridGap: 4,
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <Avatar
          sizes="small"
          sx={{ bgcolor: "orange" }}
          alt="profile picture"
          src={user.image}
        >
          {user?.name
            ?.split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("")}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Link href={"/profile/" + user.id} style={{ textDecoration: "none" }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: "13px", color: "#000" }}
                fontWeight={"bold"}
              >
                {user.email?.split("@")[0]}
              </Typography>
            </Box>
          </Link>
          <Typography
            variant="body2"
            sx={{
              color: "grey",
              fontSize: "12px",
            }}
          >
            {user.name}
          </Typography>
        </Box>
      </div>
    </div>
  );
}
