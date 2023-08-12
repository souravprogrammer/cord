import { Container, InputBase } from "@mui/material";
import React, { useEffect, useState, useTransition, useCallback } from "react";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter } from "next/dist/client/router";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShortTextIcon from "@mui/icons-material/ShortText";
type Props = {
  sear?: string;
};

export default function Header({ sear }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

  const showSearch: boolean = router.pathname.includes("/search");
  // const [width, setWidth] = useState(900);

  // const [isPending, transistion] = useTransition();

  // const showSearch: Boolean =
  //   router.pathname.includes("/search") && width <= 870;

  // const handleWindowResize = useCallback((event: any) => {
  //   transistion(() => {
  //     setWidth(window.screen.width);
  //   });
  // }, []);
  // useEffect(() => {
  //   setWidth(window.screen.width);
  // }, []);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.addEventListener("resize", handleWindowResize);
  //   }

  //   return () => {
  //     if (typeof window !== "undefined") {
  //       window.removeEventListener("resize", handleWindowResize);
  //     }
  //   };
  // }, [handleWindowResize]);

  const handleSearch = () => {
    if (!search) {
      router.push({
        pathname: "/",
      });
    } else {
      router.push(
        {
          pathname: `/search/${search}`,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  function _handleKeyDown(e: any) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }
  return (
    <Paper
      sx={{
        position: "sticky",
        top: 0,
        height: "55px",
        zIndex: 2,
      }}
    >
      <Container
        component={"nav"}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "42px 1fr",
            columnGap: "12px",
            placeItems: "center",
          }}
        >
          <Link href="/home">
            <FlutterDashIcon color="primary" fontSize="large" />
          </Link>
          <Paper
            elevation={0}
            sx={{
              // border: "1px solid red",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "55px",
              padding: "8px",
              display: {
                xs: showSearch ? "flex" : "none",
                sm: showSearch ? "flex" : "none",
                md: "none",
                lg: "none",
                xl: "none",
              },
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                flex: 1,

                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "10px",
                alignItems: "center",
                padding: "4px 12px",
              }}
            >
              <InputBase
                sx={{ flex: 1 }}
                value={search}
                placeholder="search user"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={_handleKeyDown}
              />
              <IconButton sx={{ p: 0 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              display: { sm: "none", xs: "none", md: "flex" },

              width: "100%",
              height: "55px",
              padding: "8px",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flex: 1,

                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "10px",
                alignItems: "center",
                padding: "4px 12px",
              }}
            >
              <InputBase
                sx={{ flex: 1 }}
                value={search}
                placeholder="search user"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={_handleKeyDown}
              />
              <IconButton sx={{ p: 0 }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
        <IconButton
          sx={{
            display: showSearch ? "none" : "flex",
          }}
        >
          <ShortTextIcon />
        </IconButton>
      </Container>
    </Paper>
  );
}
export async function getServerSideProps(context: any) {
  const userName = context.params.user[0];
  return {
    props: {
      sear: userName,
    },
  };
}
