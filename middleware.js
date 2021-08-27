//cap52 curs4
const Anunt=require('./models/anunt')
const Review = require('./models/review');


//cap51 curs7
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



module.exports.isAuthor = async (req, res, next) => {
    const { id, sport } = req.params;
    const anunt = await Anunt.findById(id);
    if (!anunt.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/anunturi/${anunt.sport}`);
    }
    next();
}

//cap52 curs6
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId ,anunt,sport} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/');
    }
    next();
}




