/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Modal,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  LeavePara,
  TableItem,
  LightTooltip,
  StyTextFieldLeave,
  style,
  StyButton,
  StyTableCell,
  YearlyBtn,
  DltBtn,
  ItemPara,
} from "../css/styles";
import "../css/profile.css";
import swal from "sweetalert";
import Select from "react-select";

function LeavesEMP() {
  const data_ = JSON.parse(localStorage.getItem("data"));

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attachment, setAttachmentUrl] = useState(null);

  const [allLeave, setAllLeave] = useState([]);

  const [leaveDetails, setLeaveDetails] = useState("");

  const [openLeaveDays, setOpenLeaveDays] = React.useState(false);
  const handleCloseLeaveDays = () => setOpenLeaveDays(false);

  const [openReason, setOpenReason] = React.useState(false);
  const handleCloseReason = () => setOpenReason(false);

  const [openRemarks, setOpenRemarks] = React.useState(false);
  const handleCloseRemarks = () => setOpenRemarks(false);

  /* Pagination */

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

  // API call to get leave history of single Employee

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

  async function init(status) {
    const dataAll = {
      emp_id: data_.emp_id,
      current_page: page.next,
      status: status,
    };

    const dataLeave = {
      emp_id: data_.emp_id,
    };

    getLeave(dataAll)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) {
          setAllLeave(data.data);
        }
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
  useEffect(() => init("0"), []);

  // Submit handler for leave apply form

  async function handleSubmit(e) {
    e.preventDefault();
    swal("Apply?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        leave.start_date = startDate;
        leave.end_date = endDate;
        leave.reason = reason;
        leave.emp_id = data_.emp_id;
        leave.attachment = attachment;

        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/leave/apply"
            : "/api/leave/apply";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(leave),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setReason("");
            setStartDate("");
            setEndDate("");
            swal(resjson.message.toUpperCase());
            setOpen(false);
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

  // Calculate number of days between selected date ranges

  function diffDate() {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    var diff = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24) + 1;
    return diff;
  }

  function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date();
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }

  const fileInputRef = useRef();

  const [leave, setLeave] = useState({});
  const [selectHolidayType, setSelectHolidayType] = useState();

  const holidayTypeOptions = [
    { value: 1, label: "Half Day" },
    { value: 3, label: "Single Day" },
    { value: 4, label: "Multiple Days" },
  ];

  const halfDayType = [
    { value: 1, label: "First Half" },
    { value: 2, label: "Second Half" },
  ];

  const handlehalfType = (status) => {
    leave.leave_type = status;
    setLeave(leave);
  };

  const [enableHalfdayOption, setEnable] = useState(false);

  const handleHolidayType = (status) => {
    setSelectHolidayType(status);
    setEnable(status === 1);

    if (!enableHalfdayOption) {
      leave.leave_type = status;
      setLeave(leave);
    }
  };

  const fileUpload = () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    formData.append("emp_id", data_.emp_id);
    formData.append("file", fileField.files[0]);

    fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          setAttachmentUrl(result.data.path);
          swal("Uploaded");
        } else {
          swal("Failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [status, setStatus] = useState(0);

  const [leaveDays, setLeaveDays] = useState({});
  const [reason_, setReason_] = useState("");
  const options = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Approved" },
    { value: "2", label: "Rejected" },
  ];

  const handleChange = (s) => {
    setStatus(s);
    init(s);
  };

  const [remarks, setRemarks] = useState("");

  const displayLeaveRequests = () => {
    return allLeave.map((lea, index) => {
      return (
        <TableRow
          key={index}
          sx={{
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          }}
        >
          <TableCell align="center">{lea.applied_on.split("T")[0]}</TableCell>
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
                setLeaveDays(lea.numberOfDays);
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
                  <div className="leave-reason">{reason_}</div>
                </Box>
              </Modal>
            </div>
            <YearlyBtn
              size="small"
              onClick={() => {
                setReason_(lea.reason);
                setOpenReason(true);
              }}
              variant="outlined"
            >
              View Reason
            </YearlyBtn>
          </TableCell>
          <TableCell align="center">{getStatusType(lea.status)}</TableCell>
          {status == "2" && (
            <TableCell align="center">
              {/* View Reason Modal */}

              <div>
                <Modal open={openRemarks} onClose={handleCloseRemarks}>
                  <Box sx={style}>
                    <div className="leave-reason">{remarks}</div>
                  </Box>
                </Modal>
              </div>
              <YearlyBtn
                size="small"
                onClick={() => {
                  setRemarks(lea.remarks);
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

  return (
    <div className="leaemp-main">
      {/* Button Modal Popup Form */}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={9}>
            <ItemPara>
              <YearlyBtn
                sx={{ marginLeft: "0.7%" }}
                onClick={handleOpen}
                variant="outlined"
              >
                Apply for Leave
              </YearlyBtn>
            </ItemPara>
          </Grid>
          <Grid item xs={12} md={3}>
            <ItemPara>
              {/* Select Project Type */}
              <Select
                className="select"
                options={options}
                placeholder="Pending"
                onChange={(event) => {
                  handleChange(event.value);
                }}
              />
            </ItemPara>
          </Grid>
        </Grid>
        <br />
      </Box>

      {/* Leave Form */}

      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleSubmit}>
                <Select
                  className="select-status"
                  options={holidayTypeOptions}
                  onChange={(event) => {
                    handleHolidayType(event.value);
                  }}
                ></Select>
                {enableHalfdayOption && (
                  <Select
                    className="select-status"
                    options={halfDayType}
                    placeholder="Select Half Day Type"
                    onChange={(event) => {
                      handlehalfType(event.value);
                    }}
                  />
                )}

                <LightTooltip title="Start Date" placement="right">
                  <StyTextFieldLeave
                    value={startDate}
                    inputProps={{
                      min: getformattedDate(),
                    }}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Leave from"
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    fullWidth
                  />
                </LightTooltip>
                {selectHolidayType === 4 && (
                  <LightTooltip title="End Date" placement="right">
                    <StyTextFieldLeave
                      value={endDate}
                      size="small"
                      type="date"
                      inputProps={{
                        min: getformattedDate(startDate),
                      }}
                      variant="outlined"
                      helperText="Leave To"
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      fullWidth
                    />
                  </LightTooltip>
                )}
                <StyTextFieldLeave
                  value={isNaN(diffDate()) ? 0 : diffDate()}
                  label="No. of days"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
                <StyTextFieldLeave
                  value={reason}
                  label="Reason"
                  size="small"
                  rows={4}
                  variant="outlined"
                  multiline
                  placeholder="Reason for Leave..."
                  onChange={(e) => setReason(e.target.value)}
                  required
                  fullWidth
                />
                <StyTextFieldLeave
                  className="custom-file-input"
                  size="small"
                  multiple={false}
                  ref={fileInputRef}
                  type="file"
                  helperText="Upload file before clicking apply"
                />
                <br />
                <YearlyBtn
                  type="button"
                  sx={{
                    marginRight: "7px",
                  }}
                  variant="outlined"
                  onClick={fileUpload}
                >
                  Upload
                </YearlyBtn>
                <div className="leave-btn">
                  <YearlyBtn
                    type="submit"
                    sx={{
                      marginRight: "7px",
                    }}
                    variant="outlined"
                  >
                    Apply
                  </YearlyBtn>
                  <DltBtn
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <LeavePara>
              <Typography>
                <h3 className="leave-h3">Available Leaves</h3>
                <p className="leave-num">{leaveDetails.availableLeave}</p>
              </Typography>
            </LeavePara>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LeavePara>
              <Typography>
                <h3 className="leave-h3">Total</h3>
                <p className="leave-num">{leaveDetails.yearly_leave}</p>
              </Typography>
            </LeavePara>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LeavePara>
              <Typography>
                <h3 className="leave-h3">Monthly</h3>
                <p className="leave-num">
                  {Math.round(
                    (leaveDetails.monthly_leave + Number.EPSILON) * 100
                  ) / 100}
                </p>
              </Typography>
            </LeavePara>
          </Grid>
        </Grid>
        <br />
      </Box>

      {/* Leave Tables - All Requests */}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TableItem>
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
                      <StyTableCell>Applied On</StyTableCell>
                      <StyTableCell>Leave Details</StyTableCell>
                      <StyTableCell>Reason</StyTableCell>
                      <StyTableCell>Status</StyTableCell>
                      {status == "2" && <StyTableCell>Remarks</StyTableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>{displayLeaveRequests()}</TableBody>
                </Table>
              </TableContainer>

              {/* Pending Requests Pagination Buttons */}

              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                sx={{ marginTop: "15px" }}
              >
                <Grid item xs={3}>
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
            </TableItem>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

const getStatusType = (status) => {
  const style = {
    backgroundColor: "orange",
    padding: "8px",
    margin: "auto",
    marginBottom: "8px",
    borderRadius: "3px",
    color: "white",
    fontWeight: "bold",
    maxWidth: "55%",
    textAlign: "center",
  };

  switch (status) {
    case 0:
      return <div style={style}>Pending</div>;
    case 1:
      style.backgroundColor = "green";
      return <div style={style}>Approved</div>;
    case 2:
      style.backgroundColor = "red";
      return <div style={style}>Rejected</div>;
    default:
      return "-";
  }
};

export default LeavesEMP;
