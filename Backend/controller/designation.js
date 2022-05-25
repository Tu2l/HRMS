import { Designation } from "../model/Designation.js"
import { Employee } from "../model/Employee.js"


export const showDesignation = async (req, res) => {
    const out = {}
    try {
        const departName = req.body.departName
        if (!departName) throw Error("Department code is required")

        const result = await Designation.find({ departName: departName }, ["name"])

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

export const getDesination = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Designation id is required")

        const result = await Designation.findOne({ _id: id })
        const designation = {}
        if (result) {
            designation._id = result._id
            designation.name = result.name
            designation.total_capacity = result.total_capacity
            designation.occupied = await Employee.find({ designation: result.name }).countDocuments()
            designation.vacant = designation.total_capacity - designation.occupied
            // console.log(designation)
        }
        out.message = "success"
        out.error = false
        out.data = designation

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const getAllDesignations = async (req, res) => {
    const out = {}
    try {
        const result = await Designation.find({}, ['name', 'total_capacity', 'departName', 'createdAt', 'updatedAt']).sort({ name: "asc" })

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

export const getDesignations = async (req, res) => {
    const out = {}
    try {
        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Designation.find({}).countDocuments()

        const result = await Designation
            .find({})
            .sort({ name: "asc" })
            .skip(pageNumber > 1 ? ((pageNumber - 1) * itemPerPage) : 0)
            .limit(itemPerPage)

        const arr = []
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i]
                if (res) {
                    const occupied = await Employee.find({ designation: res.name }).countDocuments()
                    arr.push({
                        _id: res._id,
                        name: res.name,
                        departName: res.departName,
                        total_capacity: res.total_capacity,
                        occupied: occupied,
                        vacant: res.total_capacity - occupied,
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

export const addDesignation = async (req, res) => {
    const out = {}
    try {

        if (!req.body.departName)
            throw Error("Department Name is missing!")

        if (!req.body.name)
            throw Error("Name is missing!")

        const check = await Designation.find({ name: req.body.name }).countDocuments()

        if (check > 0) throw Error("Same Designation Already Exists")


        const result = new Designation({
            name: req.body.name,
            total_capacity: req.body.total_capacity,
            departName: req.body.departName,
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

export const deleteDesignation = async (req, res) => {
    const out = {}
    try {
        if (!req.body.id)
            throw Error("code is missing")

        const result = await Designation.deleteOne({ _id: req.body.id })

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

export const updateDesignation = async (req, res) => {
    const out = {}
    try {
        const id = req.body.id
        if (!id) throw Error("Id is required")

        const update = {}
        if (req.body.name)
            update.name = req.body.name

        if (req.body.total_capacity)
            update.total_capacity = req.body.total_capacity

        if (req.body.departName)
            update.departName = req.body.departName

        const old = await Designation.findOne({ _id: id })
        if (!old) throw Error("Designation doesn't exists")

        out.message = "success"
        out.error = false
        out.data = await Designation.updateOne({ _id: id }, { $set: update })

        await Employee.updateMany({ designation: old.name }, { $set: { designation: update.name } })

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}