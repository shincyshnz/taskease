const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect("mongodb://127.0.0.1:27017/todoapp");
        console.log("Database Connected : " + connection.host);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDb;