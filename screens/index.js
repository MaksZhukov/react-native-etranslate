import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { inject, observer } from 'mobx-react';
import * as Linking from 'expo-linking';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Translator from './Translator';
import Root from './Root';
import Dictionary from './Dictionary';
import Header from '../layouts/Header';
import Info from './Info';
import Settings from './Settings';

const prefix = Linking.makeUrl('/');

const Stack = createStackNavigator();

const Screens = (prop) => {
    const linking = {
        prefixes: [prefix],
    };
    const [offsetScrollX, setOffsetScrollX] = useState(0);

    const header = useMemo(
        () => (props) => (
            <Header
                offsetScrollX={offsetScrollX}
                setOffsetScrollX={setOffsetScrollX}
                {...props}></Header>
        ),
        [offsetScrollX, setOffsetScrollX]
    );

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName={'Root'}>
                {<Stack.Screen name='Root' component={Root} />}
                {!prop.user.id && (
                    <Stack.Screen name='SignIn' component={SignIn} />
                )}
                {!prop.user.id && (
                    <Stack.Screen name='SignUp' component={SignUp} />
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name='Translator'
                        options={{
                            header,
                        }}
                        component={Translator}></Stack.Screen>
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name='Dictionary'
                        options={{
                            header,
                        }}
                        component={Dictionary}></Stack.Screen>
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name='Info'
                        options={{
                            header,
                        }}
                        component={Info}></Stack.Screen>
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name='Settings'
                        options={{
                            header,
                        }}
                        component={Settings}></Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default inject('user')(observer(Screens));
