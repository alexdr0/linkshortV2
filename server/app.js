"use strict";
exports.__esModule = true;
//@ts-ignore
var express = require('express');
//@ts-ignore
var bodyParser = require('body-parser');
// Importing configuration
//@ts-ignore
var config = require('./config.json');
var app = express();
var urlParser = bodyParser.urlencoded({ extended: false });
var uuid_1 = require("uuid");
//Mongoose setup
var mongoose = require("mongoose");
//@ts-ignore
mongoose.connect(config.database.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () { return console.log('MongoDB Connected'); })["catch"](function (err) { return console.log(err); });
// Importing Schemas
//@ts-ignore
var db_url = require('./models/url.js');
function generateUID() {
    return uuid_1.v4().substring(0, 7);
}
console.log("Example UUID", generateUID());
app.get('/test', function (req, res) {
    res.json({
        "response": "yea it works "
    });
});
app.post('/api/makeurl', urlParser, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body.url);
    if (req.body.url) {
        var isError_1 = false;
        var uuid_2 = "";
        var uuid_process_1 = function () {
            uuid_2 = generateUID();
            // Check if uuid it already exists
            db_url.count({ shorthand: uuid_2 }, function (err, count) {
                if (count > 0) {
                    console.log("UUID already exists");
                    uuid_process_1();
                }
            });
        };
        uuid_process_1();
        console.log("Making: ", uuid_2, " go to ", req.body.url);
        // try/catch block
        try {
            var urlQuery = new db_url({
                shorthand: uuid_2,
                url: req.body.url
            });
            urlQuery.save()
                .then(function () {
                console.log("Successfully saved to the database");
            })["catch"](function (err) {
                isError_1 = true;
                console.log(err);
            });
        }
        catch (err) {
            console.log(err);
            isError_1 = true;
        }
        if (isError_1) {
            res.json({
                error: true,
                message: 'We ran into an error sending the URL to the database.'
            });
        }
        else {
            res.json({
                error: false,
                returnType: 'json',
                "return": {
                    url: uuid_2
                }
            });
        }
    }
    else {
        res.json({
            error: true,
            errorText: 'No url provided'
        });
    }
});
app.post('/api/getuuid', urlParser, function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    if (req.body.uuid) {
        db_url.findOne({ shorthand: req.body.uuid })
            .then(function (result) {
            if (result == null) {
                console.log("Was not found");
                res.json({
                    error: true,
                    errorText: 'URL not found'
                });
            }
            else {
                console.log(result);
                console.log("Needs to be redirected to: ", result.url);
                res.json({
                    error: false,
                    returnType: 'redirect_url',
                    "return": result.url
                });
            }
        })["catch"](function (err) {
            console.log(err);
            res.json({
                error: true,
                errorText: 'No URL found'
            });
        });
    }
    else {
        res.json({
            error: true,
            errorText: 'No uuid provided'
        });
    }
});
app.listen(config.port, function () {
    console.log("Started at http://" + config.host + ":" + config.port);
});
