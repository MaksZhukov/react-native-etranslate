import React, { useLayoutEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Radio,
    View,
    Text,
    ListItem,
    Right,
    Left,
} from 'native-base';
import { Linking } from 'react-native';
import i18n from '../locale';

const Settings = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container style={{ padding: 10 }}>
            <Text style={{ textAlign: 'center' }}>{i18n.t('language')}:</Text>
            <ListItem>
                <Left>
                    <Text>{i18n.t('english')}</Text>
                </Left>
                <Right>
                    <Radio
                        onPress={() => {
                            user.setLocale('en');
                        }}
                        selected={user.locale.includes('en')}
                    />
                </Right>
            </ListItem>
            <ListItem>
                <Left>
                    <Text>{i18n.t('russian')}</Text>
                </Left>
                <Right>
                    <Radio
                        onPress={() => {
                            user.setLocale('ru');
                        }}
                        selected={user.locale.includes('ru')}
                    />
                </Right>
            </ListItem>
        </Container>
    );
};

export default inject('user')(observer(Settings));
