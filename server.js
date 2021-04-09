
'use strict';
// Module
const express = require('express');
//const db = require('nano')('http://montse:mva123@localhost:5984').db;
const db = require('nano')('http://admin:admin@localhost:5984').db;

// Variablen
const server = express();

// Middleware
server.use(express.static('public', {
    extensions: ['html']
}));

server.use(express.json());

// Routen
server.get('/loadQuiz', (req, res) => {
    let dbName = 'quiz';
    db.use(dbName).list({
        include_docs: true
    }).then(
        data => data.rows.map(row => row.doc)
    ).then(
        data => data.filter(el => !el._id.includes('_design'))
    ).then(
        data => res.send(JSON.stringify(data))
    ).catch(
        err => res.send('[]')
    )
})
server.get('/loadBereiche', (req, res) => {
    let dbName = 'quiz';
    db.use(dbName).view('bereiche', 'indexbereiche').then(
        data => data.rows.map(row => row.value)
    ).then(
        data => res.send(JSON.stringify(data))
    ).catch(
        err => res.send('[]')
    )
})
server.get('/loadviews', (req, res) => {
    let dbName = 'quiz';
    db.use(dbName).view(req.query.view, `index${req.query.view}`).then(
        data => data.rows.map(row => row.value)
    ).then(
        data => res.send(JSON.stringify(data))
    ).catch(
        err => res.send('[]')
    )
})

server.post('/saveFrage', (req, res) => {
    let dbName = 'quiz';
    db.use(dbName).insert(req.body).then(
        () => res.send(JSON.stringify('OK'))
    ).catch(
        err => res.send(JSON.stringify('UNOK'))
    )
})
server.post('/loginChecken', (req, res) => {
    let dbName = 'admins';
    db.use(dbName).find({
        selector: {
            user: {
                '$eq': req.body.user
            }
        }
    }).then(
        antwort => {
            if (antwort.docs.length == 0) {
                res.send(JSON.stringify('NOUSER'));
            } else if (antwort.docs[0].pwd == req.body.pwd) {
                res.send(JSON.stringify('OK'));
            } else res.send(JSON.stringify('PWDKO'));

        }
    ).catch(
        err => console.log(err)
    )
})
server.get('*', (req, res) => {
    res.send(`${req.url} nicht gefunden`);
})

// Funktionen
const init = () => {
    server.listen(80, err => console.log(err || 'Server läuft'));
}

// Init
init();

