import { auth, config } from 'firebase-functions';

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


