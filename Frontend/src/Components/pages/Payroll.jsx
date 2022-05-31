import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  CardHeader,
  TextField,
} from "@mui/material";
import {
  style,
  ItemPara,
  StyButton,
  StyTableCell,
  StyTextField,
  StyTextFieldLeave,
  YearlyBtn,
  DltBtn,
  LightTooltip,
  styleOverlay,
  StyEmpTableCell,
  MenuBtn2,
} from "../css/styles";
import "../css/profile.css";
import swal from "sweetalert";
import avatar from "../../images/proavatar.png";
import Select from "react-select";

function Payroll() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [openSalaryDetails, setOpenSalaryDetails] = React.useState(false);
  const handleCloseSalaryDetails = () => setOpenSalaryDetails(false);
  const handleOpenSalaryDetails = () => setOpenSalaryDetails(true);

  const [openSalaryUpdate, setOpenSalaryUpdate] = React.useState(false);
  const handleCloseSalaryUpdate = () => setOpenSalaryUpdate(false);

  const [emp, setEMP] = useState([]);
  const [selectedEmp, setSelectedEMP] = useState({});

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

  /* Get employee data */

  async function getEMPPay(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/pay/hr/get/all"
      : "/api/pay/hr/get/all";
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
  const [numberOfItems, setNumberOfItems] = useState();

  async function init(status) {
    const data = {
      current_page: pages.next,
      status: status,
    };

    getEMPPay(data)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) {
          setNumberOfItems(data.total_items);
          setEMP(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  /* Form States */

  const [pay, setPay] = useState({});

  const [empId, setEmpId] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    pay.emp_id = empId;
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/pay/hr/add"
            : "/api/pay/hr/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pay),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            handleClose();
            swal("Success");
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
        init();
      }
    });
  }

  /* Update Pay Details */

  const [empIdUpdate, setEmpIdUpdate] = useState("");
  const [payUpdate, setPayUpdate] = useState({});

  async function handleUpdateSalary(e) {
    e.preventDefault();
    payUpdate.emp_id = empIdUpdate;
    swal("Update?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/pay/hr/update"
            : "/api/pay/hr/update";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payUpdate),
          });

          let resjson = await res.json();
          if (!resjson.error) {
            handleCloseSalaryUpdate();
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
        init();
      }
    });
  }

  //Generate Salary Single

  async function handleGenerateSalarySingle(emp_id) {
    swal("Generate?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/salary/add"
            : "/api/salary/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emp_id: emp_id,
              month: getMonth(),
              year: getYear(),
            }),
          });

          let resjson = await res.json();
          if (!resjson.error) {
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
        init();
      }
    });
  }

  //Generate Salary All

  async function handleGenerateSalaryAll(e) {
    e.preventDefault();
    swal("Generate?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/salary/add/all"
            : "/api/salary/add/all";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              month: getMonth(),
              year: getYear(),
            }),
          });

          let resjson = await res.json();
          if (!resjson.error) {
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
        init();
      }
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(""), []);

  const [monthSelect, setMonthSelect] = useState(
    `${getYearDefault()}-${getMonthDefault()}`
  );

  const options = [
    { value: "", label: "Employee Status" },
    { value: "0", label: "In Service" },
    { value: "1", label: "Resigned" },
    { value: "2", label: "Terminated" },
    { value: "3", label: "On Notice Period" },
    { value: "4", label: "Probation" },
  ];

  const handleChange = (status) => {
    init(status);
  };

  const fileInputRef = useRef();

  const employeePayUpload = () => {
    swal("Upload?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const formData = new FormData();
        const fileField = document.querySelector(
          'input[id="employeePayUpload"]'
        );

        formData.append("file", fileField.files[0]);

        const UPLOAD_URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/import/pay"
          : "/api/import/pay";

        fetch(UPLOAD_URL, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            if (!result.error) {
              swal("Uploaded");
              init();
            } else {
              swal(result.message);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        init();
      }
    });
  };

  /* Search employee data */

  async function search(e) {
    const data = {
      current_page: pages.next,
      query: e.target.value,
    };

    if (data.query)
      getEMPPay(data)
        .then((response) => response.json())
        .then((data) => {
          setPage({
            current: data.current_page,
            total: data.total_page,
            next: data.current_page,
          });
          console.log(data);
          if (data.data != null) setEMP(data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    else init();
  }

  async function handleGetDownloadPayMonth(e) {
    e.preventDefault();
    swal("Download File?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/pay"
            : "/api/export/pay";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: monthSelect,
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
    <div className="pay-main">
      <div>
        <Modal open={openSalaryDetails} onClose={handleCloseSalaryDetails}>
          <Box sx={style}>
            <div className="leave-reason">
              <List>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      Basic Pay
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && selectedEmp.basic_pay}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      HRA
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && selectedEmp.hra}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      EPF
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && selectedEmp.epf}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      ESIC
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && selectedEmp.esic}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      Conveyance
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && getAdditionAmount(0)}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      Special Allowance
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && getAdditionAmount(1)}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      Performance Allowance
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && getAdditionAmount(2)}
                    </div>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <div id="list" className="leave-list">
                      Bonus
                    </div>
                    <div id="details" className="leave-list">
                      {selectedEmp && getAdditionAmount(3)}
                    </div>
                  </ListItemText>
                </ListItem>
                <Divider>
                  <Chip label="Deductions" />
                </Divider>
                {selectedEmp &&
                  selectedEmp.deductions &&
                  selectedEmp.deductions.map((ded) => {
                    return (
                      <ListItem disablePadding>
                        <ListItemText>
                          <div id="list" className="leave-list">
                            {ded.name ? ded.name : "NA"}
                          </div>
                          <div id="details" className="leave-list">
                            {ded.amount ? ded.amount : 0}
                          </div>
                        </ListItemText>
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </Box>
        </Modal>
      </div>

      {/* Add Pay Details */}

      <Modal open={open} onClose={handleClose}>
        <Box sx={styleOverlay}>
          <center>
            <form onSubmit={handleSubmit} style={{ paddingTop: "10px" }}>
              <StyTextField
                label="Basic Pay"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.basic_pay = e.target.value;
                  setPay(newPay);
                }}
                required
              />
              <StyTextField
                label="HRA"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.hra = e.target.value;
                  setPay(newPay);
                }}
                required
              />
              <StyTextField
                label="PF"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.pf = e.target.value;
                  setPay(newPay);
                }}
                required
              />
              <StyTextField
                label="TDS"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.tds = e.target.value;
                  setPay(newPay);
                }}
                required
              />
              <StyTextField
                label="PT"
                size="small"
                variant="outlined"
                required
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.pt = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="EPF"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.epf = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="ESIC"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.esic = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="Conveyance"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.conveyance = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="Special Allowance"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.special_allowance = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="Performance Allowance"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.performance_allowance = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="Bonus"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.bonus = e.target.value;
                  setPay(newPay);
                }}
              />
              <StyTextField
                label="Salary Advance"
                size="small"
                variant="outlined"
                onChange={(e) => {
                  const newPay = { ...pay };
                  newPay.salary_advance = e.target.value;
                  setPay(newPay);
                }}
              />
              <br />
              <YearlyBtn
                size="small"
                type="submit"
                sx={{
                  marginRight: "5px",
                }}
                variant="outlined"
              >
                Submit
              </YearlyBtn>
              <DltBtn
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClose}
              >
                Cancel
              </DltBtn>
            </form>
          </center>
        </Box>
      </Modal>

      {/* Update Salary Details */}

      <div>
        <Modal open={openSalaryUpdate} onClose={handleCloseSalaryUpdate}>
          <Box sx={styleOverlay}>
            <center>
              <form
                onSubmit={handleUpdateSalary}
                style={{ paddingTop: "13px" }}
              >
                <StyTextField
                  label="Basic Pay"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && selectedEmp.basic_pay}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.basic_pay = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="HRA"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && selectedEmp.hra}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.hra = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="PT"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && getDeductionAmount(2)}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.pt = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="EPF"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && selectedEmp.epf}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.epf = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="ESIC"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && selectedEmp.esic}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.esic = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="PF"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && getDeductionAmount(0)}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.pf = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="TDS"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && getDeductionAmount(1)}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.tds = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="Conveyance"
                  size="small"
                  variant="outlined"
                  defaultValue={selectedEmp && getAdditionAmount(0)}
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.conveyance = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="Special Allowance"
                  defaultValue={selectedEmp && getAdditionAmount(1)}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.special_allowance = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="Performance Allowance"
                  defaultValue={selectedEmp && getAdditionAmount(2)}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.performance_allowance = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="Bonus"
                  defaultValue={selectedEmp && getAdditionAmount(3)}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.bonus = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <StyTextField
                  label="Salary Advance"
                  defaultValue={selectedEmp && getDeductionAmount(3)}
                  size="small"
                  variant="outlined"
                  onChange={(e) => {
                    const newPay = { ...payUpdate };
                    newPay.salary_advance = e.target.value;
                    setPayUpdate(newPay);
                  }}
                />
                <br />
                <YearlyBtn
                  size="small"
                  type="submit"
                  sx={{
                    marginRight: "5px",
                  }}
                  variant="outlined"
                >
                  Submit
                </YearlyBtn>
                <DltBtn
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleCloseSalaryUpdate}
                >
                  Cancel
                </DltBtn>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      <div>
        {/* Employee details table */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item xs={6} sm={6} md={6}>
              <LightTooltip title="Select Month" placement="right">
                <StyTextFieldLeave
                  sx={{ width: "30%", marginLeft: "1%" }}
                  defaultValue={monthSelect}
                  type="month"
                  inputProps={{
                    max: getYear() + "-" + getMonth(),
                  }}
                  onChange={(e) => setMonthSelect(e.target.value)}
                  size="small"
                  variant="outlined"
                />
              </LightTooltip>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <ItemPara>
                <div className="search">
                  <TextField
                    fullWidth
                    id="outlined"
                    size="small"
                    variant="outlined"
                    placeholder="Name..."
                    label="Search Employee..."
                    onChange={search}
                  />
                </div>
              </ItemPara>
            </Grid>
            <Grid item xs={6} sm={6} md={6} sx={{ marginBottom: "-1%" }}>
              <ItemPara>
                <YearlyBtn
                  sx={{ marginLeft: "6px", marginTop: "1.5px" }}
                  type="button"
                  variant="outlined"
                  onClick={employeePayUpload}
                >
                  Upload
                </YearlyBtn>
                <StyTextFieldLeave
                  size="small"
                  multiple={false}
                  inputProps={{
                    accept:
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  ref={fileInputRef}
                  id="employeePayUpload"
                  type="file"
                  sx={{ width: "45%", float: "left" }}
                  helperText="Upload Salary Document (.xslx)"
                />
              </ItemPara>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              {/* Select Status Type */}
              <ItemPara>
                <Select
                  className="select-empstatus"
                  options={options}
                  placeholder="Employee Status"
                  onChange={(event) => {
                    handleChange(event.value);
                  }}
                />
              </ItemPara>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <ItemPara>
                <MenuBtn2
                  sx={{
                    width: "auto",
                    backgroundColor: "rgb(237, 89, 15)",
                    letterSpacing: "2px",
                  }}
                  onClick={handleGenerateSalaryAll}
                  variant="contained"
                >
                  Generate Salary for All
                </MenuBtn2>
              </ItemPara>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <ItemPara>
                <MenuBtn2
                  variant="contained"
                  sx={{
                    float: "right",
                    width: "auto",
                    marginLeft: "14px",
                    marginTop: "0",
                    backgroundColor: "rgb(237, 89, 15)",
                  }}
                  onClick={handleGetDownloadPayMonth}
                >
                  Download Salary Report
                </MenuBtn2>
              </ItemPara>
            </Grid>
            <Grid item xs={12} md={12}>
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
                        <StyEmpTableCell>Name</StyEmpTableCell>
                        <StyEmpTableCell>Designation</StyEmpTableCell>
                        <StyEmpTableCell>Department</StyEmpTableCell>
                        <StyTableCell>Payment Details</StyTableCell>
                        <StyTableCell>Payslip</StyTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emp.map((emp, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="left">
                            <CardHeader
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
                              avatar={
                                <Avatar
                                  alt="test"
                                  src={
                                    emp.profile_img
                                      ? "http://" + emp.profile_img
                                      : avatar
                                  }
                                />
                              }
                              title={emp.name}
                            />
                          </TableCell>
                          <TableCell align="left">{emp.designation}</TableCell>
                          <TableCell align="left">{emp.department}</TableCell>
                          <TableCell align="center">
                            {emp.pay && (
                              <YearlyBtn
                                size="small"
                                sx={{ marginRight: "7px" }}
                                onClick={() => {
                                  setSelectedEMP(emp.pay);
                                  handleOpenSalaryDetails();
                                }}
                                variant="outlined"
                              >
                                View
                              </YearlyBtn>
                            )}
                            <YearlyBtn
                              sx={{ marginRight: "7px" }}
                              size="small"
                              onClick={() => {
                                setSelectedEMP(emp.pay);
                                if (emp.pay) {
                                  setEmpIdUpdate(emp.emp_id);
                                  setOpenSalaryUpdate(true);
                                } else {
                                  setEmpId(emp.emp_id);
                                  setOpen(true);
                                }
                              }}
                              variant="outlined"
                            >
                              {emp.pay ? "Update" : "Add"}
                            </YearlyBtn>
                          </TableCell>
                          <TableCell align="center">
                            <YearlyBtn
                              sx={{ marginRight: "7px" }}
                              size="small"
                              onClick={async () => {
                                setSelectedEMP(emp.pay);
                                await checkSalary(emp.emp_id);
                              }}
                              variant="outlined"
                              disabled={!emp.pay}
                            >
                              View
                            </YearlyBtn>
                            <YearlyBtn
                              size="small"
                              onClick={async () => {
                                setSelectedEMP(emp.pay);
                                handleGenerateSalarySingle(emp.emp_id);
                              }}
                              variant="outlined"
                              disabled={!emp.pay}
                            >
                              Generate
                            </YearlyBtn>
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

          {/* Pagination Buttons */}

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
    </div>
  );

  function getMonthDefault() {
    const month = new Date().getMonth() + 1;
    return month < 9 ? "0" + month : month;
  }
  function getYearDefault() {
    return new Date().getFullYear();
  }

  function getMonth() {
    return monthSelect.split("-")[1];
  }
  function getYear() {
    return monthSelect.split("-")[0];
  }

  function getDeductionAmount(index) {
    return selectedEmp.deductions
      ? selectedEmp.deductions[index]
        ? selectedEmp.deductions[index].amount
        : 0
      : 0;
  }

  function getAdditionAmount(index) {
    return selectedEmp.addition ? selectedEmp.addition[index].amount : 0;
  }

  async function checkSalary(emp_id) {
    //check for salary generated or not
    var URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/salary/get/bymonth"
      : "/api/salary/get/bymonth";

    let res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
        month: getMonth(),
        year: getYear(),
      }),
    });

    let resjson = await res.json();

    if (!resjson.error) {
      //redirection->payslip
      const month = getMonth();
      const year = getYear();
      window.open(
        `/payslip?emp=${emp_id.replaceAll(
          "/",
          "_"
        )}&month=${month}&year=${year}`,
        "_blank"
      );
    } else {
      swal(resjson.message);
    }
  }
}

export default Payroll;
