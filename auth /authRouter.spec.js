//const authRouter = require("./authRouter.js");
const server = require("../api/server.js");
const request = require("supertest");
const Users = require("./../users/users-model");

beforeEach(() => {
  return Users.truncate();
});

describe("POST /register", function() {
  var token;
  it("Testing creation of valid new user", async function(done) {
    //console.log("Router", authRouter);
    //request(authRouter) //supertest
    request(server)
      .post("/api/auth/register")
      .send({
        username: "test1",
        password: "test1",
        phone: 1234,
        email: "test1@test.com"
      })
      .set("Accept", "application/json")
      .expect(function(res) {})
      .expect(200, done);

    request(server)
      .post("/api/auth/register")
      .send({
        username: "test2",
        password: "test2",
        phone: 1234,
        email: "test2@test.com"
      })
      .set("Accept", "application/json")
      .expect(function(res) {})
      .expect(200, done);

    request(server)
      .post("/api/auth/login")
      .set("Accept", "application/json")
      .send({
        username: "test1",
        password: "test1"
      })

      .expect(function(res) {
        token = res.body.token;
        console.log(token);
      })
      .expect(200, done)
      .end(function(res, done) {
        console.log("Body", res.body);
      });

    // request(server)
    //   .get("/api/users")
    //   .set(
    //     "authorization",
    //     ""
    //     //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRlc3QxIiwicGhvbmUiOjEyMzQsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1NTY2ODA2NjMsImV4cCI6MTU1Njc2NzA2M30.byBILj4yMsltDQCw9NHGYk8NXzCObxUDBhzK4zvie8U"
    //   )
    //   .set("Accept", "application/json")
    //   .send()
    //   .expect(function(res) {
    //     console.log("Get users", res.body);
    //   })
    //   .expect(200, done);
  });
});

describe("My API tests", function() {
  var token = null;

  beforeEach(function(done) {
    request(server)
      .post("/api/auth/login")
      .send({
        username: "test1",
        password: "test1"
      })
      .set("Accept", "application/json")
      .end(function(err, res) {
        token = res.body.token; // Or something
        console.log("Token >> ", token);
        done();
      });
  });

  it("Testing get users", async function(done) {
    console.log("Token > ", token);
    request(server)
      .get("/api/users")
      .set(
        "authorization",
        token
        //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRlc3QxIiwicGhvbmUiOjEyMzQsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1NTY2ODA2NjMsImV4cCI6MTU1Njc2NzA2M30.byBILj4yMsltDQCw9NHGYk8NXzCObxUDBhzK4zvie8U"
      )
      .set("Accept", "application/json")
      .send()
      .expect(function(res) {
        console.log("Get users", res.body);
      })
      .expect(200, done);
  });

  it("Testing event create", async function(done) {
    console.log("Token > ", token);
    request(server)
      .post("/api/events")
      .set(
        "authorization",
        token
        //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRlc3QxIiwicGhvbmUiOjEyMzQsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1NTY2ODA2NjMsImV4cCI6MTU1Njc2NzA2M30.byBILj4yMsltDQCw9NHGYk8NXzCObxUDBhzK4zvie8U"
      )
      .set("Accept", "application/json")
      .send({
        event_name: "Test-Party",
        description: "On Tuesday",
        date: "30th April 2019",
        total_expenditure: "100",
        paid_by: "test1@test.com",
        participants: ["test1@test.com", "test2@test.com"]
      })
      .expect(function(res) {})
      .expect(200, done);
  });

  it("Testing get dues", async function(done) {
    console.log("Token > ", token);
    request(server)
      .get("/api/events/getdues")
      .set(
        "authorization",
        token
        //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRlc3QxIiwicGhvbmUiOjEyMzQsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1NTY2ODA2NjMsImV4cCI6MTU1Njc2NzA2M30.byBILj4yMsltDQCw9NHGYk8NXzCObxUDBhzK4zvie8U"
      )
      .set("Accept", "application/json")
      .send()
      .expect(function(res) {
        console.log("Dues for test1 ", res.body);
      })
      .expect(200, done);
  });
});
