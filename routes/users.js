const express = require('express');
const { register } = require('../models/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async(req, res) => {
   try{
    const {email, username, password } =req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
    
    req.flash('success', 'Welocome to Tee Rex');
    res.redirect('/tshirts');
    });
   } catch (e)
   {
    req.flash('error', e.message);
    res.redirect('register');
   }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect:'/login'}), (req, res) => {
    const author = req.user.username;
    req.flash('success', `Welcome back! ${author}`);
    const redirectUrl = req.session.returnTo || '/tshirts';
    delete req.session.returnTo;
   res.redirect(redirectUrl); 
});

router.get('/logout', (req, res) => {

    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Good Bye!!');
        res.redirect('/');
    });
});


module.exports = router;