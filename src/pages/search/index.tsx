import React from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type Props = {};

export default function Index({}: Props) {
  return (
    <UserLayout>
      <Box>
        <Typography>Search User</Typography>
      </Box>
    </UserLayout>
  );
}
