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
  // const session = useSession();
  const changePage = useStore((state: StoreState) => state.changePage);
  const selectedThreadId = useRef<Thread | null>(null);

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
  }, [fetchNextPage]);
  const [openShare, setOpenShare] = useState<boolean>(false);
  const setThread = useStore((state) => state.setThread);
  const setOpenThreadModal = useStore((state) => state.setOpenThreadModal);

  const queryClient = useQueryClient();

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
  const { mutate: repostThread, isLoading: isRepoasting } = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      queryClient.invalidateQueries(["home"]);
    },
  });
  useEffect(() => {
    changePage("home");
  }, [changePage]);

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

  const handleRePostThread = async () => {
    repostThread({
      thread: { userId: user.id, threadId: selectedThreadId.current?._id },
    });
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
                    selectedThreadId.current = thread;
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
        <Drawer
          anchor="bottom"
          open={openShare}
          onClose={() => {
            selectedThreadId.current = null;
            // setThread(null);
            setOpenShare(false);
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "column",
              padding: "16px 8px",
            }}
          >
            <Box onClick={handleRePostThread}>
              <MyButton
                label="Repost"
                isLoading={isRepoasting}
                Icon={
                  <>
                    <AutorenewIcon sx={{ width: "20px", height: "20px" }} />
                  </>
                }
              />
            </Box>
            <Box
              onClick={() => {
                setOpenThreadModal(true);
                setOpenShare(false);
              }}
            >
              <MyButton
                disabled
                label="Quote"
                Icon={
                  <>
                    <TextsmsOutlinedIcon
                      sx={{ width: "20px", height: "20px" }}
                    />
                  </>
                }
              />
            </Box>
          </Box>
        </Drawer>
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
