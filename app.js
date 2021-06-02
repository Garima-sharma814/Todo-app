const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");

const app = express();

var items=["Eat", "Code", "Sleep"];
var workitems=[];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"));

mongoose.connect("mongod://localhost:27017/todoDB");

const port = 3000;
const hostname = "127.0.0.1";

const todoSchema = new mongoose.Schema({
  name: String
});

const Todo = new mongoose.model("todo", todoSchema);

const todo = new Todo({
  name: "buyFood"
});

// WeekEnd list
app.get("/", (req, res) => {
  let day = date();
  res.render("list", { listName: day , addeditems: items} );
});

app.post("/", (req,res)=>{
  var item = req.body.newItem;
  if(req.body.list === "Work"){
    workitems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }
});

// Work list 
app.get("/work", (req,res)=>{
  res.render("list", {listName: "Work List", addeditems: workitems})
});


//Server 
app.listen(port, () => {
  console.log(`The server is running at http://${hostname}:${port}/`);
});
