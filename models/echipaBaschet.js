const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const echipaBaschetSchema = new mongoose.Schema({
    center: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    pForward: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    sForward: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    pGuard: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    sGuard: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
})

const EchipaBaschet = mongoose.model('EchipaBaschet', echipaBaschetSchema)
module.exports = EchipaBaschet