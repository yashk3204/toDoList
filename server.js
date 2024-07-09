const express = require('express');
const mongoose = require('mongoose');
const config = require("config");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(config.get("DB_URL"));

// Define a schema and model for todo items
const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// API routes
app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/api/todos', async (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        completed: false
    });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { text: req.body.text, completed: req.body.completed },
        { new: true }
    );
    res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});

// Start the server
const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});