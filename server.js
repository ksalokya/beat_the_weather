require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render("main");
})

app.post("/", (req, res) => {
   res.redirect("/");
})

app.get("*", (req, res) => {
  res.send("Page not found.")
})

app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
