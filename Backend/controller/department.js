import { Department } from "../model/Department.js"
import { Designation } from "../model/Designation.js"
import { Employee } from "../model/Employee.js"


export const getDepartment = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Designation id is required")

        const result = await Department.findOne({ _id: id })
        const department = {}
        if (result) {
            department._id = result._id
            department.name = result.name
            department.total_capacity = result.total_capacity
            department.occupied = await Employee.find({ department: result.name }).countDocuments()
            department.vacant = department.total_capacity - department.occupied
            // console.log(designation)
        }
        out.message = "success"
        out.error = false
        out.data = department

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getAllDepartments = async (req, res) => {
    const out = {}
    try {
        const result = await Department.find({}, ['name']).sort({ name: "asc" })

        out.message = "success"
        out.error = false
        out.data = result

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getDepartments = async (req, res) => {
    const out = {}
    try {
        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Department.find({}).countDocuments()

        const result = await Department
            .find({})
            .sort({ name: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        const arr = []
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i]
                if (res) {
                    const r = await Designation.find({ departName: res.name }, ['total_capacity'])
                    // console.log(r)
                    var capacity = 0
                    r.forEach(v => {
                        capacity += v.total_capacity
                    })
                    arr.push({
                        _id: res._id,
                        name: res.name,
                        capacity: capacity,
                        createdAt: res.createdAt,
                        updatedAt: res.updatedAt
                    })
                }
            }
        }

        out.message = "success"
        out.error = false
        out.current_page = pageNumber
        out.item_perpage = itemPerPage
        out.total_page = Math.ceil(total / itemPerPage)
        out.data = arr

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const addDepartment = async (req, res) => {
    const out = {}
    try {

        if (!req.body.name)
            throw Error("Name is missing!")

        const check = await Department.find({ name: req.body.name }).countDocuments()

        if (check > 0) throw Error("Same Department Already Exists")

        const result = new Department({
            name: req.body.name,
        })
        await result.save()

        out.message = "success"
        out.error = false
        out.data = result

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const deleteDepartment = async (req, res) => {
    const out = {}
    try {

        if (!req.body.id)
            throw Error("Id is missing")

        const result = await Department.deleteOne({ _id: req.body.id })

        out.message = "success"
        out.error = false
        out.data = result

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const updateDepartment = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Id is required")

        const update = {}
        if (req.body.name)
            update.name = req.body.name

        const old = await Department.findOne({ _id: id })
        if (!old) throw Error("Department doesn't exists")

        out.message = "success"
        out.error = false
        out.data = await Department.updateOne({ _id: id }, { $set: update })

        await Employee.updateMany({ department: old.name }, { $set: { department: update.name } })
        await Designation.updateMany({ departName: old.name }, { $set: { departName: update.name } })
        
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}