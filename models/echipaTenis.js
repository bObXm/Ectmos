//cap38 curs3
const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const echipaTenisSchema = new mongoose.Schema({
    partener:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }   
})

const EchipaTenis = mongoose.model('EchipaTenis', echipaTenisSchema)
module.exports = EchipaTenis























