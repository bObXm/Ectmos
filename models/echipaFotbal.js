//cap38 curs3
const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const echipaFotbalSchema = new mongoose.Schema({
    //fotbal
    portar:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    fundas:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    mijlocas:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    atacant:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]    
})

const EchipaFotbal = mongoose.model('EchipaFotbal',echipaFotbalSchema)
module.exports = EchipaFotbal























