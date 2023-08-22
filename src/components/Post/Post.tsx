import React, { useRef } from "react";

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
import html2canvas from "html2canvas";

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
  onReshare?: (thread: Thread) => void;
};

/**
 * 1) Ceate a threat to requot / and as a rethread
 * 2) allow repllies  to a thread
 * 3) optionall  allow a replies to a repleis and replies to re post as a therad
 */

export default function Post({ user, thread, reposted, ...props }: Props) {
  const ref = useRef<any>();
  return (
    <Paper
      component={"article"}
      ref={ref}
      elevation={reposted ? 0 : 1}
      sx={{
        borderRadius: "18px",
      }}
    >
      <Box
        sx={{
          padding: reposted ? "6px" : "16px",
          border: reposted ? "1px solid" : "",
          borderColor: "border.main",
          borderRadius: "6px",
          display: "grid",
          gridTemplateColumns: {
            sm: reposted ? "28px 1fr" : "28px 1fr 32px",
            xs: reposted ? "28px 1fr" : "38px 1fr 32px",
            md: "48px 1fr 32px",
          },

          gap: { xs: "4px", sm: "8px", md: "12px" },
          maxWidth: "100%",
          gridTemplateAreas: {
            xs: reposted
              ? `
            'avatar name'
            'content content'
            'actions actions'
            `
              : `
            'avatar name options'
            'space content content'
            'actions actions actions'
            `,
            md: `
        'avatar name options'
        'space content content'
        'actions actions actions'
        `,
          },
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
          <Typography
            sx={{
              fontSize: {
                sm: "12px",
                xs: "12px",
              },
            }}
          >
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
            href={"/profile/" + (user as any)?.id}
            style={{ textDecoration: "none" }}
          >
            <Typography
              fontWeight={"bold"}
              variant="body2"
              sx={{
                paddingRight: "4px",
                whiteSpace: "nowrap",
                color: "text.head",
              }}
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
        <Box sx={{ gridArea: "content", p: 1 }}>
          <Typography variant="body2">
            {thread?.content
              ?.split(/(#\w+)|(@\w+)/gm)
              ?.map((word: string, index: number) => {
                if (word?.match(/(#\w+)|(@\w+)/gm))
                  return (
                    <Box
                      key={index}
                      component={"a"}
                      sx={{
                        color: "#0A66C2",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {word}
                    </Box>
                  );
                return <React.Fragment key={index}>{word}</React.Fragment>;
              })}
          </Typography>
          <Box>
            {thread?.media?.map((img: string, index) => {
              return (
                <Box
                  component={"figure"}
                  key={index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    position: "relative",
                  }}
                >
                  <img
                    loading="lazy"
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
                user={{ ...thread.thread, id: thread.thread.userId } as any}
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
              if (props.onReshare)
                props.onReshare({ ...thread, thread: undefined });
            }}
            startIcon={<AutorenewIcon sx={{ height: "20px" }} />}
          ></Button>
          <Button
            color={"followingButton" as "primary"}
            onClick={async () => {
              try {
                // const canvas = await html2canvas(ref.current);
                // const data = canvas.toDataURL("image/jpg");
                // var decodedData = atob(data?.split(",")[1]); // Split at ',' to remove the "data:image/png;base64," part
                // // Convert the decoded data to a Uint8Array
                // let byteArray = new Uint8Array(decodedData.length);
                // for (let i = 0; i < decodedData.length; i++) {
                //   byteArray[i] = decodedData.charCodeAt(i);
                // }
                // // // Create a Blob from the Uint8Array
                // let blob = new Blob([byteArray], { type: "image/jpg" }); // Change 'image/png' to the appropriate MIME type
                // let file = new File([blob], `image.jpg`, { type: blob.type });

                navigator.share({
                  url: "/home/" + thread._id,
                  title: thread.content ?? "Cord Thread",
                  text: thread.content ?? thread.thread?.content,
                });
              } catch (err: any) {
                console.log(err.message);
              }
            }}
            startIcon={<ShareIcon sx={{ height: "20px" }} />}
          ></Button>
        </Box>
      </Box>
      <Box sx={{ transform: "scale(0.923)" }}>
        {thread.replies?.map((replly: any, index: any) => {
          return (
            <Replly
              key={index}
              user={replly as User}
              thread={replly as Thread}
            />
          );
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
        src={user?.image}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              sm: "12px",
              xs: "12px",
            },
          }}
        >
          {user?.name
            ?.split(" ")
            .map((word: string) => word.charAt(0).toUpperCase())
            .join("")}
        </Typography>
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
            component={"time"}
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
