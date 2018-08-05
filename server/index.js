const express = require('express');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const apiRoutes = require('./routes/api-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cors = require('cors');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

var d = new Date();
d.setTime(d.getTime() + 24*60*60*1000);

app.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: d.getTime()
    }
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongo.dbUri, () => {
  console.log("Connect to db");
});

app.use(cors({credentials: true, origin: true}));
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(3000, () => {
  console.log('app now listening for requests on port 3000');
});
