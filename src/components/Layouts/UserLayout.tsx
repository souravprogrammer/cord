import React, { PropsWithChildren, ReactNode } from "react";
import Header from "../header/Header";
import NavigationBar from "../nav/NavigationBar";
import StickyWrapper from "../utils/StickyWrapper";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

export default function UserLayout(Page: ReactNode, pageProps: any) {
  const router = useRouter();
  const home =
    router.pathname.includes("/home") || router.pathname.includes("/activity");
  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: home ? "1fr 4fr" : "1fr",
            gap: "8px",
            paddingTop: "24px",
            minHeight: "calc(100dvh - 55px)",
          }}
        >
          <StickyWrapper sx={{ display: home ? "" : "none", height: "300px" }}>
            <Paper>
              <NavigationBar pageProps={pageProps} />
            </Paper>
          </StickyWrapper>
          <div>{Page}</div>
        </div>
      </Container>
    </>
  );
}
