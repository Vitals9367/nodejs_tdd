const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../models/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

let req, res, next;
const todoId = "4asd6a4d6a4d6a46da4d";

jest.mock("../../models/todo.model");

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe("TodoController.createTodo", () => {
    beforeEach(() => {
        req.body = newTodo;
    })
    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });
    it("should call TodoModel.create", async () => {
        await TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });
    it("should return 201 response code", async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return json body as response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
}); 

describe("TodoController.getTodos", () => {
    it("should have a createTodo function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });
    it("should call TodoModel.find", () => {
        TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toBeCalledWith({});
    });
    it("should return 200 response code and all todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Some error"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("TodoController.getTodoById", () => {
    it("should have a getTodoById function", () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });
    it("should call TodoModel.findById with route parameters", async () => {
        req.params.todoId = todoId;

        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith(todoId);
    });
    it("should return 200 response code and todo by id", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should return 404 response when item does not exist", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        req.params.todoId = todoId;

        const errorMessage = { message: "Some error"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findById.mockReturnValue(rejectedPromise);
        await TodoController.getTodoById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("TodoController.deleteTodo", () => {
    it("should have a deleteTodo function", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });
    it("should call TodoModel.findByIdAndUpdate with route parameters", async () => {
        req.params.todoId = todoId;

        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
    });
    it("should return 200 response", async () => {
        req.params.todoId = todoId;
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("should return 404 response when item does not exist", async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle errors", async () => {
        req.params.todoId = todoId;

        const errorMessage = { message: "Some error"};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await TodoController.deleteTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})