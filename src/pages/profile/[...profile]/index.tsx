import { GetSessionParams, getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import UserLayout from "@/components/Layouts/UserLayout";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Divider, Tab, Tabs, Paper } from "@mui/material";
import Post from "@/components/Post/Post";
import { Thread, User } from "@/Type";
import {
  getUser,
  followUser,
  unfollowUser,
  queryClient,
} from "@/utils/QueryClient";
import { dehydrate, useMutation, useQuery, useQueryClient } from "react-query";
import { NextRouter, useRouter } from "next/dist/client/router";

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
  useEffect(() => {
    console.log("profile Data", data);
  }, [data]);
  return (
    <Box>
      <Paper>
        <Box
          sx={{
            padding: 2,
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
          }}
        >
          <Avatar
            sizes="large"
            sx={{
              height: "152px",
              width: "152px",
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
              padding: "16px",
              rowGap: "8px",
              columnGap: "12px",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gridTemplateAreas: `
          'un un followbtn el'
          'th follow following el2'
          'name actions actions el3'
          'bio bio bio bio'
          `,
            }}
          >
            <Typography
              sx={{ gridArea: "un", alignSelf: "center" }}
              fontWeight={"bold"}
            >
              {data?.user?.email}
            </Typography>
            <Typography sx={{ gridArea: "th" }}>
              <span style={{ fontWeight: "bold" }}>
                {data?.user?.thread?.length}
              </span>{" "}
              Threads
            </Typography>
            <Typography sx={{ gridArea: "follow" }}>
              {" "}
              <span style={{ fontWeight: "bold" }}>
                {data?.user?.followers?.count}
              </span>{" "}
              followers
            </Typography>
            <Typography sx={{ gridArea: "following" }}>
              <span style={{ fontWeight: "bold" }}>
                {data?.user?.following?.count}
              </span>{" "}
              following
            </Typography>
            <Typography sx={{ gridArea: "name", fontWeight: "bold" }}>
              {/* sourav sharma */}
              {data?.user?.name}
            </Typography>
            <Typography sx={{ gridArea: "bio" }}>
              {data?.user?.bio}
              This world is curl but its also a very beautiful creator of
              dogesan & Arrayanime
            </Typography>
            {myProfile ? null : (
              <Button
                variant={data.user.isFollowing ? "outlined" : "contained"}
                size="small"
                sx={{
                  gridArea: "followbtn",
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
              key={thread._id}
              user={data?.user as User}
              thread={thread as Thread}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: any) {
  const userId = context.params.profile[0];
  const session: any = await getSession(context as GetSessionParams);
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
Index.getLayout = UserLayout;
