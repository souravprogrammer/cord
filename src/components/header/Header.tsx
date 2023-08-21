import {
  Container,
  InputBase,
  SwipeableDrawer,
  Grid,
  ButtonBase,
  Typography,
} from "@mui/material";
import React, { useState, useRef } from "react";
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
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useCookies } from "react-cookie";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#000" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    //logo background color
    backgroundColor: theme.palette.mode === "dark" ? "#000" : "grey",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "grey",
    borderRadius: 20 / 2,
  },
}));
type Props = {
  sear?: string;
};

function Header({ sear }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const setTheme = useStore((state) => state.setThemeMode);
  const themeMode = useStore((state) => state.themeMode);
  const [, setCookies] = useCookies(["theme"]);

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
          <Link
            href="/home"
            style={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <Image
              src={themeMode === "light" ? "/icon.png" : "/icon_dark.png"}
              alt="logo"
              width={32}
              height={32}
            />
          </Link>
          <Paper
            elevation={1}
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
          <Box
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
          </Box>
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
            // md: "none",
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
            disableRipple
            color="error"
            onClick={() => {
              setTheme(themeMode === "light" ? "dark" : "light");
              setCookies("theme", themeMode === "light" ? "dark" : "light");
            }}
            sx={(theme: any) => ({
              height: "40px",
              display: "flex",
              justifyContent: "space-between",
              px: "16px",

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
                <span style={{ fontWeight: "bold" }}> {themeMode}</span>
              </Typography>
            </Grid>
            <MaterialUISwitch checked={themeMode === "dark"} />
          </ButtonBase>
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

export default React.memo(Header);
export async function getServerSideProps(context: any) {
  const userName = context.params.user[0];
  return {
    props: {
      sear: userName,
    },
  };
}
