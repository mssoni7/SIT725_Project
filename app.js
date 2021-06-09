//imports
//var favicon = require("serve-favicon");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const bodyParser = require("body-parser");
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

//module.exports = occasion;

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

//listening to port 3000
app.listen(port, function () {
  console.log("Server is Running on port " + port);
});

// function for validating date
function validateDate(fdate) {
  fdate = new Date(fdate);
  fdate =
    fdate.getDate().toString() +
    "/" +
    (fdate.getMonth() + 1).toString() +
    "/" +
    fdate.getFullYear().toString();
  return fdate;
}
