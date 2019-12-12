var cheerio = require("cheerio");

var axios = require("axios");

axios.get("https://www.levelup.com/").then(function(response) {
  var $ = cheerio.load(response.data);

  var results = [];

  $(".news h4 a").each(function(i, element) {
    var title = $(element).text();

    var summary = $(element)
      .after("p")
      .text();

    results.push({
      title: title,
      summary: summary
    });
  });

  console.log(results);
});
