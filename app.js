const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
let articlesSchema = mongoose.Schema({
  title: String,
  content: String,
});

let Article = mongoose.model("article", articlesSchema);




app.route("/articles")
  .get((req, res) => {
    Article.find((err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    let article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Success!!");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles");
      }
    });
  });

  app.route("/articles/:var")
  .get((req,res)=>{
    Article.findOne({title: req.params.var},(err,result)=>{
      if(result){
        res.send(result);
      }
      else{
        res.send("Not article found");
      }
    })
  })
  .put((req, res)=>{
    Article.updateOne(
      {title: req.params.var},
      {title: req.body.title, content: req.body.content},
      (err)=>{
        if(!err){
          res.send("Success!!");
        }
        else{
          res.send(err);
        }
      }
      )
  })
  .patch((req,res)=>{
    Article.updateOne(
      {title: req.params.var},
      {$set: req.body},
      (err)=>{
        if(!err){
          res.send("Success!!");
        }
        else{
          res.send(err);
        }
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne(
      {title: req.params.var},
      (err)=>{
        if(!err){
          res.send("Successfully deleted!!");
        }
        else{
          res.send(err);
        }
      }
    )
  });


app.listen(3000, function () {
  console.log("Server started on port 3000");
});