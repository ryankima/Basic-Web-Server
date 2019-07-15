var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");
var campgroundRoutes = require("./routes/campgrounds");


//seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session") ({
    secret: "insertSecretPhraseHere",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//associate view engine with ejs
app.set("view engine", "ejs");

app.use(commentRoutes);
app.use(authRoutes);
app.use(campgroundRoutes);

//start server on port 3000
app.listen(3000, function() {
    console.log("Server listening on port 3000");
})

