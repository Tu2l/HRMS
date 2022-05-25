import { Bank } from "../model/Bank.js";
import { Employee } from "../model/Employee.js";

// Add Bank
export const addBank = async (req, res) => {
  const out = {};
  try {
    var { emp_id, bankname, branch, account_no, ifsc, pan_number, uan } =
      req.body;

    //Checking for fill up
    if (!emp_id || !bankname || !branch || !account_no || !ifsc || !pan_number)
      return Error("Missing Field!");

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments();
    if (emp_check == 0) throw Error("Invalid emp_id");

    const accountCheck = await Bank.find({
      $and: [{ account_no: { $exists: true } }, { account_no: account_no }],
    }).countDocuments();

    if (accountCheck) throw Error("Acount already exists");

    const bank = new Bank({
      emp_id: emp_id,
      bankname: bankname,
      branch: branch,
      account_no: account_no,
      ifsc: ifsc,
      esic: req.body.esic || "NA",
      pan_number: pan_number,
      uan: uan || "NA",
    });

    await bank.save();
    out.message = "success";
    out.error = false;
    out.data = bank;
  } catch (error) {
    out.message = error.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

// Details of bank with employee id
export const getBankDetails = async (req, res) => {
  const out = {};
  try {
    const emp_id = req.body.emp_id;
    if (!emp_id) throw Error("emp_id is required");

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments();
    if (emp_check == 0) throw Error("Invalid emp_id");

    out.message = "success";
    out.error = false;
    out.data = await Bank.findOne({ emp_id: emp_id });
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

// Update Bank details
export const updateBankDetails = async (req, res) => {
  const out = {};
  try {
    const value = {};
    const emp_id = req.body.emp_id;

    if (!emp_id) throw Error("Employee id required!");

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments();
    if (emp_check == 0) throw Error("Invalid emp_id");

    value.emp_id = emp_id;

    if (req.body.bankname) value.bankname = req.body.bankname;

    if (req.body.branch) value.branch = req.body.branch;

    if (req.body.account_no) value.account_no = req.body.account_no;

    if (req.body.ifsc) value.ifsc = req.body.ifsc;

    if (req.body.pan_number) value.pan_number = req.body.pan_number;

    if (req.body.uan) value.uan = req.body.uan;

    if (req.body.esic) value.esic = req.body.esic;

    const updatedResult = await Bank.updateOne(
      { emp_id: emp_id },
      { $set: value }
    );
    out.message = "success";
    out.error = false;
    out.data = updatedResult;
  } catch (error) {
    out.message = error.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};
