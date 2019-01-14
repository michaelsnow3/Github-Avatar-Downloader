var request = require('request');
var token = require('./secrets.js');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token.GITHUB_TOKEN}`
    }
  }
  request(options, function (err, res, body) {
    var data = JSON.parse(body);
    // console.log(data);
    cb(err, data);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor) {
    console.log(contributor.avatar_url);
  });
});