import { useEffect, useState } from "react";
import "../css/style.css";
import logo from "../../images/logo-gratia.png";

function Payslip() {
  useEffect(() => {
    const params = window.location.href.split("?")[1].split("&");
    const emp_id = params[0]
      .substring(4, params[0].length)
      .replaceAll("_", "/");
    const month = params[1].substring(6, params[1].length);
    const year = params[2].substring(5, params[2].length);
    checkSalary(emp_id, month, year);
    checkEmployee(emp_id);
    checkBank(emp_id);
    checkPay(emp_id);
  }, []);

  const params = window.location.href.split("?")[1].split("&");
  const month = params[1].substring(6, params[1].length);
  const year = params[2].substring(5, params[2].length);

  const [emp, setEmp] = useState({});
  const [pay, setPay] = useState({});
  const [bank, setBank] = useState({});
  const [salary, setSalary] = useState({});

  //check for salary generated or not
  async function checkSalary(emp_id, month, year) {
    var URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/salary/get/byMonth"
      : "/api/salary/get/byMonth";

    let res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
        month: month,
        year: year,
      }),
    });

    let resjson = await res.json();

    if (!resjson.error) {
      setSalary(resjson.data);
    }
  }

  /* Get Bank Detail */

  async function checkBank(emp_id) {
    var URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/bank/get"
      : "/api/bank/get";

    let res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
      }),
    });

    let resjson = await res.json();

    if (!resjson.error) {
      setBank(resjson.data);
    }
  }

  /* Get Employee Detail */

  async function checkEmployee(emp_id) {
    var URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/user/get"
      : "/api/user/get";

    let res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
      }),
    });

    let resjson = await res.json();

    if (!resjson.error) {
      setEmp(resjson.data);
    }
  }

  /* Get Pay Detail */

  async function checkPay(emp_id) {
    var URL = window.location.href.startsWith("http://localhost")
      ? "http://localhost:5000/api/pay/hr/get"
      : "/api/pay/hr/get";

    let res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
      }),
    });

    let resjson = await res.json();

    if (!resjson.error) {
      setPay(resjson.data);
    }
  }

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

  return (
    <div>
      <div class="salary-slip">
        <table class="empDetail">
          <tr height="100px" className="main-head">
            <td colspan="4">
              <img alt="" height="90px" src={logo} />
              <p style={{ marginLeft: "4.5%" }}>
                <strong>
                  {getMonthName(month)}, {year}
                </strong>
              </p>
            </td>
            <td colspan="4" class="companyName">
              Gratia Technology Pvt. Ltd.
              <p className="comp-address">
                Shri Kamakhya Tower, 307, 3rd Floor. Near Sohum Shoppe
              </p>
              <p className="comp-address">Christian Basti, Ghy-781006</p>
            </td>
          </tr>
          <tr class="top border">
            <th colspan="3">Employee ID</th>
            <td class="myAlign">{salary.emp_id}</td>
            <th colspan="3">UAN</th>
            <td class="myAlign">{bank.uan}</td>
          </tr>

          <tr class="top">
            <th colspan="2">Name</th>
            <td></td>
            <td class="myAlign">{emp.name}</td>
            <th colspan="2">ESIC Number</th>
            <td></td>

            <td class="myAlign">{bank.esic}</td>
          </tr>

          <tr class="top">
            <th colspan="2">Designation</th>
            <td></td>
            <td class="myAlign">{emp.designation}</td>
            <th colspan="2">Bank Account</th>
            <td></td>

            <td class="myAlign">{bank.account_no}</td>
          </tr>

          <tr class="top">
            <th colspan="2">Working Days</th>
            <td></td>
            <td class="myAlign">{salary.no_of_days}</td>
            <th colspan="2">IFSC Code</th>
            <td></td>

            <td class="myAlign">{bank.ifsc}</td>
          </tr>

          <tr class="top">
            <th colspan="2">Leave Days</th>
            <td></td>
            <td class="myAlign">{salary.total_unpaid_leaves}</td>
            <th colspan="2">Late Coming Days</th>
            <td></td>

            <td class="myAlign">{salary.late_days}</td>
          </tr>

          <tr class="myBackground">
            <th colspan="2">Payments</th>
            <th></th>
            <th class="table-border-right">Amount (Rs.)</th>
            <th colspan="2">Deductions</th>
            <th></th>
            <th class="table-border-right">Amount (Rs.)</th>
          </tr>
          <tr>
            <th colspan="2">Basic</th>
            <td></td>
            <td class="myAlign">{salary.basic_pay}</td>
            <th colspan="2">PF</th>
            <td></td>

            <td class="myAlign">{getDeductionAmount(0)}</td>
          </tr>
          <tr>
            <th colspan="2">HRA</th>
            <td></td>

            <td class="myAlign">{salary.hra}</td>
            <th colspan="2">ESIC</th>
            <td></td>

            <td class="myAlign">{getDeductionAmount(6)}</td>
          </tr>
          <tr>
            <th colspan="2">Conveyance</th>
            <td></td>

            <td class="myAlign">{getAdditionAmount(0)}</td>
            <th colspan="2">Leave Days</th>
            <td></td>

            <td class="myAlign">{getDeductionAmount(4)}</td>
          </tr>
          <tr>
            <th colspan="2">Special Allowance</th>
            <td></td>
            <td class="myAlign">{getAdditionAmount(1)}</td>
            <th colspan="2">Late Coming Days</th>
            <td></td>
            <td class="myAlign">{getDeductionAmount(5)}</td>
          </tr>
          <tr>
            <th colspan="2">Gross Monthly Amount</th>
            <td></td>

            <td class="myAlign">{salary.gross_monthly_salary}</td>
            <th colspan="2">Professional Tax</th>
            <td></td>

            <td class="myAlign">{getDeductionAmount(2)}</td>
          </tr>
          <tr>
            <th colspan="2">Bonus</th>
            <td></td>
            <td class="myAlign">{getAdditionAmount(3)}</td>
            <th colspan="2">TDS</th>
            <td></td>
            <td class="myAlign">{getDeductionAmount(1)}</td>
          </tr>
          <tr>
            <th colspan="2">Performance Allowance</th>
            <td></td>
            <td class="myAlign">{getAdditionAmount(1)}</td>
            <th colspan="2">Salary Advance</th>
            <td></td>
            <td class="myAlign">{getDeductionAmount(3)}</td>
          </tr>
          <tr>
            <th colspan="2">EPF</th>
            <td></td>
            <td class="myAlign">{pay.epf}</td>
            <th colspan="2"></th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colspan="2">ESIC</th>
            <td></td>
            <td class="myAlign">{pay.esic}</td>
            <th colspan="2"></th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colspan="2">CTC Per Month</th>
            <td></td>
            <td class="myAlign">{salary.monthly_ctc}</td>
            <th colspan="2"></th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th colspan="2">CTC Per Annum</th>
            <td></td>
            <td class="myAlign">{salary.annual_ctc}</td>
            <th colspan="2"></th>
            <td></td>
            <td></td>
          </tr>
          <tr class="myBackground">
            <th colspan="3"></th>
            <td class="myAlign"></td>
            <th colspan="3">Total Deductions</th>
            <td class="myAlign">
              {salary.total_deductions && salary.total_deductions.toFixed(2)}
            </td>
          </tr>
          <tr height="40px">
            <th colspan="2"></th>
            <th></th>
            <td class="table-border-right"></td>
            <th colspan="2" class="table-border-bottom">
              Net Salary
            </th>
            <td></td>
            <td class="myAlign">
              {salary.net_salary && salary.net_salary.toFixed(2)}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );

  function getAdditionAmount(index) {
    return (salary.addition ? salary.addition[index].amount : 0).toFixed(2);
  }

  function getDeductionAmount(index) {
    return (salary.deductions ? salary.deductions[index].amount : 0).toFixed(2);
  }
}

export default Payslip;
