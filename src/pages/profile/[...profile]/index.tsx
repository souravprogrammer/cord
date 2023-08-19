import { GetSessionParams, getSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Paper from "@mui/material/Paper";

import { Thread, User } from "@/Type";
import dynimic from "next/dynamic";

import {
  getUser,
  followUser,
  unfollowUser,
  queryClient,
} from "@/utils/QueryClient";

import { dehydrate, useMutation, useQuery, useQueryClient } from "react-query";
import { NextRouter, useRouter } from "next/dist/client/router";
import { likePost, unlike } from "@/utils/QueryClient";
import { useStore } from "@/utils";

import MySwipeableDrawer from "@/components/utils/MySwipeableDrawer";

const EditProfileDrawer = dynimic(
  () => import("@/components/card/EditProfileDrawer")
);

const ShareDrawer = dynimic(() => import("@/components/card/ShareDrawer"));
const Post = dynimic(() => import("@/components/Post/Post"));

interface userProfileType extends User {
  following: { count: number };
  followers: { count: number };
  thread: Thread[];
}
type Props = {
  user: User;
  myProfile: boolean;
};

export default function Index({ user, myProfile }: Props) {
  const [tab, setTab] = useState<number>(0);
  const router: NextRouter = useRouter();
  const queryclient = useQueryClient();
  const [openShare, setOpenShare] = useState(false);
  const setThread = useStore((state) => state.setThread);

  const { data, isLoading, isFetching } = useQuery<any>(
    ["profile", router.query.profile?.[0]],
    () => getUser({ id: router.query.profile?.[0] ?? "", userId: user.id }),
    {
      cacheTime: 2,
    }
  );
  const { mutate: follow } = useMutation(followUser, {
    onSuccess() {
      queryclient.invalidateQueries(["profile", router.query.profile?.[0]]);
    },
  });
  const { mutate: unFollow } = useMutation(unfollowUser, {
    onSuccess() {
      queryclient.invalidateQueries(["profile", router.query.profile?.[0]]);
    },
  });
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

  const onFollowhandler = async () => {
    if (data.user.isFollowing) {
      unFollow({
        action: {
          follow: user.id,
          followed: router.query.profile?.[0] ?? "",
        },
      });
    } else {
      follow({
        action: {
          follow: user.id,
          followed: router.query.profile?.[0] ?? "",
        },
      });
    }
  };

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

  const drawerRef = useRef<any>();

  return (
    <UserLayout>
      <Box>
        <Paper sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <Box
            sx={{
              display: "grid",
              padding: 2,
              gridTemplateColumns: { sm: "1fr", md: "1fr 2fr" },
            }}
          >
            <Avatar
              sizes="large"
              sx={{
                height: { xs: "85px", sm: "112px", md: "152px" },
                width: { xs: "85px", sm: "112px", md: "152px" },

                alignSelf: "center",
                justifySelf: "center",
              }}
              src={data?.user?.image as string}
            >
              <Typography variant="h2">
                {data?.user?.name
                  .split(" ")
                  .map((word: string) => word.charAt(0).toUpperCase())
                  .join("")}
              </Typography>
            </Avatar>
            <Box
              sx={{
                display: "grid",
                padding: { xs: "8px", sm: "8px", md: "16px" },
                rowGap: "8px",
                columnGap: "12px",
                gridTemplateColumns: {
                  xs: "1fr 1fr 1fr 1fr",
                  sm: "1fr 1fr 1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gridTemplateAreas: {
                  xs: `
               'un un followbtn followbtn'
               'th follow following el2' 
               'name name actions el3'
               'bio bio bio bio'
                `,
                  sm: `
                'un un un followbtn'
                'th follow following el2' 
                'name name actions el3'
                'bio bio bio bio'
                `,
                  md: `
          'un un followbtn el'
          'th follow following el2' 
          'name actions actions el3'
          'bio bio bio bio'
          `,
                },
              }}
            >
              <Typography
                sx={{
                  gridArea: { md: "un", sm: "un", xs: "un" },
                  alignSelf: "center",
                }}
                fontWeight={"bold"}
              >
                {data?.user?.email}
              </Typography>
              <Typography
                sx={{
                  gridArea: "th",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  {data?.user?.thread?.length}
                </span>{" "}
                Threads
              </Typography>
              <Typography
                sx={{
                  gridArea: "follow",
                  whiteSpace: "nowrap",
                }}
              >
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  {data?.user?.followers?.count}
                </span>{" "}
                followers
              </Typography>
              <Typography
                sx={{
                  gridArea: "following",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  {data?.user?.following?.count}
                </span>{" "}
                following
              </Typography>
              <Typography
                sx={{
                  gridArea: { md: "name", sm: "name", xs: "name" },
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.user?.name}
              </Typography>
              <Typography
                sx={{ gridArea: { md: "bio", sm: "bio", xs: "bio" } }}
              >
                {data?.user?.bio}
                This world is curl but its also a very beautiful creator of
                dogesan & Arrayanime
              </Typography>
              {myProfile ? null : (
                <Button
                  variant={data.user.isFollowing ? "outlined" : "contained"}
                  size="small"
                  sx={{
                    gridArea: {
                      md: "followbtn",
                      xs: "followbtn",
                      sm: "followbtn",
                    },
                    height: "26px",
                    alignSelf: "center",
                  }}
                  onClick={onFollowhandler}
                >
                  {data.user.isFollowing ? "following" : "follow"}
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ pt: 4 }}>
            <Divider />
          </Box>
          <Tabs value={tab} onChange={(e, value: number) => setTab(value)}>
            <Tab label="thread" />
            <Tab label="replies" />
          </Tabs>
        </Paper>

        <Paper
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >
          <Box
            sx={{
              padding: 2,
              display: "grid",
              gridTemplateColumns: "1fr fr 1fr 1fr",
              columnGap: 2,
              rowGap: 1,
              gridTemplateAreas: `
            'name name name avatar'
            'follow follow follow avatar'
            'bio bio bio bio'
            'button1 button1 button2 button2'
            `,
            }}
          >
            <Box
              sx={{
                gridArea: "name",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  gridArea: "name",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.user?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  gridArea: "name",
                  alignSelf: "center",
                  fontSize: "13px",
                }}
                fontWeight={"bold"}
              >
                {data?.user?.email}
              </Typography>
            </Box>
            <Box
              sx={{
                gridArea: "follow",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  alignSelf: "center",
                  fontSize: "13px",
                }}
                fontWeight={"bold"}
              >
                {data?.user?.followers?.count}
                <span style={{ fontWeight: "bold" }}>{" follow"}</span>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  alignSelf: "center",
                  fontSize: "13px",
                }}
                fontWeight={"bold"}
              >
                {data?.user?.following?.count}
                <span style={{ fontWeight: "bold" }}>{" following"}</span>
              </Typography>
            </Box>

            <Typography
              sx={{
                gridArea: "bio",
                fontSize: "13px",

                pt: 1,
              }}
            >
              {data?.user?.bio}
              {"world is crule but also a very beautiful"}
            </Typography>

            <Avatar
              sizes="large"
              sx={{
                gridArea: "avatar",
                height: { xs: "85px", sm: "112px", md: "112px" },
                width: { xs: "85px", sm: "112px", md: "112px" },

                alignSelf: "center",
                justifySelf: "center",
              }}
              src={data?.user?.image as string}
            >
              <Typography variant="h2">
                {data?.user?.name
                  .split(" ")
                  .map((word: string) => word.charAt(0).toUpperCase())
                  .join("")}
              </Typography>
            </Avatar>

            {myProfile ? (
              <Button
                onClick={() => {
                  drawerRef.current.setOpen(true);
                }}
                variant="outlined"
                size="small"
                sx={{
                  gridArea: "button1",
                  placeItems: "center",
                  display: "grid",
                }}
              >
                Edit Profile
              </Button>
            ) : null}

            {myProfile ? null : (
              <Button
                variant={data.user.isFollowing ? "outlined" : "contained"}
                size="small"
                sx={{
                  gridArea: "button1",
                  // height: "26px",
                  alignSelf: "center",
                }}
                onClick={onFollowhandler}
              >
                {data.user.isFollowing ? "following" : "follow"}
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigator.share({
                  title: user.name,
                  url: window.location.href,
                });
              }}
              sx={{
                gridArea: "button2",
                placeItems: "center",
                display: "grid",
              }}
            >
              share profile
            </Button>
          </Box>
        </Paper>

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
                  setOpenShare(true);
                }}
              />
            );
          })}
        </Box>
        <ShareDrawer
          open={openShare}
          onClose={() => {
            setOpenShare(false);
          }}
          user={user}
          onClickClose={() => setOpenShare(false)}
        />
      </Box>
      <MySwipeableDrawer ref={drawerRef}>
        <EditProfileDrawer
          initialProps={{
            _id: data?.user._id,
            name: data?.user.name,
            email: data?.user.email,
            image: data?.user.image,
            bio: data?.user.bio,
          }}
        />
      </MySwipeableDrawer>
    </UserLayout>
  );
}

export async function getServerSideProps(context: any) {
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
  await queryClient.prefetchQuery(["profile", userId], () =>
    getUser({ id: userId, userId: session?.user?.id })
  );
  const myProfile: boolean = (session?.user as User).id === userId;
  const data: any = queryClient.getQueryData(["profile", userId]);

  if (!data || !data.user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user: session?.user,
      myProfile,
      deState: dehydrate(queryClient),
    },
  };
}
