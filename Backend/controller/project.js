import { Employee } from "../model/Employee.js"
import { Project } from "../model/Project.js"

async function getNames(members) {
    const names = []
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const emp = {...member._doc}
        const res = await Employee.findOne({ emp_id: member.emp_id }, ['name'])
        emp.name = res.name
        names.push(emp)
    }
    return names
}


function getformattedDate(stringDate) {
    const date = stringDate ? new Date(Date.parse(stringDate)) : new Date()
    const month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    return Date.parse(date.getFullYear() + "-" + (month) + "-" + (date.getDate()))
}


export const addProject = async (req, res) => {
    const out = {}
    try {
        const res = await Project.find({}, ["project_id"]).sort({ _id: -1 }).limit(1)
        const project_fields = {}

        let id = 1
        if (res.length > 0)
            id = res[0].project_id + 1

        project_fields.project_id = id

        if (!req.body.title) throw Error("Project title is missing")

        project_fields.title = req.body.title

        if (!req.body.desc) throw Error("Project desc is missing")

        project_fields.description = req.body.desc

        if (req.body.start_date)
            project_fields.start_date = getformattedDate(req.body.start_date)

        if (req.body.end_date)
            project_fields.end_date = getformattedDate(req.body.end_date)

        if (req.body.status)
            project_fields = req.body.status

        const project = new Project(project_fields)

        await project.save()

        // console.log(project_fields)
        out.message = "success"
        out.error = false
        out.data = project
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const getProject = async (req, res) => {
    const out = {}
    try {
        if (!req.body.project_id)
            throw Error("project_id is required")

        const res = await Project.findOne({ project_id: req.body.project_id })
        const project = {...res._doc}
        project.members = await getNames(res.members)

        out.message = "success"
        out.error = false
        out.data = project
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const deleteProject = async (req, res) => {
    const out = {}
    try {
        if (!req.body.project_id)
            throw Error("project_id is required")

        out.message = "success"
        out.error = false
        out.data = await Project.deleteOne({ project_id: req.body.project_id })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const getProjects = async (req, res) => {
    const out = {}
    try {
        const conditions = []
        if (req.body.status)
            conditions.push(
                { 'status': req.body.status },
            )

        if (req.body.emp_id)
            conditions.push(
                { 'members': { "$elemMatch": { "emp_id": req.body.emp_id } } },
            )


        const pageNumber = parseInt(req.body.current_page) || 1
        const itemPerPage = 10
        const total = await Project
            .find(conditions.length > 0 ? { $and: conditions } : {})
            .countDocuments()

        const projects = await Project
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

export const updateProject = async (req, res) => {
    const out = {}
    try {
        if (!req.body.project_id)
            throw Error("project_id is required")

        const project_fields = {}

        if (req.body.title)
            project_fields.title = req.body.title

        if (req.body.desc)
            project_fields.description = req.body.desc

        if (req.body.start_date)
            project_fields.start_date = getformattedDate(req.body.start_date)

        if (req.body.end_date)
            project_fields.end_date = getformattedDate(req.body.end_date)

        if (req.body.status)
            project_fields.status = req.body.status

        out.message = "success"
        out.error = false
        out.data = await Project.updateOne({ project_id: req.body.project_id }, { $set: project_fields })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const updateProjectMembers = async (req, res) => {
    const out = {}
    try {
        const project_id = req.body.project_id
        if (!project_id) throw Error("Project Id is required")

        const members = req.body.members
        if (!members && !Array.isArray(members))
            throw Error("new members array is required")

        const set = []
        for (var i = 0; i < members.length; i++) {
            // console.log(members[i])
            if (members[i].emp_id) {
                if (await Employee.find({ emp_id: members[i].emp_id }).countDocuments() > 0) {
                    set.push({
                        emp_id: members[i].emp_id,
                        role: members[i].role || ""
                    })
                } else throw Error(members[i].emp_id + ' is invalid')
            } else throw Error("members array must be in the following format [{emp_id:id,role:role}]")
        }

        out.message = "success"
        out.error = false
        out.data = await Project.updateOne({ project_id: project_id }, { $set: { members: set } })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const addProjectMembers = async (req, res) => {
    const out = {}
    try {
        const project_id = req.body.project_id
        if (!project_id) throw Error("Project Id is required")

        const members = req.body.members
        if (!members && !Array.isArray(members))
            throw Error("new members array is required")

        const set = []
        for (var i = 0; i < members.length; i++) {
            // console.log(members[i])
            if (members[i].emp_id) {
                if (await Employee.find({ emp_id: members[i].emp_id }).countDocuments() > 0) {
                    set.push({
                        emp_id: members[i].emp_id,
                        role: members[i].role || ""
                    })
                } else throw Error(members[i].emp_id + ' is invalid')
            } else throw Error("members array must be in the following format [{emp_id:id,role:role}]")
        }

        const project = await Project.findOne({ project_id: project_id }, ["members"])
        for (var i = 0; i < project.members.length; i++)
            for (var j = 0; j < set.length; j++)
                if (set[j].emp_id === project.members[i].emp_id)
                    set.splice(j, 1)


        // console.log(set)
        out.message = "success"
        out.error = false
        out.data = await Project.updateOne({ project_id: project_id }, { $set: { members: project.members.concat(set) } })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const deleteProjectMembers = async (req, res) => {
    const out = {}
    try {
        const project_id = req.body.project_id
        if (!project_id) throw Error("Project Id is required")

        const members = req.body.members
        if (!members && !Array.isArray(members))
            throw Error("new members array is required")

        const project = await Project.findOne({ project_id: project_id }, ["members"])
        for (var i = 0; i < members.length; i++)
            for (var j = 0; j < project.members.length; j++)
                if (members[i].emp_id === project.members[j].emp_id)
                    project.members.splice(j, 1)

        // console.log(project.members)
        out.message = "success"
        out.error = false
        out.data = await Project.updateOne({ project_id: project_id }, { $set: { members: project.members } })
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}

export const getProjectMembers = async (req, res) => {
    const out = {}
    try {
        if (!req.body.project_id)
            throw Error("project_id is required")

        const project = await Project.findOne({ project_id: req.body.project_id }, ["members"])

        out.message = "success"
        out.error = false
        out.data = project
    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null
    } finally {
        //setting the output
        res.send(out)
    }
}


