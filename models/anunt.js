//cap38 curs3
const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')


const opts = { toJSON: { virtuals: true } };

const anunturiSchema=new mongoose.Schema({
    sport:{
        type:String,
        required:true,
        lowercase:true,
        enum:['fotbal','tenis','baschet']
    }, 
    dificultate:{
        type:String,
        required:true,
        enum:['Amator','Semi-amator','Mediu','Avansat']
    }, 
    organizator:{
        type:String,
        required:true
    },
    telefon:{
        type:Number,
        required:true,
        min:10,
       
    }, 
    info:{
        type:String,
        required:true
    }, 
    dataSiOra:{
        required:true,
        type:Date
    },
    
    //fotbal
    portar:{
        type:Number 
    },
    fundas:{
        type:Number 
    },
    mijlocas:{
        type:Number 
    },
    atacant:{
        type:Number 
    },

    //tenis
    simplu:{
        type:Number
    },
    dublu:{
        type:Number
    },
    

    //baschet
    center:{
        type:Number
    },
    pForward:{
        type:Number
    },
    sForward:{
        type:Number
    },
    pGuard:{
        type:Number
    },
    sGuard:{
        type:Number
    },

    //review
    //cap46 curs1
    //info cap44 curs5 min6 pt Schema.Types.ObjectId
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ], 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //cap55curs3
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    
    
},opts)



anunturiSchema.virtual('properties.popUpMarkup').get(function () {
    
    return `<strong><a href=\\"/anunt/${this.sport}/${this._id}\\">${this.sport} - ${this.organizator}</a><strong>`
    
});











//astea sunt key value pair cap37 curs4 min3:45
anunturiSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})



const Anunt=mongoose.model('Anunt',anunturiSchema)
module.exports=Anunt























