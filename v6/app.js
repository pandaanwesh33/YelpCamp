var mongoose      = require('mongoose'),
    express       = require('express'),
    app           = express(),
    passport      =require('passport'),
    LocalStrategy = require('passport-local'),
    bodyParser    = require('body-parser'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds');


// this statement conncts mongoose to the yelp_camp database....if theres not one it will create yelp_camp database...
mongoose.connect("mongodb://localhost/yelp_camp_v3",{ useNewUrlParser: true })
// Just Memorize this line ...this tells express to use bodyparser...
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();


// PASSPORT CONFIGURATION   
app.use(require("express-session")({
    secret : "Hey there Buddy!!!",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this statement pass currentUser variable to every route as parameter....
// req.user contains info about the curently logged in user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

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
            res.render("campgrounds/index" ,{campgrounds:allCampgrounds});  //req.user contians info about currently logged in user
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    })
    
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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


//=================================================
//           AUTH ROUTES
//=================================================

//          ====SIGN UP ROUTES====


// show the SIGN UP form 
app.get("/register",function(req,res){
    res.render("register");
});

// handle the signup process
app.post("/register",function(req,res){
    var newUser = new User({username : req.body.username});
    User.register(newUser , req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});


//        =====LOGIN ROUTES====

// show the login form 
app.get("/login",function(req,res){
    res.render("login");
})

//LOGIN logic
//this is like app.post("/login",middleware,callback);
app.post("/login", passport.authenticate("local",
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }), function(req,res){
    
})

//LOGOUT logic
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,()=>{
    console.log("server has started");
});