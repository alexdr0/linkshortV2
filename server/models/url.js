const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    shorthand: String,
    url: String
}, {timestamps: true});

const UrlSchema = mongoose.model('urls', urlSchema);

//exporting schema
module.exports = UrlSchema;