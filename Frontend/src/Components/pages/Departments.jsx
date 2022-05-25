import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  style,
  ItemPara,
  StyTableCell,
  StyEmpTableCell,
  StyTextField,
  YearlyBtn,
  DltBtn,
  StyButton,
  StyTextFieldLeave,
} from "../css/styles";
import "../css/profile.css";
import { toast } from "react-toastify";
import swal from "sweetalert";

function Departments() {
  //handle modal to update
  const [openUpdateDepartment, setOpenUpdateDepartment] = React.useState(false);

  const handleOpenUpdateDepartment = () => setOpenUpdateDepartment(true);
  const handleCloseUpdateDepartment = () => setOpenUpdateDepartment(false);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
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

  // Delete Department
  async function deleteDepartment(event) {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const _id = event.target.value;

        const data = {
          id: _id,
        };

        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/department/delete"
          : "api/department/delete";

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
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      init();
    });
  }

  async function getDepartment(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/department/get"
      : "/api/department/get";
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

    getDepartment(data)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) setDepartmentData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);

  //Handle add department

  async function handleSubmit(e) {
    e.preventDefault();
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/department/add"
            : "/api/department/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setName("");
            swal(resjson.message.toUpperCase());
            setOpen(false);
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

  /* Update Department Details */
  const [nameUpdate, setNameUpdate] = useState("");

  const [departId, setDepartId] = useState("");

  async function handleUpdateDepartment(e) {
    e.preventDefault();
    swal("Update?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/department/update"
            : "/api/department/update";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: departId,
              name: nameUpdate,
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setNameUpdate("");
            handleCloseUpdateDepartment();
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

  return (
    <div className="dep-main">
      {/* Udate Department */}
      <div>
        <Modal
          open={openUpdateDepartment}
          onClose={handleCloseUpdateDepartment}
        >
          <Box sx={style}>
            <center>
              <form onSubmit={handleUpdateDepartment}>
                <StyTextFieldLeave
                  defaultValue={nameUpdate}
                  label="Name"
                  size="small"
                  variant="outlined"
                  multiline
                  onChange={(e) => setNameUpdate(e.target.value)}
                  fullWidth
                />

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
                    onClick={handleCloseUpdateDepartment}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

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

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={9}>
            <ItemPara>
              <YearlyBtn
                className="add-emp"
                sx={{ marginLeft: "0.7%" }}
                variant="outlined"
                onClick={handleOpen}
              >
                Add Department
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
                      <StyEmpTableCell>Capacity</StyEmpTableCell>
                      <StyTableCell>Action</StyTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentData.map((depart, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell align="left">{depart.name}</TableCell>
                        <TableCell align="left">{depart.capacity}</TableCell>
                        <TableCell align="center">
                          <YearlyBtn
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              handleOpenUpdateDepartment();
                              setDepartId(depart._id);
                            }}
                            sx={{ marginRight: "15px" }}
                          >
                            Update
                          </YearlyBtn>
                          <DltBtn
                            color="error"
                            size="small"
                            variant="outlined"
                            value={depart._id}
                            onClick={deleteDepartment}
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

export default Departments;
