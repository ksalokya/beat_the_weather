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
var checkError = false;
const id= process.env.ID;

var weatherReport = [];
const tempArr = [0,7,15,23,31,39];

app.get("/",(req,res)=>{

    if(checkError){
      city="Mumbai";
      weatherReport.length = 0;
    }

    (async () => {
    await fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+id)
        .then((response) => response.json())
        .then((data) => {

            if (data.cod == 200) {

                for(var i=0;i<6;i++){

                  var index = tempArr[i];

                    const tempDate = data.list[index].dt * 1000;
                    const icon = data.list[index].weather[0].icon;
                    const wurl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

                    var temp_data = {

                      day: dateFormat(tempDate, "dddd"),
                      date: dateFormat(tempDate, "mmmm dS"),

                      city: data.city.name,
                      country: data.city.country,

                      linkIcon: wurl,
                      temp: Math.round(data.list[index].main.temp * 10)/10,
                      humidity:data.list[index].main.humidity,
                      wind:data.list[index].wind.speed,
                      desc: data.list[index].weather[0].description,

                      maxTemp: Math.round(data.list[index].main.temp_max * 10)/10,
                      minTemp:Math.round(data.list[index].main.temp_min * 10)/10,
                    };

                    weatherReport.push(temp_data);
                }

                checkError = false;

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

                    checkError = true;

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
