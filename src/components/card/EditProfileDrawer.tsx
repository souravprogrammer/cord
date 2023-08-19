import React, { useRef } from "react";

import { Box, TextField, Avatar, Typography, Button } from "@mui/material";
import { updateProfile } from "@/utils/QueryClient";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/dist/client/router";

type Props = {
  initialProps: {
    name: string;
    email: string;
    image: string;
    bio: string;
    _id: string;
  };
  setOpen?: (open: boolean) => void;
};

type FormState = {
  image: string;
  _id: string;
  email: string;
  bio: string;
  name: string;
};
function EditProfileDrawer({ initialProps, setOpen }: Props) {
  const formState = useRef<FormState>(initialProps);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      setOpen?.(false);
      queryClient.invalidateQueries(["profile", router.query.profile?.[0]]);
    },
    onSettled: async () => {},
  });
  const FormSubmitHandler = async (e: any) => {
    e.preventDefault();
    const submit = { ...formState.current };
    for (let k in submit) {
      if (!submit[k as keyof FormState]) {
        delete submit[k as keyof FormState];
      }
    }
    await mutate({
      update: {
        ...submit,
      },
    });
  };
  return (
    <Box
      component={"form"}
      sx={{
        height: "95dvh",
        padding: "8px 12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Avatar sx={{ height: "64px", width: "64px" }} src={initialProps.image}>
          <Typography>
            {initialProps.name
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase())
              .join("")}
          </Typography>
        </Avatar>
      </Box>
      <Box
        sx={{
          gap: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          label="name"
          variant="standard"
          onChange={(e) =>
            (formState.current = {
              ...formState.current,
              name: e.target.value,
            })
          }
          defaultValue={initialProps.name}
          sx={{
            width: "100%",
          }}
        />
        <TextField
          disabled
          sx={{
            width: "100%",
          }}
          label="email"
          variant="standard"
          defaultValue={initialProps.email}

          // value={state.email}
        />
        <TextField
          sx={{
            width: "100%",
          }}
          label="bio"
          defaultValue={initialProps.bio}
          onChange={(e) =>
            (formState.current = {
              ...formState.current,
              bio: e.target.value,
            })
          }
          variant="standard"
          // value={state.bio}
        />
        <Button
          disabled={isLoading}
          type="submit"
          variant="contained"
          sx={{ width: "100%" }}
          onClick={FormSubmitHandler}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(EditProfileDrawer);
