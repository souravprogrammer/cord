import React from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getSession } from "next-auth/react";
import { useStore } from "@/utils";

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

export async function getServerSideProps(context: any) {
  // try {
  //   const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
  //   useStore.setState({ themeMode: isDark ? "dark" : "light" });
  // } catch (err) {}
  const session = await getSession(context);

  if (session === null) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      user: session.user,
    },
  };
}
