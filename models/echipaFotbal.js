const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const echipaFotbalSchema = new mongoose.Schema({
    portar: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    fundas: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    mijlocas: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    atacant: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
})

const EchipaFotbal = mongoose.model('EchipaFotbal', echipaFotbalSchema)
module.exports = EchipaFotbal