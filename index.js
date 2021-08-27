//cap54curs4
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//cap55curs2
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });




const express=require('express');
const app=express();
const path=require('path');


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'/views'))




// cap51 curs3
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')



//cap49 curs4
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override')////cap38, curs7 min 5:30
app.use(methodOverride('_method'))


//cap43 curs4
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true})) //cap37 curs4 min2

//cap49,curs4
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//cap49,curs5
app.use(flash());


//cap 51 curs3
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//sa introduci user un session si ca sa il scoti din session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

// cap51 curs4
const userRoutes = require('./routes/users');


//min2:30 explicatia
app.use((req, res, next) => {
    //cap51 curs9
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);

//cap51 curs7
const { isLoggedIn,isAuthor,isReviewAuthor } = require('./middleware');


const Review = require('./models/review');
const Anunt=require('./models/anunt')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/licenta', { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true,useFindAndModify: false})
    .then(() => {
        console.log('connection open')
    })
    .catch(err => {
        console.log('eroare')
        console.log(err)
    })



app.listen(8080,()=>{
    console.log('am nevie de repetari a pasilor de baza ca asta')
})


app.get('/',(req,res)=>{
    res.render('homeee.ejs')
})

app.get('/home',(req,res)=>{
    res.render('home.ejs')
})
//cap51 curs7


//curs6 CREATE
//fotbal
app.get('/fotbal',isLoggedIn,(req,res)=>{
    res.render('fotbal.ejs')
})

app.post('/anunturiFotbal',isLoggedIn,catchAsync( async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.info,
        limit: 1
    }).send()
    
    const anuntNouFotbal=new Anunt(req.body) 
    //cap55curs3
    anuntNouFotbal.geometry = geoData.body.features[0].geometry;
    //cap52curs1
    anuntNouFotbal.author = req.user._id;
    await anuntNouFotbal.save()
    console.log(anuntNouFotbal)
    req.flash('success', 'Ad created successfully!');
    res.redirect(`/anunt/fotbal/${anuntNouFotbal._id}`)
    
}))



//tenis
app.get("/tenis",isLoggedIn,(req,res,next)=>{
    res.render('tenis.ejs')
})

app.post('/anunturiTenis',isLoggedIn,catchAsync( async(req,res)=>{
     //cap55curs3
    const geoData = await geocoder.forwardGeocode({
        query: req.body.info,
        limit: 1
    }).send()
    

    const anuntNouTenis=new Anunt(req.body) 
    //cap55curs3
    anuntNouTenis.geometry = geoData.body.features[0].geometry;
    //cap52curs1
    anuntNouTenis.author = req.user._id;
    await anuntNouTenis.save()
    req.flash('success', 'Ad created successfully!');
    res.redirect(`/anunt/tenis/${anuntNouTenis._id}`)

}))



//baschet
app.get('/baschet',isLoggedIn,(req,res,next)=>{
    res.render('baschet.ejs')
})

app.post('/anunturiBaschet',isLoggedIn,catchAsync(async(req,res)=>{
       //cap55curs3
       const geoData = await geocoder.forwardGeocode({
        query: req.body.info,
        limit: 1
    }).send()
    
    const anuntNouBaschet=new Anunt(req.body) 
      //cap55curs3
      anuntNouBaschet.geometry = geoData.body.features[0].geometry
    //cap52curs1
    anuntNouBaschet.author = req.user._id;
    await anuntNouBaschet.save()
    req.flash('success', 'Ad created successfully!');
    res.redirect(`/anunt/baschet/${anuntNouBaschet._id}`)

}))









//curs4 PRODUCT INDEX

// app.get('/anunturiFotbal',catchAsync(async(req,res)=>{
//     const anunturi=await Anunt.find({sport:'fotbal'})
//     res.render('anunturiFotbal.ejs',{anunturi})
// }))

// app.get('/anunturiTenis',catchAsync(async(req,res)=>{
//     const anunturi=await Anunt.find({sport:'tenis'})
//     res.render('anunturiTenis.ejs',{anunturi})
// }))

// app.get('/anunturiBaschet',catchAsync(async(req,res)=>{
//     const anunturi=await Anunt.find({sport:'baschet'})
//     res.render('anunturiBaschet.ejs',{anunturi})
// }))

app.get('/anunturi/:sportParam',catchAsync(async(req,res)=>{
        const {sportParam} =req.params
        const anunturi=await Anunt.find({sport:sportParam})
        res.render('anunturi.ejs',{anunturi})
    }))




    




//curs5 PRODUCT DETAILS

// app.get('/anunturiFotbal/:id',catchAsync(async(req,res)=>{
//     const {id}=req.params
//     const anuntFotbal=await Anunt.findById(id)
//     res.render('showFotbal.ejs',{anuntFotbal})
// }))

// app.get('/anunturiTenis/:id',catchAsync( async(req,res)=>{
//     const {id}=req.params
//     const anuntTenis=await Anunt.findById(id)
//     res.render('showTenis.ejs',{anuntTenis})
// }))

// app.get('/anunturiBaschet/:id',catchAsync(async(req,res)=>{
//     const {id}=req.params
//     const anuntBaschet=await Anunt.findById(id)
//     res.render('showBaschet.ejs',{anuntBaschet})
// }))

app.get('/anunt/:sport/:id',catchAsync(async(req,res)=>{
    const {id, sport} =req.params
    const anunt=await Anunt.findById(id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!anunt) {
        req.flash('error', 'Ad not found!');
        return res.redirect(`/anunturi/${sport}`);
    }
    const split=anunt.dataSiOra.toString().split(' ')
    const ora=split[4]
    switch (sport) {
        case 'fotbal':
            res.render('showFotbal.ejs',{anunt,ora})
          break;
          case 'tenis':
            res.render('showTenis.ejs',{anunt,ora})
          break;
          case 'baschet':
            res.render('showBaschet.ejs',{anunt,ora})
          break;
      }
}))





//ANUNTURILE MELE
app.get('/anunturile-mele',catchAsync(async(req,res)=>{  
if(req.user){ 
    const anunturileMele=await Anunt.find({author:req.user._id})
    res.render('mele.ejs',{anunturileMele})
}
}))

















//curs7 PRODUCT UPDATE 
//fotbal
app.get('/anunturiFotbal/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntFotbalEditat=await Anunt.findById(id)
    res.render('fotbalEdit.ejs',{anuntFotbalEditat})
}))



app.put('/anunturiFotbal/:id',isLoggedIn,catchAsync(async (req,res)=>{
    const { id } = req.params;
    const geoData = await geocoder
       .forwardGeocode({
          query: req.body.info,
          limit: 1,
       })
       .send();
    const anuntFotbalEditat = await Anunt.findByIdAndUpdate(id, {
       ...req.body,
    });
    console.log(anuntFotbalEditat)
   
    anuntFotbalEditat.geometry = geoData.body.features[0].geometry
    await anuntFotbalEditat.save();
    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/fotbal/${anuntFotbalEditat.id}`)
   
}))
//la updade runValidators,new:true cap37 curs11 min3


//tenis
app.get('/anunturiTenis/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntTenisEditat=await Anunt.findById(id)
    res.render('tenisEdit.ejs',{anuntTenisEditat})
}))

app.put('/anunturiTenis/:id',isLoggedIn,catchAsync(async (req,res)=>{
    const { id } = req.params;
    const geoData = await geocoder
       .forwardGeocode({
          query: req.body.info,
          limit: 1,
       })
       .send();
    const anuntTenisEditat = await Anunt.findByIdAndUpdate(id, {
       ...req.body,
    });
    
   
    anuntTenisEditat.geometry = geoData.body.features[0].geometry
    await anuntTenisEditat.save();
    
    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/tenis/${anuntTenisEditat.id}`)
   
}))


//baschet
app.get('/anunturiBaschet/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntBaschetEditat=await Anunt.findById(id)
    res.render('baschetEdit.ejs',{anuntBaschetEditat})
}))

app.put('/anunturiBaschet/:id',isLoggedIn,catchAsync(async (req,res)=>{
    const { id } = req.params;
    const geoData = await geocoder
       .forwardGeocode({
          query: req.body.info,
          limit: 1,
       })
       .send();
    const anuntBaschetEditat = await Anunt.findByIdAndUpdate(id, {
       ...req.body,
    });
    
   
    anuntBaschetEditat.geometry = geoData.body.features[0].geometry
    await anuntBaschetEditat.save();
    
    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/baschet/${anuntBaschetEditat.id}`)
   
}))



//curs 9 DELETE
//fotbal
app.delete('/anunt/fotbal/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntFotbalSters=await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/fotbal')
}))

//tenis
app.delete('/anunt/tenis/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntTenisSters=await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/tenis')
}))

//baschet
app.delete('/anunt/baschet/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id}=req.params
    const anuntBaschetSters=await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/baschet')
}))



//cap46 curs3 CREATE REVIEW
app.post('/anunt/:sport/:id/reviews',isLoggedIn,catchAsync(async(req,res)=>{
    const anunt = await Anunt.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    anunt.reviews.push(review);
    await review.save();
    await anunt.save();
    req.flash('success', 'Review created successfully!');
    res.redirect(`/anunt/${anunt.sport}/${anunt._id}`);
}))


// cap 46 curs7 DELETE REVIEW
app.delete("/anunt/:sport/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
const anunt = await Anunt.findById(req.params.id);
const{id, reviewId}=req.params
await Anunt.findByIdAndUpdate(id,{$pull: { reviews: reviewId}})
await Review.findByIdAndDelete(reviewId);
req.flash('success', 'Review successfully deleted !');
res.redirect(`/anunt/${anunt.sport}/${anunt._id}`)
}))


















//cap43 curs5
//nu mai scrii throw new error... si dupa next(err) faci direct next(+crearea de eroare)
app.all('*',(req, res, next)=>{
    next(new ExpressError('Page not found', 404))
})

//cap43 curs4
//https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/22086066#questions/15603614/
app.use((err ,req, res, next)=>{
    const{statusCode=500}=err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', {err})
})






















