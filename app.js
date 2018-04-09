var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var passportLocal = require("passport-local");
var User = require("./model/user");
// var request = request("request");
var passportLocalMongoose = require("passport-local-mongoose");
var methosOverride = require("method-override");
var Details = require("./model/details");
// mongoose.connect("mongodb://localhost/blog");
mongoose.connect("mongodb://antoo:randygold22@ds014388.mlab.com:14388/cora");
app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine","ejs");
app.use(require("express-session")({
    secret:"hey you",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.current = req.user;
    next();
});
app.use(methosOverride("_method"));
var blogSchema = new mongoose.Schema({
    name : String,
    price : String,
    image : String,
    about : String
});
var Blog = mongoose.model("Blog",blogSchema);
// creating two sample data's
// Blog.create({
//     name:"Dog",
//     image:"http://prima.cdnds.net/assets/17/07/980x490/landscape-1486985094-dog.jpg",
//     about : "adrobable"
// },function(err,blog){
//     if(err){
//         console.log("error found");
//     }else{
//         console.log("stored in database");
//     }
// });
// Blog.create({
//     name:"Cat",
//     image:"https://steemitimages.com/0x0/https://www.petmd.com/sites/default/files/petmd-cat-happy-10.jpg",
//     about : "cute"
// },function(err,blog){
//     if(err){
//         console.log("error found");
//     }else{
//         console.log("stored in database");
//     }
//     });
    // index page route
    app.get("/index",isLoggedIn,function(req,res){
        console.log(req.user);
        Blog.find({},function(err,blogs){
            if(err){
                res.redirect("/index");
            }else{
                res.render("index.ejs",{blogs:blogs});
            }
        });
    });
    // show more
    app.get("/showmore/:id",function(req,res){
        
        Blog.findById(req.params.id,function(err,data){
            if(err)
            {
                console.log(err);
            }else{
                res.render("showmore",{data:data});                    
            }
        });
    });
    // add new route
    app.get("/addnew",isLoggedIn,function(req,res){
        res.render("addnew.ejs");
    });
    app.post("/addnew",function(req,res){
        var animname = req.body.animname;
        var animprice = req.body.animprice;
        var animimg = req.body.animimg;
        var animabut = req.body.animabut;
        var blogdata = {
            name:animname,
            price:animprice,
            image:animimg,
            about:animabut
        };
        console.log(blogdata);
       Blog.create(blogdata,function(err,data){
           if(err){
               console.log(err);
           }else{
               res.redirect("/index");
           }
       });
    });
    // register route
    app.get("/register",function(req,res){
        res.render("register");
    });
    app.post("/register",function(req,res){
        var name = req.body.name;
        var dob = req.body.dob;
        var phone = req.body.phone;
        var username = req.body.username;
        // var password = req.body.password;
        Details.create({
            name:name,
            dob:dob,
            phone:phone,
            username:username
            // password:password
        },function(err,added){
            if(err)
            {
                console.log(err);
            }else{
                console.log("stored in database");
            }
        });
        User.register(new User({username:req.body.username}),req.body.password,function(err,user){
            if(err){
                console.log(err);
                return res.render("/register");
            }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/index");
            });
        });
    });
    // login route
    app.get("/login",function(req,res){
        res.render("login");
    });
    app.post("/login",passport.authenticate("local",{
    successRedirect : "/index",
    failureRedirect : "/register"
    }),function(req,res){
    });
    // Logout
    app.get("/logout",function(req,res){
        req.logout();
        res.redirect("register");
    });
    function isLoggedIn(req,res,next){
        if (req.isAuthenticated())
        {
            return next();
        }
        res.redirect("/register");
    }
    // Edit route
    app.get("/showmore/:id/edit",function(req,res){
        Blog.findById(req.params.id,function(err,data){
            if(err){
                console.log(err);
            }else{
                res.render("edit",{data:data});
            }
        });
        
    });
    //update route
    app.put("/showmore/:id",function(req,res){
        //  var data = {name:req.body.name,image:req.body.image,about:req.body.about}
        Blog.findByIdAndUpdate(req.params.id,req.body.data,function(err,update){
            if(err){
                console.log(err);
            }else{
                res.redirect("/showmore/"+req.params.id);
            }
        });
    });
    // destroy route
    app.delete("/showmore/:id",function(req,res){
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/index");
            }else{
                res.redirect("/index");
            }
        });
    });
    // comments route
    app.post("/showmore/:id",function(req,res){
        var comment = req.body.comment;
        console.log(comment);
       Blog.create(Comment,function(err,data){
           if(err){
               console.log(err);
           }else{
               res.redirect("/:id");
           }
       });
    });
    app.get("/showmore/:id/contact",function(req,res){
        Blog.findById(req.params.id,function(err,datasrc){
            if(err){
                console.log(err);
            }else{
                res.render("contact",{data:datasrc});
            }
        });
    });
app.listen(3000,function(){
    console.log("server is running");
});