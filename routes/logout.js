'use strict';

const express = require('express');
const router = express.Router();

// Route per il logout
router.get('/logout', (req, res) => { // modifica da [GET] a [DELETE]
    // Elimino la sessione (viene cancellato il file nella cartella sessions) e reindirizzo l'utente a '/'
    req.session.destroy((err) => err ? res.status(500).json({ error: err.message }) : res.redirect('/')); 

});

module.exports = router;