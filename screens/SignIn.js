import React, { useLayoutEffect, useState } from 'react';
import { Button as NativeButton } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Text,
    Button,
    Form,
    Item,
    Input,
    Icon,
    View,
    Toast,
} from 'native-base';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import api from '../api';
import i18n from '../locale';
import { setItemsToAsyncStorage } from '../helpers';

const SignIn = ({ user, navigation, userDictionary }) => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: i18n.t('Authorization'),
            headerLeft: null,
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}>
                    <Text>{i18n.t('goToSignUp')}</Text>
                </Button>
            ),
        });
    }, [navigation]);
    const handlePressSignInWith = (site) => async () => {
        let redirectUrl = await Linking.getInitialURL();
        let authUrl = `${api.defaults.baseURL}/auth/${site}?redirectTo=${redirectUrl}`;
        try {
            let authResult = await WebBrowser.openAuthSessionAsync(
                authUrl,
                redirectUrl
            );
            let {
                queryParams: { accessToken, expiresIn, refreshToken },
            } = Linking.parse(authResult.url);
            setItemsToAsyncStorage({ accessToken, expiresIn, refreshToken });
            await user.checkToken();
            await userDictionary.getUserDictionaryItems();
            navigation.navigate('Translator');
            Toast.show({
                text: i18n.t('entrySuccess'),
                type: 'success',
                textStyle: { textAlign: 'center' },
            });
        } catch (err) {
            console.log('ERROR:', err);
        }
    };
    return (
        <Container>
            <Form>
                <Item>
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder={i18n.t('email')}
                    />
                </Item>
                <Item last>
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder={i18n.t('password')}
                    />
                </Item>
                <Button
                    onPress={async () => {
                        await user.signIn(email, password);
                        await userDictionary.getUserDictionaryItems();
                    }}
                    primary
                    block>
                    <Text>{i18n.t('signIn')}</Text>
                </Button>
            </Form>
            <Text style={{ margin: 5, textAlign: 'center' }}>
                {i18n.t('signInWith')}:
            </Text>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Button
                    onPress={handlePressSignInWith('google')}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='logo-google' />
                </Button>
                <Button
                    onPress={handlePressSignInWith('yandex')}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='logo-yen' />
                </Button>
            </View>
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(SignIn));
