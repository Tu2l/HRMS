import express from "express";
import {
  getUser,
  getUsers,
  searchUser,
  deleteUser,
  updateProfileImage,
  filterList
} from "../controller/user.js";

export const user = express.Router();

//detail of single user
user.post("/get", getUser);

//detail of all user
user.post("/get/all", getUsers);

//search by name
user.post("/search", searchUser);

//remove user
user.post("/delete", deleteUser);

// Filter the user Search
user.post("/filter", filterList);

//Update Profile Image
user.post("/update", updateProfileImage);

//404
user.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
