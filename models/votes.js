const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var voteSchema = new Schema({
    elector:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    elected:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    area:{
        type: String,
        required: true
    },
    month:  {
        type: String,
        required: true
    },
    comment:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Votes = mongoose.model('Vote', voteSchema);

module.exports = Votes;