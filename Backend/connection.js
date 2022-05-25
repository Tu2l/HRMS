import mongoose from "mongoose";    

const CON = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/gratia_hrms"
mongoose.connect(CON, { useNewUrlParser: true, useUnifiedTopology: true })

export const connection = mongoose.connection