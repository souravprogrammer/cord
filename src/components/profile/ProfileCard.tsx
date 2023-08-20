import React, { useRef } from "react";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "react-query";
import { followUser, unfollowUser } from "@/utils/QueryClient";
import { useRouter } from "next/router";
import dynimic from "next/dynamic";

import Paper from "@mui/material/Paper";
import { User } from "@/Type";

import MySwipeableDrawer from "@/components/utils/MySwipeableDrawer";
const EditProfileDrawer = dynimic(
  () => import("@/components/card/EditProfileDrawer"),
  {
    ssr: false,
  }
);

type Props = {
  data?: { user: any };
  myProfile: boolean;
  user: User;
};

export default function ProfileCard({ data, myProfile, user }: Props) {
  const drawerRef = useRef<any>();
  const queryclient = useQueryClient();
  const router = useRouter();

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
    if (data?.user?.isFollowing) {
      unFollow({
        action: {
          follow: user?.id,
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

  return (
    <Paper
      ref={drawerRef}
      sx={{
        display: {
          xs: "block",
          md: "block",
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
          gridTemplateAreas: {
            xs: `
      'name name name avatar'
      'follow follow follow avatar'
      'bio bio bio bio'
      'button1 button1 button2 button2'
      `,
            md: `
       'avatar name name name'
      ' avatar follow follow follow'
      'avatar bio bio bio'
      'button1 button1 button2 button2'
      `,
          },
        }}
      >
        {/* name Box */}
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
        {/* {"follow box"} */}
        <Box
          sx={{
            gridArea: "follow",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", sm: "block", md: "block" },
              fontSize: "13px",
            }}
            fontWeight={"bold"}
          >
            {data?.user?.thread?.length}
            <span style={{ fontWeight: "bold" }}>{" Cord"}</span>
          </Typography>
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
        {/* {"bio Box"} */}
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
        {/* Avatar Box */}
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

        {/* {"Button 1"} */}
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
            variant={data?.user.isFollowing ? "outlined" : "contained"}
            size="small"
            sx={{
              gridArea: "button1",
              // height: "26px",
              alignSelf: "center",
            }}
            onClick={onFollowhandler}
          >
            {data?.user.isFollowing ? "following" : "follow"}
          </Button>
        )}
        {/* {"Button 2"} */}

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
    </Paper>
  );
}
