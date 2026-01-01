import express from "express"
import ConnectDb from "./src/db.js"
import dotenv from "dotenv";
import cors from "cors";
import   './src/utils/WhatsappClient.js';



dotenv.config({
   path: './.env'
})


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is Running....")
})




ConnectDb()
.then( () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running on Port:${process.env.PORT}`);        
    })
})
.catch( (error) => {
 console.log("DataBase Connection Failed", error)
})


// import routes here
import userRouter from './src/routes/user.route.js';
import otpRouter from "./src/routes/verifyUser.route.js";
import markAttendenceRouter from "./src/routes/markAttendence.route.js";

// use routes here
app.use("/api/v1/attendence", markAttendenceRouter);

// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", otpRouter);
