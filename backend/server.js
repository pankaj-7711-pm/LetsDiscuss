const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes")

dotenv.config();
connectDB();
const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.send("hii");
})

app.use("/api/user", userRoutes);



const port = process.env.PORT || 5000;

app.listen(port,console.log("server started in port 5000"))