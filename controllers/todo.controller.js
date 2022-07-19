const TodoModel = require("../models/todo.model");

exports.createTodo = async (req, res, next) => {
    try{
        const createdModel = await TodoModel.create(req.body);
        res.status(201).json(createdModel);
    }catch(err){
        next(err);
    }
}

exports.getTodos = async (req, res, next) => {
    try{
        const todos = await TodoModel.find({});
        res.status(200).json(todos);
    }catch(err){
        next(err);
    }
}

exports.getTodoById = async (req, res, next) => {
    try{
        const { todoId } = req.params;

        const todo = await TodoModel.findById(todoId);

        if(todo) {
            res.status(200).json(todo);
        } 
        else {
            res.status(404).send();
        }            
    }catch(err){
        next(err);
    }
}

exports.updateTodo = async (req, res, next) => {
    try{
        const { todoId } = req.params;
        const newTodo = req.body;

        const todo = await TodoModel.findByIdAndUpdate(todoId, newTodo, {
            new: true,
            useFindAndModify: true,
        })

        if(todo) {
            res.status(200).json(todo);
        } 
        else {
            res.status(404).send();
        }            
    }catch(err){
        next(err);
    }
}

exports.deleteTodo = async (req, res, next) => {
    try{
        const { todoId } = req.params;

        const deletedTodo = await TodoModel.findByIdAndDelete(todoId)

        if(deletedTodo) {
            res.status(200).json(deletedTodo);
        } 
        else {
            res.status(404).send();
        }            
    }catch(err){
        next(err);
    }
}