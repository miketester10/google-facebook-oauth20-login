'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const utenti_dao = require('../db/utenti_dao');
const Utente = require('../db/utente'); // Importo il modello utente

/*** Set up Passport ***/
// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
  },
  function (accessToken, refreshToken, profile, done) {
    const utente = new Utente(  profile.id, 
                                profile._json.given_name, 
                                profile._json.family_name, 
                                profile._json.email, 
                                profile.provider );
    utenti_dao.getUserFromDB(utente).then((user) => {
        
        if (!user) {
            console.log('Utente non esistente nel DB! Lo inserisco..');
            utenti_dao.insertUserIntoDB(utente).then(() => {
                console.log('Utente inserito nel DB! Login effettuato con successo!');
                return done(null, utente); // restituisce l'oggetto utente alla route
            }).catch((err) => {
                console.error('Errore catturato: ', err);
                return done(null, false); // mettendo false restituisce uno status code 401 Unauthorized
            });    
        } else {
            console.log('Login effettuato con successo!');
            return done(null, utente); // restituisce l'oggetto utente alla route 
        };
    
    }).catch((err) => {
        console.error('Errore catturato: ', err);
        return done(null, false); // mettendo false restituisce uno status code 401 Unauthorized
    });
    }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
    profileFields: ['first_name', 'last_name', 'email'] // A differenza di Google, per Facebook [nome, cognome, email] sono opzionali quindi devo specificarli se voglio riceverli.
  },
  function (accessToken, refreshToken, profile, done) {
    const utente = new Utente(  profile.id, 
                                profile._json.first_name, 
                                profile._json.last_name, 
                                profile._json.email, 
                                profile.provider );
    utenti_dao.getUserFromDB(utente).then((user) => {
        
        if (!user) {
            console.log('Utente non esistente nel DB! Lo inserisco..');
            utenti_dao.insertUserIntoDB(utente).then(() => {
                console.log('Utente inserito nel DB! Login effettuato con successo!');
                return done(null, utente); // restituisce l'oggetto utente alla route
            }).catch((err) => {
                console.error('Errore catturato: ', err);
                return done(null, false); // mettendo false restituisce uno status code 401 Unauthorized
            });    
        } else {
            console.log('Login effettuato con successo!');
            return done(null, utente); // restituisce l'oggetto utente alla route 
        };
    
    }).catch((err) => {
        console.error('Errore catturato: ', err);
        return done(null, false); // mettendo false restituisce uno status code 401 Unauthorized
    });
    }
));

/*** Configuro Passport serializeUser e deserializeUser ***/
// Nel caso in cui l'oggetto user da serializzare è troppo grande o contiene informazioni sensibili(es. dati finanziari, ecc..), posso serializzare solo l'id ed il provider e poi recuperare tutti i dati con deserializeUser facendo una chiamata al Database. In questo caso l'oggetto user è un oggetto piccolo che non contiene dati sensibili quindi lo serializzo tutto e lo passo a deserializeUser.
passport.serializeUser(function (user, done) {
    // console.log(`Sto serializzando l'utente ${user.id} del provider ${user.provider}!`); 
    done(null, user); 
  });
  
passport.deserializeUser(function (user, done) {
    // console.log(`Sto deserializzando l'utente ${user.email}!`); 
    done(null, user);
  });

module.exports = passport;