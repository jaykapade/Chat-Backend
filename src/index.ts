import { connectDB } from "./config/db";
import server from "./server";

const PORT = process.env.PORT || 3000;

// Mongoose DB Connection
connectDB();

// Server Port listening
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
