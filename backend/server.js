const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//handling uncaught error // printing the variables which are not

process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log(`shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
//cofiguring path
dotenv.config({ path: "backend/config/config.env" });
// sdfasdff aefa asfafa efasfd
//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server has started on http://localhost:${process.env.PORT}`);
});

//unhandled promise error  //like due to database URI changes
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
