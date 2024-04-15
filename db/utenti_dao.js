'use strict';

const sqlite = require('sqlite3');
const Utente = require('../db/utente'); // Importo il modello utente

const db = new sqlite.Database('./db/prova.db', (err) => { if (err) throw err; });

function getUserFromDB(user) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ? AND provider = ?';
        db.get(sql, [user.id, user.provider], (err, row) => {
            if (err) { // errore durante la query
                reject(err);
            } else if (row === undefined) { // user non trovato (ovvero id del determinato provider non trovata nel db)
                resolve(false);
            } else { // user trovato (ovvero id del determinato provider trovato nel db)
                const user = new Utente(  row.id, 
                                          row.nome, 
                                          row.cognome, 
                                          row.email, 
                                          row.provider );
                resolve(user);
            }
        });
    });
};

function insertUserIntoDB(user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (id, nome, cognome, email, provider) VALUES (?,?,?,?,?)';
        db.run(sql, [user.id, user.nome, user.cognome, user.email, user.provider], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = { 
    getUserFromDB,
    insertUserIntoDB 
};