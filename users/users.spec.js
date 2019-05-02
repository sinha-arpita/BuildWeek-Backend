const userRouter = require("./usersRouter.js");
const request = require("supertest");
const Users = require("./users-model");

beforeEach(() => {
  return Users.truncate();
});

describe("the server", () => {
  it("it should start testing environment", () => {
    const env = process.env.DB_ENV;
    expect(env).toBe("testing");
  });
});



// let config = {
//   headers: {
//     "authorization": value,
//   }
// }
//axios.post(URL, data, config).then(...)
