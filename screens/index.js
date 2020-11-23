import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { TIME_OFFSET_EXPIRES_IN } from '../constants';
import { inject, observer } from 'mobx-react';
import * as Linking from 'expo-linking';
import { Toast } from 'native-base';
import i18n from '../locale';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Translator from './Translator';
import Dictionary from './Dictionary';
import Header from '../layouts/Header';
import Info from './Info';
import Settings from './Settings';
import { checkItemsInAsyncStorage } from '../helpers';

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
    useEffect(() => {
        let checkToken = async () => {
            await prop.user.checkToken();
            if (prop.user.id === null) {
                const isTokensAndExpiresIn = await checkItemsInAsyncStorage([
                    'refreshToken',
                    'accessToken',
                    'expiresIn',
                ]);
                if (
                    isTokensAndExpiresIn &&
                    (await AsyncStorage.getItem('expiresIn')) <
                        (new Date().getTime() + TIME_OFFSET_EXPIRES_IN) / 1000
                ) {
                    await prop.user.updateTokens();
                    await prop.user.checkToken();
                    if (prop.user.id === null) {
                        prop.navigation.navigation.navigate('SignIn');
                    } else {
                        prop.userDictionary.getUserDictionaryItems();
                        prop.navigation.navigation.navigate('Translator');
                        Toast.show({
                            text: i18n.t('entrySuccess'),
                            type: 'success',
                            textStyle: { textAlign: 'center' },
                        });
                    }
                } else {
                    prop.navigation.navigation.navigate('SignIn');
                }
            } else {
                prop.userDictionary.getUserDictionaryItems();
                prop.navigation.navigation.navigate('Translator');
                Toast.show({
                    text: i18n.t('entrySuccess'),
                    type: 'success',
                    textStyle: { textAlign: 'center' },
                });
            }
        };
        if (prop.navigation.navigation) {
            checkToken();
        }
    }, [prop.navigation.navigation]);

    return (
        <NavigationContainer
            ref={(el) => {
                if (!prop.navigation.navigation) {
                    prop.navigation.setNavigation(el);
                }
            }}
            linking={linking}>
            <Stack.Navigator>
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

export default inject(
    'user',
    'navigation',
    'userDictionary'
)(observer(Screens));
