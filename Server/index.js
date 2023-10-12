const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const todoModel = require("./models/todoModel");
const app = express();

app.use(express.json());
app.use(cors());


connectDb();

app.get("/api/todo", async (req, res) => {
    try {
        const taskList = await todoModel.find().sort({ date: "desc" });
        res.status(200).json({
            result: taskList
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

app.post("/api/todo", async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const todoItem = {
            title,
            description,
            date,
            isCompleted: false,
        };

        const newTask = await todoModel.create(todoItem);

        res.status(200).json({
            result: newTask
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

app.put("/api/todo", async (req, res) => {
    const { _id, title, description, date, isCompleted } = req.body;

    try {
        const todoItem = {
            title,
            description,
            date,
            isCompleted,
        };

        const newTask = await todoModel.findByIdAndUpdate(_id, todoItem, { new: true });

        if (!newTask) {
            return res.status(404).json({
                message: `Item with id : ${id} does not exists`,
            });
        }

        res.status(200).json({
            result: newTask
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

app.put("/api/todo/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const taskFound = await todoModel.findById(id);

        if (!taskFound) {
            return res.status(404).json({
                message: `Item with id : ${id} does not exists`,
            });
        }

        const updatedTask = await todoModel.findByIdAndUpdate(id, { isCompleted: !taskFound.isCompleted }, { new: true });
        res.status(200).json({
            result: updatedTask
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

app.delete("/api/todo", async (req, res) => {
    const { id } = req.body;

    try {
        const deletedData = await todoModel.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({
                message: `Item with id : ${id} does not exists`,
            });
        }

        res.status(200).json({
            result: deletedData._id
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }

});

app.get("/*", (req, res) => {
    const url = req.url;
    res.status(400).json({
        message: `"${url}" url doesnot exists`,
    });

});

const PORT = 3050;
app.listen(PORT, () => {
    console.log(`Sever started at ${PORT}`);
});