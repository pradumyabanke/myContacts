// console.log("i am in the express server")
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
// const app = require('../../app');
// const http = require('http').createServer(express).listen(3000);

connectDb();
const app = express();

const port = process.env.PORT || 5000; 

app.use(express.json());
app.use('/api/contacts',require("./routes/contactsRouter"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});