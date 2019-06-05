var express = require('express');
var app = express();
var bodyParser = require('body-parser')

// Just Memorize this line ...this tells express to use bodyparser...
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds=[
        {name:"Burla",image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"},
        {name:"sambalpur",image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"},
        {name:"Bargarh",image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"},
        {name:"Bargarh",image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"},
        {name:"Bargarh",image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"},
        {name:"Bargarh",image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c47eaee8bcbf_340.jpg"}
];

app.get("/",(req,res)=>{
    res.render("landing");
})

app.get("/campgrounds",(req,res)=>{
    
    res.render("campgrounds" ,{campgrounds:campgrounds});
    
});

app.post("/campgrounds",(req,res)=>{
    // get data from the form and add it to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    //now push the datas to the campgrounds array
    var newCampground = {name: name,image:image};
    campgrounds.push(newCampground);
    // now redirect to /campgrounds (get request)
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new.ejs");
})

app.listen(process.env.PORT,process.env.IP,()=>{
    console.log("server has started");
});