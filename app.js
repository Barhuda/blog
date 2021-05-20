//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "This ist the testing Blogsite of mk. Try adding new Posts to see them on the MainPage.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');


app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

let postArray = [];

mongoose.connect("mongodb+srv://admin:123@cluster0.kyaqu.mongodb.net/blogDB", { useUnifiedTopology: true, useFindAndModify: false });

const postSchema = new mongoose.Schema({ title: String, body: String })

const Post = mongoose.model("Post", postSchema)


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function () {

  console.log("Ready");
})


app.get("/", function (req, res) {

  Post.find({}, function (err, foundPosts) {
    if (!err) {
      res.render("home", { startingContent: homeStartingContent, postArray: foundPosts });
    } else {
      console.log(err);
    }
  });



})

app.get("/about", function (req, res) {

  res.render("about", { aboutContent: aboutContent });

})

app.get("/contact", function (req, res) {

  res.render("contact", { contactContent: contactContent });

})

app.get("/compose", function (req, res) {

  res.render("compose");

})

app.get("/posts/:postId", function (req, res) {
  var selectedPost;
  Post.findById(req.params.postId, function (err, foundPost) {
    console.log(foundPost);
    res.render("post", { postTitle: foundPost.title, postBody: _.trim(foundPost.body, { "length": 25 }) });
  })


  /* postArray.forEach(function (post) {
    if (_.lowerCase(post.postTitle) === _.lowerCase(req.params.postTitle)) {
      console.log("Match found")
      selectedPost = post;

      res.render("post", { postTitle: selectedPost.postTitle, postBody: _.trim(selectedPost.postBody, { "length": 25 }) })
    } else {
      console.log("No Match")
      res.redirect("/");


    }
  })
 */


})

app.post("/compose", function (req, res) {

  const postObj = new Post({ title: req.body.postTitle, body: req.body.postBody });

  postObj.save();

  res.redirect("/");


})





