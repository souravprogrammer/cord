import { Container, InputBase } from "@mui/material";
import React, { useEffect, useState } from "react";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter } from "next/dist/client/router";
import Link from "@mui/material/Link";

type Props = {
  sear?: string;
};

export default function Header({ sear }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

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
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "42px 1fr",

            columnGap: "12px",
          }}
        >
          <Link href="/home">
            <FlutterDashIcon color="primary" fontSize="large" />
          </Link>

          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "10px",
              display: "flex",
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
        </Box>
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
