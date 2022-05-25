import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import {
  style,
  StyButton,
  StyTableCell,
  LightTooltip,
  StyTextFieldLeave,
  YearlyBtn,
  ProjectTable,
  DltBtn,
  ItemPara,
} from "../css/styles";
import "../css/profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Select from "react-select";
import ReactPaginate from "react-paginate";
toast.configure();

/* Main Function */

function Projects() {
  //Modals

  const [openAddProject, setOpenAddProject] = React.useState(false);
  const [openAddMembers, setOpenAddMembers] = React.useState(false);
  const [openMoreDetails, setOpenMoreDetails] = React.useState(false);
  const [openUpdateProject, setOpenUpdateProject] = React.useState(false);

  const handleOpenAddProject = () => setOpenAddProject(true);
  const handleCloseAddProject = () => setOpenAddProject(false);

  const handleOpenAddMembers = () => setOpenAddMembers(true);
  const handleCloseAddMembers = () => setOpenAddMembers(false);

  const handleOpenMoreDetails = () => setOpenMoreDetails(true);
  const handleCloseMoreDetails = () => setOpenMoreDetails(false);

  const handleOpenUpdateProject = () => setOpenUpdateProject(true);
  const handleCloseUpdateProject = () => setOpenUpdateProject(false);

  /* Pagination for all 3 tables (pending, approved, rejected) */

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

  const [empPages, setEmpPage] = useState({
    current: 1,
    next: 1,
    total: 1,
  });

  function preEmpPage() {
    if (empPages.current > 1) {
      empPages.next = empPages.current - 1;
      init();
    }
  }

  function nextEmpPage() {
    if (empPages.current < empPages.total) {
      empPages.next = empPages.current + 1;
      init();
    }
  }
  /* API call to get all projects */

  async function getAllProjects(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/project/get/all"
      : "/api/project/get/all";
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

  /* Get single project */

  async function getProjects(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/project/get"
      : "/api/project/get";
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

  const [projects, setProjects] = useState([]);
  const [empData, setEmpData] = useState([]);

  async function init(status) {
    const data = {
      current_page: pages.next,
      status: status,
    };

    /* Get All Projects */

    getAllProjects(data)
      .then((response) => response.json())
      .then(async (data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) {
          setProjects(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const data_emp = {
      current_page: empPages.next,
    };

    getEmployees(data_emp)
      .then((response) => response.json())
      .then((data) => {
        setEmpPage({
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init("0"), []);

  // Add new project

  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");

  async function handleAddProject(e) {
    e.preventDefault();
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/project/add"
            : "/api/project/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: projectTitle,
              desc: description,
              start_date: projectStartDate,
              end_date: projectEndDate,
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setProjectTitle("");
            setDescription("");
            setProjectStartDate("");
            setProjectEndDate("");
            handleCloseAddProject();
            swal(resjson.message.toUpperCase());
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

  /* Update Project Details */

  const [projectTitleUpdate, setProjectTitleUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [projectStartDateUpdate, setProjectStartDateUpdate] = useState("");
  const [projectEndDateUpdate, setProjectEndDateUpdate] = useState("");
  const [projectStatusUpdate, setProjectStatusUpdate] = useState("");
  const [projectIDForUpdate, setProjectIdForUpdate] = useState();

  async function handleUpdateProject(e) {
    e.preventDefault();
    swal("Update?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/project/update"
            : "/api/project/update";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: projectIDForUpdate,
              title: projectTitleUpdate,
              desc: descriptionUpdate,
              start_date: projectStartDateUpdate,
              end_date: projectEndDateUpdate,
              status: projectStatusUpdate,
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            setProjectTitleUpdate("");
            setDescriptionUpdate("");
            setProjectStartDateUpdate("");
            setProjectEndDateUpdate("");
            handleCloseUpdateProject();
            swal(resjson.message.toUpperCase());
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

  //Main Select
  const options = [
    { value: "0", label: "Pending" },
    { value: "1", label: "In Progress" },
    { value: "2", label: "Completed" },
    { value: "3", label: "Abandoned" },
  ];

  const handleChange = (status) => {
    init(status);
  };

  //Update Status Select

  const selectStatus = [
    { value: 0, label: "Pending" },
    { value: 1, label: "In Progress" },
    { value: 2, label: "Completed" },
    { value: 3, label: "Abandoned" },
  ];

  const handleChangeStatus = (status) => {
    setProjectStatusUpdate(status);
  };

  /* Delete Project */

  async function deleteProject(event) {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        const _id = event.target.value;

        const data = {
          project_id: _id,
        };

        const URL = window.location.href.startsWith("http://localhost")
          ? "http://localhost:5000/api/project/delete"
          : "api/project/delete";

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
    });
  }

  /* Add New Member */

  const [projectIDAddDeleteMembers, setProjectIdAddDeleteMembers] = useState();

  let handleAddMembers = async (e) => {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        e.preventDefault();
        const addEmpID = e.target.value;
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/project/update/member/add"
            : "/api/project/update/member/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: projectIDAddDeleteMembers,
              members: [
                {
                  emp_id: addEmpID,
                },
              ],
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            handleCloseAddMembers();
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
    init();
  };

  /* Delete Project Members */

  let handleDeleteMembers = async (e) => {
    swal("Are you sure?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        e.preventDefault();
        const empIdDelete = e.target.value;
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/project/update/member/delete"
            : "api/project/update/member/delete";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: projectIDAddDeleteMembers,
              members: [
                {
                  emp_id: empIdDelete,
                },
              ],
            }),
          });

          let resjson = await res.json();

          console.log(resjson);

          if (res.status === 200) {
            handleCloseAddMembers();
            swal(resjson.message.toUpperCase());
          } else {
            swal("Failed");
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
    init();
  };

  /* View More Details of Project PopUp Modal */

  const [viewMoreModal, setViewMoreModal] = useState([]);

  const viewMoreDetails = (event) => {
    const p_id = event.target.value;

    const data = {
      project_id: p_id,
    };

    getProjects(data)
      .then((response) => response.json())
      .then((data) => {
        if (data.data != null) {
          setViewMoreModal(data.data);
          handleOpenMoreDetails();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  /* Display Project [All Project types mapping] */

  const displayProjects = () => {
    return projects.map((pro, index) => {
      return (
        <TableRow
          key={index}
          sx={{
            "&:last-child td, &:last-child th": {
              border: 0,
            },
          }}
        >
          <TableCell align="center">{pro.title}</TableCell>
          <TableCell align="center">{pro.start_date.split("T")[0]}</TableCell>
          <TableCell align="center">{pro.end_date.split("T")[0]}</TableCell>

          {/* Add Members, Update Project, Delete Project Buttons*/}

          <TableCell align="center">
            <YearlyBtn
              sx={{ marginRight: "7px" }}
              value={pro.project_id}
              onClick={viewMoreDetails}
              variant="outlined"
            >
              More Details
            </YearlyBtn>
            <YearlyBtn
              sx={{ marginRight: "7px" }}
              onClick={() => {
                handleOpenAddMembers();
                setProjectIdAddDeleteMembers(pro.project_id);
              }}
              variant="outlined"
            >
              Add - Delete Members
            </YearlyBtn>
            <YearlyBtn
              sx={{ marginRight: "7px" }}
              onClick={() => {
                handleOpenUpdateProject();
                setProjectIdForUpdate(pro.project_id);
              }}
              variant="outlined"
            >
              Update
            </YearlyBtn>
            <DltBtn
              sx={{ marginRight: "7px" }}
              color="error"
              value={pro.project_id}
              onClick={deleteProject}
              variant="outlined"
            >
              Delete
            </DltBtn>
          </TableCell>
        </TableRow>
      );
    });
  };

  /* View Members */

  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 1;
  const pagesVisited = pageNumber * usersPerPage;
  const length_ = viewMoreModal.members ? viewMoreModal.members.length || 0 : 0;

  const pageCount = Math.ceil(length_ / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  function viewMembers() {
    const isEmpty = Object.keys(viewMoreModal).length === 0;
    if (!isEmpty) {
      return viewMoreModal.members
        .slice(pagesVisited, pagesVisited + usersPerPage)
        .map((members) => {
          return (
            <ul className="members-list">
              <li>{members.name}</li>
            </ul>
          );
        });
    }
  }

  /* Main return starts here */

  return (
    <div className="pro-main">

      {/* View More Details of Projects*/}

      <div>
        <Modal open={openMoreDetails} onClose={handleCloseMoreDetails}>
          <Box sx={style}>
            <div className="desc-reason">
              <h4 className="desc-h2">Description</h4>
              <span className="desc-main">{viewMoreModal.description}</span>
              <h4 className="desc-h2">Members</h4>
              <div className="view-members">{viewMembers()}</div>
            </div>
            <div className="react-paginate" align="center">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                onPageChange={changePage}
                pageCount={pageCount}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </Box>
        </Modal>
      </div>

      {/* Add Project form */}

      <div>
        <Modal open={openAddProject} onClose={handleCloseAddProject}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleAddProject}>
                <StyTextFieldLeave
                  value={projectTitle}
                  label="Title"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  fullWidth
                />
                <StyTextFieldLeave
                  value={description}
                  label="Project Description"
                  size="small"
                  variant="outlined"
                  rows={4}
                  multiline
                  placeholder="A brief description..."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  fullWidth
                />
                <LightTooltip title="Start Date" placement="right">
                  <StyTextFieldLeave
                    value={projectStartDate}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Select the start date for the project"
                    onChange={(e) => setProjectStartDate(e.target.value)}
                    required
                    fullWidth
                  />
                </LightTooltip>
                <LightTooltip title="End Date" placement="right">
                  <StyTextFieldLeave
                    value={projectEndDate}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Select the end date for the project"
                    onChange={(e) => setProjectEndDate(e.target.value)}
                    required
                    fullWidth
                  />
                </LightTooltip>
                <div className="leave-btn">
                  <YearlyBtn
                    type="submit"
                    sx={{
                      marginRight: "7px",
                    }}
                    variant="outlined"
                  >
                    Add
                  </YearlyBtn>
                  <DltBtn
                    variant="outlined"
                    color="error"
                    onClick={handleCloseAddProject}
                  >
                    Close
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Add Members to a Project */}

      <div>
        <Modal open={openAddMembers} onClose={handleCloseAddMembers}>
          <Box sx={style}>
            <div className="search-pro">
              <TextField
                size="small"
                variant="outlined"
                placeholder="Name..."
                label="Search..."
                onChange={search}
              />
            </div>
            <center>
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
                      <StyTableCell>Actions</StyTableCell>
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
                        <TableCell align="center">
                          {emp.emp_id ? emp.emp_id : "-"}
                        </TableCell>
                        <TableCell align="center">
                          {emp.name ? emp.name : "-"}
                        </TableCell>
                        <TableCell align="center">
                          <YearlyBtn
                            sx={{
                              marginRight: "7px",
                            }}
                            size="small"
                            type="button"
                            variant="outlined"
                            value={emp.emp_id}
                            onClick={handleAddMembers}
                          >
                            Add
                          </YearlyBtn>
                          <DltBtn
                            size="small"
                            type="button"
                            color="error"
                            variant="outlined"
                            value={emp.emp_id}
                            onClick={handleDeleteMembers}
                          >
                            Delete
                          </DltBtn>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Pagination Buttons */}
              <div style={{ marginTop: "10px" }}>
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
                      onClick={preEmpPage}
                    >
                      Pre
                    </StyButton>
                    <StyButton
                      variant="outlined"
                      size="small"
                      onClick={nextEmpPage}
                    >
                      Next
                    </StyButton>
                  </Grid>
                </Grid>
              </div>
              <div className="leave-btn">
                <DltBtn
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleCloseAddMembers}
                >
                  Close
                </DltBtn>
              </div>
            </center>
          </Box>
        </Modal>
      </div>

      {/* Update Project Details */}

      <div>
        <Modal open={openUpdateProject} onClose={handleCloseUpdateProject}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleUpdateProject}>
                <StyTextFieldLeave
                  value={projectTitleUpdate}
                  label="Title"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setProjectTitleUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={descriptionUpdate}
                  label="Project Description"
                  size="small"
                  variant="outlined"
                  rows={4}
                  multiline
                  placeholder="A brief description..."
                  onChange={(e) => setDescriptionUpdate(e.target.value)}
                  fullWidth
                />
                <LightTooltip title="Start Date" placement="right">
                  <StyTextFieldLeave
                    value={projectStartDateUpdate}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Select the start date for the project"
                    onChange={(e) => setProjectStartDateUpdate(e.target.value)}
                    fullWidth
                  />
                </LightTooltip>
                <LightTooltip title="End Date" placement="right">
                  <StyTextFieldLeave
                    value={projectEndDateUpdate}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Select the end date for the project"
                    onChange={(e) => setProjectEndDateUpdate(e.target.value)}
                    fullWidth
                  />
                </LightTooltip>
                <Select
                  className="select-status"
                  options={selectStatus}
                  placeholder="Pending"
                  onChange={(event) => {
                    handleChangeStatus(event.value);
                  }}
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
                    onClick={handleCloseUpdateProject}
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
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <ItemPara>
              <YearlyBtn onClick={handleOpenAddProject} variant="outlined">
                Add Project
              </YearlyBtn>
            </ItemPara>
          </Grid>
          <Grid item xs={12} md={6}>
            <ItemPara>
              {/* Select Project Type */}

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
          {/* View Projects */}
          <Grid item xs={12} md={12}>
            <ProjectTable>
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
                      <StyTableCell>Title</StyTableCell>
                      <StyTableCell>Start Date</StyTableCell>
                      <StyTableCell>End Date</StyTableCell>
                      <StyTableCell>Actions</StyTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Projects Table */}

                    {displayProjects()}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination Buttons */}

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
            </ProjectTable>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Projects;
