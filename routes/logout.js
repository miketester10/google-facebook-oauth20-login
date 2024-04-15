'use strict';

const express = require('express');
const router = express.Router();

// Route per il logout
router.get('/logout', (req, res) => { // modificare da [GET] a [DELETE]
    // Elimino la sessione (viene cancellato il file nella cartella sessions), elimino il cookie dal client e reindirizzo l'utente a '/'
    req.session.destroy((err) => {
        if (err) { res.status(500).json({ error: err.message }) };
        res.clearCookie('connect.sid')
        res.redirect('/');
        console.log('Logout effettuato!');
    }); 
});

module.exports = router;