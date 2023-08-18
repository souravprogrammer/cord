import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { GetSessionParams, getSession } from "next-auth/react";
import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import { Thread, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { createThread } from "@/utils/QueryClient";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

import { likePost, unlike, getHomeThreads } from "@/utils/QueryClient";
import UserLayout from "@/components/Layouts/UserLayout";
import ShareDrawer from "@/components/card/ShareDrawer";

type Props = { user: User };

const ProfileSide = dynamic(() => import("@/components/nav/ProfileSide"));
const StickyWrapper = dynamic(() => import("@/components/utils/StickyWrapper"));
const CreatePost = dynamic(() => import("@/components/Post/CreatePost"));
const MyButton = dynamic(() => import("@/components/utils/MyButton"));
const InfiniteScroller = dynamic(
  () => import("@/components/utils/InfiniteScroller")
);
const Post = dynamic(() => import("@/components/Post/Post"));

export default function Index({ user }: Props) {
  const changePage = useStore((state: StoreState) => state.changePage);
  const [openShare, setOpenShare] = useState<boolean>(false);
  const setThread = useStore((state) => state.setThread);
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
      getHomeThreads({ page: { userId: user.id, page: pageParam, size: 10 } }),
    {
      getNextPageParam: (_lastpage, pages) => {
        return pages.length + 1;
      },
    }
  );
  const fetchOnScroll = useCallback(() => {
    fetchNextPage();
  }, []);

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
    <InfiniteScroller next={fetchOnScroll}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "3fr 1fr" },
          gap: "8px",
          height: "100%",
        }}
      >
        <div
          style={{
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            borderRight: "1px solid rgba(0,0,0,0.1)",
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
            return group.getHomeThreads?.map((thread: any, index) => {
              return (
                <Post
                  key={index}
                  user={{ ...thread, id: thread.userId } as User}
                  thread={thread as Thread}
                  onLike={handlePostLikeDisLike}
                  onReshare={(thread: Thread) => {
                    setThread(thread);
                    setOpenShare(true);
                  }}
                />
              );
            });
          })}
          {isLoading || isFetchingNextPage ? (
            <>
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={318}
              ></Skeleton>
              <Skeleton variant="rectangular" width={"100%"} height={318} />
            </>
          ) : null}
        </div>
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
        <ShareDrawer
          open={openShare}
          onClose={() => {
            setOpenShare(false);
          }}
          onClickClose={() => setOpenShare(false)}
          user={user}
        />
      </Box>
    </InfiniteScroller>
  );
}
Index.getLayout = UserLayout;

export async function getServerSideProps(context: GetSessionParams) {
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
