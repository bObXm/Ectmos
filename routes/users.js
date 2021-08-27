// cap51 curs4
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');


//REGISTER
router.get('/register', (req, res) => {
    res.render('users/register.ejs');
});

router.post('/register',catchAsync(async (req, res,next) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        //cap51 curs10
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Ectmos!');
            res.redirect('/');
        })
    }catch(e){
            req.flash('error', e.message);
            res.redirect('register');
    }
}))



// cap51 curs6
// LOGIN
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/');
})




// cap51 curs8
//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
})









module.exports = router;




