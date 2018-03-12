var config = require('config');
var eb = require('./lib/node-eb');
var opt = process.argv[3];

if (opt === 'circleci') {
  const {
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_BRANCH,
  } = process.env;
  
  var circleci = config.spalate.deploy.circleci;
  var app = eb(circleci.app || CIRCLE_PROJECT_REPONAME);
  try {
    if (CIRCLE_BRANCH === 'master') {
      console.log('deploy master');
      app.branch(circleci.branches.master).deploy();
    }
    else if (CIRCLE_BRANCH === 'develop') {
      console.log('deploy develop');
      app.branch(circleci.branches.develop).deploy();
    }
  } catch (e) {
    if (e.name === "ApplicationVersionsLimitError") {
      app.clearAppVersions();
    }
    console.log(
      `code: ${e.status}`,
      e.message
    );
    if (e.stdout && e.stderr) {
      console.log(
        `stdout: ${e.stdout.toString()}\nstderr: ${e.stderr.toString()}`
      );
    }
    
  }
}  

