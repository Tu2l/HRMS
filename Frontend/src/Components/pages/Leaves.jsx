/* eslint-disable eqeqeq */
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
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  style,
  style2,
  ButtonPara,
  TableItem2,
  StyButton,
  StyTableCell,
  LightTooltip,
  StyTextFieldLeave,
  YearlyBtn,
  DltBtn,
  ItemPara,
} from "../css/styles";
import "../css/profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Select from "react-select";
toast.configure();

/* Main Function */

function Leaves() {
  const data_ = JSON.parse(localStorage.getItem("data"));

  const [openHistory, setOpenHistory] = React.useState(false);
  const [openYearlyForm, setOpenYearlyForm] = React.useState(false);
  const [openReason, setOpenReason] = React.useState(false);
  const [openRemarks, setOpenRemarks] = React.useState(false);
  const [openLeaveDays, setOpenLeaveDays] = React.useState(false);
  const [openGiveRemarks, setOpenGiveRemarks] = React.useState(false);

  const handleCloseHistory = () => {
    setOpenHistory(false);
    init();
  };

  const handleOpenYearlyForm = () => setOpenYearlyForm(true);
  const handleCloseYearlyForm = () => setOpenYearlyForm(false);

  const handleOpenGiveRemarks = () => setOpenGiveRemarks(true);
  const handleCloseGiveRemarks = () => setOpenGiveRemarks(false);

  const handleCloseReason = () => setOpenReason(false);
  const handleCloseRemarks = () => setOpenRemarks(false);
  const handleCloseLeaveDays = () => setOpenLeaveDays(false);

  /* Pagination for leave history popup modal */

  const [leavePages, setLeavePage] = useState({
    current: 1,
    next: 1,
    total: 1,
    emp_id: null,
  });

  function preLeavePage() {
    if (leavePages.current > 1) {
      leavePages.next = leavePages.current - 1;
      viewLeaves();
    }
  }

  function nextLeavePage() {
    if (leavePages.current < leavePages.total) {
      leavePages.next = leavePages.current + 1;
      viewLeaves();
    }
  }

  /* Pagination for all 3 tables (pending, approved, rejected) */

  const [page, setPage] = useState({
    current: 1,
    next: 1,
    total: 1,
  });

  function prePage() {
    if (page.current > 1) {
      page.next = page.current - 1;
      init();
    }
  }

  function nextPage() {
    if (page.current < page.total) {
      page.next = page.current + 1;
      init();
    }
  }

  /* API call to get all leave requests data */

  async function getLeaveRequests(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/leave/get/requests"
      : "/api/leave/get/requests";
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

  const [leaveDetails, setLeaveDetails] = useState("");

  async function getLeaveDetails(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/leave/get/details"
      : "/api/leave/get/details";
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

  /* Get Leave Data (single) */

  async function getLeave(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/leave/get"
      : "/api/leave/get";

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

  const [leaveHistoryModal, setLeaveHistoryModal] = useState([]);

  /* View Leave History  */

  const viewLeaves = (event) => {
    const emp_id = event ? event.target.value : leavePages.emp_id;

    const data = {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      emp_id: emp_id,
      current_page: leavePages.next,
    };

    /* Get Leave */

    getLeave(data)
      .then((response) => response.json())
      .then((data) => {
        setLeavePage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
          emp_id: emp_id,
        });
        if (data.data != null) setLeaveHistoryModal(data.data);
        setOpenHistory(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  /* Date range for leave */

  const [dateRange, setDateRange] = useState({
    start_date: getformattedDate(),
    end_date: getformattedDate(),
  });

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

  function getName(emp_id) {
    return empName.get(emp_id) || "-";
  }

  async function getEmployee(emp_id) {
    const data = {
      emp_id: emp_id,
    };
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/user/get"
      : "/api/user/get/";
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

    return response.json();
  }

  /* Different leave requests usestates */

  const [allLeave, setAllLeave] = useState([]);
  const [empName, setEmpName] = useState(new Map());

  async function init(status) {
    const dataAll = {
      current_page: page.next,
      status: status,
    };

    const dataLeave = {
      emp_id: data_.emp_id,
    };

    /* Get Leave Requests */

    getLeaveRequests(dataAll)
      .then((response) => response.json())
      .then(async (data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) {
          setAllLeave(data.data);
        }

        const map = new Map();
        for (let i = 0; i < data.data.length; i++) {
          if (!empName.has(data.data[i].emp_id)) {
            const emp = await getEmployee(data.data[i].emp_id);
            map.set(data.data[i].emp_id, emp.data.name);
          }
        }

        setEmpName(new Map([...empName].concat([...map])));

        // console.log(empName);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getLeaveDetails(dataLeave)
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          setLeaveDetails(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function allowUpdate(event) {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const _id = event.target.value;

        const data = {
          id: _id,
          status: 1,
        };

        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/leave/update/status"
          : "/api/leave/update/status";

        await fetch(URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            toast.info(data.message.toUpperCase(), {
              position: toast.POSITION.TOP_CENTER,
            });
            init("0");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }

  const [requestID, setRequestID] = useState();
  const [remarks, setRemarks] = useState("");

  async function rejectUpdate(e) {
    e.preventDefault();
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/leave/update/status"
          : "/api/leave/update/status";

        await fetch(URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: requestID,
            remarks: remarks,
            status: 2,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            handleCloseGiveRemarks();
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        init("0");
        toast.error("Leave Request Rejected", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  }

  const [remarksView, setRemarksView] = useState("");

  // Submit/ Update yearly leaves

  const [yearlyLeave, setYearlyLeave] = useState("");

  async function handleSubmitYearlyLeave(e) {
    e.preventDefault();
    swal("Submit?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/leave/hr/update"
            : "/api/leave/hr/update";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emp_id: data_.emp_id,
              yearly: yearlyLeave,
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setYearlyLeave("");
            swal(resjson.message.toUpperCase());
            setOpenYearlyForm(false);
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
        init("0");
      }
    });
  }
  
  const [reason, setReason] = useState("");

  const getFileUrl = (path) => {
    return "http://" + path;
  };

  const [status, setStatus] = useState(0);
  const handleChange = (s) => {
    setStatus(s);
    init(s);
    // console.log(s)
  };

  const options = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Approved" },
    { value: "2", label: "Rejected" },
  ];

  const [leaveDays, setLeaveDays] = useState({});

  const displayLeaveRequests = () => {
    return allLeave.map((emp, index) => {
      return (
        <TableRow
          key={index}
          sx={{
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          }}
        >
          <TableCell align="center">{getName(emp.emp_id)}</TableCell>
          <TableCell align="center">{emp.applied_on.split("T")[0]}</TableCell>
          <TableCell align="center">{emp.start_date.split("T")[0]}</TableCell>
          <TableCell align="center">{emp.end_date.split("T")[0]}</TableCell>
          <TableCell align="center">
            {/* View Leave Days Modal */}

            <div>
              <Modal open={openLeaveDays} onClose={handleCloseLeaveDays}>
                <Box sx={style}>
                  <div className="leave-reason">
                    <List>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Leave Days
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.leave_days}
                          </div>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Paid Leaves
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.paid_leaves}
                          </div>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Unpaid Leaves
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.unpaid_leaves}
                          </div>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Holidays
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.holidays}
                          </div>
                        </ListItemText>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Weekends
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.weekends}
                          </div>
                        </ListItemText>
                      </ListItem>
                      <Divider>
                        <Chip label="Final" />
                      </Divider>
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            Final Leave Days
                          </div>
                          <div id="details" className="leave-list">
                            {leaveDays.final_leave_days}
                          </div>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </div>
                </Box>
              </Modal>
            </div>
            <YearlyBtn
              size="small"
              onClick={() => {
                setLeaveDays(emp.numberOfDays);
                setOpenLeaveDays(true);
              }}
              variant="outlined"
            >
              Leave Details
            </YearlyBtn>
          </TableCell>
          <TableCell align="center">
            {/* View Reason Modal */}

            <div>
              <Modal open={openReason} onClose={handleCloseReason}>
                <Box sx={style}>
                  <div className="leave-reason">{reason}</div>
                </Box>
              </Modal>
            </div>
            <YearlyBtn
              size="small"
              onClick={() => {
                setReason(emp.reason);
                setOpenReason(true);
              }}
              variant="outlined"
            >
              View Reason
            </YearlyBtn>
          </TableCell>
          <TableCell align="center">
            <YearlyBtn
              disabled={emp.attachments == null ? true : false}
              href={getFileUrl(emp.attachments)}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
            >
              View
            </YearlyBtn>
          </TableCell>

          {/* Change Leave Status Buttons*/}

          {status == "0" && (
            <TableCell align="center">
              <YearlyBtn
                sx={{ marginRight: "10px" }}
                size="small"
                variant="outlined"
                onClick={allowUpdate}
                value={emp._id}
              >
                Allow
              </YearlyBtn>
              <DltBtn
                color="error"
                size="small"
                variant="outlined"
                onClick={() => {
                  handleOpenGiveRemarks();
                  setRequestID(emp._id);
                }}
              >
                Decline
              </DltBtn>
            </TableCell>
          )}
          {status == "2" && (
            <TableCell align="center">
              {/* View Reason Modal */}

              <div>
                <Modal open={openRemarks} onClose={handleCloseRemarks}>
                  <Box sx={style}>
                    <div className="leave-reason">{remarksView}</div>
                  </Box>
                </Modal>
              </div>
              <YearlyBtn
                size="small"
                onClick={() => {
                  setRemarksView(emp.remarks);
                  setOpenRemarks(true);
                }}
                variant="outlined"
              >
                View Remarks
              </YearlyBtn>
            </TableCell>
          )}
        </TableRow>
      );
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init("0"), []);

  return (
    <div className="lea-main">
      {/* Yearly Holidays Form Modal */}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={4}>
            <ButtonPara>
              <YearlyBtn onClick={handleOpenYearlyForm} variant="outlined">
                Yearly Leaves
              </YearlyBtn>
            </ButtonPara>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <ButtonPara>
              <div className="presently">
                <TextField
                  sx={{ marginTop: "-1%" }}
                  size="small"
                  id="read-only-input"
                  value={
                    leaveDetails.yearly_leave +
                    " / Year -- " +
                    Math.round(
                      (leaveDetails.monthly_leave + Number.EPSILON) * 100
                    ) /
                      100 +
                    " / Month"
                  }
                />
              </div>
            </ButtonPara>
          </Grid>
          <Grid item xs={12} md={4}>
            <ItemPara>
              {/* Select Holiday Type */}

              <div>
                <Select
                  className="select"
                  options={options}
                  placeholder="Pending"
                  onChange={(event) => {
                    handleChange(event.value);
                  }}
                />
              </div>
            </ItemPara>
          </Grid>
        </Grid>
        <br />
      </Box>

      <div>
        <Modal open={openGiveRemarks} onClose={handleCloseGiveRemarks}>
          <Box sx={style}>
            <center>
              <form onSubmit={rejectUpdate}>
                <StyTextFieldLeave
                  value={remarks}
                  label="Remarks for Rejection"
                  size="small"
                  rows={3}
                  variant="outlined"
                  multiline
                  placeholder="Remarks..."
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  fullWidth
                />
                <div className="leave-btn">
                  <YearlyBtn
                    type="submit"
                    sx={{
                      marginRight: "7px",
                    }}
                    variant="outlined"
                  >
                    Reject
                  </YearlyBtn>
                  <DltBtn
                    variant="outlined"
                    color="error"
                    onClick={handleCloseGiveRemarks}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Yearly form */}

      <div>
        <Modal open={openYearlyForm} onClose={handleCloseYearlyForm}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleSubmitYearlyLeave}>
                <StyTextFieldLeave
                  value={yearlyLeave}
                  label="Yearly Leaves"
                  size="small"
                  variant="outlined"
                  multiline
                  placeholder="Enter new value"
                  onChange={(e) => setYearlyLeave(e.target.value)}
                  required
                  fullWidth
                />
                <div className="leave-btn">
                  <YearlyBtn
                    type="submit"
                    sx={{
                      marginRight: "7px",
                    }}
                    variant="outlined"
                  >
                    Update
                  </YearlyBtn>
                  <DltBtn
                    variant="outlined"
                    color="error"
                    onClick={handleCloseYearlyForm}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>
      {/* View More Details of Leaves of Employees */}

      <div>
        <Modal open={openHistory} onClose={handleCloseHistory}>
          <Box sx={style2}>
            <center>
              <div style={{ marginBottom: "2%" }}>
                <LightTooltip title="Start Range" placement="top">
                  <TextField
                    sx={{
                      marginRight: "20px",
                    }}
                    size="small"
                    type="date"
                    variant="outlined"
                    value={dateRange.start_date}
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
                  onClick={viewLeaves}
                  value={leavePages.emp_id}
                >
                  Apply
                </YearlyBtn>
              </div>
              <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
                <Table
                  sx={{
                    minWidth: 300,
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
                      <StyTableCell>Applied On</StyTableCell>
                      <StyTableCell>No. of days</StyTableCell>
                      <StyTableCell>Start Date</StyTableCell>
                      <StyTableCell>End Date</StyTableCell>
                      <StyTableCell>Reason</StyTableCell>
                      <StyTableCell>Status</StyTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Leave History Mapping*/}

                    {leaveHistoryModal.map((lea, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align="center">
                          {lea.applied_on.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">
                          {lea.numberOfDays.final_leave_days}
                        </TableCell>
                        <TableCell align="center">
                          {lea.start_date.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">
                          {lea.end_date.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">{lea.reason}</TableCell>
                        <TableCell align="center">
                          {lea.status === 0
                            ? "Pending"
                            : lea.status === 1
                            ? "Approved"
                            : "Rejected"}
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
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: "15px" }}
                    onClick={preLeavePage}
                  >
                    Pre
                  </StyButton>
                  <StyButton
                    size="small"
                    variant="outlined"
                    onClick={nextLeavePage}
                  >
                    Next
                  </StyButton>
                </Grid>
              </Grid>{" "}
              <br />
              <DltBtn
                size="small"
                variant="outlined"
                color="error"
                onClick={handleCloseHistory}
              >
                Close
              </DltBtn>
            </center>
          </Box>
        </Modal>
      </div>

      {/* View All Employees */}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TableItem2>
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
                      <StyTableCell>Name</StyTableCell>
                      <StyTableCell>Applied On</StyTableCell>
                      <StyTableCell>Start Date</StyTableCell>
                      <StyTableCell>End Date</StyTableCell>
                      <StyTableCell>Leave Details</StyTableCell>
                      <StyTableCell>Reason</StyTableCell>
                      <StyTableCell>Attachment</StyTableCell>
                      {status == "2" && <StyTableCell>Remarks</StyTableCell>}
                      {status == "0" && <StyTableCell>Actions</StyTableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Pending Requests Table*/}

                    {displayLeaveRequests()}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Leave Request Pagination Buttons - Pending Page*/}

              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid
                  item
                  xs={3}
                  sx={{ marginTop: "1.5%", marginBottom: "1.5%" }}
                >
                  <StyButton
                    size="small"
                    variant="outlined"
                    sx={{ marginRight: "15px" }}
                    onClick={prePage}
                  >
                    Pre
                  </StyButton>
                  <StyButton size="small" variant="outlined" onClick={nextPage}>
                    Next
                  </StyButton>
                </Grid>
              </Grid>
            </TableItem2>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Leaves;
