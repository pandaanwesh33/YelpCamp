var mongoose     = require('mongoose'),
    express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    Campground   = require('./models/campground'),
    Comment      = require('./models/comment'),
    seedDB       = require('./seeds');


// this statement conncts mongoose to the yelp_camp database....if theres not one it will create yelp_camp database...
mongoose.connect("mongodb://localhost/yelp_camp_v3",{ useNewUrlParser: true })
// Just Memorize this line ...this tells express to use bodyparser...
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

// seedDB();

// Routes starts here

app.get("/",(req,res)=>{
    res.render("landing");
})


// INDEX  -- show all campgrounds
app.get("/campgrounds",(req,res)=>{
    //Get campgrounds from DB amd then render it
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index" ,{campgrounds:allCampgrounds});
        }
    });
    
    
});


// CREATE -- create a new campground 
app.post("/campgrounds",(req,res)=>{
    // get data from the form and add it to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //now push the datas to the campgrounds array
    var newCampground = {name: name,image:image,description: desc};
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
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new.ejs");
})


// SHOW -- shows more info about the campground
app.get("/campgrounds/:id",function(req,res){
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


// ===============================================

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    })
    
});

app.post("/campgrounds/:id/comments",function(req,res){
    // lookup campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    });
    // create new comment
    // connect new comment to campground
    // redirect to campground show page
});

// ===============================================

app.listen(process.env.PORT,process.env.IP,()=>{
    console.log("server has started");
});