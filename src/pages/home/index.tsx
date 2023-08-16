import React, { useEffect, useRef, useState } from "react";
import ProfileSide from "@/components/nav/ProfileSide";
import StickyWrapper from "@/components/utils/StickyWrapper";
import UserLayout from "@/components/Layouts/UserLayout";
import { GetSessionParams, getSession, useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getHomeThreads, getUsers } from "@/utils/QueryClient";
import Post from "@/components/Post/Post";
import { Button, Drawer, Paper } from "@mui/material";
import CreatePost from "@/components/Post/CreatePost";
import { Thread, User } from "@/Type";
import { useStore } from "@/utils";
import { StoreState } from "@/utils/Store";
import { likePost, unlike } from "@/utils/QueryClient";
import Box from "@mui/material/Box";
import MyButton from "@/components/utils/MyButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { createThread } from "@/utils/QueryClient";
type Props = { user: User };

export default function Index({ user }: Props) {
  const session = useSession();
  const changePage = useStore((state: StoreState) => state.changePage);
  const selectedThreadId = useRef<string>("");
  const { data: therads, isLoading } = useQuery(["home"], () =>
    getHomeThreads({ userId: user.id })
  );
  const [openShare, setOpenShare] = useState<boolean>(false);
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
  }, []);
  useEffect(() => {
    console.log("session ", session);
  }, [session]);

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
      thread: { userId: user.id, threadId: selectedThreadId.current },
    });
  };

  return (
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
        {therads?.getHomeThreads?.map((thread: any, index) => {
          return (
            <Post
              key={index}
              user={{ id: thread.userId, ...thread } as User}
              thread={thread as Thread}
              onLike={handlePostLikeDisLike}
              onReshare={(id: string) => {
                selectedThreadId.current = id;
                setOpenShare(true);
              }}
            />
          );
        })}
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
          console.log("closing the drawer");
          selectedThreadId.current = "";
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
          <MyButton
            disabled
            label="Quote"
            Icon={
              <>
                <TextsmsOutlinedIcon sx={{ width: "20px", height: "20px" }} />
              </>
            }
          />
        </Box>
      </Drawer>
    </Box>
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
