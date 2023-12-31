import React, { useState, useRef, useEffect, useReducer } from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import {
  Button,
  IconButton,
  InputBase,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useMutation, useQueryClient } from "react-query";
import { createThread } from "@/utils/QueryClient";
import { User } from "@/Type";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSession } from "next-auth/react";
import { useStore } from "@/utils";
import Post from "@/components/Post/Post";

type Props = {
  user?: User;
};

export default function CreatePost({}: Props) {
  const [text, setText] = useState<string>("");
  const [images, setImages] = useState<Array<File>>([]);
  const [disable, setDisable] = useState(true);
  const InputImagesRef = useRef<React.RefObject<HTMLInputElement> | any>();
  const sharedThread = useStore((state) => state.thread);
  const setSharedThread = useStore((state) => state.setThread);
  const setOpenThreadModal = useStore((state) => state.setOpenThreadModal);
  const queryClient = useQueryClient();

  const session = useSession();
  const user: User = session.data?.user as User;

  const { mutate, isLoading } = useMutation({
    mutationFn: createThread,
    onSuccess: async () => {
      setText("");
      setDisable(true);
      setImages([]);
      setSharedThread(null);
      queryClient.invalidateQueries(["home"]);
      queryClient.invalidateQueries(["profile", user.id]);
    },
    onSettled: async () => {
      setText("");
      setDisable(true);
      setImages([]);
      setSharedThread(null);
      setOpenThreadModal(false);
    },
  });

  useEffect(() => {
    if (text === "" && images.length === 0) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [images, text]);

  const onSubmit = async () => {
    let result: any;

    if (images.length > 0) {
      const formData = new FormData();
      for (let img of images) {
        formData.append("file", img);
      }
      formData.append("upload_preset", "my-uploads");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/do8otauxu/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      result = await res.json();
    }

    mutate({
      thread: {
        userId: user?.id,
        content: text,
        media: result ? [result.secure_url] : [],
        threadId: sharedThread?._id,
      },
    });
  };

  const handleImageInput = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    // got the images here
    if (files) {
      setImages((img) => [files[0]]);
    }
  };
  return (
    <Paper
      sx={{
        padding: "16px",
        backgroundColor: "background.paper",

        display: "grid",
        gridTemplateColumns: "48px 1fr 32px",
        gap: "12px",
        gridTemplateAreas: `
        'avatar name name'
        'left space space'
        'actions actions actions'
        'thread thread thread'
        `,
      }}
    >
      <Box sx={{ py: 2, gridArea: "avatar" }}>
        <Avatar
          sx={{ bgcolor: "orange" }}
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
      </Box>
      <Box
        sx={{
          gridArea: "name",
          pt: 2,
          pb: 1,
        }}
      >
        <InputBase
          multiline
          placeholder="what is happening?!"
          value={text}
          sx={{ fontSize: "18px", width: "100%" }}
          onChange={(e) => setText(e.target.value)}
        />
        <Box
          sx={{
            display: "grid",
          }}
        >
          {images.map((img: File, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  position: "relative",
                }}
              >
                <img
                  key={index}
                  style={{
                    maxWidth: "100%",
                  }}
                  src={URL.createObjectURL(new Blob([img], { type: img.type }))}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                  }}
                  onClick={() => {
                    InputImagesRef.current.value = "";
                    setImages([]);
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Box>
      <Paper
        elevation={1}
        sx={{
          boxShadow: "none",
          gridArea: "space",
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "center" },
          px: { sm: "8px", xs: "8px", md: "0px" },
          position: { sm: "fixed", xs: "fixed", md: "inherit" },
          bottom: "0",
          left: 0,
          width: "100%",
        }}
      >
        <div>
          <IconButton
            sx={{ position: "relative" }}
            onClick={() => {
              InputImagesRef.current.click();
            }}
          >
            <ImageIcon sx={{ width: "24px" }} />
            <input
              onChange={handleImageInput}
              type="file"
              hidden
              ref={InputImagesRef}
              accept="image/png, image/jpeg"
            />
          </IconButton>
        </div>
        <Button
          disabled={disable || isLoading}
          variant="contained"
          size="small"
          sx={{ borderRadius: "10px", padding: "2px 24px", height: "34px" }}
          onClick={onSubmit}
        >
          {isLoading ? (
            <CircularProgress
              sx={{
                maxWidth: "24px",
                maxHeight: "24px",
              }}
            />
          ) : (
            "Post"
          )}
        </Button>
      </Paper>
      {sharedThread ? (
        <Box sx={{ gridArea: "thread" }}>
          <Post user={user} reposted={true} thread={sharedThread} />
        </Box>
      ) : null}
    </Paper>
  );
}
