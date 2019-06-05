var express = require('express'),
    router  = express.Router();      // this is express Router
    
var Campground = require('../models/campground');


// INDEX  -- show all campgrounds
router.get("/campgrounds",(req,res)=>{
    //Get campgrounds from DB amd then render it
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index" ,{campgrounds:allCampgrounds});  //req.user contians info about currently logged in user
        }
    });
});


// CREATE -- create a new campground 
router.post("/campgrounds", isLoggedIn, (req,res)=>{
    // get data from the form and add it to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id , 
        username : req.user.username
    };
    //now push the datas to the campgrounds array
    var newCampground = {name: name, image:image, description: desc, author : author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            // now redirect to /campgrounds (get request)
            res.redirect("/campgrounds");
        }
    })
    
});


// NEW -- show the form to create a new campground
router.get("/campgrounds/new", isLoggedIn, (req,res)=>{
    res.render("campgrounds/new.ejs");
})


// SHOW -- shows more info about the campground
router.get("/campgrounds/:id",function(req,res){
    // find the campground with provided id 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
             // render show template for that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
   
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router ;