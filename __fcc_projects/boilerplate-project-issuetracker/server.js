'use strict';

let baseUrl = "fcc/issuetracker"

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

let app = express();

app.use('/public', express.static(process.cwd() + '/__fcc_projects/boilerplate-project-issuetracker/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/__fcc_projects/boilerplate-project-issuetracker/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/__fcc_projects/boilerplate-project-issuetracker/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Only run tests if this app is launched standalone (optional safety)
if (process.env.NODE_ENV === 'test' && require.main === module) {
  console.log('Running Tests...');
  setTimeout(() => {
    try {
      runner.run();
    } catch (e) {
      console.log('Tests are not valid:');
      console.error(e);
    }
  }, 3500);
}

module.exports = app; //for testing
