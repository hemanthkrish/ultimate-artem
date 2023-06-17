const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true, depreciated
    })
    .then((data) => {
      console.log(`mongodb connected with server ${data.connection.host}`);
    });
  // .catch((err) => {
  //   console.log(err);
  // });
  // tomake this as a unhandled error
};

module.exports = connectDatabase;
