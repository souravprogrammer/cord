import React, { useEffect, useLayoutEffect } from "react";
import ProfileSide from "@/components/nav/ProfileSide";
import StickyWrapper from "@/components/utils/StickyWrapper";
import UserLayout from "@/components/Layouts/UserLayout";
import { GetSessionParams, getSession, useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getHomeThreads, getThread, getUsers } from "@/utils/QueryClient";
import Post from "@/components/Post/Post";
import { Paper } from "@mui/material";
import { Thread, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import { likePost, unlike } from "@/utils/QueryClient";
import Box from "@mui/material/Box";
type Props = { user: User; thread: Thread };

export default function Index({ user, thread }: Props) {
  console.log(thread);
  const changePage = useStore((state: StoreState) => state.changePage);
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
    <UserLayout>
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
          <Post
            user={{ ...thread, id: thread.userId } as any}
            thread={thread}
            onLike={handlePostLikeDisLike}
          />
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
      </Box>
    </UserLayout>
  );
}
export async function getServerSideProps(context: any) {
  // const isDark = context?.req?.headers?.cookie?.includes("theme=dark");
  // useStore.setState({ themeMode: isDark ? "dark" : "light" });
  const threadId = context.params.thread;

  const session = await getSession(context);

  try {
    const thread = await getThread({ threadId: threadId });
    if (!thread.getThread) {
      return {
        notFound: true,
      };
    }
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
        thread: thread.getThread,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}
