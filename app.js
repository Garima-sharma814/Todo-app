const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("static"));

mongoose.connect("mongodb+srv://admin-Garima:iamgarima@cluster0.wvq5t.mongodb.net/todoDB",{useNewUrlParser: true,useUnifiedTopology: true });

const port = process.env.PORT;
const hostname = "127.0.0.1";

const todoSchema = new mongoose.Schema({
  name: String
});

const Todo = new mongoose.model("todo", todoSchema); //todo is the collection 

const item1 = new Todo({
  name: "Yeah! You are all done, add more items to start working"
});
const defaultitems = [item1];
// WeekEnd list
app.get("/", (req, res) => {
  Todo.find({}, (err, itemsfound)=>{
    if(itemsfound.length===0){
      Todo.insertMany(defaultitems, (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("inserted");
          res.redirect("/");
        }
      })    
    }else{
      res.render("list", { listName: "Today" , addeditems: itemsfound} );
    }
  });
});

app.post("/", (req,res)=>{
  const itemName = req.body.newItem;
  const item = new Todo({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res)=>{
  const checkedItemID = req.body.checkbox;
  Todo.findByIdAndRemove(checkedItemID , (err)=>{
      if(err){
        console.log(err);
        }else{
          console.log("deleted");
        }
        res.redirect("/");
    })
  })   
// Work list 
app.get("/work", (req,res)=>{
  res.render("list", {listName: "Work List", addeditems: workitems})
});

//Server 
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => {
  console.log(`The server is running at http://${hostname}:${port}/`);
});
