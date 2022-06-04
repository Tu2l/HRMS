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
  FormControl,
  InputLabel,
  MenuItem,
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
import { useSearchParams } from "react-router-dom";
import Select from "@mui/material/Select";

/* Main Function */

function Attendance() {
  const [searchParams, setSearchParams] = useSearchParams();
  let param_attendanceType = searchParams.get("attendance_type") || "all";

  const [empData, setEmpData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getformattedDate());
  const [selectedAttendanceType, setSelectedAttendanceType] =
    useState(param_attendanceType);

  let date = selectedDate;
  const setDate = (d) => {
    date = d;
  };

  let attendance_type = "";
  const setAttendanceType = (v) => {
    if (v !== "all") attendance_type = v;
  };

  const attendanceFilterOptions = [
    { value: "all", label: "All" },
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "late", label: "Late" },
  ];

  /* Get Attendance Data */

  async function getCurrentDayAttendance(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/attendance/get/withdetails"
      : "/api/attendance/get/withdetails";

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
    setSelectedDate(e.target.value);
    setDate(e.target.value);
    init();
  };

  const handleAttendanceTypeChange = (e) => {
    setSelectedAttendanceType(e.target.value);
    setAttendanceType(e.target.value);
    init();
  };

  /* Show/ Handle search results*/

  async function handleSearchQueryChange(e) {
    if (e.target.value) init(e.target.value);
    else init();
  }

  const [numberOfItems, setNumberOfItems] = useState();

  async function init(query) {
    const data = {
      current_page: pages.next,
      date: date,
      attendance_type: attendance_type,
    };

    // console.log('AttendanceType:'+attendance_type)
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
        if (res.data !== null) {
          setEmpData(res.data);
          setNumberOfItems(res.total_items);
        }

        // console.log(res)
        if (param_attendanceType) {
          searchParams.delete("attendance_type");
          setSearchParams(searchParams);
          param_attendanceType = false;
          setSelectedAttendanceType("all");
          // console.log('deleted')
        }
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

  useEffect(() => {
    setAttendanceType(selectedAttendanceType);
    console.log(selectedAttendanceType);
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function handleGetDownloadMonth(e) {
    e.preventDefault();
    swal("Download File?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/attendance/month"
            : "/api/export/attendance/month";

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
          <FormControl
            size="small"
            className="select-status"
            sx={{ width: "35%" }}
          >
            <InputLabel>Attendance Status</InputLabel>
            <Select
              size="small"
              label="Attendance Status"
              defaultValue={param_attendanceType || "all"}
              onChange={(e) => {
                handleAttendanceTypeChange(e);
              }}
            >
              {attendanceFilterOptions.map((item, index) => {
                return (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <LightTooltip title="Select Date" placement="right">
            <TextField
              size="small"
              type="date"
              sx={{ marginLeft: "4%" }}
              inputProps={{
                max: getformattedDate(),
              }}
              variant="outlined"
              value={selectedDate}
              onChange={(e) => {
                handleDateChange(e);
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
            <StyButtonDownload
              variant="contained"
              sx={{ marginLeft: "0.5%" }}
              onClick={handleGetDownload}
            >
              Download By Day
            </StyButtonDownload>
            <StyButtonDownload
              variant="contained"
              sx={{ marginLeft: "0.5%" }}
              onClick={handleGetDownloadMonth}
            >
              Download By Month
            </StyButtonDownload>
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
                        <TableCell
                          align="left"
                          onClick={() => {
                            window.location =
                              "./employees?emp_id=" +
                              emp.emp_id.replaceAll("/", "_");
                          }}
                          sx={{
                            color: "blue",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {emp.emp_id}
                        </TableCell>
                        <TableCell
                          align="left"
                          onClick={() => {
                            window.location =
                              "./employees?emp_id=" +
                              emp.emp_id.replaceAll("/", "_");
                          }}
                          sx={{
                            color: "blue",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {emp.name}
                        </TableCell>
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
              <span className="total" style={{ float: "right" }}>
                Total Entries: {numberOfItems}
              </span>
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
