'use strict';
// IMPORT
import domQuiz from './domQuiz.js';
import formularQuiz from './formularQuiz.js';
import db from './couchDB.js';

// VARIABLEN
const quizContainer = document.querySelector('#quizContainer');
const countDownContainer = document.querySelector('#countDownContainer');
const btnQuiz = document.querySelector('#btnQuiz');
const btnQuizAdv = document.querySelector('#btnQuizAdv');
const btnBereich = document.querySelector('#btnBereich');
let dataDB = [];
let bereiche = [];
let userBereiche = [];
let zufallZahlen;
const MIN = 0, ZAHL_FRAGEN = 10;
let max = 0, countRichtig = 0, countFalsch = 0, countUnbeantwortet = 0;
let richtigeAntwort;
const MAXTIMER = 10;
let time = MAXTIMER;
let countDownTimer;
let quizLevel;
let readBD = true;

// FUNKTIONEN
const checkAntwort = event => {
    //poso el container de les respostes a inactiu, pq no puguin donar
    //una altra resposta en aquest moment
    if (quizLevel == 'advanced') clearInterval(countDownTimer);
    quizContainer.querySelector('.antworten').classList.add('disabled');
    //correcte --> verd, incorrecte -->vermell 
    setTimeout(function () {
        if (richtigeAntwort == event.target.value) {
            countRichtig++;
            event.target.parentNode.classList.add('gruen');
        } else {
            countFalsch++;
            event.target.parentNode.classList.add('rot');
            quizContainer.querySelector(`#antwort${richtigeAntwort}`)
                .parentNode.classList.add('gruen');
        }
    }, 500);
    //despres d´un temps tornem a deixar el container llest per a la propera 
    //pregunta i anem a la següent pregunta automaticament
    setTimeout(function () {
        event.target.checked = false;
        event.target.parentNode.classList.remove('rot');
        quizContainer.querySelector(`#antwort${richtigeAntwort}`)
            .parentNode.classList.remove('gruen');
        quizContainer.querySelector('.antworten').classList.remove('disabled');
        if (zufallZahlen.length == 0) {
            endQuiz(); 
        } else {
            fragenStellen();
        }
    }, 2000);
    
}
const endQuiz = () => {
    //donar resultats
    quizContainer.innerHTML = '';
    countDownContainer.style.display = "none";
    domQuiz.templates.createEndQuiz({
        eltern: quizContainer,
        inhalt1: `Sie haben ${Math.round(100 / ZAHL_FRAGEN * countRichtig)}% der Fragen richtig beantwortet`,
        inhalt2: `Richtig: ${countRichtig}`,
        inhalt3: `Falsch: ${countFalsch}`,
        inhalt4: `Unbeantwortet: ${countUnbeantwortet}`,
        quizLevel
    });

    let btn = domQuiz.templates.createNeuStartenBtn(quizContainer);
    // EVENTLISTENER 
    //btn.addEventListener('click',startQuiz);
    btn.addEventListener('click', startQuiz);
}
const startCountDown = () => {
    time = MAXTIMER;
    countDownContainer.style.display = '';
    countDownContainer.innerHTML = time;
    countDownTimer = setInterval(setTimer, 1000);
}
const setTimer = () => {
    time--;
    countDownContainer.innerHTML = time;
    if (time == 0) stopCountDown();
}
const stopCountDown = () => {
    clearInterval(countDownTimer);
    //haig de donar automaticament la resposta correcte
    countUnbeantwortet++;
    let containerRadio = quizContainer.querySelectorAll('[type=radio]');
    let elem = Array.from(containerRadio).find(e => {
        return (e.value == richtigeAntwort);
    });
    quizContainer.querySelector('.antworten').classList.add('disabled');
    setTimeout(function () {
        elem.checked = true;
        elem.parentNode.classList.add('gruen');
    }, 500);
    setTimeout(function () {
        elem.checked = false;
        elem.parentNode.classList.remove('gruen');
        quizContainer.querySelector('.antworten').classList.remove('disabled');
        if (zufallZahlen.length == 0) {
            endQuiz(); 
        } else {
            fragenStellen();
        }
    }, 2000);
}

const fragenStellen = () => {
    quizContainer.querySelector('#richtig').innerHTML = `Richtig: ${countRichtig}   -`;
    quizContainer.querySelector('#falsch').innerHTML = `Falsch: ${countFalsch}`;
    quizContainer.querySelector('#result').innerHTML = 
        `${Math.round(100 / ZAHL_FRAGEN * countRichtig)}%`;
    quizContainer.querySelector('#progress').value =
        `${(ZAHL_FRAGEN - zufallZahlen.length) / ZAHL_FRAGEN}`;
    //inicialitzar el comptador Timer
    if (quizLevel == 'advanced') startCountDown();
    quizContainer.querySelector('#frageN').innerHTML = 
        `Frage: ${ZAHL_FRAGEN - zufallZahlen.length + 1} von ${ZAHL_FRAGEN}`;
    quizContainer.querySelector('#frage').innerHTML =
        `${dataDB[zufallZahlen[0]].bereich}<br><br>${dataDB[zufallZahlen[0]].frage}`;
    dataDB[zufallZahlen[0]].antworten.forEach((e, index) => {
        quizContainer.querySelector(`#antwort${index + 1}`).innerHTML = e.antwort;
        if (e.richtig) richtigeAntwort = index + 1;
    })
    //entfernen erste element von zufallZahlen
    zufallZahlen.splice(0, 1);
}
const createRandom = (min, max, z) => {
    // Zufallszahlen erzeugen - no repetits
    let tmp = [];
    let zz;
    for (let i = 1; i <= z;) {
        zz = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tmp.includes(zz)) {
            tmp.push(zz);
            i++;
        }
    }
    return tmp;
}
const startQuiz = () => {
    if (countDownTimer) {
        clearInterval(countDownTimer);
        countDownContainer.innerHTML = '';
    };
    if (quizLevel == 'basic') countDownContainer.style.display = 'none';
    quizContainer.style.display = ''; //abans display == none
    quizContainer.innerHTML = '';
    //Array, num. random de les preguntes a preguntar
    zufallZahlen = createRandom(MIN, max, ZAHL_FRAGEN);
    countRichtig = 0;
    countFalsch = 0;
    countUnbeantwortet = 0;
    //Formular erzeugen
    domQuiz.templates.createQuiz(quizContainer);
    //Event für radio Buttons -- wenn user click Antwort
    let containerRadio = quizContainer.querySelectorAll('[type=radio]');
    containerRadio.forEach(e => {
        e.addEventListener('click', checkAntwort);
    });
    //fragen zeigen
    fragenStellen();
}
const getUserBereiche = () => {
    let container = quizContainer.querySelector('#bereiche');
    //si abans hem escollit categories, el contenidor no esta buit i per tan anem a llegir les que
    //l usuari ha escollit
    if (container != null){ 
        userBereiche = formularQuiz.readUserBereiche(quizContainer.querySelector('#bereiche'));
        readBD = true;
    }
    //readBD ens indica si cal no no llegir de la BD, no cal carregar sempre les dades
    //el primer cop segur que l hem de llegir per aixo a init() la posem a true
    if (readBD) {
        db.loadDB(userBereiche).then(
            data => {
                dataDB = data;
                max = dataDB.length - 1;
                readBD = false;
                startQuiz();
            }
        ).catch(
            err => console.log(err)
        );
    } else startQuiz();

}
//Usuari escull Allgemein o be Bereiche, si Algemein --> Bereiche desactivats
//Si Bereiche --> checkbox disponibles
const checkSelection = () => {
    let container = quizContainer.querySelector('#chkContainer');
    if (event.target.value == 'A') {
        container.classList.add('disabled');
        let ckb = container.querySelectorAll('[type=checkbox]');
        ckb.forEach(elem => elem.checked = false);
    }
    if (event.target.value == 'B') {
        container.classList.remove('disabled');
    }

}
const zeigUserBereiche = () => {
    quizContainer.style.display = ''; //abans display == none
    quizContainer.innerHTML = '';
    domQuiz.templates.createBereiche(quizContainer, bereiche);
    //radioButton: Allgemein,Bereiche: Si Algemein --> bloc Bereiche bloquejat
    let rdb = quizContainer.querySelectorAll('[type=radio]');
    rdb.forEach(e => {
        e.addEventListener('click', checkSelection);
    });
}
const loadZeigBereiche = () => {
    if (countDownTimer) {
        clearInterval(countDownTimer);
        countDownContainer.innerHTML = '';
        countDownContainer.style.display = "none";
    }
    //Seleccionem les categories de la BD
    db.loadBereicheDB().then(
        data => {
            bereiche = data;
            zeigUserBereiche();
        }
    ).catch(
        err => console.log(err)
    )
}
const init = () => {
    //ho haig de posar a none pq hi ha border definits
    quizContainer.style.display = "none";
    countDownContainer.style.display = "none";
    // EVENTLISTENER
    btnQuiz.addEventListener('click', () => {
        quizLevel = 'basic';
        //carregem les categories i comencem el joc
        getUserBereiche();
    });
    btnQuizAdv.addEventListener('click', () => {
        quizLevel = 'advanced';
        //carregem les categories i comencem el joc
        getUserBereiche();
    });
    btnBereich.addEventListener('click', () => {
        loadZeigBereiche();
    });
    readBD=true; //el primer cop hem de llegir de la BD
}

// INIT
init();
