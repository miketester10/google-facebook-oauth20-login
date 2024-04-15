'use strict';

const express = require('express');
const router = express.Router();
const passport = require('../config/passport_auth');

/*** GOOGLE ***/
// Route per login/autenticazione con Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

// Route per callback del login con Google
router.get('/auth/google/callback', 
  passport.authenticate('google', {
        successRedirect: '/homepage',
        failureRedirect: '/'
    }
));

/*** FACEBOOK ***/
// Route per login/autenticazione con Facebook
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// Route per callback del login con Facebook
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
        successRedirect: '/homepage',
        failureRedirect: '/'
    }
));

module.exports = router;
