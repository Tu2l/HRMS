import { Employee } from "../model/Employee.js";
import crypto from "crypto";

export const changeServiceStatus = async (req, res) => {
  const out = {};
  try {
    const emp_id = req.body.emp_id;
    if (!emp_id) throw Error("id is required");

    if (!req.body.status) throw Error("status is required");

    const status = parseInt(req.body.status);

    out.message = "success";
    out.error = false;
    out.data = await Employee.updateOne(
      { emp_id: emp_id },
      { $set: { status: status } }
    );
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

//login
export const login = async (req, res) => {
  const out = {};
  try {
    //checking if the an employee exist with the email id
    const conditions = [];
    conditions.push({ email: req.body.email });
    if (req.body.userType) conditions.push({ userType: req.body.userType });

    const userCheck = await Employee.findOne({ $and: conditions });

    if (userCheck) {
      //check the status of the user
      if (
        await Employee.findOne({
          $and: [{ status: { $in: [1, 2] } }, { email: userCheck.email }],
        })
      ) {
        throw Error("Login Access Denied!");
      }

      //passsword checking
      //hashing plain  text password
      const hash = crypto
        .createHmac("sha256", req.body.email)
        .update(req.body.password)
        .digest("hex");
      if (hash.toString().localeCompare(userCheck.password) === 0) {
        out.message = "success";
        out.error = false;
        out.data = userCheck;
      } else throw Error("Wrong password");
    } else throw Error("User not found");
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

//register
export const register = async (req, res) => {
  const out = {};
  try {
    /*generating emp_id based on last emp_id if there is no employee exist then 1 will be used as default emp_id
        emp_id format : GT/[Serial Number]/[Last two digit of the current year]
        */
    const last_emp = await Employee.find().sort({ _id: -1 }).limit(1);
    var num = 1;
    if (last_emp.length > 0) {
      num = parseInt(last_emp[0].emp_id.split("/")[1]);
      num += 1;
    }
    const date = new Date();
    let year = date.getFullYear();
    const emp_id =
      "GT/" +
      (num <= 9
        ? "000" + num
        : num <= 99
        ? "00" + num
        : num <= 999
        ? "0" + num
        : num) +
      "/" +
      year.toString().substring(2);

    //elements for password hasing
    const passName = req.body.name.substring(0, 3 + 1).toUpperCase();
    const passYear = req.body.dob.split("-")[0];

    //hashing plain  text password
    const hash = crypto
      .createHmac("sha256", req.body.email)
      .update(passName + passYear)
      .digest("hex");

    //checking if the an employee already exist with the same email id
    const userCheck = await Employee.find(
      {
        $and: [{ email: { $exists: true } }, { email: req.body.email }],
      },
      [req.body.email]
    ).limit(1);
    // console.log(userCheck)

    if (userCheck.length > 0) throw Error("Email already registered");

    const emp = new Employee({
      emp_id: emp_id.toString(),
      email: req.body.email,
      password: hash,
      name: req.body.name,
      phone: req.body.phone,
      dob: req.body.dob,
      designation: req.body.designation,
      department: req.body.department,
      join_date: req.body.join_date,
      status: req.body.status,
    });

    await emp.save();
    out.message = "success";
    out.error = false;
    out.data = emp;
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

//change Password
export const changePassword = async (req, res) => {
  const out = {};
  try {
    const emp_id = req.body.emp_id;
    if (!emp_id) throw Error("id is required");

    const userCheck = await Employee.findOne({ emp_id: emp_id });

    if (userCheck) {
      //passsword checking
      const hash = crypto
        .createHmac("sha256", userCheck.email)
        .update(req.body.password)
        .digest("hex");
      if (hash.toString().localeCompare(userCheck.password) === 0) {
        const newHashPassword = crypto
          .createHmac("sha256", userCheck.email)
          .update(req.body.newPassword)
          .digest("hex");

        out.message = "success";
        out.error = false;
        out.data = await Employee.updateOne(
          { emp_id: userCheck.emp_id },
          { $set: { password: newHashPassword } }
        );
      } else throw Error("Wrong Old password");
    } else throw Error("User not found");
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};
