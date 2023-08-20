import React from "react";

import { Drawer, Box } from "@mui/material";
import MyButton from "@/components/utils/MyButton";
import { useStore } from "@/utils";
import { createThread } from "@/utils/QueryClient";
import { useMutation, useQueryClient } from "react-query";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MySwipeableDrawer from "../utils/MySwipeableDrawer";
import { User } from "@/Type";
type Props = {
  user: User;
  setOpen?: (open: boolean) => void;
};

export default function ShareDrawer({ user, setOpen }: Props) {
  const thread = useStore((state) => state.thread);
  const setThread = useStore((state) => state.setThread);
  const setOpenThreadModal = useStore((state) => state.setOpenThreadModal);
  const queryClient = useQueryClient();

  const { mutate: repostThread, isLoading: isRepoasting } = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      queryClient.invalidateQueries(["home"]);
    },
  });

  const handleRePostThread = async () => {
    if (thread)
      repostThread({
        thread: { userId: user.id, threadId: thread?._id },
      });
    setOpen?.(false);
  };

  return (
    // <Drawer anchor="bottom" open={open} onClose={onClose}>
    // </Drawer>
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
      <Box
        onClick={() => {
          setOpenThreadModal(true);
        }}
      >
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
    </Box>
  );
}
