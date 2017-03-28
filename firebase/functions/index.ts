import { auth, config, analytics } from 'firebase-functions';

import { database, initializeApp } from 'firebase-admin';


initializeApp(config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// }) 


exports.creatUserDB = auth.user().onCreate(event => {
    // [END onCreateTrigger]
    // [START eventAttributes]
    const user = event.data; // The Firebase user.

    const {
        uid
    } = user;

    // [END eventAttributes]
    let initCount = {
        clicked: 0,
        left: 10
    }

    return database().ref('/user').child(uid).set(initCount)
})

// Deletes the user data in the Realtime Datastore when the accounts are deleted.
exports.cleanupUserData = auth.user().onDelete(event => {
    const uid = event.data.uid;
    return database().ref(`/user/${uid}`).remove();
});


exports.analyticsClicked = analytics.event('clicked_advert').onLog(event => {
     const uid = event.data.user.userId || event.data.params.uid
     let refUser = database().ref('/user').child(uid)
    return refUser.once('value', snapshot => {
         let snap:{clicked: number, left: number} = snapshot.val()
         if(snap.clicked && snap.left){
            let { clicked, left} = snap;
            clicked = ++clicked;
            left = --left;
            if (left === 0) {
                return refUser.update({clicked: 0, left: 10})
            } 
            return refUser.update({clicked, left})
         }
     })
});
