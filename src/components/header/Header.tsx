import {
  Container,
  InputBase,
  SwipeableDrawer,
  Grid,
  ButtonBase,
  Typography,
} from "@mui/material";
import React, {
  useEffect,
  useState,
  useTransition,
  useCallback,
  useRef,
} from "react";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter } from "next/dist/client/router";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShortTextIcon from "@mui/icons-material/ShortText";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import { signOut } from "next-auth/react";
import { useStore } from "@/utils";
type Props = {
  sear?: string;
};

export default function Header({ sear }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const showSearch: boolean = router.pathname.includes("/search");
  const ref = useRef<any>();

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
          onClick={() => setOpenModal(true)}
          sx={{
            display: showSearch ? "none" : "flex",
          }}
        >
          <ShortTextIcon />
        </IconButton>
      </Container>
      <SwipeableDrawer
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "none",
          },
        }}
        container={ref.current as any}
        open={openModal}
        anchor="bottom"
        onClose={() => {
          setOpenModal(false);
        }}
        onOpen={() => {
          setOpenModal(true);
        }}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            padding: "16px 8px",
          }}
        >
          <ButtonBase
            color="error"
            sx={(theme: any) => ({
              height: "40px",
              display: "flex",

              borderRadius: "4px",
              bgcolor: `${theme.palette.disable.light}20`,
              width: "100%",
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: `${theme.palette.disable.light}50`,
              },
            })}
          >
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <RoomPreferencesIcon sx={{ ml: "15px" }} />
            </Grid>
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Roboto,sans-serif",
                  pr: "30px",
                  textTransform: "capitalize",
                }}
              >
                Settings
              </Typography>
            </Grid>
          </ButtonBase>
          <ButtonBase
            color="error"
            onClick={async () => {
              signOut();
            }}
            sx={(theme) => ({
              height: "40px",
              display: "flex",

              borderRadius: "4px",
              bgcolor: `${theme.palette.error.main}50`,
              width: "100%",
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: `${theme.palette.error}80`,
              },
            })}
          >
            <>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <PowerSettingsNewOutlinedIcon
                  color="error"
                  sx={{ ml: "15px" }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Roboto,sans-serif",

                    pr: "30px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  logout
                </Typography>
              </Grid>
            </>
          </ButtonBase>
        </Box>
      </SwipeableDrawer>
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
