const {Schema} = require('mongoose');

const versionSchema = new Schema({
    _id: Number,
    version : Number,
    taskCounter: Number,
});
module.exports = {versionSchema};