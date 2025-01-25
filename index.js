const { connectDB } = require("./config/db")

require("dotenv").config()
connectDB()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/", require("./routes/index"))





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});


