"use strict";
const firebase_functions_1 = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
firebase_admin_1.initializeApp(firebase_functions_1.config().firebase);
exports.creatUserDB = firebase_functions_1.auth.user().onCreate(event => {
    const user = event.data;
    const { uid } = user;
    let initCount = {
        clicked: 0,
        left: 10
    };
    return firebase_admin_1.database().ref('/user').child(uid).set(initCount);
});
exports.cleanupUserData = firebase_functions_1.auth.user().onDelete(event => {
    const uid = event.data.uid;
    return firebase_admin_1.database().ref(`/user/${uid}`).remove();
});
