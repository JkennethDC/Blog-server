const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogs")

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

// Mongo
mongoose.connect(process.env.MONGO_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// routes
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`)
    });
}

module.exports = {app, mongoose};