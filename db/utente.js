'use strict';

class Utente {
    constructor(id, nome, cognome, email, provider) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome
        this.email = email;
        this.provider = provider
    }
};

module.exports = Utente