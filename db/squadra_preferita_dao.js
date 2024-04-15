'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./db/prova.db', (err) => { if (err) throw err; });

function getSquadraPreferitaFromDB(id, provider) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM squadra_preferita WHERE id_user = ? AND provider_user = ?';
        db.get(sql, [id, provider], (err, row) => {
            if (!err) {
                const result = row
                resolve(result); 
            } else {
                reject(err);
            }        
        });
    });  
};

function addSquadraPreferitaToDB(id, provider, squadra) {

    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO squadra_preferita (id_user, provider_user, squadra) VALUES (?,?,?)';
        db.run(sql, [id, provider, squadra], function (err) {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }        
        });
    });  
};




module.exports = { 
    getSquadraPreferitaFromDB,
    addSquadraPreferitaToDB
};