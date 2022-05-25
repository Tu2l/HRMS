import express from "express"
import {
  addProject, getProject, deleteProject, getProjects, updateProject,
  updateProjectMembers, addProjectMembers, deleteProjectMembers, getProjectMembers
} from "../controller/project.js"

export const project = express.Router()

project.post('/add', addProject)

project.post('/get', getProject)

project.post('/delete', deleteProject)

project.post('/get/all', getProjects)

project.post('/get/members', getProjectMembers)

project.post('/update', updateProject)

project.post('/update/member', updateProjectMembers)

project.post('/update/member/add', addProjectMembers)

project.post('/update/member/delete', deleteProjectMembers)


//404
project.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});
