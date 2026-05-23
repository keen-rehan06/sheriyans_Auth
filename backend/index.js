import dotenv from "dotenv"
dotenv.config({path:"./.env"})

import express from "express"
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import authRoute from "./routes/auth.route.js"

const app = express()  
;(async()=>{
    try {
        await connectDb();
    } catch (error) {
        console.log("MongoDb Connection Failed:❌",error);
    }
})()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/",authRoute)
app.get("/",(req,res)=>{
    res.send("Hello World!")
})

app.listen(3000,function(){
    console.log("app is running on port 3000!")
});
