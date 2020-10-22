import React, { useLayoutEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Text, Button } from 'native-base';
import { Linking } from 'react-native';
import i18n from '../locale';

const Info = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container style={{ padding: 10 }}>
            <Text style={{ marginBottom: 10 }}>{i18n.t('infoFirst')}</Text>
            <Text style={{ marginBottom: 10 }}>
                {i18n.t('infoSecondPartOne')}{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={async () => {
                        await Linking.openURL(
                            'https://e-translate.herokuapp.com/'
                        );
                    }}>
                    {i18n.t('infoSecondPartTwo')} ETranslate
                </Text>{' '}
                {i18n.t('infoSecondPartThree')}
            </Text>
            <Text>
                {i18n.t('infoThirdPartOne')}{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={async () => {
                        await Linking.openURL(
                            'https://github.com/MaksZhukov/etranslate-chrome-extension/archive/master.zip'
                        );
                    }}>
                    ETranslate {i18n.t('infoThirdPartTwo')}
                </Text>{' '}
                {i18n.t('infoThirdPartThree')}
            </Text>
        </Container>
    );
};

export default inject('user')(observer(Info));
