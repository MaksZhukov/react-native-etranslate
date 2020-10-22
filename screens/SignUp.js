import React, { useLayoutEffect, useState } from 'react';
import { TextInput } from 'react-native';
import {
    Container,
    Text,
    Button,
    Form,
    Item,
    Input,
    Icon,
    View,
    Content,
} from 'native-base';
import i18n from '../locale';

const SignUp = ({ navigation }) => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    useLayoutEffect(() => {
        navigation.setOptions({
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
    const handlePressSignInWith = (site) => async () => {
        let redirectUrl = await Linking.getInitialURL();
        let authUrl = `${api.defaults.baseURL}/auth/${site}`;
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
            navigation.navigate('Translator');
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
                    onPress={() => {
                        user.signIn(email, password);
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

export default SignUp;
