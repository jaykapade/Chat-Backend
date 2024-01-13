import request from "supertest";

import server from "../server";

let adminToken = "";
let userToken = "";
let chatId = "";
let chatUserCount = 0;
let users: any[] = [];

const adminCreds = {
  email: "test@test.com",
  password: "123456",
};

const userCreds = {
  name: "Jill Doe",
  email: "jill@test.com",
  password: "123456",
};

describe("User routes", () => {
  it("Register User Successfully", async () => {
    const res = await request(server).post("/api/user").send(userCreds);
    userToken = res.body.token;

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "Jill Doe",
      email: "jill@test.com",
    });
  });
  it("User Already Registered", async () => {
    const res = await request(server).post("/api/user").send(userCreds);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ message: "User already exists" });
  });
  it("Login User Successfully", async () => {
    const res = await request(server).post("/api/user/login").send(adminCreds);
    adminToken = res.body.token;

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      email: "test@test.com",
    });
    expect(res.body).toHaveProperty("token");
  });
  it("Login User : Wrong Credentials", async () => {
    const res = await request(server).post("/api/user/login").send({
      email: "wrong@test.com",
      password: "123456",
    });
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      message: "Invalid Email or Password",
    });
  });
  it("Get All Users Successfully", async () => {
    const res = await request(server)
      .get("/api/user")
      .set("Authorization", `Bearer ${userToken}`);
    res.body.forEach((user: any) => users.push(user._id));
    expect(res.status).toBe(200);
  });
  it("Get All Users Failed", async () => {
    const res = await request(server).get("/api/user");
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      message: "Not authorized, no token",
    });
  });
});

describe("Auth Middleware tests for Protected routes", () => {
  it("Access Protected Route without token", async () => {
    const res = await request(server).get("/api/user");
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      message: "Not authorized, no token",
    });
  });
  it("Access Protected Route with malformed token", async () => {
    const res = await request(server)
      .get("/api/user")
      .set("Authorization", `Bearer test1234567890`);
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      message: "Not authorized, token failed",
    });
  });
  it("Access Protected Route with Proper token", async () => {
    const res = await request(server)
      .get("/api/user")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });
});

describe("Group Chat routes", () => {
  it("Create Group Chat Successfully", async () => {
    const res = await request(server)
      .post("/api/chat/group")
      .send({
        users: JSON.stringify(users.slice(0, 2)),
        name: "Test Group",
      })
      .set("Authorization", `Bearer ${adminToken}`);

    chatId = res.body._id;
    chatUserCount = res.body.users.length;
    expect(res.status).toBe(200);
  });
  it("Create Group Chat Failed : No users", async () => {
    const res = await request(server)
      .post("/api/chat/group")
      .send({
        users: JSON.stringify([]),
        name: "Test Group",
      })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });
  it("Create Group Chat Failed : No name", async () => {
    const res = await request(server)
      .post("/api/chat/group")
      .send({
        users: JSON.stringify(users),
      })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });
  it("Rename Group Chat", async () => {
    const res = await request(server)
      .put("/api/chat/rename")
      .send({
        chatId,
        chatName: "TEST GROUP 1",
      })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      chatName: "TEST GROUP 1",
    });
  });
  it("Add User to Group Chat", async () => {
    const res = await request(server)
      .put("/api/chat/groupadd")
      .send({
        chatId,
        userId: users[users.length - 1],
      })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(chatUserCount + 1);
  });
  it("Remove User from Group Chat", async () => {
    const res = await request(server)
      .put("/api/chat/groupremove")
      .send({
        chatId,
        userId: users[users.length - 1],
      })
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(chatUserCount);
  });
  it("Delete Group Chat", async () => {
    const res = await request(server)
      .delete("/api/chat/groupdelete")
      .send({
        chatId,
      })
      .set("Authorization", `Bearer ${adminToken}`);
    console.log("🚀 ~ delete res:", res.body);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: "Group chat deleted successfully",
    });
  });
});

describe("Admin Middleware tests for Admin Protected routes", () => {
  it("Create Group Chat Failed : User Token", async () => {
    const res = await request(server)
      .post("/api/chat/group")
      .send({
        users: JSON.stringify(users),
        name: "Test Group",
      })
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(401);
  });
});
