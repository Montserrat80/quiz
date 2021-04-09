'use strict';
let a = [];
const db = {
    loadAll(){
        return fetch('/loadQuiz').then(
            data => data.json()
        ).then(
            data => data
        )
    },
    loadBereicheDB(){
        return fetch('/loadBereiche').then(
            data => data.json()
        ).then(
            data => this.initBereiche(data)
        );
    },
    initBereiche(data){
        let bereiche = [];
        data.forEach(e => {
            if (!bereiche.includes(e))
                bereiche.push(e)

        });
        return bereiche;
    },
    frageSpeicherneDB({
        bereich,
        frage,
        antworten
    }) {
        let speichernRequest = new Request(
            '/saveFrage',
            {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    bereich,
                    frage,
                    antworten
                })
            }
        );
        return fetch(speichernRequest).then(
            data => data
        );
    },
    loginChecken({
        user,
        pwd
    }) {
        let speichernRequest = new Request(
            '/loginChecken',
            {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    user,
                    pwd,
                })
            }
        );
        return fetch(speichernRequest).then(
            data => data.json()
        ).then(
            data => data
        );
    },
    loadView(view){
        return fetch(`/loadviews?view=${view}`).then(
            data => data.json()
        ).then(
            data => data
        );
    },
    loadViews(views){
        return Promise.all(views.map(view => this.loadView(view))).then(
            data => data.reduce((allData, singleData) => {
                allData.push(...singleData);
                return allData;
            }, [])

        );
    },
    loadDB(userBereiche){
        if (userBereiche.length == 0 || userBereiche.length == 4) {
            //Get alle Documente from quiz couchDB
            return this.loadAll().then(
                data => data
            ).catch(
                err => console.log(err)
            );
        } else {
            return this.loadViews(userBereiche).then(
                data => data
            );
        }
    }
}
export default db;