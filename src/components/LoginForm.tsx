import React, { Component } from 'react';
import { View, Text, ViewStyle } from 'react-native';

import RNFirebase from 'react-native-firebase'; 

import { Button, Card, CardSection, Input, Spinner } from './common';

interface Props {

}

interface State {
        email: string,
        password: string,
        error: string,
        loading: boolean
} 
const firebase = new RNFirebase();

export default class LoginForm extends Component<Props, State> {
    state: State = {
        email: '',
        password: '',
        error: '',
        loading: false
    };

        constructor(props:Props){
        super(props)
    }

    componentWillUnmount() {
        this.setState({email: '', password: '', error: '', loading: false})
    }

    onButtonPress() { 
        const { email, password } = this.state;

        this.setState({ error: '', loading: true });

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(this.onLoginSuccess.bind(this))
            .catch(() => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(this.onLoginSuccess.bind(this))
                    .catch(this.onLoginFail.bind(this));
                    });
    }

    onLoginSuccess() {

    }
    
    onLoginFail() {
        this.setState({ 
            error: 'auth Fail', 
            loading: false
        });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size='small' />;
        }

        return (
            <Button
                onPress={this
                .onButtonPress
                .bind(this)}
            >
                Login
            </Button>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        label='Email'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        placeholder="user@email.com" 
                    />
                </CardSection>
                <CardSection>
                    <Input
                        label='Password'
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        placeholder="password"
                        secureTextEntry 
                    />
                </CardSection>
                <Text style={styles.errorText}>{this.state.error}</Text>

                <CardSection>
                    {this.renderButton()}
                </CardSection>

            </Card>
        );
    }
}

const styles = {
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    } as ViewStyle
};

