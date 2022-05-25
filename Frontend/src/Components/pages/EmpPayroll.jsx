import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ItemPara,
  StyButton,
  StyTableCell,
  YearlyBtn,
  StyEmpTableCell,
} from "../css/styles";
import "../css/profile.css";
import "react-toastify/dist/ReactToastify.css";
import "../css/ViewProfile.css";

function EmpPayroll() {
  const data_ = JSON.parse(localStorage.getItem("data"));
  const [salaries, setSalaries] = useState([]);

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

  async function getSalary(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/salary/get"
      : "/api/salary/get";
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

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getMonthName(index) {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return month[index - 1];
  }

  async function init() {
    const data = {
      emp_id: data_.emp_id,
      current_page: pages.next,
    };

    getSalary(data)
      .then((response) => response.json())
      .then((data) => {
        setPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });

        if (data.data != null) setSalaries(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div className="pay-main">
      <Grid container>
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
                    <StyEmpTableCell>Month</StyEmpTableCell>
                    <StyEmpTableCell>Year</StyEmpTableCell>
                    <StyTableCell>Action</StyTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaries.map((salary, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="left">
                        {salary.month ? getMonthName(salary.month) : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {salary.year ? salary.year : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <YearlyBtn
                          size="small"
                          variant="outlined"
                          sx={{ marginRight: "15px" }}
                          onClick={() => {
                            window.open(
                              `/payslip?emp=${salary.emp_id.replaceAll(
                                "/",
                                "_"
                              )}&month=${salary.month}&year=${salary.year}`,
                              "_blank"
                            );
                          }}
                        >
                          View Payslip
                        </YearlyBtn>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ItemPara>
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
      </Grid>
    </div>
  );
}

export default EmpPayroll;
