
const Anunt=require('./models/anunt')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/licenta', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection open')
    })
    .catch(err => {
        console.log('eroare')
        console.log(err)
    })

const o=new Anunt({
    sport:'tenis',dificultate:"Amator",organizator:'ion', telefon:073757504745 ,
     info:'baritiu data 16.03 ora 7', simplu:1, dublu:2, 
})

o.save()
    .then(o=>{
        console.log(o)
    })
    .catch(e =>{
        console.log(e)
    })


    const i=new Anunt({
        sport:'baschet',dificultate:"Mediu",organizator:'mihai', telefon:073744504745 ,
         info:'gheorgheni data 22.03 ora 9', center:1, pForward:2, sForward:2, pGuard:1
    })
    
    i.save()
        .then(i=>{
            console.log(i)
        })
        .catch(e =>{
            console.log(e)
        })











