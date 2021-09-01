//cap54curs4
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//cap55curs2
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const path = require('path');


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


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

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true })) //cap37 curs4 min2



//cap59 curs2+4
const dbUrl= 'mongodb://localhost:27017/licenta'
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const MongoDBStore = require("connect-mongo")(session);
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

//cap49,curs4
const sessionConfig = {
    store,
    secret,
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
const { isLoggedIn, isAuthor, isReviewAuthor } = require('./middleware');


const Review = require('./models/review');
const Anunt = require('./models/anunt')
const mongoose = require('mongoose');
const EchipaBaschet = require('./models/echipaBaschet');
const EchipaTenis = require('./models/echipaTenis');
const EchipaFotbal = require('./models/echipaFotbal');

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('MongoDB connection open!')
    })
    .catch(err => {
        console.log('eroare')
        console.log(err)
    })


//cap59 curs5
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`)
})


app.get('/', (req, res) => {
    res.render('homeee.ejs')
})

app.get('/home', (req, res) => {
    res.render('home.ejs')
})
//cap51 curs7


//curs6 CREATE
//fotbal
app.get('/fotbal', isLoggedIn, (req, res) => {
    res.render('fotbal.ejs')
})

app.post('/anunturiFotbal', isLoggedIn, catchAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.oras,
        limit: 1
    }).send()

    const team = new EchipaFotbal({
        portar: [],
        fundas: [],
        mijlocas: [],
        atacant: []
    }).save();

    const anuntNou = await Anunt.create({
        ...req.body,
        geometry: geoData.body.features[0].geometry,
        author: req.user._id,
        
        team: team._id,
        onModel: 'EchipaFotbal'
    });

    req.flash('success', 'Ad created successfully!');
    res.redirect(`/anunt/fotbal/${anuntNou._id}`)

}))



//tenis
app.get("/tenis", isLoggedIn, (req, res) => {
    res.render('tenis.ejs')
})

app.post('/anunturiTenis', isLoggedIn, catchAsync(async (req, res) => {
    //cap55curs3
    const geoData = await geocoder.forwardGeocode({
        query: req.body.oras,
        limit: 1
    }).send()

    const team = new EchipaTenis({
        partner: {
            counter: req.body.partnerCounter,
            players: []
        }
    });
    await team.save();
    const anuntNou = await Anunt.create({
        ...req.body,
        geometry: geoData.body.features[0].geometry,
        author: req.user._id,
        
        team: team._id,
        onModel: 'EchipaTenis'
    });

    req.flash('success', 'Ad created successfully!');
    res.redirect(`/anunt/tenis/${anuntNou._id}`)

}))



//baschet
app.get('/baschet', isLoggedIn, (req, res) => {
    res.render('baschet.ejs')
})

app.post('/anunturiBaschet', isLoggedIn, catchAsync(async (req, res) => {
    //cap55curs3
    const geoData = await geocoder.forwardGeocode({
        query: req.body.oras,
        limit: 1
    }).send()
    const team = new EchipaBaschet({
        center: [],
        pForward: [],
        sForward: [],
        pGuard: [],
        sGuard: []
    }).save();

    const anuntNou = await Anunt.create({
        ...req.body,
        geometry: geoData.body.features[0].geometry,
        author: req.user._id,
        
        team: team._id,
        onModel: 'EchipaBaschet'
    });

    req.flash('success', 'Ad created successfully!!');
    res.redirect(`/anunt/baschet/${anuntNou._id}`)
}))

app.post('/anunturiFotbal/:id', bodyParser.json(), isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.oras,
            limit: 1,
        })
        .send();
    const anuntEditat = await Anunt.findByIdAndUpdate(id, {
        ...req.body,
    });

    anuntEditat.geometry = geoData.body.features[0].geometry
    await anuntEditat.save();
    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/fotbal/${anuntEditat.id}`)

}))

app.get('/anunturi/:sportParam', catchAsync(async (req, res) => {
    const { sportParam } = req.params
    const anunturi = await Anunt.find({ sport: sportParam })
    res.render('anunturi.ejs', { anunturi })
}))


//ANUNTURILE MELE
app.get('/anunturile-mele', catchAsync(async (req, res) => {
    if (req.user) {
        const anunturi = await Anunt.find({ author: req.user._id })
        res.render('anunturi.ejs', { anunturi })
    }
}))

app.get('/anunt/:sport/:id', catchAsync(async (req, res) => {
    const { id, sport } = req.params
    // let ref;
    // switch (sport) {
    //     case 'fotbal':
    //         ref = "EchipaFotbal"
    //         break;
    //     case 'tenis':
    //         ref = "EchipaTenis"
    //         break;
    //     case 'baschet':
    //         ref = "EchipaBasket"
    //         break;
    // }

    const anunt = await Anunt.findById(id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author').populate('team').populate({
        path: 'team',
        populate: {
            path: 'players'
        }
    });

    if (!anunt) {
        req.flash('error', 'Ad not found!');
        return res.redirect(`/anunturi/${sport}`);
    }

    const split = anunt.dataSiOra.toString().split(' ')
    const ora = split[4]
    switch (sport) {
        case 'fotbal':
            res.render('showFotbal.ejs', { anunt, ora })
            break;
        case 'tenis':
            res.render('showTenis.ejs', { anunt, ora })
            break;
        case 'baschet':
            res.render('showBaschet.ejs', { anunt, ora })
            break;
    }
}))

//curs7 PRODUCT UPDATE 
//fotbal
app.get('/anunturiFotbal/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id)
    res.render('fotbalEdit.ejs', { anunt })
}))

//tenis
app.get('/anunturiTenis/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id)
    res.render('tenisEdit.ejs', { anunt })
}))

app.post('/anunturiTenis/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.oras,
            limit: 1,
        })
        .send();
    const anuntEditat = await Anunt.findByIdAndUpdate(id, {
        ...req.body,
    });

    anuntEditat.geometry = geoData.body.features[0].geometry
    await anuntEditat.save();

    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/tenis/${anuntEditat.id}`)
}))

app.put('/anunt/adauga-membru/:idAnunt', bodyParser.json(), isLoggedIn, catchAsync(async (req, res) => {
    const { idAnunt } = req.params;
    const anuntul = await Anunt.findById(idAnunt);
    if(anuntul.team){
        // TODO - switch based on sport
        const echipa = await EchipaTenis.findById(anuntul.team);
        // TODO - populate based on sport an position
        echipa[`${req.body.pozitie}`].players.push(req.body.user);

        await echipa.save();
    } else {
        // TODO - switch based on sport
        const team = new EchipaTenis({
            partner: {
                counter: 1,
                players: [req.body.user]
            }
        });
        await team.save();
        anuntul.team = team._id;
        // TODO - switch based on sport
        anuntul.onModel = "EchipaTenis";
        await anuntul.save();
    }

    res.send({
        'success': true,
        "message": 'Added you as member!',
        anuntul
    })
}))


//baschet
app.get('/anunturiBaschet/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id)
    res.render('baschetEdit.ejs', { anunt })
}))

app.post('/anunturiBaschet/:id', bodyParser.json(), isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.oras,
            limit: 1,
        })
        .send();
    const anuntEditat = await Anunt.findByIdAndUpdate(id, {
        ...req.body,
    });

    anuntEditat.geometry = geoData.body.features[0].geometry
    await anuntEditat.save();

    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/baschet/${anuntEditat.id}`)
}))

//fotbal
app.delete('/anunt/fotbal/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/fotbal')
}))

//tenis
app.delete('/anunt/tenis/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/tenis')
}))

//baschet
app.delete('/anunt/baschet/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/baschet')
}))

//cap46 curs3 CREATE REVIEW
app.post('/anunt/:sport/:id/reviews', isLoggedIn, catchAsync(async (req, res) => {
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
app.delete("/anunt/:sport/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const anunt = await Anunt.findById(req.params.id);
    const { id, reviewId } = req.params
    await Anunt.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted !');
    res.redirect(`/anunt/${anunt.sport}/${anunt._id}`)
}))

app.all('*', (req, res, next) => {
    // const err = { message: '404 Page not found', stack: ""};
    // res.status(404).render('error.ejs', {err} )
    // next();
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error.ejs', { err })
})