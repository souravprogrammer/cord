import React from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Link from "next/dist/client/link";

import { Avatar, Divider } from "@mui/material";
import { Thread, User } from "@/Type";

type LikeAction = {
  action: {
    threadId: string;
  };
};
type Props = {
  user?: User;
  thread: Thread;
  reposted?: boolean;
  onLike?: (action: LikeAction, liked: boolean) => Promise<any>;
  onReshare?: (threadId: string) => void;
};

/**
 * 1) Ceate a threat to requot / and as a rethread
 * 2) allow repllies  to a thread
 * 3) optionall  allow a replies to a repleis and replies to re post as a therad
 */

export default function Post({ user, thread, reposted, ...props }: Props) {
  return (
    <Paper elevation={reposted ? 0 : 1}>
      <Box
        sx={{
          padding: reposted ? "0px" : "16px",
          display: "grid",
          gridTemplateColumns: {
            sm: "28px 1fr 32px",
            xs: "38px 1fr 32px",
            md: "48px 1fr 32px",
          },

          gap: "12px",
          maxWidth: "100%",
          gridTemplateAreas: `
        'avatar name options'
        'space content content'
        'actions actions actions'
        `,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "orange",
            gridArea: "avatar",
            width: {
              xs: "26px",
              sm: "30px",
              md: "40px",
            },
            height: {
              xs: "26px",
              sm: "30px",
              md: "40px",
            },
          }}
          alt="profile picture"
          src={user?.image}
        >
          <Typography>
            {user?.name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase())
              .join("")}
          </Typography>
        </Avatar>
        <IconButton
          sx={{ display: reposted ? "none" : "flex", gridArea: "options" }}
        >
          <MoreHorizIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: { md: "center", sm: "start", xs: "start" },
            flexDirection: {
              md: "row",
              sm: "column",
              xs: "column",
            },
            gridArea: "name",
          }}
        >
          <Link
            href={"/profile/" + user?.id}
            style={{ textDecoration: "none", color: "#000" }}
          >
            <Typography
              fontWeight={"bold"}
              variant="body2"
              sx={{ paddingRight: "4px", whiteSpace: "nowrap" }}
            >
              {user?.name}
            </Typography>
          </Link>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "grey",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                },
              }}
            >
              {user?.email}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "grey",
                px: "8px",
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "14px",
                },
              }}
            >
              {formatDate(parseInt(thread?.timeStamp))}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ gridArea: "content" }}>
          <Typography>{thread?.content}</Typography>
          <Box>
            {thread?.media?.map((img: string, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    position: "relative",
                    // border: "1px solid red",
                  }}
                >
                  <img
                    key={index}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "410px",
                      // border: "1px solid green",
                    }}
                    src={img}
                  />
                </Box>
              );
            })}
          </Box>
          {thread.thread ? (
            <Box
              sx={{
                transition: "scale(0.8)",
              }}
            >
              <Post
                user={thread.thread as any}
                thread={thread.thread}
                reposted={true}
              />
            </Box>
          ) : null}
        </Box>
        <Box
          sx={{
            gridArea: "actions",

            display: reposted ? "none" : "flex",
            gap: "8px",
          }}
        >
          <Button
            color={"followingButton" as "primary"}
            startIcon={
              thread.liked ? (
                <FavoriteIcon sx={{ height: "20px", color: "red" }} />
              ) : (
                <FavoriteBorderIcon sx={{ height: "20px" }} />
              )
            }
            onClick={() => {
              if (props.onLike)
                props.onLike(
                  {
                    action: { threadId: thread._id },
                  },
                  !!thread.liked
                );
            }}
          >
            {thread.likes}
          </Button>
          <Button
            color={"followingButton" as "primary"}
            onClick={() => {
              if (props.onReshare) props.onReshare(thread._id);
            }}
            startIcon={<AutorenewIcon sx={{ height: "20px" }} />}
          ></Button>
          <Button
            color={"followingButton" as "primary"}
            onClick={async () => {
              navigator.share({
                url: "profile/" + user?.id,
                title: "my best therad",
                text: "hey checkout this thread",
              });
            }}
            startIcon={<ShareIcon sx={{ height: "20px" }} />}
          ></Button>
        </Box>
      </Box>
      <Box sx={{ transform: "scale(0.933)" }}>
        {thread.replies?.map((replly: any, index: any) => {
          return <Replly user={replly as User} thread={replly as Thread} />;
        })}
      </Box>
    </Paper>
  );
}

function Replly({ user, thread, ...props }: Props) {
  return (
    <Box
      sx={{
        padding: "16px",
        display: "grid",
        gridTemplateColumns: "48px 1fr 32px",

        gap: "12px",
        maxWidth: "100%",
        gridTemplateAreas: `
    'avatar name options'
    'space content content'
    'actions actions actions'
    `,
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          gridArea: "space",
        }}
      >
        <Divider orientation="vertical" />
      </Box>
      <Avatar
        sx={{
          bgcolor: "orange",
          gridArea: "avatar",
          width: {
            xs: "30px",
            sm: "30px",
            md: "40px",
          },
          height: {
            xs: "30px",
            sm: "30px",
            md: "40px",
          },
        }}
        alt="profile picture"
        // src={user?.image}
      >
        MS
      </Avatar>
      <IconButton sx={{ gridArea: "options" }}>
        <MoreHorizIcon />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: { md: "center", sm: "start", xs: "start" },
          flexDirection: {
            md: "row",
            sm: "column",
            xs: "column",
          },
          gridArea: "name",
        }}
      >
        <Link
          href={"/profile/"}
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Typography
            fontWeight={"bold"}
            variant="body2"
            sx={{ paddingRight: "4px", whiteSpace: "nowrap" }}
          >
            {user?.name}
          </Typography>
        </Link>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "grey",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: {
                xs: "10px",
                sm: "12px",
                md: "14px",
              },
            }}
          >
            test@email.com
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "grey",
              px: "8px",
              fontSize: {
                xs: "10px",
                sm: "12px",
                md: "14px",
              },
            }}
          >
            {formatDate(parseInt(thread?.timeStamp))}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ gridArea: "content" }}>
        <Typography>{thread?.content}</Typography>
        <Box>
          {thread?.media?.map((img: string, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  position: "relative",
                  // border: "1px solid red",
                }}
              >
                <img
                  key={index}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "410px",
                    // border: "1px solid green",
                  }}
                  src={img}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          gridArea: "actions",

          display: "flex",
          gap: "8px",
        }}
      >
        <Button
          color={"followingButton" as "primary"}
          startIcon={
            thread?.liked ? (
              <FavoriteIcon sx={{ height: "20px", color: "red" }} />
            ) : (
              <FavoriteBorderIcon sx={{ height: "20px" }} />
            )
          }
          onClick={() => {
            // if (props.onLike)
            //   props?.onLike(
            //     {
            //       action: { threadId: thread._id },
            //     },
            //     !!thread.liked
            //   );
          }}
        >
          2{/* {thread.likes} */}
        </Button>
        <Button
          color={"followingButton" as "primary"}
          startIcon={<AutorenewIcon sx={{ height: "20px" }} />}
        ></Button>
        <Button
          color={"followingButton" as "primary"}
          onClick={async () => {
            navigator.share({
              url: "profile/" + user?.id,
              title: "my best therad",
              text: "hey checkout this thread",
            });
          }}
          startIcon={<ShareIcon sx={{ height: "20px" }} />}
        ></Button>
      </Box>
    </Box>
  );
}

function formatDate(milliseconds: number): string {
  const millisecondsInMinute = 60000;
  const millisecondsInHour = 3600000;
  const millisecondsInDay = 86400000;
  const targetDate = milliseconds;
  const currentDate = new Date().getTime();

  const hour = Math.round((currentDate - targetDate) / millisecondsInHour);
  const min = Math.round((currentDate - targetDate) / millisecondsInMinute);
  if (min <= 60) {
    return min + "m";
  } else if (hour < 24) {
    return hour + "h";
  } else {
    const day = new Date(milliseconds).getDate();
    const shortMonthName = new Date(milliseconds).toLocaleString("default", {
      month: "short",
    });
    return `${day} ${shortMonthName}`;
  }
}
