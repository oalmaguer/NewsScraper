var cheerio = require("cheerio");
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var path = require("path");
var mongoose = require("mongoose");

var db = require("./models");
var PORT = 8080;
var app = express();

// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
  axios.get("https://www.levelup.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    var result = {};

    $(".news .content").each(function(i, element) {
      result.title = $(element)
        .find("a")
        .text();

      result.summary = $(element)
        .find("p")
        .first()
        .text();

      result.url = $(element)
        .find("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);

          res.send("Scrape Complete");
        });
    });

    console.log(result);
  });
});

app.get("/articles", function(req, res) {
  db.Article.find()
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/comments", function(req, res) {
  db.Comments.find({})
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    .populate("comments") //reference article.js
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/comments/:id", function(req, res) {
  db.Comments.find({ _id: req.params.id })
    .populate("comments")
    .then(function(dbComment) {
      res.json(dbComment);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// app.get("/populated", function(req, res) {
//   db.Article.find({})
//     .populate("comments")
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

app.post("/articles/:id", function(req, res) {
  db.Comments.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            comments: dbComment._id
          }
        }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
      console.log("Success");
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("Listening on http://localhost:" + PORT);
});
