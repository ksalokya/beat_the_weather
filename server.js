require('dotenv').config()
const express = require("express");

const fetch = require("node-fetch");

// Require dateformat library
var dateFormat = require("dateformat");

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

var city = "Mumbai";
const id= process.env.ID;

app.get("/",(req,res)=>{
    fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+id)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
})

app.post("/", (req, res) => {
    city = req.body.search;
    res.redirect("/");
})

app.get("*", (req, res) => {
    res.send("Page not found.")
})

app.listen(port, () => {
    console.log(`Server is running on : http://localhost:${port}`);
});
