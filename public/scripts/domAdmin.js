'use strict';

const dom = {
    createDOMElement ({
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
        createLoginFormular(eltern){
            let divContainer= dom.createDOMElement({
                attr : {'id':'loginFormular'},
                eltern
            });
            dom.createDOMElement({
                typ : 'h2',
                inhalt: 'Anmelden',
                eltern: divContainer
            });    
            dom.createDOMElement({
                typ : 'input',
                klassen: ['cFeld', 'cFeldLogin'], 
                attr : {'type':'text','name':'user', 'placeholder':'Benutzername','required':'required'},
                eltern: divContainer
            });     
            dom.createDOMElement({
                typ : 'input',
                klassen: ['cFeldLogin'], 
                attr : {'type':'password','name':'pwd','required':'required', 'placeholder':'Passwort'},
                eltern: divContainer
            });
            return divContainer;
        },
        createFormular(eltern,bereiche){
            let pContainer;
            pContainer = this.createContainer({inhalt:'Bereich',eltern});
            let sContainer = dom.createDOMElement({
                typ : 'select',
                klassen: ['cFeld'], 
                attr : {'name':'bereich', 'required':'required'},
                eltern: pContainer
            });
            dom.createDOMElement({
                typ : 'option',
                inhalt: '-bitte wählen-',
                eltern: sContainer
            });
            //select - option <--bereiche
            bereiche.forEach (e => {
                dom.createDOMElement({
                    typ : 'option',
                    inhalt: e,
                    eltern: sContainer
                });
            });
            pContainer = this.createContainer({inhalt:'Frage',eltern});
            dom.createDOMElement({
                typ : 'textarea',
                klassen: ['cFeld'], 
                attr : {'name':'frage','rows':'5','required':'required'},
                eltern: pContainer,
            });
            pContainer = this.createContainer({inhalt:'Antwort - 1',eltern});
            this.createAntwort({eltern:pContainer,num:'1'});

            pContainer = this.createContainer({inhalt:'Antwort - 2',eltern});
            this.createAntwort({eltern:pContainer,num:'2'});

            pContainer = this.createContainer({inhalt:'Antwort - 3',eltern});
            this.createAntwort({eltern:pContainer,num:'3'});

            dom.createDOMElement({
                typ: 'p',
                klassen: ['datenPflicht'], 
                inhalt: 'alle Eingabefelder sind pflicht!',
                eltern
            });
           
        },
        createContainer({
            inhalt,
            eltern
         }){
             let pContainer = dom.createDOMElement({
                 typ: 'p',
                 klassen: ['pFormular'], 
                 eltern
             });
             dom.createDOMElement({
                 inhalt,
                 typ: 'label',
                 klassen: ['cLabel'], 
                 eltern: pContainer
             });
             return pContainer;
        },
        createAntwort({
            eltern,
            num
        }){
            dom.createDOMElement({
                typ : 'input',
                klassen: ['cFeld'], 
                attr : {'type':'text','name':`antwort${num}`,'required':'required'},
                eltern: eltern
            });
            let pContainer = this.createContainer({inhalt:'Richtig',eltern});
            let rdb = dom.createDOMElement({
                typ : 'input',
                klassen: ['cFeldRadio'], 
                attr : {'type':'radio','name':'richtig','value':num}, 
                eltern: pContainer
            });
            if (num == "1") rdb.setAttribute('checked','checked');
        },
        createSummitBtn(eltern) {
           return dom.createDOMElement({
                typ: 'button',
                inhalt: 'Submit',
                eltern,
                klassen: ['formButton']
            });
        },
        createLoginBtn(eltern) {
            let pContainer = dom.createDOMElement({
                typ : 'p',
                klassen: ['alignCenter'],
                eltern: eltern
            });
            return dom.createDOMElement({
                 typ: 'button',
                 inhalt: 'Anmelden',
                 eltern:pContainer
             });
         }
    }
}
export default dom;