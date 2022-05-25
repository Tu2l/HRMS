import React from "react";
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  CardHeader,
} from "@mui/material";
import { LightTooltip } from "../css/styles";
import ListItemButton from "@mui/material/ListItemButton";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import MasksIcon from "@mui/icons-material/Masks";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HouseboatIcon from "@mui/icons-material/Houseboat";
import WorkIcon from "@mui/icons-material/Work";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import "../css/profile.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function DrawerItems({ isAdmin, open }) {
  const [link, setLink] = React.useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    const path = window.location.pathname.split("/");
    setLink(path[path.length - 1]);
  }, [location]);

  return (
    <List className="list-main">
      <div className="list-d">
        <div hidden={!isAdmin}>
          <Divider />
          <CardHeader
            sx={{
              minWidth: 0,
              width: "100%",
              mr: open ? 3 : "auto",
              justifyContent: "center",
              marginTop: "-10px",
              marginBottom: "-1px",
              padding: "13px",
              backgroundColor: "rgb(14, 169, 186)",
              color: "rgb(251, 251, 251)",
            }}
            avatar={<PersonPinIcon />}
            title={open ? "Employee Panel" : ""}
          />
          <Divider />
        </div>
        <Link to="employeedashboard">
          <LightTooltip title="Dashboard" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "employeedashboard"
                    ? "rgb(234, 165, 27)"
                    : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <DashboardCustomizeIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Dashboard
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="empattendance">
          <LightTooltip title="Attendance" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "empattendance"
                    ? "rgb(234, 165, 27)"
                    : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ReceiptLongIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Attendance
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="leavesemp">
          <LightTooltip title="Leaves" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "leavesemp" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <VaccinesIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Leaves
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="emppayroll">
          <LightTooltip title="Payroll" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "emppayroll" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Payroll
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="holidays">
          <LightTooltip title="Holidays" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "holidays" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <HouseboatIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Holidays
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>

        <div hidden={!isAdmin}>
          <Divider />
          <CardHeader
            sx={{
              minWidth: 0,
              width: "100%",
              mr: open ? 3 : "auto",
              justifyContent: "center",
              padding: "13px",
              marginTop: "-1px",
              marginBottom: "-1px",
              backgroundColor: "rgb(14, 169, 186)",
              color: "rgb(251, 251, 251)",
            }}
            avatar={<AdminPanelSettingsIcon />}
            title={open ? "Admin Panel" : ""}
          />
          <Divider />
        </div>
        <Link to="dashboard" hidden={!isAdmin}>
          <LightTooltip title="Dashboard" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "dashboard" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <DashboardCustomizeIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Dashboard
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="employees" hidden={!isAdmin}>
          <LightTooltip title="Employees" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "employees" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {" "}
                <PersonPinIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Employees
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>

        <Link to="hrattendance" hidden={!isAdmin}>
          <LightTooltip title="Attendance" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "hrattendance" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <HowToRegIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Attendance
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="leaves" hidden={!isAdmin}>
          <LightTooltip title="Leaves" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "leaves" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {" "}
                <MasksIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Leaves
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="departments" hidden={!isAdmin}>
          <LightTooltip title="Departments" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "departments" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <HomeWorkIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Departments
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="designation" hidden={!isAdmin}>
          <LightTooltip title="Designation" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "designation" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <WorkIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Designation
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="projects" hidden={!isAdmin}>
          <LightTooltip title="Projects" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "projects" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {" "}
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Projects
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
        <Link to="payroll" hidden={!isAdmin}>
          <LightTooltip title="Payroll" placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor:
                  link === "payroll" ? "rgb(234, 165, 27)" : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "rgb(250, 250, 250)",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                  color: "rgb(250, 250, 250)",
                }}
              >
                Payroll
              </ListItemText>
            </ListItemButton>
          </LightTooltip>
        </Link>
      </div>
    </List>
  );
}

export default DrawerItems;
