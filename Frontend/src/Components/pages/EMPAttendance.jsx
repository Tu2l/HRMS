import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ItemPara, StyButton, StyTableCell,StyEmpTableCell, YearlyBtn } from "../css/styles";
import "../css/profile.css";

function EMPAttendance() {
  /* Data of currently logged user */
  const userData = JSON.parse(localStorage.getItem("data"));

  /* Dynamic Button Value */
  const [buttonValue, setButtonValue] = useState({
    name: "Register Attendance",
    val: true,
  });

  /*Check In, Check Out for attendance */

  const [checkIn, setCheckIn] = useState([]);
  const [checkOut, setCheckOut] = useState([]);

  /* Pagination */

  const [pages, setPage] = useState({
    current: 1,
    next: 1,
    total: 1,
  });

  function prePage() {
    if (pages.current > 1) {
      pages.next = pages.current - 1;
      init();
    }
  }

  function nextPage() {
    if (pages.current < pages.total) {
      pages.next = pages.current + 1;
      init();
    }
  }

  /* Attendance check out date */

  function getCheckOut(date) {
    let timestamp = "-";
    checkOut.forEach((att) => {
      const date1 = Date.parse(date);
      const date2 = Date.parse(att.date);
      if (date1 === date2 && att.attendanceType === 2) {
        timestamp = att.timestamp;
      }
    });

    return timestamp;
  }

  /* Register function for employees' attendance with API call */

  async function registerAttendance() {
    const data = {
      emp_id: userData.emp_id,
      attendanceType: buttonValue.attendanceType,
    };

    if (buttonValue.attendanceType > 0) {
      const URL = window.location.href.startsWith("http://localhost")
        ? "http://localhost:5000/api/attendance/register"
        : "/api/attendance/register";

      await fetch(URL, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) init();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  /* Get employee attendance data from API call */

  async function getAttendance(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/attendance/get/range"
      : "/api/attendance/get/range";

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

  /* Check daily attendance status and display employee attendance data */

  async function init() {
    const date = new Date();
    const start_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-01";
    const end_date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const data_attendanceCheck = {
      start_date: end_date,
      end_date: end_date,
      emp_id: userData.emp_id,
      current_page: 1,
    };

    getAttendance(data_attendanceCheck)
      .then((response) => response.json())
      .then((data) => {
        if (data.data.length === 0) {
          setButtonValue({ name: "Check in", val: false, attendanceType: 1 });
        } else if (data.data.length === 1) {
          setButtonValue({ name: "Check out", val: false, attendanceType: 2 });
        } else {
          setButtonValue({
            name: "Attendance registered",
            val: true,
            attendanceType: 0,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const data = {
      start_date: start_date,
      end_date: end_date,
      emp_id: userData.emp_id,
      current_page: pages.next,
    };

    getAttendance(data)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        const checkinArr = [];
        const checkoutArr = [];
        if (data.data != null)
          data.data.forEach((att) => {
            if (att.attendanceType === 1) checkinArr.push(att);
            else checkoutArr.push(att);
          });

        setCheckIn(checkinArr);
        setCheckOut(checkoutArr);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  
  const getRemark = (remark) => {
    const style = {
      backgroundColor: "rgb(33, 174, 20)",
      padding: "8px",
      margin: "auto",
      marginBottom: "8px",
      borderRadius: "3px",
      color: "white",
      fontWeight: "bold",
      maxWidth: "100%",
      textAlign: "center",
    };

    switch (remark) {
      case "On Time":
        return <div style={style}>On Time</div>;
      case "Late":
        style.backgroundColor = "rgb(219, 101, 28)";
        return <div style={style}>Late</div>;
      default:
        style.backgroundColor = "rgb(219, 44, 28)";
        return <div style={style}>Absent</div>;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);

  return (
    <div className="emp-main">
      <Box sx={{ flexGrow: 1 }}>
        {/* Table for showing employee details */}

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12}>
            <ItemPara>
              <YearlyBtn
                sx={{ padding: "8px 30px 8px 30px" }}
                variant="outlined"
                disabled={buttonValue.val}
                onClick={registerAttendance}
              >
                {buttonValue.name}
              </YearlyBtn>
            </ItemPara>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <ItemPara>
              <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
                <Table
                  sx={{
                    minWidth: 300,
                    borderBottom: "3px solid rgb(19, 71, 129)",
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "rgb(19, 71, 129)",
                      }}
                    >
                      <StyEmpTableCell>Date</StyEmpTableCell>
                      <StyEmpTableCell>Checked In</StyEmpTableCell>
                      <StyEmpTableCell>Checked Out</StyEmpTableCell>
                      <StyTableCell>Remark</StyTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkIn.map((att, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          sx={{ color: "rgb(19, 71, 129)", fontWeight: "bold" }}
                          align="left"
                          component="th"
                          scope="row"
                        >
                          {att.date.split("T")[0]}
                        </TableCell>
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          sx={{ color: "green", fontWeight: "bold" }}
                        >
                          {att.timestamp}
                        </TableCell>
                        <TableCell
                          align="left"
                          component="th"
                          scope="row"
                          sx={{ color: "red", fontWeight: "bold" }}
                        >
                          {getCheckOut(att.date)}
                        </TableCell>
                        <TableCell align="left">
                            {att.remark
                              ? getRemark(att.remark)
                              : getRemark("Absent")}
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ItemPara>
          </Grid>
        </Grid>

        {/* Buttons for pagination functions */}

        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={3}>
            <StyButton
              variant="outlined"
              sx={{ marginRight: "15px" }}
              onClick={prePage}
            >
              Pre
            </StyButton>
            <StyButton variant="outlined" onClick={nextPage}>
              Next
            </StyButton>
          </Grid>
        </Grid>
      </Box>
    </div>
  );


}

export default EMPAttendance;
