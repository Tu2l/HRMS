import React, { useEffect, useState } from "react";
import Select from "@mui/material/Select";
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
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  style,
  ItemPara,
  StyTableCell,
  StyEmpTableCell,
  StyTextField,
  YearlyBtn,
  DltBtn,
  StyTextFieldLeave,
  StyButton,
} from "../css/styles";
import "../css/profile.css";
import { toast } from "react-toastify";
import swal from "sweetalert";

function Designation() {
  const [departmentData, setDepartmentData] = useState([]);

  //handle modal to update
  const [openUpdateDesignation, setOpenUpdateDesignation] =
    React.useState(false);

  const handleOpenUpdateDesignation = () => setOpenUpdateDesignation(true);
  const handleCloseUpdateDesignation = () => setOpenUpdateDesignation(false);

  //open modal to add Designation
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");
  const [totalCapacity, setTotalCapacity] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const [designationData, setDesignationData] = useState([]);
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

  //get Department
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

  // Delete Designation
  async function deleteDesignation(event) {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const _id = event.target.value;

        const data = {
          id: _id,
        };

        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/designation/delete"
          : "api/designation/delete";

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
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      init();
    });
  }

  async function getDesignation(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/designation/get"
      : "/api/designation/get/all";
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
      current_page: pages.next,
    };

    getDesignation(data)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });
        if (data.data != null) setDesignationData(data.data);
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

  // Handle add designation Form
  async function handleSubmit(e) {
    e.preventDefault();
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/designation/add"
            : "/api/designation/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              total_capacity: totalCapacity,
              departName: departmentName,
            }),
          });

          let resjson = await res.json();

          // console.log(resjson);

          if (res.status === 200) {
            setName("");
            setTotalCapacity("");
            setDepartmentName("");
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

  /* Update designation Details */
  const [nameUpdate, setNameUpdate] = useState("");
  const [capacityUpdate, setCapacityUpdate] = useState("");
  const [departNameUpdate, setDepartmentaNameUpdate] = useState("");

  const [desgId, setDesgId] = useState("");

  async function handleUpdateDesignation(e) {
    e.preventDefault();
    swal("Update?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/designation/update"
            : "/api/project/update";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: desgId,
              name: nameUpdate,
              total_capacity: capacityUpdate,
              departName: departNameUpdate,
            }),
          });

          let resjson = await res.json();

          // console.log(resjson);

          if (res.status === 200) {
            setNameUpdate("");
            setCapacityUpdate("");
            setDepartmentaNameUpdate("");
            handleCloseUpdateDesignation();
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

  //change the department while updating
  const handleChangeDepartment = (event) => {
    setDepartmentName(event.target.value);
  };

  //set the department while adding
  const handleChangeDepartmentOnUpdate = (event) => {
    setDepartmentaNameUpdate(event.target.value);
  };

  return (
    <div className="des-main">
      {/* Update Designation */}
      <div>
        <Modal
          open={openUpdateDesignation}
          onClose={handleCloseUpdateDesignation}
        >
          <Box sx={style}>
            <center>
              <form onSubmit={handleUpdateDesignation}>
                <StyTextFieldLeave
                  defaultValue={nameUpdate}
                  label="Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setNameUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={capacityUpdate}
                  size="small"
                  label="Capacity"
                  type="number"
                  variant="outlined"
                  onChange={(e) => setCapacityUpdate(e.target.value)}
                  fullWidth
                />
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departNameUpdate}
                    label="Department"
                    onChange={handleChangeDepartmentOnUpdate}
                  >
                    {departmentData.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.name}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <div className="leave-btn">
                  <YearlyBtn
                    size="small"
                    type="submit"
                    sx={{
                      marginRight: "7px",
                    }}
                    variant="outlined"
                  >
                    Update
                  </YearlyBtn>
                  <DltBtn
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={handleCloseUpdateDesignation}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Add Designation */}
      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleSubmit}>
                <StyTextField
                  defaultValue={name}
                  label="Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <StyTextField
                  defaultValue={totalCapacity}
                  size="small"
                  label="Capacity"
                  type="number"
                  variant="outlined"
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  required
                />
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    defaultValue={departmentName}
                    label="Department"
                    onChange={handleChangeDepartment}
                  >
                    {departmentData.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.name}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <br />
                <YearlyBtn
                  size="small"
                  type="submit"
                  sx={{
                    marginRight: "7px",
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
      </div>

      {/* Display Designation Table */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={4}>
            <ItemPara>
              <YearlyBtn
                className="add-emp"
                sx={{ marginLeft: "0.7%" }}
                variant="outlined"
                onClick={handleOpen}
              >
                Add Designation
              </YearlyBtn>
            </ItemPara>
          </Grid>

          {/* Employee details table */}

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
                      <StyEmpTableCell>Capacity</StyEmpTableCell>
                      <StyEmpTableCell>Occupied</StyEmpTableCell>
                      <StyEmpTableCell>Vacant</StyEmpTableCell>
                      <StyTableCell>Action</StyTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {designationData.map((desig, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align="left">{desig.name}</TableCell>
                        <TableCell align="left">{desig.departName}</TableCell>
                        <TableCell align="left">
                          {desig.total_capacity}
                        </TableCell>
                        <TableCell align="left">{desig.occupied}</TableCell>
                        <TableCell align="left">{desig.vacant}</TableCell>
                        <TableCell align="center">
                          <YearlyBtn
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              handleOpenUpdateDesignation();
                              setDesgId(desig._id);
                            }}
                            sx={{ marginRight: "15px" }}
                          >
                            Update
                          </YearlyBtn>
                          <DltBtn
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ marginRight: "15px" }}
                            value={desig._id}
                            onClick={deleteDesignation}
                          >
                            Delete
                          </DltBtn>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            </StyButton>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Designation;
