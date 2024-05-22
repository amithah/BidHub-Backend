const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const userController = require("../controllers/userController")

describe('createUser', () => {
  it('should throw an error if name is missing', async () => {
    const userData = {
      // Missing name
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    const resp =await  request(app)
    .post("/users")
    .send(userData);
    expect(resp.status).toBe(400);

  });

  it('should throw an error if email is missing', async () => {
    const userData = {
      name: 'Test User',
      // Missing email
      phone: '1234567890',
      password: 'password123',
    };
    const resp =await  request(app)
    .post("/users")
    .send(userData);
    expect(resp.status).toBe(400);

  });
  it('should create user',async ()=>{
    const userData = {
      name: 'Test User',
      email: 'testuser@gmail.com',
      phone: '1234567890',
      password: 'password123',
    }
    const resp =await  request(app)
    .post("/users")
    .send(userData);
    expect(resp.status).toBe(201);

  })

});
