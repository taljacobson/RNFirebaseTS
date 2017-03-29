"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
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
exports.analyticsClicked = firebase_functions_1.analytics.event('clicked_Update').onLog(event => {
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
exports.leftRight = firebase_functions_1.database.ref('hands/{userId}/hand').onWrite((event) => __awaiter(this, void 0, void 0, function* () {
    const userId = event.params.userId;
    const hands = ['left', 'right'];
    let randomhand = Math.round(Math.random());
    let cloudPicked = hands[randomhand];
    if (!event.data.val())
        console.log('no value');
    let tokens = yield firebase_admin_1.database().ref('tokens').child(userId).once('value');
    if (!tokens.val())
        console.log('no token');
    let token = tokens.val().token;
    const hand = event.data.val();
    let body = 'Fake news  it was ' + cloudPicked;
    let title = 'WRONG!';
    let isWin = hand === cloudPicked;
    if (isWin) {
        title = "RIGHT";
        body = 'Are you sick of WINING';
    }
    const payload = {
        notification: {
            title,
            body
        },
        data: {
            win: isWin ? 'win' : 'lose'
        }
    };
    let options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    return firebase_admin_1.messaging().sendToDevice(token, payload, options);
}));
