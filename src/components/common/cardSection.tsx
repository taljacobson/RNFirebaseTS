import React from 'react';
import { View, ViewStyle } from 'react-native';

export const CardSection = (props:React.Props<any>) => {
    return (
        <View style={styles.containerStyle} >
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative'
        } as ViewStyle
};

