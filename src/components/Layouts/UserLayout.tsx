import React, {
  ReactNode,
  useCallback,
  useState,
  useEffect,
  useTransition,
} from "react";
import Header from "../header/Header";
import NavigationBar from "../nav/NavigationBar";
import StickyWrapper from "../utils/StickyWrapper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

export default function UserLayout(Page: ReactNode, pageProps: any) {
  const router = useRouter();
  const [width, setWidth] = useState(900);
  const [isPending, transistion] = useTransition();
  const home =
    router.pathname.includes("/home") ||
    router.pathname.includes("/activity") ||
    (router.pathname.includes("/profile") && width <= 870);

  useEffect(() => {}, [width]);
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
      <Container>
        <Box
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
