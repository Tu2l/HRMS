import mongoose from "mongoose";

const additional = new mongoose.Schema({
  name: { type: String, required: [true, "Incentive name is required"] },
  amount: { type: Number, required: [true, "Incentive amount is required"] },
});

const salarySchema = new mongoose.Schema({
  emp_id: { type: String, required: true },
  basic_pay: { type: Number, required: [true, "Basic pay amount is required"] },
  hra: { type: Number, required: [true, "HRA amount is required"] },
  gross_monthly_salary: {
    type: Number,
    required: [true, "Gross salary is required"],
  },
  net_salary: { type: Number, required: [true, "Net salary is required"] },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  annual_ctc: { type: Number },
  monthly_ctc: { type: Number },
  total_deductions: { type: Number },
  no_of_days: { type: Number },
  total_unpaid_leaves: { type: Number },
  late_days: { type: Number },
  addition: { type: [additional], required: true, default: [] },
  deductions: { type: [additional], required: true, default: [] }, //pf,pt, tds
  allowance: { type: [additional], required: true, default: [] },
});

export const Salary = mongoose.model("Salary", salarySchema);
