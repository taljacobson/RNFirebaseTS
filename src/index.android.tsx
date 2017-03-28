import React, { Component } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Button from 'react-native-button';
import LoginForm from './components/LoginForm';
import RNFirebase from 'react-native-firebase';

const firebase = new RNFirebase();
// firebase.on('debug', bug => console.log(bug))
interface Props {

}

interface State {
  user?: any;
  loggedIn: boolean;
  clickedCount?: number
}

export default class App extends Component<Props, State> {
  state: State = {
    user: null,
    loggedIn: false
  }

  componentWillMount() {

    firebase.analytics().setAnalyticsCollectionEnabled(true);
    firebase.analytics().setCurrentScreen('user_profile');

    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {

        console.log('onAuthStateChanged', user)
        const { uid } = user
        firebase.analytics().setUserId(uid)
        this.setState({ user, loggedIn: !this.state.loggedIn })
      } else {
        this.setState({
          user: null,
          loggedIn: false
        })
      }

    }, (err) => console.log(err))
  }

  componentDidMount() {

  }
  renderAuth() {
    if (!this.state.loggedIn || !this.state.user)
      return <LoginForm />;
    return (
      <Button onPress={() => firebase.auth().signOut()}>
        Logout
      </Button>
    )
  }

  renderIncrease() {
    if (this.state.loggedIn && this.state.user) {
      let uid: string = ''
      if (firebase.auth().currentUser) {
        uid = firebase.auth().currentUser.uid;
        firebase.database().ref('user/').child(uid).on('value', (snapshot) => {
          let val = snapshot.val()
          if (val) {
            console.log(val)
            const clickedCount = val.clicked
            if (!(this.state.clickedCount === clickedCount))
              this.setState({ clickedCount })
          }
        })
      }
    }

    return (
      <View>

        <Button onPress={this.Analytic.bind(this)}>
          increase + {this.state.clickedCount}
        </Button>

      </View>)
  }

  increaseCount() {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('user/').child(uid).update({ clicked: this.state.clickedCount + 1 })
    this.setState({})
  }

  Analytic() {
    if (this.state.user) {

      firebase.analytics().logEvent('clicked_advert', { uid: this.state.user.uid });
    }
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
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
          {this.state.loggedIn ? this.renderIncrease() : null}

        </View>
        {this.renderAuth()}
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
  } as ViewStyle,

  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  } as ViewStyle,

  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  } as ViewStyle,

  helloworld: {
    marginVertical: 15,
  } as ViewStyle,
});
