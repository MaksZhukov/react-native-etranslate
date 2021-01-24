import React, { useLayoutEffect, useState } from 'react';
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
import { inject, observer } from 'mobx-react';
import api from '../api';
import i18n from '../locale';
import { setItemsToAsyncStorage } from '../helpers';

const SignUp = ({ navigation, user, userDictionary }) => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    useLayoutEffect(() => {
        navigation.setOptions({
            title: i18n.t('Registration'),
            headerLeft: null,
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate('SignIn');
                    }}>
                    <Text>{i18n.t('goToSignIn')}</Text>
                </Button>
            ),
        });
    }, [navigation]);
    const handlePressSignUpWith = (site) => async () => {
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
                        await user.signUp(email, password);
                        await userDictionary.getUserDictionaryItems();
                    }}
                    primary
                    block>
                    <Text>{i18n.t('signUp')}</Text>
                </Button>
            </Form>
            <Text style={{ margin: 5, textAlign: 'center' }}>
                {i18n.t('signUpWith')}:
            </Text>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Button
                    onPress={handlePressSignUpWith('google')}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='logo-google' />
                </Button>
                <Button
                    onPress={handlePressSignUpWith('yandex')}
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

export default inject('user', 'userDictionary')(observer(SignUp));
