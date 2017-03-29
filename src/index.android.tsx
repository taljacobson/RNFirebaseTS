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
  clickedCount?: number;
  isWin?: string
}

export default class App extends Component<Props, State> {
  state: State = {
    user: null,
    loggedIn: false,
    isWin: null
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
    firebase.messaging().getInitialNotification()
      .then((notification) => {
        console.log('Notification which opened the app: ', notification);
        if(notification.win)
          this.setState({isWin: notification.win})
      });

      firebase.messaging().onMessage((message) => {
        console.log(message)
        if(message.win)
          this.setState({isWin: message.win})
      });
  }

  increaseCount() {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('user/').child(uid).update({ clicked: this.state.clickedCount + 1 })
    this.setState({})
  }

  Analytic() {
    if (this.state.user) {
      firebase.analytics().logEvent('clicked_Update', { uid: this.state.user.uid });
    }
  }


  async sendMessage() {
    let token = await firebase.messaging().getToken()
    console.log('Device FCM Token: ', token);
    firebase.database().ref('tokens/').child(this.state.user.uid).set({ token })

  }

  async upDateHand(hand: string) {
    await this.sendMessage()
    await firebase.database().ref('hands/').child(this.state.user.uid).update({ hand })
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

  renderButtonFCM() {
    return (
      <Button onPress={this.sendMessage.bind(this)}>
        get a message from firebase
        </Button>)
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
        {this.renderButtonFCM()}
      </View>)
  }

  renderLeftRight() {
    const LeftRight = ['left', 'right']

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {LeftRight.map((value, index) =>
          <Button key={value + index} onPress={this.upDateHand.bind(this, value)} >{value}</Button>
        )}
      </View>
    );
  }
  isloggedIn() {
    if (!this.state.user) return this.renderAuth();

    return (
      <View>
        <Text style={styles.welcome}>
          lets play a Game, pick left or Right
          </Text>
        {this.renderLeftRight()}
        {this.state.loggedIn ? this.renderIncrease() : null}
      </View>
    )

  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
        < Text style={styles.welcome}>{this.state.isWin || null}</Text>
          {this.isloggedIn()}
        </View>
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
