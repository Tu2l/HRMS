import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Modal,
  Avatar,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  style3,
  styleGrid,
  ButtonPara,
  YearlyBtn,
  DltBtn,
  style,
  StyTextFieldLeave,
} from "../css/styles";
import "../css/profile.css";
import avatar from "../../images/proavatar.png";
import "../css/ViewProfile.css";
import swal from "sweetalert";
import Select from "@mui/material/Select";

function ViewProfile({ emp_id }) {
  const [userProfile, setUserProfile] = useState("");
  const data_ = JSON.parse(localStorage.getItem("data"));

  async function getUserDetails(emp_id) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/user/get"
      : "/user/get";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
      }),
    });
    return response;
  }

  const [openAddbankForm, setOpenAddbankForm] = React.useState(false);
  const [openUpdateForm, setOpenUpdateForm] = React.useState(false);
  const [openUpdateAddress, setOpenUpdateAddress] = React.useState(false);
  const [openMoreDetails, setOpenMoreDetails] = React.useState(false);

  const handleOpenAddbankForm = () => setOpenAddbankForm(true);
  const handleCloseAddbankForm = () => setOpenAddbankForm(false);

  const handleOpenUpdateForm = () => setOpenUpdateForm(true);
  const handleCloseUpdateForm = () => setOpenUpdateForm(false);

  const handleOpenUpdateAddress = () => setOpenUpdateAddress(true);
  const handleCloseUpdateAddress = () => setOpenUpdateAddress(false);

  const handleOpenMoreDetails = () => setOpenMoreDetails(true);
  const handleCloseMoreDetails = () => setOpenMoreDetails(false);

  // Submit handler for adding bank details

  const [bankname, setBankname] = useState("");
  const [branch, setBranch] = useState("");
  const [account_no, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan_number, setPan] = useState("");
  const [uan, setUAN] = useState("");
  const [esic, setEsic] = useState("");

  let handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const AddURL = window.location.href.startsWith("http://localhost")
        ? "http://localhost:5000/api/bank/add"
        : "/api/bank/add";

      let res = await fetch(AddURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: userProfile.emp_id,
          bankname: bankname,
          branch: branch,
          account_no: account_no,
          ifsc: ifsc,
          pan_number: pan_number,
          esic: esic,
          uan: uan,
        }),
      });

      let resjson = await res.json();
      if (res.status === 200) {
        setBankname("");
        setBranch("");
        setAccount("");
        setIfsc("");
        setPan("");
        setEsic("");
        setUAN("");
        handleCloseAddbankForm();
        swal(resjson.message.toUpperCase());
      } else {
        swal("Failed");
      }
    } catch (err) {
      console.log(err);
    }
    init();
  };

  /* Update Bank Details */
  const [bankNameUpdate, setBankNameUpdate] = useState("");
  const [branchUpdate, setBranchUpdate] = useState("");
  const [bankaccountUpdate, setBankAccountUpdate] = useState("");
  const [bankifscUpdate, setBankIfscUpdate] = useState("");
  const [panUpdate, setPanUpdate] = useState("");
  const [uanUpdate, setUANUpdate] = useState("");
  const [esicUpdate, setEsicUpdate] = useState("");

  let handleUpdateBank = async (e) => {
    e.preventDefault();
    try {
      const AddURL = window.location.href.startsWith("http://localhost")
        ? "http://localhost:5000/api/bank/update"
        : "/api/bank/update";

      let res = await fetch(AddURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: userProfile.emp_id,
          bankname: bankNameUpdate,
          branch: branchUpdate,
          account_no: bankaccountUpdate,
          ifsc: bankifscUpdate,
          pan_number: panUpdate,
          esic: esicUpdate,
          uan: uanUpdate,
        }),
      });

      let resjson = await res.json();
      if (res.status === 200) {
        setBankNameUpdate("");
        setBranchUpdate("");
        setBankAccountUpdate("");
        setBankIfscUpdate("");
        setPanUpdate("");
        setUANUpdate("");
        setEsicUpdate("");
        handleCloseUpdateForm();
        swal(resjson.message.toUpperCase());
      } else {
        swal("Failed");
      }
    } catch (err) {
      console.log(err);
    }
    init();
  };

  /* get detail of bank */

  const [empBankData, setEmpBankData] = useState({});
  async function getBankDetails(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/bank/get"
      : "/api/bank/get";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  //get address

  const [getCurrentAddress, setGetCurrentAddress] = useState();
  const [getPermanentAddress, setGetPermanentAddress] = useState();

  async function getUserAddress(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/address/get"
      : "/api/address/get";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  const [storePersonalDetails, setStorePersonalDetails] = useState();

  async function getPersonalDetails(data) {
    const URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/profile/get"
      : "/api/profile/get";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async function init() {
    if (emp_id) {
      await getUserDetails(emp_id)
        .then((response) => response.json())
        .then((data) => {
          if (data.data != null) {
            setUserProfile(data.data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    const dataBank = {
      emp_id: emp_id,
    };

    getBankDetails(dataBank)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) setEmpBankData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const currentAddressData = {
      emp_id: emp_id,
      address_type: "1",
    };

    const permanentAddressData = {
      emp_id: emp_id,
      address_type: "2",
    };

    getUserAddress(currentAddressData)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setGetCurrentAddress(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getUserAddress(permanentAddressData)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setGetPermanentAddress(data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getPersonalDetails(dataBank)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) setStorePersonalDetails(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // update Address States

  const [updateAddress, setUpdateAddress] = useState("");
  const [updateCity, setUpdateCity] = useState("");
  const [updateDistrict, setUpdateDistrict] = useState("");
  const [updateBlock, setUpdateBlock] = useState("");
  const [updateState, setUpdateState] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");
  const [updateZipcode, setUpdateZipcode] = useState("");
  const [updateAddressType, setUpdateAddressType] = useState("");

  const handleChangeUpdateAddressType = (event) => {
    setUpdateAddressType(event.target.value);
  };

  //Update Address

  let handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const AddURL = window.location.href.startsWith("http://localhost")
        ? "http://localhost:5000/api/address/update"
        : "/api/address/update";

      let res = await fetch(AddURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: userProfile.emp_id,
          address: updateAddress,
          city: updateCity,
          district: updateDistrict,
          block: updateBlock,
          state: updateState,
          phone: updatePhone,
          zip_code: updateZipcode,
          address_type: updateAddressType,
        }),
      });

      let resjson = await res.json();
      // console.log(resjson)

      if (!resjson.error) {
        setUpdateAddress("");
        setUpdateCity("");
        setUpdateDistrict("");
        setUpdateBlock("");
        setUpdateState("");
        setUpdatePhone("");
        setUpdateZipcode("");
        setUpdateAddressType("");
        handleCloseUpdateAddress();
        swal(resjson.message.toUpperCase());
      } else {
        swal(resjson.message);
      }
    } catch (err) {
      console.log(err);
    }
    init();
  };

  //Add More Personal Details

  const [moreQualification, setMoreQualification] = useState("");
  const [moreFather, setMoreFather] = useState("");
  const [moreGender, setMoreGender] = useState("");
  const [moreMarital, setMoreMarital] = useState("");
  const [moreAadhar, setMoreAadhar] = useState("");

  const handleChangeGender = (event) => {
    setMoreGender(event.target.value);
  };

  const handleChangeMarital = (event) => {
    setMoreMarital(event.target.value);
  };

  let handleMoreDetails = async (e) => {
    e.preventDefault();
    try {
      const AddURL = window.location.href.startsWith("http://localhost")
        ? "http://localhost:5000/api/profile/update"
        : "/api/profile/update";

      let res = await fetch(AddURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: userProfile.emp_id,
          qualification: moreQualification,
          father_name: moreFather,
          gender: moreGender,
          marital: moreMarital,
          aadhar_number: moreAadhar,
        }),
      });

      let resjson = await res.json();

      if (!resjson.error) {
        setMoreQualification("");
        setMoreFather("");
        setMoreGender("");
        setMoreMarital("");
        setMoreAadhar("");
        handleCloseMoreDetails();
        swal(resjson.message.toUpperCase());
      } else {
        swal(resjson.message);
      }
    } catch (err) {
      console.log(err);
    }
    init();
  };

  //Upload files

  const fileInputRef = useRef();
  const fileInputRefCV = useRef();
  const fileInputRefApp = useRef();

  const fileUpload = () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[id="profileImageUpload"]');

    formData.append("emp_id", data_.emp_id);
    formData.append("file", fileField.files[0]);

    fetch("http://localhost:5000/api/upload/profile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          swal("Uploaded");
        } else {
          swal(result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const CVUpload = () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[id="CVUpload"]');

    formData.append("emp_id", data_.emp_id);
    formData.append("file", fileField.files[0]);

    fetch("http://localhost:5000/api/upload/cv", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          swal("Uploaded");
        } else {
          swal(result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const appointmentUpload = () => {
    const formData = new FormData();
    const fileField = document.querySelector('input[id="appointmentUpload"]');

    formData.append("emp_id", data_.emp_id);
    formData.append("file", fileField.files[0]);

    fetch("http://localhost:5000/api/upload/appointment", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          swal("Uploaded");
        } else {
          swal(result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getFileUrl = (path) => {
    return "http://" + path;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => init(), []);
  return (
    <div className="for-margin">
      {/* Update Address */}

      <div>
        <Modal open={openUpdateAddress} onClose={handleCloseUpdateAddress}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleUpdateAddress}>
                <FormControl
                  size="small"
                  className="select-status"
                  sx={{ marginBottom: "12px" }}
                >
                  <InputLabel>Address Type</InputLabel>
                  <Select
                    value={updateAddressType}
                    label="Address Type"
                    onChange={handleChangeUpdateAddressType}
                  >
                    <MenuItem value="1">Current Address</MenuItem>
                    <MenuItem value="2">Permanent Address</MenuItem>
                  </Select>
                </FormControl>
                <StyTextFieldLeave
                  value={updateAddress}
                  label="Address"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateAddress(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updateCity}
                  label="City"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateCity(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updateDistrict}
                  label="District"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateDistrict(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updateBlock}
                  label="Block"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateBlock(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updateState}
                  label="State"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateState(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updatePhone}
                  label="Phone"
                  size="small"
                  inputProps={{
                    minLength: "10",
                    maxLength: "10",
                  }}
                  variant="outlined"
                  onChange={(e) => setUpdatePhone(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={updateZipcode}
                  label="Zip Code"
                  inputProps={{
                    minLength: "6",
                    maxLength: "6",
                  }}
                  size="small"
                  variant="outlined"
                  onChange={(e) => setUpdateZipcode(e.target.value)}
                  fullWidth
                />
                <br />
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
                    onClick={handleCloseUpdateAddress}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/*  Add Bank Account Modal  */}

      <Modal open={openAddbankForm} onClose={handleCloseAddbankForm}>
        <Box sx={style}>
          <center>
            <form onSubmit={handleOnSubmit}>
              <StyTextFieldLeave
                value={bankname}
                onChange={(e) => setBankname(e.target.value)}
                label="Bank Name"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                label="Branch"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                value={account_no}
                onChange={(e) => setAccount(e.target.value)}
                label="Account Number"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                label="IFSC"
                size="small"
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                value={pan_number}
                onChange={(e) => setPan(e.target.value)}
                label="PAN Number"
                size="small"
                inputProps={{
                  minLength: "10",
                  maxLength: "10",
                }}
                variant="outlined"
                fullWidth
                required
              />
              <StyTextFieldLeave
                value={esic}
                onChange={(e) => setEsic(e.target.value)}
                label="ESIC"
                size="small"
                variant="outlined"
                fullWidth
              />
              <StyTextFieldLeave
                value={uan}
                onChange={(e) => setUAN(e.target.value)}
                label="UAN"
                size="small"
                variant="outlined"
                fullWidth
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
                Add
              </YearlyBtn>
              <DltBtn
                size="small"
                variant="outlined"
                color="error"
                onClick={handleCloseAddbankForm}
              >
                Cancel
              </DltBtn>
            </form>
          </center>
        </Box>
      </Modal>

      {/* Update Bank Details */}

      <div>
        <Modal open={openUpdateForm} onClose={handleCloseUpdateForm}>
          <Box sx={style}>
            <center>
              <form onSubmit={handleUpdateBank}>
                <StyTextFieldLeave
                  value={bankNameUpdate}
                  label="Bank Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setBankNameUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={branchUpdate}
                  label="Branch Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setBranchUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={bankaccountUpdate}
                  label="Account Number"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setBankAccountUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={bankifscUpdate}
                  size="small"
                  label="IFSC"
                  variant="outlined"
                  onChange={(e) => setBankIfscUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={panUpdate}
                  size="small"
                  inputProps={{
                    minLength: "10",
                    maxLength: "10",
                  }}
                  label="PAN Number"
                  variant="outlined"
                  onChange={(e) => setPanUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={esicUpdate}
                  size="small"
                  label="ESIC"
                  variant="outlined"
                  onChange={(e) => setEsicUpdate(e.target.value)}
                  fullWidth
                />
                <StyTextFieldLeave
                  value={uanUpdate}
                  onChange={(e) => setUANUpdate(e.target.value)}
                  label="UAN"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
                <br />
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
                    onClick={handleCloseUpdateForm}
                  >
                    Cancel
                  </DltBtn>
                </div>
              </form>
            </center>
          </Box>
        </Modal>
      </div>

      {/* More Details /Update Profile */}

      <Modal open={openMoreDetails} onClose={handleCloseMoreDetails}>
        <Box sx={style}>
          <center>
            <form onSubmit={handleMoreDetails} style={{ paddingTop: "3%" }}>
              <StyTextFieldLeave
                defaultValue={
                  storePersonalDetails && storePersonalDetails.qualification
                }
                onChange={(e) => setMoreQualification(e.target.value)}
                label="Qualification"
                size="small"
                variant="outlined"
                fullWidth
              />
              <StyTextFieldLeave
                defaultValue={
                  storePersonalDetails && storePersonalDetails.father_name
                }
                type="text"
                onChange={(e) => setMoreFather(e.target.value)}
                label="Father Name"
                size="small"
                variant="outlined"
                fullWidth
              />
              <FormControl
                defaultValue={
                  storePersonalDetails && storePersonalDetails.gender
                }
                size="small"
                className="select-status"
                sx={{ marginBottom: "12px" }}
                required
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  defaultValue={
                    storePersonalDetails && storePersonalDetails.gender
                  }
                  label="Address Type"
                  onChange={handleChangeGender}
                >
                  <MenuItem value="1">Male</MenuItem>
                  <MenuItem value="2">Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                size="small"
                className="select-status"
                sx={{ marginBottom: "12px" }}
                required
              >
                <InputLabel>Marital Status</InputLabel>
                <Select
                  defaultValue={
                    storePersonalDetails && storePersonalDetails.marital
                  }
                  label="Address Type"
                  onChange={handleChangeMarital}
                >
                  <MenuItem value="1">Married</MenuItem>
                  <MenuItem value="2">Un-Married</MenuItem>
                </Select>
              </FormControl>
              <StyTextFieldLeave
                defaultValue={
                  storePersonalDetails && storePersonalDetails.aadhar_number
                }
                type="text"
                inputProps={{
                  minLength: "12",
                  maxLength: "12",
                }}
                onChange={(e) => setMoreAadhar(e.target.value)}
                label="Aadhar Number"
                size="small"
                variant="outlined"
                fullWidth
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
                Update
              </YearlyBtn>
              <DltBtn
                size="small"
                variant="outlined"
                color="error"
                onClick={handleCloseMoreDetails}
              >
                Cancel
              </DltBtn>
            </form>
          </center>
        </Box>
      </Modal>

      <Box style={style3}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <center>
              <Avatar
                className="profile-image"
                sx={{ height: "160px", width: "160px", marginTop: "18px" }}
                alt="profile_image"
                src={
                  userProfile.profile_img
                    ? "http://" + userProfile.profile_img
                    : avatar
                }
              />
              <br hidden={data_.emp_id !== emp_id} />
              <div className="profile-image" hidden={data_.emp_id !== emp_id}>
                <StyTextFieldLeave
                  sx={{ width: "20%" }}
                  size="small"
                  multiple={false}
                  ref={fileInputRef}
                  id="profileImageUpload"
                  type="file"
                />
                <br />
                <YearlyBtn
                  type="button"
                  variant="outlined"
                  onClick={fileUpload}
                >
                  Upload
                </YearlyBtn>
              </div>
              <h1 className="name">{userProfile.name}</h1>
              <h4 className="id">{userProfile.emp_id}</h4>
            </center>
          </Grid>
        </Grid>
        <Grid container style={styleGrid} sx={{ marginBottom: "-3%" }}>
          <Grid item xs={12} sm={12} md={12} hidden={data_.emp_id === emp_id}>
            <YearlyBtn
              disabled={userProfile.cv_file == null}
              href={getFileUrl(userProfile.cv_file)}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
            >
              View CV
            </YearlyBtn>
          </Grid>
          <Grid item xs={12} sm={12} md={12} hidden={data_.emp_id === emp_id}>
            <YearlyBtn
              disabled={userProfile.appointment_file == null}
              href={getFileUrl(userProfile.appointment_file)}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
            >
              View Appointment File
            </YearlyBtn>
          </Grid>
        </Grid>
        <h3 className="header-profile">Personal Details</h3>
        {/* Add/ Edit Buttons */}
        <Grid container spacing={0} sx={{ paddingBottom: "18px" }}>
          <Grid item xs={12} sm={12} md={3} hidden={data_.emp_id !== emp_id}>
            <ButtonPara>
              <YearlyBtn onClick={handleOpenMoreDetails} variant="outlined">
                Add More Details
              </YearlyBtn>
            </ButtonPara>
          </Grid>
        </Grid>
        <Grid container style={styleGrid}>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Name</h4>
              <p>{userProfile.name}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Phone</h4>
              <p>{userProfile.phone}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Email</h4>
              <p>{userProfile.email}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>DOB</h4>
              <p>{userProfile.dob}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Designation</h4>
              <p>{userProfile.designation}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Department</h4>
              <p>{userProfile.department}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Joining Date</h4>
              <p>{userProfile ? userProfile.join_date.split("T")[0] : "NA"}</p>
            </div>
          </Grid>
          <>
            <Grid item xs={12} sm={6} md={4}>
              <div className="data">
                <h4>Father Name</h4>
                <p>
                  {storePersonalDetails
                    ? storePersonalDetails.father_name
                    : "NA"}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="data">
                <h4>Qualification</h4>
                <p>
                  {storePersonalDetails
                    ? storePersonalDetails.qualification
                    : "NA"}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="data">
                <h4>Gender</h4>
                <p>
                  {storePersonalDetails
                    ? storePersonalDetails.gender === 1
                      ? "Male"
                      : "Female"
                    : "NA"}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div className="data">
                <h4>Marital Status</h4>
                <p>
                  {storePersonalDetails
                    ? storePersonalDetails.marital === 1
                      ? "Married"
                      : "Un-Married"
                    : "NA"}
                </p>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <div className="data">
                <h4>Aadhar Number</h4>
                <p>
                  {storePersonalDetails
                    ? storePersonalDetails.aadhar_number
                    : "NA"}
                </p>
              </div>
            </Grid>
          </>
        </Grid>
        {/* Add/ Update Buttons */}
        <Grid container style={styleGrid}></Grid>
        <h3 className="header-profile">Address</h3>
        {/* Add/ Update Buttons */}
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={3} hidden={data_.emp_id !== emp_id}>
            <ButtonPara>
              <YearlyBtn onClick={handleOpenUpdateAddress} variant="outlined">
                {!getCurrentAddress ? "ADD Address" : "UPDATE Address"}
              </YearlyBtn>
            </ButtonPara>
          </Grid>
        </Grid>
        <Grid container style={styleGrid}>
          <Grid item xs={12} sm={12} md={12}>
            <div className="data">
              <h4 style={{ fontSize: "19px" }}>Current Address</h4>
            </div>
          </Grid>
          <>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Address</h4>
                <p>{getCurrentAddress ? getCurrentAddress.address : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Block</h4>
                <p>{getCurrentAddress ? getCurrentAddress.block : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>City</h4>
                <p>{getCurrentAddress ? getCurrentAddress.city : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>District</h4>
                <p>{getCurrentAddress ? getCurrentAddress.district : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Phone</h4>
                <p>{getCurrentAddress ? getCurrentAddress.phone : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>State</h4>
                <p>{getCurrentAddress ? getCurrentAddress.state : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>ZIP Code</h4>
                <p>{getCurrentAddress ? getCurrentAddress.zip_code : "NA"}</p>
              </div>
            </Grid>
          </>
        </Grid>
        <Grid container style={styleGrid}>
          <Grid item xs={12} sm={12} md={12}>
            <div className="data">
              <h4 style={{ fontSize: "19px" }}>Permanent Address</h4>
            </div>
          </Grid>
          <>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Address</h4>
                <p>
                  {getPermanentAddress ? getPermanentAddress.address : "NA"}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Block</h4>
                <p>{getPermanentAddress ? getPermanentAddress.block : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>City</h4>
                <p>{getPermanentAddress ? getPermanentAddress.city : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>District</h4>
                <p>
                  {getPermanentAddress ? getPermanentAddress.district : "NA"}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>Phone</h4>
                <p>{getPermanentAddress ? getPermanentAddress.phone : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>State</h4>
                <p>{getPermanentAddress ? getPermanentAddress.state : "NA"}</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="data">
                <h4>ZIP Code</h4>
                <p>
                  {getPermanentAddress ? getPermanentAddress.zip_code : "NA"}
                </p>
              </div>
            </Grid>
          </>
        </Grid>
        <h3 className="header-profile">Bank Details</h3>
        {/* Add/ Update Buttons */}
        <Grid container spacing={0} sx={{ paddingBottom: "18px" }}>
          <Grid item xs={12} sm={12} md={3} hidden={data_.emp_id !== emp_id}>
            <ButtonPara>
              <YearlyBtn
                onClick={handleOpenAddbankForm}
                variant="outlined"
                disabled={empBankData._id == null ? false : true}
              >
                Add Details
              </YearlyBtn>
            </ButtonPara>
          </Grid>
          <Grid item xs={12} sm={12} md={3} hidden={data_.emp_id !== emp_id}>
            <ButtonPara>
              <YearlyBtn
                onClick={handleOpenUpdateForm}
                variant="outlined"
                disabled={empBankData._id != null ? false : true}
              >
                Update Details
              </YearlyBtn>
            </ButtonPara>
          </Grid>
        </Grid>
        <Grid container style={styleGrid}>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Bank Name</h4>
              <p>{empBankData.bankname ? empBankData.bankname : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Branch</h4>
              <p>{empBankData.branch ? empBankData.branch : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>Account No.</h4>
              <p>{empBankData.account_no ? empBankData.account_no : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>IFSC</h4>
              <p>{empBankData.ifsc ? empBankData.ifsc : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>PAN</h4>
              <p>{empBankData.pan_number ? empBankData.pan_number : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>ESIC</h4>
              <p>{empBankData.esic ? empBankData.esic : "NA"}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="data">
              <h4>UAN</h4>
              <p>{empBankData.uan ? empBankData.uan : "NA"}</p>
            </div>
          </Grid>
        </Grid>
        <h3 hidden={data_.emp_id !== emp_id} className="header-profile">
          Upload Section
        </h3>
        <Grid container style={styleGrid}>
          <Grid item xs={12} sm={6} md={6} hidden={data_.emp_id !== emp_id}>
            <div className="data">
              <h4>Upload Resume/ CV</h4>
            </div>
            <StyTextFieldLeave
              size="small"
              inputProps={{
                accept: ".pdf",
              }}
              multiple={false}
              ref={fileInputRefCV}
              id="CVUpload"
              helperText="(.pdf)"
              type="file"
            />
            <YearlyBtn
              sx={{ marginLeft: "6px", marginTop: "2px" }}
              type="button"
              variant="outlined"
              onClick={CVUpload}
            >
              Upload
            </YearlyBtn>
            <br />
            <YearlyBtn
              disabled={userProfile.cv_file == null ? true : false}
              href={getFileUrl(userProfile.cv_file)}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
            >
              View CV
            </YearlyBtn>
          </Grid>
          <Grid item xs={12} sm={6} md={6} hidden={data_.emp_id !== emp_id}>
            <div className="data">
              <h4>Upload Appointment</h4>
            </div>
            <StyTextFieldLeave
              size="small"
              multiple={false}
              inputProps={{
                accept: ".pdf",
              }}
              ref={fileInputRefApp}
              id="appointmentUpload"
              helperText="(.pdf)"
              type="file"
            />
            <YearlyBtn
              sx={{ marginLeft: "6px", marginTop: "2px" }}
              type="button"
              variant="outlined"
              onClick={appointmentUpload}
            >
              Upload
            </YearlyBtn>
            <br />
            <YearlyBtn
              disabled={userProfile.appointment_file == null ? true : false}
              href={getFileUrl(userProfile.appointment_file)}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
            >
              View Appointment File
            </YearlyBtn>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default ViewProfile;
