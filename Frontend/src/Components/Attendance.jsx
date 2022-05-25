import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
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
  StyEmpTableCell,
  LightTooltip,
  StyButtonDownload,
} from "./css/styles";
import "./css/profile.css";
import swal from "sweetalert";

/* Main Function */

function Attendance() {
  const [empData, setEmpData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getformattedDate());

  var date = getformattedDate();
  const setDate = (d) => {
    date = d;
  };

  /* Get Attendance Data */

  async function getCurrentDayAttendance(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/attendance/get/withdetails"
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

  /* Pagination for root table  */

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

  // Date formatting
  function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date();
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day;
  }

  /* Get check out date of employee attendance */

  function getAttendanceTimeStamp(att, type) {
    for (let i = 0; i < att.length; i++) {
      const a = att[i];
      // eslint-disable-next-line eqeqeq
      if (a.attendanceType == type) return a.timestamp;
    }

    return "-";
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
    init();
  };

  /* Show/ Handle search results*/

  async function handleSearchQueryChange(e) {
    if (e.target.value) init(e.target.value);
    else init();
  }

  async function init(query) {
    const data = {
      current_page: pages.next,
      date: date,
    };

    if (query) data.query = query;

    /* Get Employees */

    await getCurrentDayAttendance(data)
      .then((response) => response.json())
      .then((res) => {
        setPage({
          current: res.current_page,
          total: res.total_page,
          next: res.current_page,
        });
        setEmpData(res.data);
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

  async function handleGetDownload(e) {
    e.preventDefault();
    swal("Download File?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/attendance"
            : "/api/export/attendance";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: selectedDate,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            window.open("http://" + resjson.data, "_blank");
            swal("Downloaded");
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
    <div className="emp-main">
      <Grid container sx={{ marginBottom: "10px", marginLeft: "10px" }}>
        <Grid item xs={12} sm={6} md={9}>
          <LightTooltip title="Select Date" placement="right">
            <TextField
              sx={{
                float: "left",
              }}
              size="small"
              type="date"
              inputProps={{
                max: getformattedDate(),
              }}
              variant="outlined"
              value={selectedDate}
              onChange={(e) => {
                handleDateChange(e);
                setSelectedDate(e.target.value);
              }}
              required
            />
          </LightTooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className="search-att" style={{ marginRight: "5.5%" }}>
            <TextField
              id="outlined"
              size="small"
              variant="outlined"
              placeholder="Name..."
              label="Search Employee..."
              onChange={handleSearchQueryChange}
            />
          </div>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={12}>
            <ItemPara>
              <span className="tablehead">
                Today's Attendance ({selectedDate})
              </span>
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
                      <StyEmpTableCell>Emp ID</StyEmpTableCell>
                      <StyEmpTableCell>Name</StyEmpTableCell>
                      <StyEmpTableCell>Check In</StyEmpTableCell>
                      <StyEmpTableCell>Check Out</StyEmpTableCell>
                      <StyTableCell>Remark</StyTableCell>
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
                        <TableCell align="left">{emp.emp_id}</TableCell>
                        <TableCell align="left">{emp.name}</TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                          {getAttendanceTimeStamp(emp.attendance, 1)}
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: "bold" }}>
                          {getAttendanceTimeStamp(emp.attendance, 2)}
                        </TableCell>
                        <TableCell align="left">
                          {emp.remark
                            ? getRemark(emp.remark)
                            : getRemark("Absent")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <StyButtonDownload
                sx={{ float: "left" }}
                variant="contained"
                onClick={handleGetDownload}
              >
                Download Excel
              </StyButtonDownload>
            </ItemPara>
          </Grid>
        </Grid>

        {/* Pagination Buttons*/}

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

export default Attendance;
