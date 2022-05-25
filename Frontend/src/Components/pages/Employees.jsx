import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Grid,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CardHeader,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  style,
  ItemPara,
  StyButton,
  StyTableCell,
  StyTextField,
  StyTextFieldLeave,
  LightTooltip,
  YearlyBtn,
  DltBtn,
  StyEmpTableCell,
  MenuBtn2,
  StyButtonDownload,
} from "../css/styles";
import swal from "sweetalert";
import "../css/profile.css";
import avatar from "../../images/proavatar.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@mui/material/Select";
import { useLocation } from "react-router-dom";
import "../css/ViewProfile.css";
import ViewProfile from "./ViewProfile";
toast.configure();

function Employees() {
  const data_ = JSON.parse(localStorage.getItem("data"));
  const [open, setOpen] = React.useState(false);
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [selectedEmp, setSelectedEmp] = React.useState("");
  const [statusFilterOpen, setStatusFilterOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenFilter = () => setStatusFilterOpen(true);
  const handleCloseFilter = () => setStatusFilterOpen(false);

  const [empData, setEmpData] = useState([]);

  const paramSearch = useLocation().search;
  const viewprofile = new URLSearchParams(paramSearch).get("emp_id") || false;

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

  const selectStatus = [
    { value: "0", label: "In Service" },
    { value: "1", label: "Resigned" },
    { value: "2", label: "Terminated" },
    { value: "3", label: "On Notice Period" },
    { value: "4", label: "On Probation" },
  ];

  // Delete employee
  async function deleteEmployeeConfirmation(event) {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value) {
        const emp_id = event.target.value;

        const data = {
          emp_id: emp_id,
        };

        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/user/delete"
          : "/api/user/delete";

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
            toast.info(data.message.toUpperCase(), {
              position: toast.POSITION.TOP_CENTER,
            });
            if (!data.error) init();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
  /* Get Department data */

  const [departmentData, setDepartmentData] = useState([]);

  async function getDepartment() {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/department/get/all"
      : "/api/department/get/all";
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

  /* Search employee data */

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

  /* Get Designation data */

  const [designationData, setDesignationData] = useState([]);

  async function getDesignationList(depart) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/designation/show"
      : "/api/designation/show";
    const response = await fetch(URL, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ departName: depart }),
    });

    return response;
  }

  /* Search employee data */

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

  async function init() {
    const data = {
      current_page: pages.next,
    };

    getEmployees(data)
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

    getDepartment()
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          setDepartmentData(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);

  /* Form States */

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [join_date, setJoinDate] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");

  /* Submit function for adding employees */

  async function handleSubmit(e) {
    e.preventDefault();
    swal("Add Employee?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/register"
            : "/api/rol/register";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              name: name,
              phone: phone,
              dob: dob,
              designation: designation,
              department: department,
              join_date: join_date,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            setEmail("");
            setName("");
            setPhone("");
            setDob("");
            setDesignation("");
            setDepartment("");
            setJoinDate("");
            swal(resjson.message.toUpperCase());
            handleClose();
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

  async function handleStatusUpdate(e) {
    e.preventDefault();
    swal("Update?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/rol/status"
            : "/api/rol/status";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emp_id: selectedEmp.emp_id,
              status: e.target.status.value,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            swal(resjson.message.toUpperCase());
          } else {
            swal(resjson.message.toUpperCase());
          }
        } catch (ex) {
          console.log(ex.message);
        }
        setStatusModalOpen(false);
        init();
      }
    });
  }

  const handleChangeDesignation = (event) => {
    setDesignation(event.target.value);
  };

  const handleChangeDepartment = (event) => {
    setDepartment(event.target.value);
    getDesignationList(event.target.value)
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          setDesignationData(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [statusSelect, setStatusSelect] = useState("");

  const handleChangeStatus = (event) => {
    setStatusSelect(event.target.value);
  };

  async function handleSubmitFilter(e) {
    e.preventDefault();
    swal("Filter?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/user/filter"
            : "/api/user/filter";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              designation: designation,
              department: department,
              status: statusSelect,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            setDesignation("");
            setDepartment("");
            setStatusSelect("");
            setEmpData(resjson.data);
            setPage({
              current: resjson.data.current_page,
              total: resjson.data.total_page,
              next: resjson.data.current_page,
            });
            swal(resjson.message.toUpperCase());
            handleCloseFilter();
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  const fileInputRef = useRef();

  const employeeDocUpload = () => {
    swal("Upload?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const formData = new FormData();
        const fileField = document.querySelector(
          'input[id="employeeDocUpload"]'
        );

        formData.append("file", fileField.files[0]);

        fetch("http://localhost:5000/api/import/emp", {
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

  async function handleGetDownload(e) {
    e.preventDefault();
    swal("Download File?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/export/emp"
            : "/api/export/emp";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            window.open("http://" + resjson.data, "_blank");
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date();
    const month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }

  return !viewprofile ? (
    <div className="emp-main">
      {/* Add Employee Modal */}
      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleSubmit}>
                <StyTextField
                  value={email}
                  label="Email"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <StyTextField
                  id="empformname"
                  value={name}
                  label="Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <LightTooltip title="Date of Birth" placement="right">
                  <StyTextField
                    value={dob}
                    size="small"
                    type="date"
                    inputProps={{
                      max: "2005-01-01",
                    }}
                    variant="outlined"
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </LightTooltip>
                <StyTextField
                  value={phone}
                  label="Phone Number"
                  size="small"
                  inputProps={{
                    minLength: "10",
                    maxLength: "10",
                  }}
                  variant="outlined"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <LightTooltip title="Date of Joining" placement="right">
                  <StyTextField
                    value={join_date}
                    size="small"
                    type="date"
                    inputProps={{
                      max: getformattedDate(),
                    }}
                    variant="outlined"
                    onChange={(e) => setJoinDate(e.target.value)}
                    required
                  />
                </LightTooltip>
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    required
                    value={department}
                    label="Department"
                    onChange={handleChangeDepartment}
                  >
                    {departmentData.map((item) => {
                      return <MenuItem value={item.name}>{item.name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Designation</InputLabel>
                  <Select
                    required
                    disabled={!department}
                    value={designation}
                    label="Designation"
                    onChange={handleChangeDesignation}
                  >
                    {designationData.map((item) => {
                      return <MenuItem value={item.name}>{item.name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <br />
                <YearlyBtn
                  type="submit"
                  sx={{
                    marginRight: "7px",
                  }}
                  variant="outlined"
                >
                  Submit
                </YearlyBtn>
                <DltBtn variant="outlined" color="error" onClick={handleClose}>
                  Cancel
                </DltBtn>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Status Modal */}
      <div>
        <Modal
          open={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
          }}
        >
          <Box sx={style}>
            <center>
              <form onSubmit={handleStatusUpdate}>
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Select Status</InputLabel>
                  <Select
                    name="status"
                    defaultValue={selectedEmp.status}
                    label="Select Status"
                  >
                    {selectStatus.map((item) => {
                      return (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <br />
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
                  onClick={() => {
                    setStatusModalOpen(false);
                  }}
                >
                  Cancel
                </DltBtn>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Filter */}
      <Modal open={statusFilterOpen} onClose={handleCloseFilter}>
        <Box sx={style}>
          <center>
            <form onSubmit={handleSubmitFilter}>
              <FormControl
                size="small"
                className="select-status"
                sx={{ marginBottom: "12px" }}
              >
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  label="Department"
                  onChange={handleChangeDepartment}
                >
                  {departmentData.map((item) => {
                    return <MenuItem value={item.name}>{item.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                className="select-status"
                sx={{ marginBottom: "12px" }}
              >
                <InputLabel>Designation</InputLabel>
                <Select
                  disabled={!department}
                  value={designation}
                  label="Designation"
                  onChange={handleChangeDesignation}
                >
                  {designationData.map((item) => {
                    return <MenuItem value={item.name}>{item.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <FormControl
                className="select-status"
                size="small"
                sx={{ marginBottom: "12px" }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusSelect}
                  onChange={handleChangeStatus}
                >
                  {selectStatus.map((item) => {
                    return <MenuItem value={item.value}>{item.label}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <br />
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
                onClick={handleCloseFilter}
              >
                Cancel
              </DltBtn>
            </form>
          </center>
        </Box>
      </Modal>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={9}>
            <ItemPara>
              {/* Add Employee Button with Modal Popup */}

              <YearlyBtn
                className="add-emp"
                onClick={handleOpen}
                variant="outlined"
              >
                Add Employee
              </YearlyBtn>
            </ItemPara>
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <ItemPara>
              <div className="search">
                <TextField
                  sx={{ marginLeft: "24%" }}
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

          {/* Employee details table */}

          <Grid item xs={12} sm={12} md={4}>
            <ItemPara>
              <MenuBtn2
                size="small"
                sx={{
                  backgroundColor: "rgb(237, 89, 15)",
                  letterSpacing: "2px",
                }}
                onClick={handleOpenFilter}
                variant="contained"
              >
                Filter
              </MenuBtn2>
            </ItemPara>
          </Grid>

          <Grid item xs={12} sm={12} md={8} sx={{ marginBottom: "-1%" }}>
            <ItemPara>
              <YearlyBtn
                sx={{ marginLeft: "6px", marginTop: "1.5px", float: "right" }}
                type="button"
                variant="outlined"
                onClick={employeeDocUpload}
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
                id="employeeDocUpload"
                type="file"
                sx={{ width: "35%", float: "right" }}
                helperText="Upload Employees Document (.xslx)"
              />
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
                      <StyEmpTableCell>Department</StyEmpTableCell>
                      <StyEmpTableCell>Designation</StyEmpTableCell>
                      <StyEmpTableCell>Join Date</StyEmpTableCell>
                      <StyTableCell>Service</StyTableCell>
                      <StyTableCell>Action</StyTableCell>
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
                        <TableCell align="left">
                          <CardHeader
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
                        <TableCell align="left">
                          {emp.department ? emp.department : "-"}
                        </TableCell>
                        <TableCell align="left">
                          {emp.designation ? emp.designation : "-"}
                        </TableCell>
                        <TableCell align="left">
                          {emp.join_date ? emp.join_date.split("T")[0] : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {getServiceType(emp.status)}
                        </TableCell>
                        <TableCell align="center">
                          <YearlyBtn
                            size="small"
                            variant="outlined"
                            sx={{ marginRight: "15px" }}
                            disabled={data_.emp_id === emp.emp_id}
                            onClick={() => {
                              setSelectedEmp(emp);
                              setStatusModalOpen(true);
                            }}
                          >
                            Change Status
                          </YearlyBtn>
                          <YearlyBtn
                            size="small"
                            variant="outlined"
                            sx={{ marginRight: "15px" }}
                            onClick={() => {
                              window.location =
                                "?emp_id=" + emp.emp_id.replaceAll("/", "_");
                            }}
                          >
                            View Profile
                          </YearlyBtn>
                          <DltBtn
                            size="small"
                            variant="contained"
                            color="error"
                            value={emp.emp_id}
                            onClick={deleteEmployeeConfirmation}
                            disabled={data_.emp_id === emp.emp_id}
                          >
                            Delete
                          </DltBtn>
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

        {/* Pagination Buttons */}

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
            </StyButton>{" "}
            <br />
            {/* <ReactLoading
              type={"bars"}
              color={"rgb(19, 71, 129)"}
              height={200}
              width={200}
            /> */}
          </Grid>
        </Grid>
      </Box>
    </div>
  ) : (
    <ViewProfile emp_id={viewprofile.replaceAll("_", "/")} />
  );
}

const getServiceType = (status) => {
  const style = {
    backgroundColor: "green",
    padding: "8px",
    margin: "auto",
    marginBottom: "8px",
    borderRadius: "3px",
    color: "white",
    fontWeight: "bold",
    maxWidth: "100%",
    textAlign: "center",
  };

  switch (status) {
    case 0:
      return <div style={style}>In Service</div>;
    case 1:
      style.backgroundColor = "rgb(239, 104, 13)";
      return <div style={style}>Resigned</div>;
    case 2:
      style.backgroundColor = "rgb(222, 39, 39)";
      return <div style={style}>Terminated</div>;
    case 3:
      style.backgroundColor = "rgb(241, 233, 11)";
      style.color = "black";
      return <div style={style}>On Notice Period</div>;
    case 4:
      style.backgroundColor = "rgb(241, 200, 11)";
      style.color = "black";
      return <div style={style}>On Probation</div>;
    default:
      return "-";
  }
};

export default Employees;
