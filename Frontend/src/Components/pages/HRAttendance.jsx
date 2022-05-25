import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Modal,
  TextField,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  ItemPara,
  StyButton,
  StyTableCell,
  LightTooltip,
  YearlyBtn,
  DltBtn,
  styleOverlay,
} from "../css/styles";
import "../css/profile.css";
import Attendance from "../Attendance";

/* Main Function */

function HRAttendance() {
  const [open, setOpen] = React.useState(false);

  const [empData, setEmpData] = useState([]);

  /* Check in/out for employees */

  const [checkIn, setCheckIn] = useState([]);
  const [checkOut, setCheckOut] = useState([]);

  /* Get Attendance Data */

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

  const viewAttendance = (event) => {
    const emp_id = event ? event.target.value : attendancePages.emp_id;
    const data = {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      emp_id: emp_id,
      current_page: attendancePages.next,
    };

    /* Get Attendance */

    getAttendance(data)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setAttendancePage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
          emp_id: emp_id,
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
        setOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  /* Call to search API */

  async function searchEmployee(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/user/search"
      : "/api/user/search";
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

  /* Show/ Handle search results*/

  async function search(e) {
    const data = {
      current_page: pages.next,
      query: e.target.value,
    };

    if (data.query)
      searchEmployee(data)
        .then((response) => response.json())
        .then((data) => {
          setPage({
            current: data.current_page,
            total: data.total_page,
            next: data.current_page,
          });

          if (data.data != null) setEmpData(data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    else init();
  }

  const handleClose = () => {
    setOpen(false);
    init();
  };

  /* Date range for attendance */

  const [dateRange, setDateRange] = useState({
    start_date: getformattedDate(),
    end_date: getformattedDate(),
  });

  /* Pagination for root table & modal table */

  const [pages, setPage] = useState({
    current: 1,
    next: 1,
    total: 1,
  });

  const [attendancePages, setAttendancePage] = useState({
    current: 1,
    next: 1,
    total: 1,
    emp_id: null,
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

  function preAttendancePage() {
    if (attendancePages.current > 1) {
      attendancePages.next = attendancePages.current - 1;
      viewAttendance();
    }
  }

  function nextAttendancePage() {
    if (attendancePages.current < attendancePages.total) {
      attendancePages.next = attendancePages.current + 1;
      viewAttendance();
    }
  }

  /* Date formatting */

  function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date();
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
  }

  /* Get employee data */

  async function getEmployees(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/user/get/all"
      : "/api/user/get/all";
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

  /* Get check out date of employee attendance */

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

  async function init() {
    const dataAll = {
      emp_id: empData.emp_id,
      current_page: pages.next,
    };

    /* Get Employees */

    getEmployees(dataAll)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) setEmpData(data.data);
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
    <>
      <Attendance />
      <div className="emp-main">
        <div>
          <div className="search-att">
            <TextField
              id="outlined"
              size="small"
              variant="outlined"
              placeholder="Name..."
              label="Search Employee..."
              onChange={search}
            />
          </div>
        </div>
        <div>
          {/* View Attendance of Employees */}

          <Modal open={open} onClose={handleClose}>
            <Box sx={styleOverlay}>
              <center>
                <div style={{ marginBottom: "2%", marginTop: "4%" }}>
                  <LightTooltip title="Start Range" placement="top">
                    <TextField
                      sx={{
                        marginRight: "20px",
                      }}
                      size="small"
                      type="date"
                      variant="outlined"
                      value={dateRange.start_date}
                      inputProps={{
                        max: getformattedDate(),
                      }}
                      onChange={(e) =>
                        setDateRange({
                          start_date: e.target.value,
                          end_date: dateRange.end_date,
                        })
                      }
                      required
                    />
                  </LightTooltip>
                  <LightTooltip title="End Range" placement="top">
                    <TextField
                      sx={{
                        marginRight: "20px",
                      }}
                      size="small"
                      type="date"
                      inputProps={{
                        min: getformattedDate(dateRange.start_date),
                        max: getformattedDate(),
                      }}
                      variant="outlined"
                      onChange={(e) =>
                        setDateRange({
                          start_date: dateRange.start_date,
                          end_date: e.target.value,
                        })
                      }
                      value={dateRange.end_date}
                      required
                    />
                  </LightTooltip>
                  <YearlyBtn
                    variant="outlined"
                    onClick={viewAttendance}
                    value={attendancePages.emp_id}
                  >
                    Apply
                  </YearlyBtn>
                </div>
                <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
                  <Table
                    sx={{
                      minWidth: 650,
                      borderBottom: "solid rgb(19, 71, 129)",
                    }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "rgb(19, 71, 129)",
                        }}
                      >
                        <StyTableCell>Date</StyTableCell>
                        <StyTableCell>Check In</StyTableCell>
                        <StyTableCell>Check Out</StyTableCell>
                        <StyTableCell>Remarks</StyTableCell>
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
                          <TableCell align="center">
                            {att.date.split("T")[0]}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ color: "green", fontWeight: "bold" }}
                          >
                            {att.timestamp}
                          </TableCell>
                          <TableCell
                            align="center"
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
                <br />
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={3}>
                    <StyButton
                      variant="outlined"
                      sx={{ marginRight: "15px" }}
                      onClick={preAttendancePage}
                    >
                      Pre
                    </StyButton>
                    <StyButton variant="outlined" onClick={nextAttendancePage}>
                      Next
                    </StyButton>
                  </Grid>
                </Grid>{" "}
                <br />
                <DltBtn
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleClose}
                >
                  Close
                </DltBtn>
              </center>
            </Box>
          </Modal>
        </div>

        {/* View All Employees */}

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <ItemPara>
                <span className="tablehead">View Employees Attendance</span>
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
                        <StyTableCell>Emp ID</StyTableCell>
                        <StyTableCell>Name</StyTableCell>
                        <StyTableCell></StyTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {empData.map((emp, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center">{emp.emp_id}</TableCell>
                          <TableCell align="center">{emp.name}</TableCell>
                          <TableCell align="center">
                            <YearlyBtn
                              size="small"
                              variant="outlined"
                              onClick={viewAttendance}
                              value={emp.emp_id}
                            >
                              View Attendance
                            </YearlyBtn>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ItemPara>
            </Grid>
          </Grid>

          {/* Pagination Buttons*/}

          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
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
    </>
  );
}

export default HRAttendance;
