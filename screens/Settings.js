import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Radio,
    View,
    Text,
    ListItem,
    Right,
    Left,
    Button,
    Switch,
    Input,
    Item,
    Label,
    Icon,
    Picker,
    Toast,
} from 'native-base';
import i18n from '../locale';
import api from '../api/pushNotifications';
import { LANGUAGES } from '../constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Settings = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);

    const handleChangeDateForNotifications = (key) => (value) => {
        user.setDateForNotifications({
            ...user.dateForNotifications,
            [key]: value,
        });
    };
    useEffect(() => {}, []);

    const registerPushNotifications = async (timeInMinutes) => {
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );
        if (status !== 'granted') {
            alert('No notification permissions!');
            return;
        }
        let token = (await Notifications.getExpoPushTokenAsync()).data;
        await api.registerPushNotifications(
            token,
            timeInMinutes,
            user.pushNotificationsTextLang,
            user.pushNotificationsTranslateLang,
            user.id
        );
    };

    const handleChangeSwitch = async (val) => {
        let timeInMinutes =
            +user.dateForNotifications.days * 24 * 60 +
            +user.dateForNotifications.hours * 60 +
            +user.dateForNotifications.minutes;
        if (timeInMinutes) {
            if (val) {
                await registerPushNotifications(timeInMinutes);
            } else {
                await api.unregisterPushNotifications(user.id);
            }
            user.setIsActivePushNotifications(val);
        }
    };
    const handleChangePushNotificationsTextLang = (val) => {
        if (val === user.pushNotificationsTranslateLang) {
            user.setPushNotificationsTranslateLang(
                user.pushNotificationsTextLang
            );
        }
        user.setPushNotificationsTextLang(val);
    };
    const handleChangePushNotificationsTranslateLang = (val) => {
        if (val === user.pushNotificationsTextLang) {
            user.setPushNotificationsTextLang(
                user.pushNotificationsTranslateLang
            );
        }
        user.setPushNotificationsTranslateLang(val);
    };
    const handlePressRefreshPushNotifications = async () => {
        let timeInMinutes =
            +user.dateForNotifications.days * 24 * 60 +
            +user.dateForNotifications.hours * 60 +
            +user.dateForNotifications.minutes;
        if (user.isActivePushNotifications) {
            await registerPushNotifications(timeInMinutes);
            Toast.show({
                text: i18n.t('updatedPushSettings'),
                type: 'success',
                textStyle: { textAlign: 'center' },
            });
        }
    };
    return (
        <Container style={{ padding: 10 }}>
            <Text style={{ textAlign: 'center' }}>{i18n.t('language')}:</Text>
            <Item style={{ padding: 10 }}>
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
            </Item>
            <Item style={{ padding: 10 }}>
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
            </Item>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 10,
                }}>
                <Text style={{ textAlign: 'center' }}>
                    {i18n.t('pushNotificationsFromDictionary')}
                </Text>
                <Switch
                    style={{ marginHorizontal: 5 }}
                    value={user.isActivePushNotifications}
                    onValueChange={handleChangeSwitch}></Switch>
                <Button
                    onPress={handlePressRefreshPushNotifications}
                    rounded
                    small
                    transparent
                    bordered>
                    <Icon name='refresh' />
                </Button>
            </View>

            <Item floatingLabel>
                <Label>{i18n.t('Days')}</Label>
                <Input
                    value={user.dateForNotifications.days}
                    onChangeText={handleChangeDateForNotifications('days')}
                    keyboardType='numeric'
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('Hours')}</Label>
                <Input
                    value={user.dateForNotifications.hours}
                    keyboardType='numeric'
                    onChangeText={handleChangeDateForNotifications('hours')}
                />
            </Item>
            <Item floatingLabel>
                <Label>{i18n.t('Minutes')}</Label>
                <Input
                    value={user.dateForNotifications.minutes}
                    onChangeText={handleChangeDateForNotifications('minutes')}
                    keyboardType='numeric'
                />
            </Item>
            <Item>
                <Label>{i18n.t('languageForText')}</Label>
                <Picker
                    note
                    onValueChange={handleChangePushNotificationsTextLang}
                    selectedValue={user.pushNotificationsTextLang}
                    mode='dropdown'>
                    {LANGUAGES.map((item) => (
                        <Picker.Item
                            key={item.abbr}
                            label={i18n.t(item.name)}
                            value={item.abbr}></Picker.Item>
                    ))}
                </Picker>
            </Item>
            <Item>
                <Label>{i18n.t('languageForTranslate')}</Label>
                <Picker
                    note
                    onValueChange={handleChangePushNotificationsTranslateLang}
                    selectedValue={user.pushNotificationsTranslateLang}
                    mode='dropdown'>
                    {LANGUAGES.map((item) => (
                        <Picker.Item
                            key={item.abbr}
                            label={i18n.t(item.name)}
                            value={item.abbr}></Picker.Item>
                    ))}
                </Picker>
            </Item>
        </Container>
    );
};

export default inject('user')(observer(Settings));
