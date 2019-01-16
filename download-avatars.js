var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config().parsed

var inputRepoOwner = process.argv[2];
var inputRepoName = process.argv[3];

//accounts for recommend function arg
if(process.argv[2] === 'recommend.js'){
  inputRepoOwner = process.argv[3];
  inputRepoName = process.argv[4];
}

function getRepoContributors(repoOwner, repoName, cb) {
  //if no dotenv file
  if(!dotenv){
    console.log("No dotenv file");
    return 0;
  }
  //no token key in dotenv file
  if (!('GITHUB_TOKEN' in dotenv)){
      console.log("No github token key");
      return 0;
    }
  //if incorrect number of arguments are entered
  if(process.argv.length !== 4){
    console.log("enter repo owner and repo name");
    return 0;
  }
  console.log('attempt a request');
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.GITHUB_TOKEN}`
    }
  };

  //request github api to provide contributors of project
  request(options, function (err, res, body) {
    if(err) {
      console.log("Erorr making get request");
      throw err;
    }
    var data = JSON.parse(body);
    cb(err, data);
  });
}

//function that creates file containing contributers image
function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .on('error', function(err) {
      console.log("Errors:", err);
      throw err;
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(inputRepoOwner, inputRepoName, function(err, result) {
  //incorrect github token key
  if(result.message === "Bad credentials"){
    console.log("incorrect github token key");
    return 0;
  }
  //error already accounted for
  if(result.message === "Not Found"){
    console.log("Contributors not found. Incorrect repo name or owner");
    return 0;
  }
  result.forEach(function(contributor) {
    downloadImageByURL(contributor.avatar_url, `avatars/${contributor.login}.jpg`);
  });
});