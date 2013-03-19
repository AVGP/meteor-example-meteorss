var feeds = new Meteor.Collection("feeds");
var articles = new Meteor.Collection("articles");
  
  if (Meteor.isClient) {
  Template.feeds.feedList = function () {
      return feeds.find();
  };
  
  Template.feeds.events({
      "click #addFeed": function() {
          Meteor.call("addFeed", $("#feedUrl").val());
          $("#feedUrl").val("");
      }
  });
  
  
  Template.overview.articles = function() {
      return articles.find({}, {sort: [["published", "desc"]]});
  };
}

if (Meteor.isServer) {
  var require = __meteor_bootstrap__.require;
  var feedparser = require('feedparser');
  
  Meteor.methods({
      "addFeed": function(url) {
          feeds.insert({name: url });
          try {
              feedparser.parseUrl(url).on('article', function(article) {
                  Fiber(function() {
                      articles.insert({
                          headline: article.title,
                          published: article.date
                      });
                  }).run();
              });
          } catch(e) {
              console.log("I should go home.");
          }
      }
  });
  
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
