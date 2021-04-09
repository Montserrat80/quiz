'use strict';
// IMPORT
import dom from './domAdmin.js';
import formularAdmin from './formularAdmin.js';
import db from './couchDB.js';
import MD5 from './md5.js';

// VARIABLEN
const eingabenContainer = document.querySelector('#eingabenContainer');
const warningContainer = document.querySelector('#warningContainer');
let bereiche = [];

// FUNKTIONEN
const frageSpeichern = () => {
    let dataForm = formularAdmin.readFormular(eingabenContainer);
    if (!dataForm) {
        formularAdmin.displayWarning(warningContainer, 'alle Eingabefelder sind pflicht!');
        return
    }
    //server - speichern
    db.frageSpeicherneDB({
        bereich: dataForm.bereich,
        frage: dataForm.frage,
        antworten: dataForm.antworten
    }).then(
        antwort => {
            formularAdmin.displayWarning(warningContainer, 'speichern erfolgreich!');
            formularZeigen();
        }
    ).catch(
        err => console.log(err)
    )
}
const formularZeigen = () => {
    eingabenContainer.innerHTML = '';
    //Formular erzeugen
    dom.templates.createFormular(eingabenContainer, bereiche)
    let btn = dom.templates.createSummitBtn(eingabenContainer)
    btn.addEventListener('click', frageSpeichern);
    eingabenContainer.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) frageSpeichern();
    });
}
const loadInfoFormular = () => {
    warningContainer.style.display = "none"
    //Get Bereiche (view) from couchDB
    db.loadBereicheDB().then(
        data => {
            bereiche = data;
            formularZeigen();
        }
    ).catch(
        err => console.log(err)
    )
}
const loginChecken = () => {
    //1 controlar que no entrin blancs
    let loginUser = eingabenContainer.querySelector('[name=user]');
    let loginPwd = eingabenContainer.querySelector('[name=pwd]');
    loginUser.classList.remove('rot');
    loginPwd.classList.remove('rot');
    if ((loginUser.value).trim() == "") {
        loginUser.classList.add('rot');
        formularAdmin.displayWarning(warningContainer, 'Bitte füllen Sie das Feld - Benutzername - aus');
        return;
    };
    if ((loginPwd.value).trim() == "") {
        loginPwd.classList.add('rot');
        formularAdmin.displayWarning(warningContainer, 'Bitte füllen Sie das Feld - Passwort - aus');
        return;
    };
    //2 PWD verschlüsseln
    let pwdVerschluesselt = MD5(loginPwd.value);
    //3 couchDB - User/pwd checken
    db.loginChecken({
        user: loginUser.value,
        pwd: pwdVerschluesselt
    }).then(
        data => {
            switch (data) {
                case 'NOUSER':
                    formularAdmin.displayWarning(warningContainer, 'Benutzername nicht gefunden');
                    break;
                case 'PWDKO':
                    formularAdmin.displayWarning(warningContainer, 'Passwort nicht korrekt');
                    break;
                case 'OK':
                    loadInfoFormular();
            }

        }
    ).catch(
        err => console.log(err)
    )
}
const init = () => {
    warningContainer.style.display = "none"
    //Formular Anmelden erzeugen
    let loginContainer = dom.templates.createLoginFormular(eingabenContainer);
    let btnLogin = dom.templates.createLoginBtn(loginContainer);
    btnLogin.addEventListener('click', loginChecken);
    loginContainer.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) loginChecken();
    });
}

// INIT
init();
