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

var weatherReport = [];
const tempArr = [0,5,13,21,29,37];

app.get("/",(req,res)=>{
    (async () => {
    await fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+id)
        .then((response) => response.json())
        .then((data) => {

            if (data.cod == 200) {

                for(var i=0;i<6;i++){

                  var index = tempArr[i];

                    const temp = data.list[index].dt * 1000;
                    const icon = data.list[index].weather[0].icon;
                    const wurl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

                    var temp_data = {

                      day: dateFormat(temp, "dddd"),
                      date: dateFormat(temp, "mmmm dS"),

                      city: data.city.name,
                      country: data.city.country,

                      linkIcon: wurl,
                      temp: data.list[index].main.temp,
                      humidity:data.list[index].main.humidity,
                      wind:data.list[index].wind.speed,

                      maxTemp:data.list[index].main.temp_max,
                      minTemp:data.list[index].main.temp_min,
                    };

                    weatherReport.push(temp_data);
                }


                res.render('main', {
                  weatherData:weatherReport,
                  status: data.cod,
                });


            }

            else{
                for(var i=0;i<6;i++){

                      var temp_data = {
                        day: "-",
                        date: "-",

                        city: "Not Found",
                        country: "-",

                        linkIcon: " ",
                        temp: "-",
                        humidity:"-",
                        wind:"-",

                        maxTemp:"-",
                        minTemp:"-",
                      };

                      weatherReport.push(temp_data);
                    }

                    res.render('main', {
                      weatherData:weatherReport
                    });
            }
        })
        .catch((err) => console.log(`Error: ${err}`));
  })();
})

app.post("/", (req, res) => {
   city = req.body.search;
   weatherReport.length = 0;
   res.redirect("/");
})

app.get("*", (req, res) => {
  res.send("Page not found.")
})

app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
