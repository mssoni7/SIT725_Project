//imports
//var favicon = require("serve-favicon");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const port = 3000;
const io = require("socket.io")(server, { cors: { origin: "*" } });

// create a data schema
const OccasionsSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mobileno: { type: String, required: true },
  date: { type: Date, required: true },
  gender: { type: String, required: true },
  occasion: { type: String, required: true },
  note: { type: String, required: true },
});

const Occasion = mongoose.model("Occasion", OccasionsSchema);
// Connect to database
mongoose.connect(
  "mongodb+srv://mssoni:Ds5Td5Ef7Dn8@sit725.ldrf3.mongodb.net/mydb?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log("Database Connection has Successfully Established")
);

// Static Files
app.use(express.static("public"));
//app.use(favicon(__dirname + "/public/img/favicon.ico"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set Views
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index", { text: "This is EJS" });
});

app.get("/dash", (req, res) => {
  //res.render("dash");
  Occasion.find({}, function (err, data) {
    res.render("dash", {
      occasionList: data,
    });
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/noti", (req, res) => {
  res.render("noti");
});

// saving data from add.ejs to mongodb
app.post("/add", (req, res) => {
  let newOccasion = new Occasion({
    firstname: req.body.fname,
    lastname: req.body.lname,
    mobileno: req.body.mono,
    date: req.body.doo,
    gender: req.body.gen,
    occasion: req.body.type,
    note: req.body.onote,
  });
  newOccasion.save();
  res.redirect("/dash");
});

// //listening to port 3000
// app.listen(port, function () {
//   console.log("Server is Running on port " + port);
// });

//socket code
server.listen(port, () => {
  console.log("Server is Running on port " + port);
});

io.on("connection", (socket) => {
  console.log("User Conencted" + socket.id);

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
});
