var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

//allow users to create campgrounds
router.post("/campgrounds", isLoggedIn, function(req, res) {
    //get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    //create new campground
    Campground.create(
        {
            name: name, 
            image: image,
            description: description
        }, function(err, campground) {
            if(err) {
                console.log("Error");
            } else {
                console.log("Newly Created Campground:")
                console.log(campground);
            }
        });
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
})

//show campgrounds
router.get("/campgrounds", function(req, res) {
    //Get all campgrounds from database
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
        }
    })
})

//Create new campgrounds
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//campground display based on id
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        }
        else {
            //render show template for that campground
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;