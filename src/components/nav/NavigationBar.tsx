import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useStore } from "@/utils";
import PersonIcon from "@mui/icons-material/Person";
import Paper from "@mui/material/Paper";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { User } from "@/Type";

function NavigationBar({ showNav = true }: { showNav?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <SideList nav={showNav} />
    </div>
  );
}

const SidebarList = [
  {
    title: "home",
    Icon: HomeSharpIcon,
    page: "home",
    path: "/home",
  },
  {
    title: "Activity",
    Icon: NotificationsIcon,
    page: "activity",
    path: "/activity",
  },
];
const SidebarListMobile = [
  {
    title: "home",
    Icon: HomeSharpIcon,
    page: "home",
    path: "/home",
  },
  {
    title: "Activity",
    Icon: NotificationsIcon,
    page: "activity",
    path: "/activity",
  },

  {
    title: "profile",
    Icon: PersonIcon,
    page: "profile",
    path: "/profile",
  },
  {
    title: "Search",
    Icon: SearchIcon,
    page: "*",
    path: "/search/",
  },
];
const SideList = ({ nav }: { nav: boolean }) => {
  const { activePage, changePage } = useStore((state) => state);
  const [value, setValue] = useState(0);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.includes("profile")) {
      changePage("profile");
    } else if (router.pathname.includes("home")) {
      changePage("home");
    } else if (router.pathname.includes("activity")) {
      changePage("activity");
    } else if (router.pathname.includes("/search")) {
      changePage("search");
    }
  }, [router.pathname, changePage]);

  useEffect(() => {
    if (activePage === "home") {
      setValue(0);
    } else if (activePage === "activity") {
      setValue(1);
    } else if (activePage === "profile") {
      setValue(2);
    } else if (activePage === "search") {
      setValue(3);
    }
  }, [activePage]);

  return (
    <>
      {nav ? (
        <Box
          component={"nav"}
          role="presentation"
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
          }}
        >
          <List>
            {SidebarList.map((item) => {
              return (
                <ListItem
                  key={item.title}
                  disablePadding
                  onClick={() => {
                    changePage(item.page as any);
                    router.push(item.path);
                  }}
                  sx={
                    activePage === item.page
                      ? {
                          backgroundColor: "rgba(0,0,0,0.1)",
                          color: "primary.main",
                          borderLeft: "4px solid",
                          borderColor: "primary.main",
                        }
                      : {}
                  }
                >
                  <ListItemButton sx={{}}>
                    <ListItemIcon>
                      <item.Icon />
                    </ListItemIcon>

                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : null}
      <Paper
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "none",
          },
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100dvw",
          zIndex: 100,
          backgroundColor: "#fff",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {SidebarListMobile.map((item, index) => {
            return (
              <BottomNavigationAction
                onClick={() => {
                  if (item.path.includes("profile")) {
                    router.push(
                      item.path + "/" + (session.data?.user as User).id
                    );
                  } else {
                    router.push(item.path);
                  }
                  changePage(item.page as any);
                }}
                key={index}
                label={item.title}
                icon={<item.Icon />}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default React.memo(NavigationBar);
