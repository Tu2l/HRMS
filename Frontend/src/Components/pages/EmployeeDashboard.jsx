import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import leave from "../../images/exit.png";
import wallet from "../../images/wallet.png";
import attendance from "../../images/attendance.png";
import activities from "../../images/activities.png";
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

function EmployeeDashboard() {
  const data_ = JSON.parse(localStorage.getItem("data"));

  /* Get Employee Dashboard data */

  const [empDashboardData, setEmpDashboardData] = useState({});

  async function getEmpDashboardData(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/dashboard/emp"
      : "/api/dashboard/emp";
    const response = await fetch(URL, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  }

  async function init() {
    const data = {
      emp_id: data_.emp_id,
    };

    getEmpDashboardData(data)
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          console.log(data.data);
          setEmpDashboardData(data.data);
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
            <Grid item xs={12} sm={12} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Attendance Marked</h3>
                  <p className="profile-num">
                    {empDashboardData
                      ? empDashboardData.attendance_marked === true
                        ? "Yes"
                        : "No"
                      : "NA"}
                  </p>
                  <img src={attendance} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Payslip Generated</h3>
                  <p className="profile-num">
                    {empDashboardData
                      ? empDashboardData.payslip_generated === true
                        ? "Yes"
                        : "No"
                      : "NA"}
                  </p>
                  <img src={wallet} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Leaves Remaining</h3>
                  <p className="profile-num" style={{ marginRight: "10%" }}>
                    {empDashboardData ? empDashboardData.availableLeave : "NA"}
                  </p>
                  <img src={leave} className="img-profile" alt="" />
                </Typography>
              </ItemPara>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <ItemPara>
                <Typography>
                  <h3 className="profile-h3">Attendance Status</h3>
                  <p
                    className="profile-num"
                    style={{ paddingBottom: "20px", fontSize: "32px" }}
                  >
                    {empDashboardData
                      ? empDashboardData.attendance_remark
                      : "NA"}
                  </p>
                  <img src={activities} className="img-profilestatus" alt="" />
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

export default EmployeeDashboard;
