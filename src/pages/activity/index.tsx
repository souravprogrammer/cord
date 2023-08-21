import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import UserLayout from "@/components/Layouts/UserLayout";
import { useQuery } from "react-query";
import { getActivities } from "@/utils/QueryClient";
import { GetSessionParams, getSession } from "next-auth/react";
import { Activity, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import { CircularProgress } from "@mui/material";

// import NotifiactionCard from "@/components/card/NotificationCard";

const NotifiactionCard = dynamic(
  () => import("@/components/card/NotificationCard"),
  { loading: () => <p>loading...</p> }
);

type Props = {
  user: User;
};

export default function Index({ user }: Props) {
  const changePage = useStore((state: StoreState) => state.changePage);
  const { data, isLoading, isFetching } = useQuery(["activity"], () =>
    getActivities({ userId: user.id })
  );

  useEffect(() => {
    changePage("activity");
  }, []);

  return (
    <UserLayout>
      <div
        style={{
          display: "grid",
          gap: "8px",
        }}
      >
        {isLoading || isFetching ? (
          <>
            <div
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          </>
        ) : (
          data?.activity?.map((activity: any, index: number) => {
            return (
              <NotifiactionCard
                key={index}
                user={activity.from as User}
                activity={activity as Activity}
              />
            );
          })
        )}
      </div>
    </UserLayout>
  );
}

export async function getServerSideProps(context: GetSessionParams) {
  // const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
  // useStore.setState({ themeMode: isDark ? "dark" : "light" });
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
      page: 1,
    },
  };
}
