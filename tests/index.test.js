const axios = require("axios");

function sum(a, b) {
  return a + b;
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User is able to sign up only once ", async () => {
    const username = "Naser-" + Math.random();
    const password = "1234456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(updatedResponse.statusCode).toBe(400);

    //
  });

  //
  test("Signup request fails if the username is empty", async () => {
    const username = `Naesr-${Math.random()}`;
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
    });

    expect(response.statusCode).toBe(400);
  });

  //

  test("Signin is succeeded if the username and password is correct", async () => {
    const username = `Naser-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.data.token).toBeDefined();

    //
  });

  //

  test("Signin fails if the username or password are incorrect", async () => {
    const username = `Naser-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "WrongUsername",
      password,
    });

    expect(response.statusCode).toBe(403);

    //
  });
  //
});

///
describe("User Information endpoints", () => {
  let token = "";
  //
  beforeAll(async () => {
    const username = `Naser-${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;

    //
  });

  //

  test("User cant update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: "1235416512",
    });

    expect(response.statusCode).toBe(400);

    //
  });

  //
  test("test 2 ", () => {
    expect(1).toBe(1);
  });

  //
  test("test 3 ", () => {
    expect(1).toBe(1);
  });

  //
});
