import { server } from "./app.js";
import { host, port } from "./config.js";
import connectDB from "./helpers/db.js";

// connecting to database and starting server
connectDB()
  .then(() => {
    server.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
