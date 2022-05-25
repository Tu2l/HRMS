import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import activities from "../../images/activities.png";
import employee from "../../images/employee.png";
import leave from "../../images/exit.png";
import onsite from "../../images/available.png";
import ontime from "../../images/on-time.jpg";
import absent from "../../images/absent.png";
import working from "../../images/working.png";
import "../css/profile.css";

const ItemPara = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  "&:hover": {
    boxShadow: "3px 3px rgba(0,0,0,.1)",
  },
  color: "rgb(12, 0, 57)",
  borderRadius: "20px",
  boxShadow: "none",
}));

function Dashboard() {
  /* Get Dashboard data */

  const [dashboardData, setDashboardData] = useState({});

  async function getDashboardData() {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/dashboard/admin"
      : "/api/dashboard/admin";
    const response = await fetch(URL, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    });

    return response;
  }

  async function init() {
    getDashboardData()
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          setDashboardData(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);

  return (
    <div className="dash-main">
      <Box
        style={{ backgroundColor: "rgb(243, 243, 243)" }}
        component="main"
        sx={{ flexGrow: 1 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Active Employees</h3>
                  <p className="profile-num">
                    {dashboardData ? dashboardData.active_emp : "NA"}
                  </p>
                  <img src={activities} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Inactive Employees</h3>
                  <p className="profile-num">
                    {dashboardData ? dashboardData.inactive_emp : "NA"}
                  </p>
                  <img src={employee} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Present</h3>
                  <p className="profile-num">
                    {dashboardData ? dashboardData.present_emp : "NA"}
                  </p>
                  <img src={onsite} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Absent</h3>
                  <p className="profile-num">
                    {dashboardData ? dashboardData.absent_emp : "NA"}
                  </p>
                  <img src={absent} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Late</h3>
                  <p className="profile-num" style={{ marginRight: "4%" }}>
                    {dashboardData ? dashboardData.late_emp : "NA"}
                  </p>
                  <img src={ontime} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Leave Requests</h3>
                  <p className="profile-num" style={{ marginRight: "10%" }}>
                    {dashboardData
                      ? dashboardData.pending_leave_requests
                      : "NA"}
                  </p>
                  <img src={leave} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Pending Projects</h3>
                  <p className="profile-num" style={{ marginRight: "4%" }}>
                    {dashboardData ? dashboardData.pending_projects : "NA"}
                  </p>
                  <img src={working} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
          </Grid>
          <br />
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;
