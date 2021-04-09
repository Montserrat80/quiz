'use strict'
const formularAdmin = {
    readFormular(container){
        let formFelder = container.querySelectorAll('[name]');
        let formRadio = container.querySelectorAll('[type=radio]');
        const dataTmp = {};
        //object: amb les dades del formulari. compte pq del radioButton obte sempre
        //l ultim (richtig = 3)
        formFelder.forEach(e => {
            dataTmp[e.getAttribute('name')] = e.value
        })
        //donem a l attribut -richtig- el valor del radioButton que esta checked
        formRadio.forEach(e => {
            if (e.checked) dataTmp['richtig']=e.value;
        })
        if (dataTmp.bereich == '-bitte wählen-' || 
            !dataTmp.frage || 
            !dataTmp.antwort1 || 
            !dataTmp.antwort2 || 
            !dataTmp.antwort3 ) {
            //Alle Daten sind Pflicht!
            return false
        }
        //convertir Antworten --> Array  
        let tmpAntworten = [], tmpObj = {},r;
        for (let i = 1; i <= 3; i++){
            (dataTmp.richtig == i) ? r = true : r = false;
            tmpObj = {
                antwort:dataTmp[`antwort${i}`],
                richtig :r
            }
            tmpAntworten.push(tmpObj);
        }
        //Objecte a retornar (identic al document de la BD)
        const data = {};
        data.bereich = dataTmp.bereich;
        data.frage = dataTmp.frage;
        data.antworten = tmpAntworten;
        
        return data;
    },
    displayWarning(container,warning){
        container.style.display = "";
        container.innerHTML = warning;
        setTimeout(function(){ 
            container.innerHTML =""; 
            container.style.display = "none";
        }, 2000);
    }
}

export default formularAdmin;