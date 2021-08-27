import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
} from "@material-ui/core";
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
} from "react-feather";
import NavItem from "./NavItem";

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [items, setItems] = useState([
    {
      href: "/app/addblog",
      icon: UserPlusIcon,
      title: "Add Blog",
    },
    {
      href: "/app/allblogs",
      icon: UsersIcon,
      title: "All Blogs",
    },
  ]);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    const adminAuthId = sessionStorage.getItem("adminAuthId");
    if (adminAuthId !== null) {
      const n = sessionStorage.getItem("adminName");
      const e = sessionStorage.getItem("adminEmail");
      setName(n);
    } else {
      const n = sessionStorage.getItem("userName");
      const e = sessionStorage.getItem("userEmail");
      setName(n);
    }
  }, []);

  useEffect(() => {
    const adminAuthId = sessionStorage.getItem("adminAuthId");
    if (adminAuthId !== null) {
      setItems([
        ...items,
        {
          href: "/app/authors",
          icon: UsersIcon,
          title: "Authors",
        },
        {
          href: "/app/categories",
          icon: UserPlusIcon,
          title: "Categories",
        },
      ]);
    }
  }, []);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Avatar
          component={RouterLink}
          // src={user?.avatar}
          sx={{
            cursor: "pointer",
            width: 64,
            height: 64,
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {/* {user.jobTitle} */}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default DashboardSidebar;
