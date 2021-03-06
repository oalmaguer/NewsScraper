$("#scrapebtn").click(function() {
  $.ajax({
    method: "GET",
    url: "/scrape",
    dataType: "json",
    success: function(res) {
      console.log(res);
      alert(
        "Your content is being scraped! If you don't see them reload the site and wait"
      );
      location.reload();
    }
  });
});

$.getJSON("/articles", function(data) {
  if (data.length == 0) {
    console.log("No articles");
    $("#articles").prepend(
      "<h2>No articles to display, press scrape and reload the site to get the articles</h2>"
    );
  } else {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append(
        "<p class='posts' data-id='" +
          data[i]._id +
          "'>" +
          "Title is: " +
          data[i].title +
          "<br />" +
          "Summary is: " +
          data[i].summary +
          "<br />" +
          `<a href="https://www.levelup.com${data[i].url}">${data[i].url}</a>` +
          "<br />" +
          "</p>" +
          "<hr/>"
      );
    }
  }

  console.log(data);

  $(document).on("click", ".posts", function() {
    $("#comments").empty();

    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data2) {
      console.log(data2);
      //title of the article
      $("#comments").append("<h2>" + data2[0].title + "</h2>");

      $("#comments").append(
        "<input type='text' class='form-control mt-4' id='userinput' name='user' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1'></input>"
      );

      $("#comments").append(
        "<textarea class='form-control mt-4' id='bodyinput' name='body' placeholder='Leave a comment' aria-label='With textarea'></textarea>"
      );

      $("#comments").append(
        "<button data-id='" +
          data2[0]._id +
          "' id='savecomment' class='btn btn-primary mt-4'>Save Comment</button>"
      );

      $("#comments").append("<h2>Comments for this post</h2>");
      for (var i = 0; i < data2[0].comments.length; i++) {
        $("#comments").append(`<p>Username: ${data2[0].comments[i].user}</p>`);
        $("#comments").append(
          `<p>Comment: ${data2[0].comments[i].body}</p><hr>`
        );
      }
    });
  });

  $(document).on("click", "#savecomment", function() {
    var thisId2 = $(this).attr("data-id");
    console.log(thisId2);

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId2,
      data: {
        user: $("#userinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data3) {
      console.log(data3);

      alert("Your comment has been saved!");

      $("#comments").empty();
    });

    $("#userinput").val("");
    $("bodyinput").val("");
  });
});

$("#deletebtn").click(function() {
  $.ajax({
    method: "GET",
    url: "/delete",
    dataType: "json",
    success: function(res) {
      console.log(res);
      alert("Your articles have been deleted!");
      location.reload();
    }
  });
});

$(document).on("click", "#reloadbtn", function() {
  location.reload();
});
