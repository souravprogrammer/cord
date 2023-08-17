import React, { useEffect, useCallback } from "react";

import { PropsWithChildren } from "react";
import { Box } from "@mui/material";

type Props = {
  next?: (() => Promise<void>) | (() => void);
} & PropsWithChildren;

export default function InfiniteScroller({ children, next }: Props) {
  const handleRef = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      next?.();
    }
  }, [next]);

  useEffect(() => {
    window.addEventListener("scroll", handleRef);
    return () => {
      window.removeEventListener("scroll", handleRef);
    };
  }, [handleRef]);

  return <Box>{children}</Box>;
}
