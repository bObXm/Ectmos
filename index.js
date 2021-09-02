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
// const dbUrl=  'mongodb://localhost:27017/licenta'
const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/licenta'
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
//fotbal - create view
app.get('/fotbal', isLoggedIn, (req, res) => {
    res.render('fotbal.ejs')
})
//fotbal - create action
app.post('/anunturiFotbal', isLoggedIn, catchAsync(async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.oras,
        limit: 1
    }).send()

    const team = new EchipaFotbal({
        portar: {
            counter: req.body.portarCounter,
            players: []
        },
        fundas: {
            counter: req.body.fundasCounter,
            players: []
        },
        mijlocas: {
            counter: req.body.mijlocasCounter,
            players: []
        },
        atacant: {
            counter: req.body.atacantCounter,
            players: []
        }
    });
    await team.save();
    const anuntNou = await Anunt.create({
        ...req.body,
        geometry: geoData.body.features[0].geometry,
        author: req.user._id,
        
        team: team._id,
        onModel: 'EchipaFotbal'
    });

    req.flash('success', 'Football ad created successfully!');
    res.redirect(`/anunt/fotbal/${anuntNou._id}`)

}))



//tenis - create view
app.get("/tenis", isLoggedIn, (req, res) => {
    res.render('tenis.ejs')
})
//tenis - create action
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



//baschet - create view
app.get('/baschet', isLoggedIn, (req, res) => {
    res.render('baschet.ejs')
})
//baschet - create action
app.post('/anunturiBaschet', isLoggedIn, catchAsync(async (req, res) => {
    //cap55curs3
    const geoData = await geocoder.forwardGeocode({
        query: req.body.oras,
        limit: 1
    }).send()
    const team = new EchipaBaschet({
        center: {
            counter: req.body.centerCounter,
            players: []
        },
        pForward: {
            counter: req.body.pForwardCounter,
            players: []
        },
        sForward: {
            counter: req.body.sForwardCounter,
            players: []
        },
        pGuard: {
            counter: req.body.pGuardCounter,
            players: []
        },
        sGuard: {
            counter: req.body.sGuardCounter,
            players: []
        }
    });
    await team.save();

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




// lista anunturi
app.get('/anunturi/:sportParam', catchAsync(async (req, res) => {
    const { sportParam } = req.params
    let anunturi = [];
    if(req.user) {
        anunturi = await Anunt.find({ 
            sport: sportParam, 
            author: { $ne: req.user._id } }).populate('author')
    } else {
        anunturi = await Anunt.find({ sport: sportParam }).populate('author')
    }
    res.render('anunturi.ejs', { anunturi })
}))

//ANUNTURILE MELE
app.get('/anunturile-mele', catchAsync(async (req, res) => {
    if (req.user) {
        const anunturi = await Anunt.find({ author: req.user._id }).populate('author')
        res.render('anunturi.ejs', { anunturi })
    }
}))



// pagina detalii anunt - orice tip de anunt
app.get('/anunt/:sport/:id', catchAsync(async (req, res) => {
    const { id, sport } = req.params
    let pathToPopulate;
    switch (sport) {
        case 'tenis':
            pathToPopulate = {
                populate: {
                path: 'partner.players'
            }}
            break;
        case 'fotbal':
            pathToPopulate = {
                populate: {
                path: 'portar.players fundas.players mijlocas.players atacant.players'
            }}
            break;
        case 'baschet':
            pathToPopulate = {
                populate: {
                path: 'center.players pForward.players sForward.players pGuard.players sGuard.players'
            }}
            break;
    }

    const anunt = await Anunt.findById(id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author').populate('team').populate({
        path: 'team',
        ...pathToPopulate
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
//fotbal - edit view
app.get('/anunturiFotbal/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id).populate('team').populate({
        path: 'team',
        populate: {
            path: 'portar.players fundas.players mijlocas.players atacant.players'
        }
    });
    res.render('fotbalEdit.ejs', { anunt })
}))

//fotbal - edit action
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

    const echipa = await EchipaFotbal.findById(anuntEditat.team);
    echipa.portar.counter = req.body.portarCounter;
    echipa.mijlocas.counter = req.body.mijlocasCounter;
    echipa.fundas.counter = req.body.fundasCounter;
    echipa.atacant.counter = req.body.atacantCounter;
    await echipa.save();

    await anuntEditat.save();
    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/fotbal/${anuntEditat.id}`)

}))


//tenis - edit view
app.get('/anunturiTenis/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id).populate('team').populate({
        path: 'team',
        populate: {
            path: 'players'
        }
    });
    res.render('tenisEdit.ejs', { anunt })
}))

//tenis - edit action
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

    anuntEditat.geometry = geoData.body.features[0].geometry;

    const echipa = await EchipaTenis.findById(anuntEditat.team);
    echipa.partner.counter = req.body.partnerCounter;
    await echipa.save();

    await anuntEditat.save();

    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/tenis/${anuntEditat.id}`)
}))


//baschet - edit view
app.get('/anunturiBaschet/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const anunt = await Anunt.findById(id).populate('team').populate({
        path: 'team',
        populate: {
            path: 'center.players pForward.players sForward.players pGuard.players sGuard.players'
        }
    });
    res.render('baschetEdit.ejs', { anunt })
}))

//baschet - edit action
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

    const echipa = await EchipaBaschet.findById(anuntEditat.team);
    echipa.center.counter = req.body.centerCounter;
    echipa.pForward.counter = req.body.pForwardCounter;
    echipa.sForward.counter = req.body.sForwardCounter;
    echipa.pGuard.counter = req.body.pGuardCounter;
    echipa.sGuard.counter = req.body.sGuardCounter;
    await echipa.save();

    await anuntEditat.save();

    req.flash('success', 'Update completed successfully!');
    res.redirect(`/anunt/baschet/${anuntEditat.id}`)
}))


// add new member for any type of ad
// current implementation supports only adding an ad for tennis
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

    const user = req.user;

    req.flash('success', 'Successfully added you as a team player!');
    res.send({
        'success': true,
        user
    })
}))


//delete ad
app.delete('/anunt/:sport/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { sport, id } = req.params
    await Anunt.findByIdAndDelete(id)
    req.flash('success', 'Ad deleted successfully!');
    res.redirect('/anunturi/'+sport)
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