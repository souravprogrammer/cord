import React, { useEffect } from "react";

import ProfileSide from "@/components/nav/ProfileSide";
import StickyWrapper from "@/components/utils/StickyWrapper";
import Paper from "@mui/material/Paper";
import { useSession } from "next-auth/react";
import UserSearch from "@/components/card/UserSearch";
import { User } from "@/Type";
import { useRouter } from "next/dist/client/router";
import { getUsers } from "@/utils/QueryClient";
import { useQuery } from "react-query";
import Box from "@mui/material/Box";
import { getSession } from "next-auth/react";
import { useStore } from "@/utils";
// import dynamic from "next/dynamic";

import UserLayout from "@/components/Layouts/UserLayout";
// const UserLayout = dynamic(() => import("@/components/Layouts/UserLayout"));
type Props = {
  result: any;
};

export default function User({}: Props) {
  const session = useSession();
  const router = useRouter();

  const { data, isLoading, isFetching } = useQuery(
    ["search", router.query.user],
    () => getUsers({ name: (router.query.user as string) ?? "mike" })
  );

  return (
    <UserLayout showNav={false}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { sm: "1fr", xs: "1fr", md: "3fr 1fr" },
          gap: "8px",
          // border: "1px solid red",
        }}
      >
        <div
          style={{
            // border: "1px solid red",
            gap: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {data?.users?.length === 0 ? "no result found" : null}
          {data?.users?.map((user: any, index) => {
            return <UserSearch key={user._id} user={user} />;
          })}
        </div>
        <StickyWrapper
          sx={{
            display: {
              md: "block",
              sm: "none",
              xs: "none",
            },
            height: "300px",
          }}
        >
          <Paper>
            <ProfileSide user={session.data?.user ?? ({} as any)} />
          </Paper>
        </StickyWrapper>
      </Box>
    </UserLayout>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
    useStore.setState({ themeMode: isDark ? "dark" : "light" });
  } catch (err) {}
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
