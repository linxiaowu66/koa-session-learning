/* eslint no-console: 0 */

const path = require('path')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const webpackDevMiddleware = require('./middleware/webpack-dev.js')
const routes = require('./routes/index');
const session = require('express-session')
const passport = require('passport')
const sfs = require('session-file-store')
// const Promise = require('bluebird');
const mongoose = require('mongoose');
// mongoose.Promise = Promise;
// Express will set the NODE_ENV to 'development' if you dont config it, but
// koa is not.
const isDev = process.env.NODE_ENV !== 'production'
const config = require('../config/index')
const port = config.port
const app = express()
const FileStore = sfs(session)

if (isDev) {
  webpackDevMiddleware(app)
}


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(session({
  store: new FileStore(),
  secret: 'express-dwb',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'))

routes(app)

var Account = require('./helper/passport');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  app.listen(port, config.host, function onStart(err) {
    if (err) {
      console.log(err)
    }
    console.info(`==> 🌎 Listening on port ${port}. Open up http://${config.host}:${port}/ in your browser.`)
  })
})

