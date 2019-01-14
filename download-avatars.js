var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');
var inputRepoOwner = process.argv[2];
var inputRepoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  if(!repoOwner || !repoName){
    console.log("enter repo owner and repo name");
    return 0;
  }
  console.log('attempt a request');
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token.GITHUB_TOKEN}`
    }
  }
  request(options, function (err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .on('error', function(err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(inputRepoOwner, inputRepoName, function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(contributor) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}.jpg`);
  });
});