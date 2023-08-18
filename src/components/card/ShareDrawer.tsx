import React from "react";

import { Drawer, Box } from "@mui/material";
import MyButton from "@/components/utils/MyButton";
import { useStore } from "@/utils";
import { createThread } from "@/utils/QueryClient";
import { useMutation, useQueryClient } from "react-query";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { User } from "@/Type";
type Props = {
  open: boolean;
  user: User;
  onClose: () => void;
  onClickClose?: () => void;
};

export default function ShareDrawer({
  open,
  onClose,
  user,
  onClickClose,
}: Props) {
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
    onClickClose?.();
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
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
            onClickClose?.();
            // setOpenShare(false);
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
    </Drawer>
  );
}
