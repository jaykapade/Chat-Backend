import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import User from "./src/models/User";

let mongoServer: MongoMemoryServer;

/* Opening database connection before all tests. */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();

  mongoose.connect(mongoUri);

  // Insert initial data
  const initialUsers = [
    {
      name: "John Doe",
      email: "test@test.com",
      password: "123456",
      isAdmin: true,
    },
    {
      name: "Jack Doe",
      email: "jack@test.com",
      password: "123456",
      isAdmin: false,
    },
    {
      name: "Davy Jones",
      email: "davy@test.com",
      password: "123456",
      isAdmin: false,
    },
  ];

  await User.create(initialUsers);
});

/* Closing database connection after all tests. */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await mongoServer.stop();
});
