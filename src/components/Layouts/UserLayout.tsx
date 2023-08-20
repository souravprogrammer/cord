import React, {
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useTransition,
  useRef,
  PropsWithChildren,
} from "react";
import Header from "../header/Header";
import NavigationBar from "../nav/NavigationBar";
import StickyWrapper from "../utils/StickyWrapper";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useStore } from "@/utils";

const AddIcon = dynamic(() => import("@mui/icons-material/Add"));
const Fab = dynamic(() => import("@mui/material/Fab"));
const SwipeableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"));
const CreatePost = dynamic(() => import("@/components/Post/CreatePost"));

// Page: ReactNode, pageProps: any

type Props = {
  showNav?: boolean;
} & PropsWithChildren;
export default function UserLayout({ children, showNav = true }: Props) {
  const router = useRouter();
  const [width, setWidth] = useState(900);
  const [isPending, transistion] = useTransition();
  const ref = useRef<any>();
  const open = useStore((state) => state.openThreadModal);
  const setOpen = useStore((state) => state.setOpenThreadModal);
  const setThread = useStore((state) => state.setThread);
  // const home =
  //   router.pathname.includes("/home") ||
  //   router.pathname.includes("/activity") ||
  //   (router.pathname.includes("/search") && width <= 870) ||
  //   (router.pathname.includes("/profile") && width <= 870);

  const handleWindowResize = useCallback((event: any) => {
    transistion(() => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    setWidth(window.innerWidth);
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
          setThread(null);
        }}
        onOpen={() => {
          // setOpen(true);
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
            // border: "1px solid red",
            backgroundColor: "background.paper",
          }}
        >
          <CreatePost />
        </Box>
      </SwipeableDrawer>

      <Container>
        <Box
          ref={ref}
          sx={{
            display: "grid",
            gridTemplateColumns: { sm: "1fr", md: showNav ? "1fr 4fr" : "1fr" },
            gap: "8px",
            paddingTop: "24px",
            minHeight: "calc(100dvh - 55px)",
            paddingBottom: "60px",
          }}
        >
          <Box
            sx={{
              position: {
                xs: "fixed",
                sm: "fixed",
                md: showNav ? "relative" : "none",
              },
              zIndex: 100,
            }}
          >
            {
              <StickyWrapper
                sx={{
                  height: "300px",
                }}
              >
                <Paper>
                  <NavigationBar showNav={showNav} />
                </Paper>
              </StickyWrapper>
            }
          </Box>
          <div>{children}</div>
        </Box>
      </Container>
    </>
  );
}
