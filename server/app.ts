//@ts-ignore
const express = require('express');
//@ts-ignore
const bodyParser = require('body-parser')

// Importing configuration
//@ts-ignore
const config = require('./config.json');

const app:any = express()

let urlParser = bodyParser.urlencoded({ extended: false })

import { v4 as uuidv4 } from 'uuid';

//Mongoose setup
import * as mongoose from "mongoose";

//@ts-ignore
mongoose.connect(config.database.uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Importing Schemas
//@ts-ignore
const db_url = require('./models/url.js');

function generateUID() {
    return uuidv4().substring(0,7)
}




console.log("Example UUID", generateUID())

app.get('/test', (req, res) => {
    res.json({
        "response": "yea it works "
    })
})

app.post('/api/makeurl', urlParser, (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body.url)
    if(req.body.url){
        let isError = false
        let uuid:any = ""
        let uuid_process = () => {
            uuid = generateUID()

            // Check if uuid it already exists
            db_url.count({shorthand: uuid}, (err, count) => {
                if(count > 0){
                    console.log("UUID already exists")
                    uuid_process()
                }
            })
        }
        uuid_process()


        console.log("Making: ", uuid, " go to ", req.body.url)

        
        // try/catch block
        try{
            const urlQuery = new db_url({
                shorthand: uuid,
                url: req.body.url
            },)

            urlQuery.save()
            .then(() => {
                console.log("Successfully saved to the database")
            })
            .catch((err) => {
                isError = true
                console.log(err)
            })

        } catch(err){
            console.log(err);
            isError = true;
        }

        if(isError){
            res.json({
                error: true,
                message: 'We ran into an error sending the URL to the database.'
            })
        } else {
            res.json({
                error: false,
                returnType: 'json',
                return: {
                    url: uuid
                }
            })
        }
    } else {
        res.json({
            error: true,
            errorText: 'No url provided'
        })
    }
})

app.post('/api/getuuid', urlParser, (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    if(req.body.uuid){
        db_url.findOne({shorthand: req.body.uuid})
        .then((result) => {
            if(result == null){
                console.log("Was not found")
                res.json({
                    error: true,
                    errorText: 'URL not found'
                })
            } else {
                console.log(result)
                console.log("Needs to be redirected to: ", result.url)
                res.json({
                    error:false,
                    returnType: 'redirect_url',
                    return: result.url
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.json({
                error: true,
                errorText: 'No URL found'
            })
        })
    } else {
        res.json({
            error: true,
            errorText: 'No uuid provided'
        })
    }
})

app.listen(config.port, () => {
    console.log(`Started at http://${config.host}:${config.port}`)
})