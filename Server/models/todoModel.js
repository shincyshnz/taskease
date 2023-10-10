const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minLength: [3, "Title must be more than 3 Characters"],
        maxLength: [50, "Title cannot be more than 300 Characters"],
        required: [true, "Title cannot be empty."]
    },
    description: {
        type: String,
        trim: true,
        minLength: [3, "Todo must be more than 3 Characters"],
        maxLength: [300, "Todo cannot be more than 300 Characters"],
        required: [true, "Todo cannot be empty."]
    },
    date: {
        type: Date,
        require: true,
    },
    isCompleted: Boolean
}, { timestamps: true });

module.exports = mongoose.model("todos", todoSchema);