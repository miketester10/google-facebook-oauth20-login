'use strict';

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const squadra_preferita_dao = require('./db/squadra_preferita_dao');
require('dotenv').config();

/*** Inizializzo Express ***/
const app = express();
const PORT = process.env.PORT || 3000;

/*** Set up Router ***/
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

/*** Set up Middleware ***/
app.use(express.json());
app.use(express.static('public')); // configuro Express per servire i file statici dalla cartella 'public'.
/*** Middleware per verificare se l'utente è autenticato o meno quando chiama una route (serve anche a proteggere la route, in quanto se l'utente non è autenticato e prova ad accedere alla route ottiene un errore: status code "401" ed il messaggio error: Utente non autenticato!) ***/
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { // controllo se sono autenticato (dopo esser stato deserializzato con passport.deserializeUser), prima di procedere con il codice presente nella route chiamante, altrimenti viene restituito un 401 Unauthorized
        console.log(`L'utente ${req.user.nome} è autenticato!`);
        return next();
    };
    return res.status(401).json({ error: 'Utente non autenticato!' });
};

/*** Abilito sessioni in Express (usando 'session-file-store') ***/
app.use(session({
    store: new FileStore(),
    secret: process.env.SECRET, // Frase segreta (posso scrivere qualsiasi cosa) da non condividere con nessuno. Serve a firmare il cookie Session ID'. La metto in una variabile d'ambiente.
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'Lax' } // imposto sameSite a 'Lax' per limitare attacchi CSRF. Inoltre aggiungere { secure: true } per abilitare l'utilizzo dei cookie con connessioni HTTPS.
}));

/*** Abilito Passport per usare le sessioni ****/
app.use(passport.initialize());
app.use(passport.session());

/*** Abilito le Routes */
app.use(loginRouter);
app.use(logoutRouter);

/*** Definisco tutte le Route ***/
// Route per homepage
app.get('/homepage', isLoggedIn, async (req, res) => {
    try {
        const id = req.user.id;
        const provider = req.user.provider;
        let result = await squadra_preferita_dao.getSquadraPreferitaFromDB(id, provider);
        if (result === undefined) { result = {squadra: 'Nessuna'}; };  
        res.send(`
            <div>
                <h1>Ciao, ${req.user.nome}!</h1>
                <p> La mia squadra preferita è: ${result.squadra} </p>
                <form action="/logout">
                    <button type="submit">Logout</button>
                </form>
            </div>
        `);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
});

// Route per aggiungere una squadra preferita
app.post('/api/v1/squadra', isLoggedIn, async (req, res) => {
    try {
        // console.log(req.body.squadra);
        const id = req.user.id;
        const provider = req.user.provider;
        const squadra = req.body.squadra;
        await squadra_preferita_dao.addSquadraPreferitaToDB(id, provider, squadra);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }  
});

/*** Avvio del server ***/
app.listen(PORT, () => {
    console.log(`Il server è in ascolto sulla porta ${PORT}`);
});  