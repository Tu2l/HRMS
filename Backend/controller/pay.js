import { Pay } from "../model/Salary/Pay.js";
import { Employee } from "../model/Employee.js";

export const addPay = async (req, res) => {
  const out = {};
  try {
    var { emp_id, basic_pay, hra } = req.body;

    //Checking for fill up
    if (!emp_id || !basic_pay || !hra) return Error("Missing Field!");

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments();
    if (emp_check == 0) throw Error("Invalid emp_id");

    const check = await Pay.find({ emp_id: emp_id }).countDocuments();

    const deductions = [];

    const pf = {};
    pf.name = "PF";
    pf.amount = req.body.pf;
    deductions.push(pf);

    const tds = {};
    tds.name = "TDS";
    tds.amount = req.body.tds;
    deductions.push(tds);

    const pt = {};
    pt.name = "Professional Tax";
    pt.amount = req.body.pt;
    deductions.push(pt);

    if (!pf.amount || !pt.amount || !tds.amount)
      throw new Error("Amount is missing!");

    const additions = [];
    //conveyance 0
    additions.push({
      name: "Conveyance",
      amount: parseInt(req.body.conveyance) || 0,
    });
    //special allowance 1
    additions.push({
      name: "Special Allowance",
      amount: parseInt(req.body.special_allowance) || 0,
    });
    //performance allowance 2
    additions.push({
      name: "Performance Allowance",
      amount: parseInt(req.body.performance_allowance) || 0,
    });

    //bonus 3
    additions.push({
      name: "Bonus",
      amount: parseInt(req.body.bonus) || 0,
    });

    //salary advance 0 || optional
    deductions.push({
      name: "Salary Advance",
      amount: parseInt(req.body.salary_advance) || 0,
    });


    if (check > 0) throw Error("Pay details already exists for this employee");

    const pay = new Pay({
      emp_id: emp_id,
      basic_pay: basic_pay,
      hra: hra,
      deductions: deductions,
      addition: additions,
      epf: req.body.epf || 0,
      esic: req.body.esic || 0,
    });

    await pay.save();
    out.message = "success";
    out.error = false;
    out.data = pay;
  } catch (error) {
    out.message = error.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

// Update Bank details
export const updatePay = async (req, res) => {
  const out = {};
  try {
    const deductions = [];
    const additions = [];
    const value = {};
    const emp_id = req.body.emp_id;

    if (!emp_id) throw Error("Employee id required!");

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments();
    if (emp_check === 0) throw Error("Invalid emp_id");

    const pay_check = await Pay.findOne({ emp_id: emp_id }, ['deductions', 'addition']);

    pay_check.deductions.forEach((deduction) => {
      deductions.push({
        name: deduction.name,
        amount: deduction.amount,
      });
    });

    pay_check.addition.forEach((add) => {
      additions.push({
        name: add.name,
        amount: add.amount,
      });
    });


    value.emp_id = emp_id;

    if (req.body.basic_pay) value.basic_pay = req.body.basic_pay;

    if (req.body.hra) value.hra = req.body.hra;

    if (req.body.epf) value.epf = req.body.epf;

    if (req.body.esic) value.esic = req.body.esic;


    //deductions
    if (req.body.pf) deductions[0].amount = req.body.pf;

    if (req.body.tds) deductions[1].amount = req.body.tds;

    if (req.body.pt) deductions[2].amount = req.body.pt;

    if (req.body.salary_advance) deductions[3].amount = req.body.salary_advance;


    //additions
    if (req.body.conveyance) additions[0].amount = req.body.conveyance;

    if (req.body.special_allowance) additions[1].amount = req.body.special_allowance;

    if (req.body.performance_allowance) additions[2].amount = req.body.performance_allowance;

    if (req.body.bonus) additions[3].amount = req.body.bonus;

    value.deductions = deductions;
    value.addition = additions;

    // console.log(value);
    const updatedResult = await Pay.updateOne({ emp_id: emp_id }, { $set: value })
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

// Details of bank with employee id
export const getPayDetails = async (req, res) => {
  const out = {};
  try {
    const emp_id = req.body.emp_id;
    if (!emp_id) throw Error("emp_id is required");

    const emp_check = await Employee.findOne({
      emp_id: emp_id,
    }).countDocuments();
    if (emp_check == 0) throw Error("Invalid emp_id");

    const payCheck = await Pay.findOne({ emp_id: emp_id });

    out.message = "success";
    out.error = false;
    out.data = payCheck;
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};

export const getEmpPay = async (req, res) => {
  const out = {};
  try {
    const query = req.body.query
    const conditions = []
    if (query) {
      conditions.push({
        name: {
          $regex: query,
          $options: "i",
        }
      })
    }

    conditions.push({ status: { $in: (req.body.status ? [req.body.status] : [0, 3, 4]) } })

    const pageNumber = parseInt(req.body.current_page) || 1;
    const itemPerPage = 10;

    const total = await Employee.find({ $and: conditions }).countDocuments();

    const result = await Employee.find({ $and: conditions },
      [
        "emp_id",
        "name",
        "designation",
        "department",
        "profile_img",
      ])
      .sort({ name: "asc" })
      .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
      .limit(itemPerPage);

    const users = [];
    for (var i = 0; i < result.length; i++) {
      const user = { ...result[i]._doc };
      user.pay = await Pay.findOne({ emp_id: user.emp_id });
      users.push(user);
    }

    out.message = "success";
    out.error = false;
    out.current_page = pageNumber;
    out.item_perpage = itemPerPage;
    out.total_page = Math.ceil(total / itemPerPage);
    out.total_items =  total
    out.data = users;
  } catch (err) {
    out.message = err.message;
    out.error = true;
    out.data = null;
  } finally {
    //setting the output
    res.send(out);
  }
};
