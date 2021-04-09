'use strict'
const formularQuiz = {
    readUserBereiche(container){
        let formRdb=container.querySelectorAll('[type=radio]');
        //converteixo el NodeList en un array de nodes
        let rdbChecked = [...formRdb].find(elem => elem.checked==true)
        if (rdbChecked.value == 'A') return [];
        let dataTmp=[];
        container.querySelectorAll('[type=checkbox]').forEach(e => {
            if (e.checked) dataTmp.push((e.value).toLowerCase());
        })
        return dataTmp;
    }
}

export default formularQuiz;