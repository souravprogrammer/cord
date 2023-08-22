import React, { useEffect, useRef } from "react";
import ProfileSide from "@/components/nav/ProfileSide";
import StickyWrapper from "@/components/utils/StickyWrapper";
import UserLayout from "@/components/Layouts/UserLayout";
import { GetSessionParams, getSession, useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getThread, getUsers } from "@/utils/QueryClient";
import Post from "@/components/Post/Post";
import { CircularProgress, Paper } from "@mui/material";
import { Thread, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import { likePost, unlike } from "@/utils/QueryClient";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import MySwipeableDrawer from "@/components/utils/MySwipeableDrawer";
const ShareDrawer = dynamic(() => import("@/components/card/ShareDrawer"), {
  ssr: false,
  suspense: true,
});
type Props = { user: User; threadId: string };

export default function Index({ user, threadId }: Props) {
  const changePage = useStore((state: StoreState) => state.changePage);
  const queryClient = useQueryClient();
  const setThread = useStore((state) => state.setThread);
  const shareRef = useRef<any>();
  const { data: thread, isLoading } = useQuery(["thread", threadId], () =>
    getThread({ threadId: threadId })
  );
  const { mutate: mutateLikePost } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["thread", threadId]);
    },
  });
  const { mutate: mutateunLikePost } = useMutation({
    mutationFn: unlike,
    onSuccess: () => {
      queryClient.invalidateQueries(["thread", threadId]);
    },
  });
  useEffect(() => {
    changePage("home");
  }, []);

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
    <UserLayout removeNav={true}>
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
          {isLoading ? (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: "100dvh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            thread?.getThread && (
              <Post
                user={
                  { ...thread.getThread, id: thread?.getThread.userId } as any
                }
                thread={thread?.getThread as Thread}
                onLike={handlePostLikeDisLike}
                onReshare={(thread: Thread) => {
                  setThread(thread);
                  shareRef.current.setOpen(true);
                }}
              />
            )
          )}
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
        <MySwipeableDrawer ref={shareRef}>
          <ShareDrawer user={user} />
        </MySwipeableDrawer>
      </Box>
    </UserLayout>
  );
}
export async function getServerSideProps(context: any) {
  try {
    const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
    useStore.setState({ themeMode: isDark ? "dark" : "light" });
  } catch (err) {}
  const threadId = context.params.thread;

  const session = await getSession(context);

  try {
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
        threadId: threadId,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
