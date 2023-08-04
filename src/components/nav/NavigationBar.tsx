import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useStore } from "@/utils";

import { useRouter } from "next/dist/client/router";

export default function NavigationBar({ pageProps }: { pageProps: any }) {
  return (
    <div
      style={{
        flex: 1,
      }}
    >
      <SideList />
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
const SideList = () => {
  const { activePage, changePage } = useStore((state) => state);
  const router = useRouter();

  return (
    <Box role="presentation">
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
  );
};
