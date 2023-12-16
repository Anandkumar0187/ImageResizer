const mongoose = require('mongoose');

const imageSchema=  new mongoose.Schema({
    url : String,
    timeStamp : {type : Date, default : Date.now}
})

const imageModel = mongoose.model('images',imageSchema);

module.exports = imageModel;