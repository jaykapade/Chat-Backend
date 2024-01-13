import request from "supertest";

import server from "../server";

describe("Test Server is Running", () => {
  test("Catch-all route", async () => {
    const res = await request(server).get("/test");
    expect(res.body).toEqual({
      message: "Server is up and running",
    });
  });
});


