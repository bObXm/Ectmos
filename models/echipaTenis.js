//cap38 curs3
const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const User = require('./user')

const echipaTenisSchema = new mongoose.Schema({
    partener:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
        }]  
})


// const echipaTenisSchema = new mongoose.Schema({
//     partener:{
//         counter: {
//             type: Number
//         },
//         players: [{
//             type: Schema.Types.ObjectId,
//             ref: 'User'
//         }]
//     }  
// })

const EchipaTenis = mongoose.model('EchipaTenis', echipaTenisSchema)
module.exports = EchipaTenis























