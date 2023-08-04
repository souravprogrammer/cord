import React from "react";

import UserLayout from "@/components/Layouts/UserLayout";
import ProfileSide from "@/components/nav/ProfileSide";
import StickyWrapper from "@/components/utils/StickyWrapper";
import Paper from "@mui/material/Paper";
import { useSession } from "next-auth/react";
import UserSearch from "@/components/card/UserSearch";
import { User } from "@/Type";
import { useRouter } from "next/dist/client/router";
import { getUsers } from "@/utils/QueryClient";
import { useQuery } from "react-query";
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        gap: "8px",
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
      <StickyWrapper sx={{ height: "300px" }}>
        <Paper>
          <ProfileSide user={session.data?.user ?? ({} as any)} />
        </Paper>
      </StickyWrapper>
    </div>
  );
}

User.getLayout = UserLayout;

// export async function getServerSideProps(context: any) {
//   const userName = context.params.user[0];
//   return {
//     props: {},
//   };
// }
