const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
const testData = { title: "Make integration test for put", done: true}
let firstTodo, newTodoId;

describe(endpointUrl, () => {
    it("POST " + endpointUrl, async () => {
        const response = await request(app)
          .post(endpointUrl)
          .send(newTodo);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);

        newTodoId = response.body._id;
    });
    it("should return 500 on malformed data with POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({title: "Missing done"});
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({message: "Todo validation failed: done: Path `done` is required."});
    })
    it("GET " + endpointUrl, async () => {
        const response = await request(app)
          .get(endpointUrl);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();

        firstTodo = response.body[0]

    });

    it("GET " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .get(endpointUrl + firstTodo._id)
          .send(newTodo);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);
    });
    it("GET todoby id doesn't exist " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .get(endpointUrl + "somerandomid");

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({});
    });

    it("PUT " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .put(endpointUrl + newTodoId)
          .send(testData);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    it("PUT todoby id doesn't exist " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .put(endpointUrl + "somerandomid")
          .send(newTodo);

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({});
    });

    it("DELETE " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .delete(endpointUrl + newTodoId);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testData.title);
        expect(response.body.done).toBe(testData.done);
    });
    it("DELETE todoby id doesn't exist " + endpointUrl + ":todoId", async () => {
        const response = await request(app)
          .delete(endpointUrl + "somerandomid");

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({});
    });
})