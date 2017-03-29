import { auth, config, analytics, database as DataBase } from 'firebase-functions';

import { database, initializeApp, messaging } from 'firebase-admin';


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


exports.analyticsClicked = analytics.event('clicked_Update').onLog(event => {
    const uid = event.data.user.userId || event.data.params.uid
    let refUser = database().ref('/user').child(uid)
    return refUser.once('value', snapshot => {
        let snap: { clicked: number, left: number } = snapshot.val()
        if (snap.clicked && snap.left) {
            let { clicked, left } = snap;
            clicked = ++clicked;
            left = --left;
            if (left === 0) {
                return refUser.update({ clicked: 0, left: 10 })
            }
            return refUser.update({ clicked, left })
        }
    })
});


export let leftRight = DataBase.ref('hands/{userId}/hand').onWrite(async event => {
    const userId = event.params.userId;
    const hands = ['left', 'right'];
    let randomhand = Math.round(Math.random());
    let cloudPicked = hands[randomhand];
    if(!event.data.val()) 
        console.log('no value');

    let tokens = await database().ref('tokens').child(userId).once('value')
    if (!tokens.val()) 
        console.log('no token');
    
    let token = tokens.val().token

    const hand = event.data.val();


    let body:string = 'Fake news  it was ' + cloudPicked;
    let title: string = 'WRONG!';
    let isWin = hand === cloudPicked;
    if(isWin) {
        title = "RIGHT"
        body = 'Are you sick of WINING'
    }
    const payload = {
        notification: {
            title,
            body
        },
        data: {
            win: isWin ? 'win': 'lose'
        }
    };
    let options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

    return messaging().sendToDevice(token, payload, options)
    
})