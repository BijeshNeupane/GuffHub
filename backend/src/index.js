import express from "express";
import {config} from "dotenv";

const app = express();
config();

const PORT = process.env.PORT || 3000;

app.get("/api/health-check", (req, res) => {
    res.status(200).json({message: "Backend running successfully"})
})

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})