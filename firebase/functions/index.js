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
exports.analyticsClicked = firebase_functions_1.analytics.event('clicked_advert').onLog(event => {
    const uid = event.data.user.userId || event.data.params.uid;
    let refUser = firebase_admin_1.database().ref('/user').child(uid);
    return refUser.once('value', snapshot => {
        let snap = snapshot.val();
        if (snap.clicked && snap.left) {
            let { clicked, left } = snap;
            clicked = ++clicked;
            left = --left;
            if (left === 0) {
                return refUser.update({ clicked: 0, left: 10 });
            }
            return refUser.update({ clicked, left });
        }
    });
});
