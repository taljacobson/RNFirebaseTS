import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import HelloWorld from "./components/HelloWorld/index";
import RNFirebase from 'react-native-firebase';

const firebase = new RNFirebase();
firebase.on('debug', (msg: any) => console.log('Receiveds debug message', msg))
console.log("any")
interface Props {

}

interface State {

}

export default class App extends Component<Props, State> {
    componentWillMount() {
        firebase.analytics().setAnalyticsCollectionEnabled(true);
        firebase.analytics().setCurrentScreen('user_profile');
        firebase.analytics().logEvent('clicked_advert', { id: 1337 });
        firebase.database()
            .ref('posts/1234')
            .set({
                title: 'My awesome post',
                content: 'Some awesome content',
            });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    Shake or press menu button for dev menu
                </Text>

                <HelloWorld style={styles.helloworld} max={10} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    } as React.ViewStyle,

    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    } as React.TextStyle,

    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    } as React.TextStyle,

    helloworld: {
        marginVertical: 15,
    } as React.ViewStyle,
});
