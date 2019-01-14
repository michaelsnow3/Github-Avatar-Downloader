var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

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

function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}.jpg`);
  });
});