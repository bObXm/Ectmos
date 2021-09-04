const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./user')

const echipaTenisSchema = new mongoose.Schema({
    partner: {
        counter: {
            type: Number
        },
        players: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
})

const EchipaTenis = mongoose.model('EchipaTenis', echipaTenisSchema)
module.exports = EchipaTenis