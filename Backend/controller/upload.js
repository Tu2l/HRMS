import { Employee } from '../model/Employee.js'


const upload = async (req, folder) => {
    // console.log(req)
    const emp_id = req.body.emp_id
    if (!emp_id)
        throw Error("emp_id is required")

    const emp_check = await Employee.find({ emp_id: emp_id }).countDocuments()
    if (emp_check == 0)
        throw Error("Invalid emp_id")


    if (!req.files)
        throw Error("No file uploaded")

    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let file = req.files.file
    const max_size = 5242880
    if (file.size > max_size) throw Error('Max file is 5MB')

    const fileName = new Date().getTime() + '_' + file.name
    const path = './public/upload/' + emp_id.replaceAll('/', '_') + '/' + folder + '/' + fileName

    //Use the mv() method to place the file in upload path (i.e. "uploads")
    file.mv(path)

    return {
        name: fileName,
        path: req.headers.host + '/upload/' + emp_id.replaceAll('/', '_') + '/' + folder + '/' + fileName,
        size: file.size
    }
}

export const uploadFile = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'files')
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const uploadProfile = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'profile')
        await Employee.updateOne({ emp_id: req.body.emp_id }, { $set: { profile_img: data.path } })
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const uploadAppointment = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'appointment')
        await Employee.updateOne({ emp_id: req.body.emp_id }, { $set: { appointment_file: data.path } })
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const uploadCV = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'cv')
        await Employee.updateOne({ emp_id: req.body.emp_id }, { $set: { cv_file: data.path } })
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}

export const uploadInvoice = async (req, res) => {
    const out = {}
    try {
        const data = await upload(req, 'invoice')
        out.message = "success"
        out.error = false
        out.data = data

    } catch (err) {
        out.message = err.message
        out.error = true
        out.data = null

    } finally {
        //setting the output
        res.send(out)
    }
}