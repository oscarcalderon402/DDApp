const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://oscarUalett:guitarra2@cluster0.e1gib.mongodb.net/DDApp",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.log(error));
