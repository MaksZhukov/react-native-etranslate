import React, { useLayoutEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Text, Button } from 'native-base';
import { Linking } from 'react-native';
const Info = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container style={{ padding: 10 }}>
            <Text style={{ marginBottom: 10 }}>
                Это мобильное приложение предназначено для перевода текста и
                ведения словаря по словам
            </Text>
            <Text style={{ marginBottom: 10 }}>
                Можете использовать{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={async () => {
                        await Linking.openURL(
                            'https://e-translate.herokuapp.com/'
                        );
                    }}>
                    Веб приложение ETranslate
                </Text>{' '}
                которое позволяет переводить текст и вести словарь с компьютера
                или ноутбука
            </Text>
            <Text>
                Можете скачать{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={async () => {
                        await Linking.openURL(
                            'https://github.com/MaksZhukov/etranslate-chrome-extension/archive/master.zip'
                        );
                    }}>
                    ETranslate расширение
                </Text>{' '}
                для браузера google chrome для удобного перевода слов со страниц
            </Text>
        </Container>
    );
};

export default inject('user')(observer(Info));
