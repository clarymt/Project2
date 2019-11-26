var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the reviews
  app.get("/api/posts/", function(req, res) {
    db.Review.findAll({}).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for returning reviews of a specific category
  app.get("/api/posts/category/:category", function(req, res) {
    db.Review.findAll({
      where: {
        category: req.params.category
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single review
  app.get("/api/posts/:id", function(req, res) {
    db.Review.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new review
  app.post("/api/posts", function(req, res) {
    console.log(req.body);
    db.Review.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  app.delete("/api/posts/:id", function(req, res) {
    db.Review.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating reviews
  app.put("/api/posts", function(req, res) {
    db.Review.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
