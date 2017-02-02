var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport');


module.exports = function (app, config) {

    var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Cache-Control', 'no-cache');

        next();
    };

    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(session({secret: 'wishlist', cookie: {maxAge: 60000}}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(allowCrossDomain);
};