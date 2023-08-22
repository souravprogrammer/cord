import React, { useState, Suspense, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import { GetSessionParams, getSession } from "next-auth/react";
import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { Thread, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

import { likePost, unlike, getHomeThreads } from "@/utils/QueryClient";
import UserLayout from "@/components/Layouts/UserLayout";
import MySwipeableDrawer from "@/components/utils/MySwipeableDrawer";
// import ShareDrawer from "@/components/card/ShareDrawer";

type Props = { user: User };

const ShareDrawer = dynamic(() => import("@/components/card/ShareDrawer"), {
  ssr: false,
  suspense: true,
});

const ProfileSide = dynamic(() => import("@/components/nav/ProfileSide"));
const StickyWrapper = dynamic(() => import("@/components/utils/StickyWrapper"));
const CreatePost = dynamic(() => import("@/components/Post/CreatePost"));
const Post = dynamic(() => import("@/components/Post/Post"));

function Index({ user }: Props) {
  const changePage = useStore((state: StoreState) => state.changePage);
  const setThread = useStore((state) => state.setThread);
  const shareRef = useRef<any>();
  const queryClient = useQueryClient();

  const {
    data: therads,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["home"],
    ({ pageParam = 1 }) =>
      getHomeThreads({ page: { userId: user.id, page: pageParam, size: 50 } }),
    {
      getNextPageParam: (_lastpage: any, pages) => {
        return _lastpage?.getHomeThreads?.length < 50 ? null : pages.length + 1;
      },
      staleTime: 60000,
      cacheTime: 50000,
    }
  );

  const { mutate: mutateLikePost } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["home"]);
    },
  });
  const { mutate: mutateunLikePost } = useMutation({
    mutationFn: unlike,
    onSuccess: () => {
      queryClient.invalidateQueries(["home"]);
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
    <UserLayout>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "3fr 1fr" },
          gap: "8px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            borderLeft: { xs: "none", md: "1px solid rgba(0,0,0,0.1)" },
            borderRight: { xs: "none", md: "1px solid rgba(0,0,0,0.1)" },
            padding: "4px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
              },
            }}
          >
            <CreatePost user={user} />
          </Box>
          {therads?.pages.map((group, index) => {
            return group.getHomeThreads?.map((thread: any, index: number) => {
              return (
                <Post
                  key={index}
                  user={{ ...thread, id: thread.userId } as User}
                  thread={thread as Thread}
                  onLike={handlePostLikeDisLike}
                  onReshare={(thread: Thread) => {
                    setThread(thread);
                    shareRef.current.setOpen(true);
                  }}
                />
              );
            });
          })}
          {isLoading ? (
            <>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={180}
              ></Skeleton>
              <Skeleton variant="rectangular" width={"100%"} height={318} />
              <Skeleton variant="rectangular" width={"100%"} height={318} />
              <Skeleton variant="rectangular" width={"100%"} height={318} />
              <Skeleton variant="rectangular" width={"100%"} height={318} />
              <Skeleton variant="rectangular" width={"100%"} height={318} />
            </>
          ) : null}

          {!isLoading && isFetchingNextPage ? (
            <>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={180}
              ></Skeleton>
              <Skeleton variant="rectangular" width={"100%"} height={318} />
            </>
          ) : null}
          {!isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "20px",
                }}
                onClick={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
              >
                Load More
              </Button>
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
          }}
        >
          <StickyWrapper sx={{ height: "300px" }}>
            <Paper>
              <ProfileSide user={user} />
            </Paper>
          </StickyWrapper>
        </Box>

        <Suspense fallback={"loading..."}>
          <MySwipeableDrawer ref={shareRef}>
            <ShareDrawer user={user} />
          </MySwipeableDrawer>
        </Suspense>
      </Box>
    </UserLayout>
  );
}
export default React.memo(Index);

export async function getServerSideProps(context: GetSessionParams) {
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
      page: 0,
    },
  };
}
