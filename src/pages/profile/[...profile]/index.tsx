import { GetSessionParams, getSession } from "next-auth/react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import UserLayout from "@/components/Layouts/UserLayout";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { Thread, User } from "@/Type";
import dynimic from "next/dynamic";

import { getUser } from "@/utils/QueryClient";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { NextRouter, useRouter } from "next/dist/client/router";
import { likePost, unlike } from "@/utils/QueryClient";
import { useStore } from "@/utils";
import MySwipeableDrawer from "@/components/utils/MySwipeableDrawer";

const ProfileCard = dynimic(() => import("@/components/profile/ProfileCard"), {
  ssr: false,
  suspense: true,
});

const ShareDrawer = dynimic(() => import("@/components/card/ShareDrawer"));
const Post = dynimic(() => import("@/components/Post/Post"));

type Props = {
  user: User;
  myProfile: boolean;
};

export default function Index({ user, myProfile }: Props) {
  const router: NextRouter = useRouter();
  const queryclient = useQueryClient();
  const setThread = useStore((state) => state.setThread);
  const shareRef = useRef<any>();

  const { data, isLoading, isFetching } = useQuery<any>(
    ["profile", router.query.profile?.[0]],
    () => getUser({ id: router.query.profile?.[0] ?? "", userId: user.id }),
    {
      cacheTime: 2,
    }
  );
  const { mutate: mutateLikePost } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryclient.invalidateQueries(["profile", router.query.profile?.[0]]);
    },
  });
  const { mutate: mutateunLikePost } = useMutation({
    mutationFn: unlike,
    onSuccess: () => {
      queryclient.invalidateQueries(["profile", router.query.profile?.[0]]);
    },
  });

  const handlePostLikeDisLike = async (
    action: {
      action: { threadId: string };
    },
    liked: boolean
  ) => {
    if (liked) {
      mutateunLikePost({ action: { ...action.action, userId: user.id } });
    } else {
      mutateLikePost({ action: { ...action.action, userId: user.id } });
    }
  };

  return (
    <UserLayout showNav={false}>
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Suspense fallback={"laoding..."}>
            <ProfileCard data={data} user={user} myProfile={myProfile} />
          </Suspense>
          <Box
            sx={{
              display: "grid",
              gap: "16px",
              pt: "8px",
            }}
          >
            {data?.user?.thread.map((thread: any) => {
              return (
                <Post
                  onLike={handlePostLikeDisLike}
                  key={thread._id}
                  user={{ ...data?.user, id: data.user?._id } as User}
                  thread={thread as Thread}
                  onReshare={(thread: Thread) => {
                    setThread(thread);
                    // setOpenShare(true);
                    shareRef.current.setOpen(true);
                  }}
                />
              );
            })}
          </Box>
          <MySwipeableDrawer ref={shareRef}>
            <ShareDrawer user={user} />
          </MySwipeableDrawer>
        </Box>
      )}
    </UserLayout>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
    useStore.setState({ themeMode: isDark ? "dark" : "light" });
  } catch (err) {}
  const userId = context.params.profile[0];
  const session: any = await getSession(context as GetSessionParams);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const data = await getUser({ id: userId, userId: session?.user?.id });
  const myProfile: boolean = (session?.user as User).id === userId;

  if (!data || !data.user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user: session?.user,
      myProfile,
    },
  };
}
