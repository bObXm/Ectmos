const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const echipaBaschetSchema = new mongoose.Schema({
    //baschet
    center:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pForward:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    sForward:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pGuard:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    sGuard:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const EchipaBaschet = mongoose.model('EchipaBaschet', echipaBaschetSchema)
module.exports = EchipaBaschet























