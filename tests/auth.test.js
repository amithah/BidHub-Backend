const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const authController = require("../controllers/authController")

describe('auth', () => {

  it('should login user',async ()=>{
    const loginData = {
        username: 'testuser@gmail.com',
      password: 'password123',
    }
    const resp = await request(app)
    .post("/login")
    .send(loginData);
    expect(resp.status).toBe(200);

  })

});
