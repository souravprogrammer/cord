import React, { useState, useRef, useEffect, useReducer } from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import {
  Button,
  IconButton,
  InputBase,
  Box,
  CircularProgress,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useMutation } from "react-query";
import { createThread } from "@/utils/QueryClient";
import { User } from "@/Type";
import CancelIcon from "@mui/icons-material/Cancel";
type Props = {
  user: User;
};

export default function CreatePost({ user }: Props) {
  const [text, setText] = useState<string>("");
  const [images, setImages] = useState<Array<File>>([]);
  const [disable, setDisable] = useState(true);
  const InputImagesRef = useRef<React.RefObject<HTMLInputElement> | any>();

  const { mutate, isLoading } = useMutation({
    mutationFn: createThread,
    onSuccess: async () => {
      setText("");
      setDisable(true);
      setImages([]);
      console.log("I'm first!");
    },
    onSettled: async () => {
      setText("");
      setDisable(true);
      setImages([]);
      console.log("I'm second!");
    },
  });

  useEffect(() => {
    console.log(">>> ", isLoading, disable);
  }, [isLoading]);

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
        userId: user.id,
        content: text,
        media: result ? [result.secure_url] : [],
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
        display: "grid",
        gridTemplateColumns: "48px 1fr 32px",
        gap: "12px",
        gridTemplateAreas: `
        'avatar name name'
        'left space space'
        'actions actions actions'
        `,
      }}
    >
      <Box sx={{ py: 2, gridArea: "avatar" }}>
        <Avatar
          sx={{ bgcolor: "orange" }}
          alt="profile picture"
          src={user.image}
        >
          NM
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
      <div
        style={{
          gridArea: "space",
          display: "flex",
          justifyContent: "space-between",
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
          startIcon={
            <>
              {isLoading ? (
                <CircularProgress
                  sx={{
                    maxWidth: "24px",
                    maxHeight: "24px",
                  }}
                />
              ) : null}
            </>
          }
        >
          Post
        </Button>
      </div>
    </Paper>
  );
}
