import React, { useEffect, useLayoutEffect } from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import { useQuery } from "react-query";
import { getActivities } from "@/utils/QueryClient";
import { GetSessionParams, getSession } from "next-auth/react";
import { Activity, User } from "@/Type";
import NotifiactionCard from "@/components/card/NotificationCard";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";

type Props = {
  user: User;
};

export default function Index({ user }: Props) {
  const changePage = useStore((state: StoreState) => state.changePage);
  const { data, isLoading } = useQuery(["activity"], () =>
    getActivities({ userId: user.id })
  );

  useLayoutEffect(() => {
    changePage("activity");
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gap: "8px",
      }}
    >
      {data?.activity?.map((activity: any, index: number) => {
        return (
          <NotifiactionCard
            key={index}
            user={activity.from as User}
            activity={activity as Activity}
          />
        );
      })}
    </div>
  );
}

Index.getLayout = UserLayout;
export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  console.log(session);

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
