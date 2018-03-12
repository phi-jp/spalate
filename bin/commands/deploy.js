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
    var env = circleci.branches[CIRCLE_BRANCH];
    if (env) {
      console.log('deploy ' + CIRCLE_BRANCH);
      app.branch(env).deploy();
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

