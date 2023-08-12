import React, {
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useTransition,
  useRef,
} from "react";
import Header from "../header/Header";
import NavigationBar from "../nav/NavigationBar";
import StickyWrapper from "../utils/StickyWrapper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CreatePost from "../Post/CreatePost";

export default function UserLayout(Page: ReactNode, pageProps: any) {
  const router = useRouter();
  const [width, setWidth] = useState(900);
  const [isPending, transistion] = useTransition();
  const ref = useRef<any>();
  const [open, setOpen] = useState(false);
  const home =
    router.pathname.includes("/home") ||
    router.pathname.includes("/activity") ||
    (router.pathname.includes("/search") && width <= 870) ||
    (router.pathname.includes("/profile") && width <= 870);

  const handleWindowResize = useCallback((event: any) => {
    transistion(() => {
      setWidth(window.screen.width);
    });
  }, []);

  useEffect(() => {
    setWidth(window.screen.width);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleWindowResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleWindowResize);
      }
    };
  }, [handleWindowResize]);

  return (
    <>
      <Header />

      <Fab
        size="small"
        color="primary"
        aria-label="add"
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          display: {
            xs: "flex",
            sm: "flex",
            md: "none",
          },
          position: "fixed",
          right: 8,
          bottom: 62,
        }}
      >
        <AddIcon />
      </Fab>

      <SwipeableDrawer
        container={ref.current as any}
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            height: "95dvh",
          }}
        >
          <CreatePost
            user={{ id: "asdf", name: "sdaf", email: "asedfgd", image: "" }}
          />
        </Box>
      </SwipeableDrawer>

      <Container>
        <Box
          ref={ref}
          sx={{
            display: "grid",
            gridTemplateColumns: { sm: "1fr", md: home ? "1fr 4fr" : "1fr" },
            gap: "8px",
            paddingTop: "24px",
            minHeight: "calc(100dvh - 55px)",
          }}
        >
          <Box
            sx={{
              position: {
                xs: "fixed",
                sm: "fixed",
                md: "relative",
              },
              zIndex: 100,
            }}
          >
            <StickyWrapper
              sx={{
                display: home ? "" : "none",
                height: "300px",
              }}
            >
              <Paper>
                <NavigationBar pageProps={pageProps} />
              </Paper>
            </StickyWrapper>
          </Box>
          <div>{Page}</div>
        </Box>
      </Container>
    </>
  );
}
