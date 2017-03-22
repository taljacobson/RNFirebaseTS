# RNfirebaseTS


 project created with [ReactNativeTS](https://github.com/mrpatiwi/ReactNativeTS.git) template of a [React Native](https://facebook.github.io/react-native/) project with [Typescript](https://www.typescriptlang.org/).

> Recommended usage with [VSCode](https://code.visualstudio.com/)

## Goal

create a react-native app with [React-native-firebase](https://github.com/invertase/react-native-firebase) plugin
follow steps to add android(that is all i could test, no mac so no ios)

test firebse analytic, auth, database, functions.

## app Flow

login with firebase, calls a firebase function what adds 2 fields to user uid database entry
``` json
{
    "clicked": 0,
    "left": 10
}

``` 
ui button with database clicked field and onPress method that when clicked sends a anaytics event/ database event to update one field,
 
event gets caught by firebase function, updates user uid fields with

```json
{
    "clicked": +1,
    "left": -1
}
```

firebase function what checks if `"left" === 0` resets counter send FCM to user that counter reset. 

## Getting Started

* Requirements: [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/)

Clone this repository:

```sh
git clone https://github.com/mrpatiwi/ReactNativeTS.git
cd RNfirebaseTS
```

#### firebase function set up

create firebase project in [firebase console](console.firebase.google.com)

have firebase CLI tools installed globaly 
```sh
 npm install -g firebase-tools
```

log in to firebase cli 
```sh
   firebase login
```

link firebase project to cli
```sh 
    cd functions
    npm install
    firebase use --add
```


deploy to firebase
```sh
    firebase deploy 
```

#### link firebase android to App
in firebase console add a android app with the same app id as the app `com.rnfirebasets`

* might need to add an sha1 key for auth
https://developers.google.com/android/guides/client-auth

download and add google-services.json file as instructed by firebase

#### RN project set up

Install dependencies:

```sh
yarn
```

Start React Native server:

```sh
yarn start
```

Build the source-code with Typescript:

```sh
# Build once
yarn run build

# Build and watch for changes
yarn run watch
```

### iOS

```sh
yarn run ios
```

### Android

```sh
yarn run android
```
