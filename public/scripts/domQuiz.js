'use strict';

const domQuiz = {
    createDOMElement({
        inhalt = false,
        eltern = false,
        klassen = [],
        typ = 'div',
        attr = {},
        styles = {},
        events = {}
    } = {}) {
        let neu = document.createElement(typ);
        if (inhalt) neu.innerHTML = inhalt;
        if (klassen.length) neu.className = klassen.join(' ');

        Object.entries(attr).forEach(a => neu.setAttribute(...a));
        Object.entries(styles).forEach(s => neu.style[s[0]] = s[1]);
        Object.entries(events).forEach(event => neu.addEventListener(...event));

        if (eltern) eltern.append(neu);

        return neu;
    },

    templates: {
        createBereiche(quizContainer, bereiche) {
            let divContainer = domQuiz.createDOMElement({
                attr: { 'id': 'bereiche' },
                eltern: quizContainer
            });
            let pContainer = domQuiz.createDOMElement({
                typ: 'p',
                eltern: divContainer
            });
            let rdb = domQuiz.createDOMElement({
                typ: 'input',
                klassen: ['cFeldRadio'],
                attr: { 'type': 'radio', 'name': 'rdb', 'value': 'A' },
                eltern: pContainer
            });
            rdb.setAttribute('checked', 'checked');
            domQuiz.createDOMElement({
                typ: 'span',
                inhalt: 'Allgemein',
                klassen: ['space'],
                eltern: pContainer
            });
            pContainer = domQuiz.createDOMElement({
                typ: 'p',
                eltern: divContainer
            });
            domQuiz.createDOMElement({
                typ: 'input',
                klassen: ['cFeldRadio'],
                attr: { 'type': 'radio', 'name': 'rdb', 'value': 'B' },
                eltern: pContainer
            });
            domQuiz.createDOMElement({
                typ: 'span',
                klassen: ['space'],
                inhalt: 'Bereiche',
                eltern: pContainer
            });
            let chkContainer = domQuiz.createDOMElement({
                attr: { 'id': 'chkContainer' },
                klassen: ['disabled'],
                eltern: divContainer
            });
            //select - option <--bereiche
            bereiche.forEach(e => {
                let pContainer = domQuiz.createDOMElement({
                    typ: 'p',
                    eltern: chkContainer
                });
                domQuiz.createDOMElement({
                    typ: 'input',
                    attr: { 'type': 'checkbox', 'name': 'ckb', 'value': e },
                    eltern: pContainer
                });
                domQuiz.createDOMElement({
                    typ: 'span',
                    inhalt: e,
                    klassen: ['space'],
                    eltern: pContainer
                });
            });
        },
        createQuiz(eltern) {
            let divContainer;
            divContainer = domQuiz.createDOMElement({
                klassen: ['infoQuiz'],
                eltern
            });
            domQuiz.createDOMElement({
                typ: 'span',
                attr: { 'id': 'frageN' },
                eltern: divContainer
            });
            let sContainer = domQuiz.createDOMElement({
                typ: 'span',
                klassen: ['counters'],
                eltern: divContainer
            });
            domQuiz.createDOMElement({
                typ: 'span',
                attr: { 'id': 'richtig' },
                eltern: sContainer
            });
            domQuiz.createDOMElement({
                typ: 'span',
                klassen: ['space'],
                attr: { 'id': 'falsch' },
                eltern: sContainer
            });
            domQuiz.createDOMElement({
                typ: 'span',
                klassen: ['result'],
                attr: { 'id': 'result' },
                eltern: divContainer
            });
            domQuiz.createDOMElement({
                typ: 'p',
                klassen: ['frage'],
                attr: { 'id': 'frage' },
                eltern
            });
            divContainer = domQuiz.createDOMElement({
                klassen: ['antworten'],
                eltern
            });
            this.createAntwort({ eltern: divContainer, num: '1' });
            this.createAntwort({ eltern: divContainer, num: '2' });
            this.createAntwort({ eltern: divContainer, num: '3' });

            this.createProgress(eltern);

        },
        createAntwort({
            eltern,
            num
        }) {
            let pContainer = domQuiz.createDOMElement({
                typ: 'p',
                klassen: ['antwort'],
                eltern: eltern
            });
            domQuiz.createDOMElement({
                typ: 'input',
                attr: { 'type': 'radio', 'name': 'antwort', 'value': num },

                eltern: pContainer
            });
            domQuiz.createDOMElement({
                typ: 'span',
                klassen: ['space'],
                attr: { 'id': `antwort${num}` },
                eltern: pContainer
            });
        },
        createProgress(eltern) {
            let pContainer = domQuiz.createDOMElement({
                typ: 'p',
                klassen: ['alignCenter'],
                eltern: eltern
            });
            domQuiz.createDOMElement({
                typ: 'progress',
                eltern: pContainer,
                attr: { 'id': 'progress', value: 0 }
            });
        },
        createNeuStartenBtn(eltern) {
            let pContainer = domQuiz.createDOMElement({
                typ: 'p',
                klassen: ['alignCenter'],
                eltern,
            });
            return domQuiz.createDOMElement({
                typ: 'button',
                inhalt: 'Quiz neu starten',
                eltern: pContainer
            });
        },
        createEndQuiz({
            eltern,
            inhalt1,
            inhalt2,
            inhalt3,
            inhalt4,
            quizLevel
        }) {
            let divContainer = domQuiz.createDOMElement({
                typ: 'div',
                klassen: ['alignCenter'],
                eltern
            });
            domQuiz.createDOMElement({
                typ: 'p',
                inhalt: inhalt1,
                klassen: ['textSize'],
                eltern: divContainer
            });
            domQuiz.createDOMElement({
                typ: 'p',
                inhalt: inhalt2,
                klassen: ['gruen2', 'textSize'],
                eltern: divContainer
            });
            domQuiz.createDOMElement({
                typ: 'p',
                inhalt: inhalt3,
                klassen: ['rot2', 'textSize'],
                eltern: divContainer
            });
            if (quizLevel == 'advanced')
                domQuiz.createDOMElement({
                    typ: 'p',
                    inhalt: inhalt4,
                    klassen: ['textSize'],
                    eltern: divContainer
                });
        }
    }
}

export default domQuiz;