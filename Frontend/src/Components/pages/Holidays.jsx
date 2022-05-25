import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Modal } from "@mui/material";
import {
  ItemPara,
  YearlyBtn,
  StyButton,
  LightTooltip,
  DltBtn,
  StyTextFieldLeave,
  style,
} from "../css/styles";
import "../css/profile.css";
import swal from "sweetalert";
import Select from "react-select";

function Holidays() {
  function isAdmin() {
    return localStorage.getItem("admin") === "true" ? true : false;
  }

  /* Pagination for holidays popup modal */

  const [holidayPages, setHolidayPage] = useState({
    current: 1,
    next: 1,
    total: 1,
    emp_id: null,
  });

  function preHolidayPage() {
    if (holidayPages.current > 1) {
      holidayPages.next = holidayPages.current - 1;
      init();
    }
  }

  function nextHolidayPage() {
    if (holidayPages.current < holidayPages.total) {
      holidayPages.next = holidayPages.current + 1;
      init();
    }
  }
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
  // View Holidays

  async function getHolidays(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/holiday/get"
      : "/api/holiday/get";

    const response = await fetch(URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  }

  const [holidays, setHolidays] = useState([]);

  async function init() {
    const data = {
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      current_page: holidayPages.next,
    };

    /* Get Leave */

    getHolidays(data)
      .then((response) => response.json())
      .then((data) => {
        setHolidayPage({
          current: data.current_page,
          total: data.total_page,
          next: data.current_page,
        });
        if (data.data != null) setHolidays(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);

  const [openHolidayForm, setOpenHolidayForm] = React.useState(false);

  const handleOpenHolidayForm = () => setOpenHolidayForm(true);
  const handleCloseHolidayForm = () => setOpenHolidayForm(false);

  //Submit Holidays

  const [holidayDate, setHolidayDate] = useState("");
  const [holidayName, setHolidayName] = useState("");

  const [selectHolidayType, setSelectHolidayType] = useState();
  const [endDate, setEndDate] = useState("");

  const handleChangeHoliday = (status) => {
    setSelectHolidayType(status);
  };

  const holidayOptions = [
    { value: 0, label: "Single" },
    { value: 1, label: "By Range" },
  ];

  async function handleSubmitHolidaySingle(e) {
    e.preventDefault();
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/holiday/add"
            : "/api/holiday/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: holidayDate,
              name: holidayName,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            setHolidayDate("");
            setHolidayName("");
            handleCloseHolidayForm();
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

  async function handleSubmitHolidayRange(e) {
    e.preventDefault();
    swal("Add?", {
      buttons: ["Oh no!", true],
    }).then(async (value) => {
      if (value === true) {
        try {
          const AddURL = window.location.href.startsWith("http://localhost")
            ? "http://localhost:5000/api/holiday/add/range"
            : "/api/holiday/add";

          let res = await fetch(AddURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start_date: holidayDate,
              end_date: endDate,
              name: holidayName,
            }),
          });

          let resjson = await res.json();

          if (!resjson.error) {
            setHolidayDate("");
            setEndDate("");
            setHolidayName("");
            handleCloseHolidayForm();
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
    <div className="hol-main">
      {/* Add Holidays Form Modal */}

      <div>
        <Modal open={openHolidayForm} onClose={handleCloseHolidayForm}>
          <Box sx={style}>
            <center>
              <form
                onSubmit={
                  // eslint-disable-next-line eqeqeq
                  selectHolidayType == 0
                    ? handleSubmitHolidaySingle
                    : handleSubmitHolidayRange
                }
              >
                <Select
                  className="select-status"
                  options={holidayOptions}
                  onChange={(event) => {
                    handleChangeHoliday(event.value);
                  }}
                ></Select>
                <LightTooltip title="Select Date" placement="right">
                  <StyTextFieldLeave
                    value={holidayDate}
                    size="small"
                    type="date"
                    variant="outlined"
                    helperText="Select the date for the holiday"
                    onChange={(e) => setHolidayDate(e.target.value)}
                    required
                    fullWidth
                  />
                </LightTooltip>
                {selectHolidayType === 1 && (
                  <LightTooltip title="Select End Date" placement="right">
                    <StyTextFieldLeave
                      value={endDate}
                      size="small"
                      type="date"
                      inputProps={{
                        min: getformattedDate(holidayDate),
                      }}
                      variant="outlined"
                      helperText="Holiday To"
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      fullWidth
                    />
                  </LightTooltip>
                )}
                <StyTextFieldLeave
                  value={holidayName}
                  label="Holiday Name"
                  size="small"
                  variant="outlined"
                  multiline
                  placeholder="Enter name"
                  onChange={(e) => setHolidayName(e.target.value)}
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
                    Add
                  </YearlyBtn>
                  <DltBtn
                    variant="outlined"
                    color="error"
                    onClick={handleCloseHolidayForm}
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
        <Grid container spacing={0}>
          <Grid item xs={12} md={3} hidden={!isAdmin()}>
            <ItemPara>
              <YearlyBtn onClick={handleOpenHolidayForm} variant="outlined">
                Add Holidays
              </YearlyBtn>
            </ItemPara>
          </Grid>
          <Grid item xs={12} md={9}>
            <div className="date-range">
              <label className="hol-label">Start Range</label>
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
              <label className="hol-label">End Range</label>
              <LightTooltip title="End Range" placement="top">
                <TextField
                  sx={{
                    marginRight: "20px",
                  }}
                  size="small"
                  type="date"
                  variant="outlined"
                  inputProps={{
                    min: getformattedDate(dateRange.start_date),
                  }}
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
              <YearlyBtn variant="outlined" onClick={init}>
                Apply
              </YearlyBtn>
            </div>
          </Grid>
          {/* Holidays Mapping*/}
          {holidays.map((hol, index) => (
            <div className="view-holidays">
              Date: {hol.date.split("T")[0]}
              <br />
              <br />
              <span>Reason: {hol.name}</span>
            </div>
          ))}
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
                onClick={preHolidayPage}
              >
                Pre
              </StyButton>
              <StyButton
                size="small"
                variant="outlined"
                onClick={nextHolidayPage}
              >
                Next
              </StyButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Holidays;
