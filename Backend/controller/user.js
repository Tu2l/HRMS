import { Employee } from "../model/Employee.js"
import { PersonalDetail } from "../model/PersonalDetail.js"
import { Address } from "../model/Address.js"
import { Bank } from "../model/Bank.js"
import { Pay } from "../model/Salary/Pay.js"
import { Salary } from "../model/Salary/Salary.js"

//update profile Image
export const updateProfileImage = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    out.message = "success"
    out.error = false
    out.data = await Employee.updateOne({ emp_id: emp_id }, { $set: { profile_img: req.body.profile_img } })
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

//get the detail of a particular user
export const getUser = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    const results = await Employee.findOne({ emp_id: emp_id }, [
      "emp_id",
      "email",
      "name",
      "dob",
      "phone",
      "designation",
      "department",
      "join_date",
      "status",
      "profile_img",
      "appointment_file",
      "cv_file"
    ])

    out.error = !results

    out.message = out.error ? "User Not found" : "success"
    out.data = out.error ? null : results
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

//get details on all users
export const getUsers = async (req, res) => {
  const out = {}
  try {
    const pageNumber = parseInt(req.body.current_page) || 1
    const itemPerPage = 10
    const total = await Employee.find({}, ["emp_id"]).countDocuments()

    const users = await Employee.find({}, [
      "emp_id",
      "email",
      "name",
      "dob",
      "phone",
      "designation",
      "department",
      "join_date",
      "status",
      "profile_img",
      "appointment_file",
      "cv_file"
    ])
      .sort({ name: "asc" })
      .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
      .limit(itemPerPage)

    out.message = "success"
    out.error = false
    out.current_page = pageNumber
    out.item_perpage = itemPerPage
    out.total_page = Math.ceil(total / itemPerPage)
    out.data = users
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

//SEARCH by Name
export const searchUser = async (req, res) => {
  const out = {}
  try {
    const query = req.body.query
    if (!query) throw Error("query is required")

    const pageNumber = parseInt(req.body.current_page) || 1
    const itemPerPage = 10
    const total = await Employee.find(
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      ["emp_id"]
    ).countDocuments()

    const user = await Employee.find(
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      ["emp_id", "email", "name", "dob", "phone", "designation", "department"]
    )
      .sort({ name: "asc" })
      .skip(pageNumber > 1 ? (pageNumber - 1) * itemPerPage : 0)
      .limit(itemPerPage)

    out.message = "success"
    out.error = false
    out.current_page = pageNumber
    out.item_perpage = itemPerPage
    out.total_page = Math.ceil(total / itemPerPage)
    out.data = user
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

// Search using depart, desig and service
export const filterList = async (req, res) => {
  const out = {}
  try {
    const conditions = []
    if (req.body.status)
      conditions.push(
        { 'status': req.body.status },
      )

    if (req.body.designation)
      conditions.push(
        { 'designation': req.body.designation },
      )

    if (req.body.department)
      conditions.push(
        { 'department': req.body.department },
      )

    const pageNumber = parseInt(req.body.current_page) || 1
    const itemPerPage = 10
    const total = await Employee
      .find(conditions.length > 0 ? { $and: conditions } : {})
      .countDocuments()

    const projects = await Employee
      .find(conditions.length > 0 ? { $and: conditions } : {})
      .sort({ title: "asc" })
      .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
      .limit(itemPerPage)

    out.message = "success"
    out.error = false
    out.current_page = pageNumber
    out.item_perpage = itemPerPage
    out.total_page = Math.ceil(total / itemPerPage)
    out.data = projects
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}

//DELETE user
export const deleteUser = async (req, res) => {
  const out = {}
  try {
    const emp_id = req.body.emp_id
    if (!emp_id) throw Error("emp_id is required")

    await Employee.deleteOne({ emp_id: emp_id })
    await PersonalDetail.deleteOne({ emp_id: emp_id })
    await Address.deleteOne({ emp_id: emp_id })
    await Bank.deleteOne({ emp_id: emp_id })
    await Pay.deleteOne({ emp_id: emp_id })
    await Salary.deleteMany({ emp_id: emp_id })

    out.message = "success"
    out.error = false
    out.data = emp_id + "deleted"
  } catch (err) {
    out.message = err.message
    out.error = true
    out.data = null
  } finally {
    //setting the output
    res.send(out)
  }
}
