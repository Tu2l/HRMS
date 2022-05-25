import mongoose from 'mongoose'

const projectMember = new mongoose.Schema({
    emp_id: String,
    role: String, default: ""
})

const projectSchema = new mongoose.Schema
    (
        {
            project_id: { type: Number, required: [true, "Project id is required"] },
            title: { type: String, required: [true, "Project title is required"] },
            description: { type: String },
            start_date: { type: Date, default: null },
            end_date: { type: Date, default: null },
            status: {
                type: Number, required: true, default: 0,
                min: [0, "0->pending, 1->inprogress, 2->completed/delivered, 3->abandoned"],
                max: [3, "0->pending, 1->inprogress, 2->completed/delivered, 3->abandoned"]
            },
            members: { type: [projectMember], required: true, default: [] }
        }
    )

export const Project = mongoose.model("Project", projectSchema)