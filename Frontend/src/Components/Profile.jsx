import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Box, Drawer, Toolbar, IconButton, Menu, Modal } from "@mui/material";
import {
  Main,
  AppBar,
  DrawerHeader,
  MenuBtn,
  YearlyBtn,
  DltBtn,
  style,
  StyTextFieldLeave,
} from "./css/styles";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DrawerItems from "./pages/DrawerItems";
import swal from "sweetalert";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Payroll from "./pages/Payroll";
import Projects from "./pages/Projects";
import Leaves from "./pages/Leaves";
import Designation from "./pages/Designation";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EMPAttendance from "./pages/EMPAttendance";
import HRAttendance from "./pages/HRAttendance";
import LeavesEMP from "./pages/LeavesEMP";
import Holidays from "./pages/Holidays";
import Departments from "./pages/Departments";
import EmpPayroll from "./pages/EmpPayroll";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import avatar from "../images/proavatar.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./css/profile.css";
import "./css/ViewProfile.css";
import ViewProfile from "../Components/pages/ViewProfile";

const drawerWidth = 230;
const transitionDuration = 350;

export default function Profile() {
  const data = JSON.parse(localStorage.getItem("data"));
  const theme = useTheme();

  // const classes = useStyles();
  const greaterThan375 = useMediaQuery("(min-width:375px)");
  const [open, setOpen] = React.useState(greaterThan375);

  useEffect(() => {
    setOpen(greaterThan375);
  }, [greaterThan375]);

  const handleMenuClick = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    swal("Logout of HRMS?", {
      buttons: ["Oh no!", true],
    }).then((value) => {
      if (value === true) {
        localStorage.removeItem("data");
        window.location.href = "/";
      }
    });
  };

  function isAdmin() {
    return localStorage.getItem("admin") === "true" ? true : false;
  }

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //Change Password Handler

  async function handleChangePassword(e) {
    e.preventDefault();
    swal("Change Password?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/change/password"
            : "/api/rol/change/password";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emp_id: data.emp_id,
              password: oldPassword,
              newPassword: newPassword,
            }),
          });

          let resjson = await res.json();
          console.log(resjson);

          if (!resjson.error) {
            setOldPassword("");
            setNewPassword("");
            swal(resjson.message.toUpperCase());
            handleCloseChangePassword();
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  return (
    <div>
      <Modal open={openChangePassword} onClose={handleCloseChangePassword}>
        <Box sx={style}>
          <center>
            <form onSubmit={handleChangePassword}>
              <StyTextFieldLeave
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                label="Old Password"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                label="New Password"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <br />
              <YearlyBtn
                size="small"
                type="submit"
                sx={{
                  marginRight: "7px",
                }}
                variant="outlined"
              >
                Change
              </YearlyBtn>
              <DltBtn
                size="small"
                variant="outlined"
                color="error"
                onClick={handleCloseChangePassword}
              >
                Cancel
              </DltBtn>
            </form>
          </center>
        </Box>
      </Modal>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          open={open}
          sx={{ backgroundColor: "rgb(19, 71, 129);" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Typography
                    sx={{ color: "rgb(253, 253, 253)", marginRight: "8px" }}
                  >
                    {data.name}
                  </Typography>
                  <Avatar alt="Avatar" src={
                  data.profile_img
                    ? "http://" + data.profile_img
                    : avatar
                } />
                  <KeyboardArrowDownIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "60px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link to="viewprofile">
                    <MenuBtn
                      size="small"
                      variant="text"
                      sx={{ color: "rgb(19, 71, 129)" }}
                    >
                      View Profile
                    </MenuBtn>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <MenuBtn
                    size="small"
                    variant="text"
                    sx={{ color: "rgb(19, 71, 129)" }}
                    onClick={handleOpenChangePassword}
                  >
                    Change Password
                  </MenuBtn>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <MenuBtn
                    size="small"
                    variant="text"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuBtn>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          transitionDuration={{
            enter: transitionDuration,
            exit: transitionDuration,
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader
            sx={{
              minWidth: 0,
              backgroundColor: "rgb(251,251,251)",
              color: "rgb(19,71,129)",
            }}
          >
            <strong
              style={{
                width: "100%",
              }}
            >
              GRATIA HRMS
            </strong>
            <IconButton onClick={handleMenuClick}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon
                  sx={{
                    color: "rgb(19,71,129)",
                  }}
                />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <div>
            {/* //Drawer Items */}

            <DrawerItems open={open} isAdmin={isAdmin()} />
          </div>
        </Drawer>
        {/* Routes for drawer components */}
        <Main open={open}>
          <Routes>
            <Route path="employeedashboard" element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="projects" element={<Projects />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="leavesemp" element={<LeavesEMP />} />
            <Route path="empattendance" element={<EMPAttendance />} />
            <Route path="hrattendance" element={<HRAttendance />} />
            <Route path="designation" element={<Designation />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="departments" element={<Departments />} />
            <Route
              path="viewprofile"
              element={<ViewProfile emp_id={data.emp_id} />}
            />
            <Route path="emppayroll" element={<EmpPayroll />} />
          </Routes>
        </Main>
      </Box>
    </div>
  );
}
