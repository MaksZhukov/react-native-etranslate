import { action, observable } from 'mobx';
import { Toast } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import apiUser from '../api/user';
import * as Localization from 'expo-localization';
import i18n from '../locale';
import { DEFAULT_API_RESPONSE } from '../config';
import { setItemsToAsyncStorage } from '../helpers';
import { BACKEND_MESSAGES_DICTIONARY, LANGUAGES } from '../constants';

class UserStore {
    @observable email = null;
    @observable id = null;
    @observable locale = Localization.locale;
    @observable isActivePushNotifications = false;
    @observable pushNotificationsTextLang = LANGUAGES[0].abbr;
    @observable pushNotificationsTranslateLang = LANGUAGES[1].abbr;
    @observable dateForNotifications = {
        days: '0',
        hours: '0',
        minutes: '0',
    };
    isNetworkConnected = true;

    @observable checkTokenResponse = DEFAULT_API_RESPONSE;
    @observable updateTokenResponse = DEFAULT_API_RESPONSE;
    @observable signInResponse = DEFAULT_API_RESPONSE;
    @observable signUpResponse = DEFAULT_API_RESPONSE;

    constructor(root) {
        this.setDefaultFromAsyncStorage();
        NetInfo.addEventListener((state) => {
            if (state.isConnected && !this.isNetworkConnected) {
                Toast.show({
                    text: i18n.t('online'),
                    type: 'success',
                    textStyle: { textAlign: 'center' },
                });
            }
            if (!state.isConnected) {
                Toast.show({
                    text: i18n.t('offline'),
                    textStyle: { textAlign: 'center' },
                    duration: 999999,
                });
            }
            this.isNetworkConnected = state.isConnected;
        });
        this.root = root;
    }

    @action
    async checkToken() {
        try {
            this.checkTokenResponse = {
                ...this.checkTokenResponse,
                loading: true,
            };
            let { data } = await apiUser.checkToken();
            this.setUser(data);
            this.checkTokenResponse = {
                ...this.checkTokenResponse,
                loading: false,
            };
        } catch (err) {
            this.checkTokenResponse = {
                err,
                loading: false,
            };
        }
    }
    @action
    async updateTokens() {
        try {
            this.updateTokenResponse = {
                ...this.updateTokenResponse,
                loading: true,
            };
            const { data } = await apiUser.updateTokens();
            setItemsToAsyncStorage(data);
            this.updateTokenResponse = {
                ...this.updateTokenResponse,
                loading: false,
            };
        } catch (err) {
            this.updateTokenResponse = {
                ...this.updateTokenResponse,
                err,
                loading: false,
            };
        }
    }
    @action
    async signIn(email, password) {
        try {
            this.signInResponse = {
                ...this.signInResponse,
                loading: true,
            };
            let { data } = await apiUser.signIn({ email, password });
            if (data.status === 'success') {
                const { accessToken, refreshToken, expiresIn } = data;
                setItemsToAsyncStorage({
                    accessToken,
                    refreshToken,
                    expiresIn,
                });
                this.setUser(data);
            }
            Toast.show({
                text: i18n.t(BACKEND_MESSAGES_DICTIONARY[data.message]),
                type: data.status,
                textStyle: { textAlign: 'center' },
            });
            this.signInResponse = {
                ...this.signInResponse,
                loading: false,
            };
            this.root.navigation.navigate('Translator');
        } catch (err) {
            this.signInResponse = {
                err,
                loading: false,
            };
        }
    }
    @action
    async signUp(email, password) {
        try {
            this.signUpResponse = {
                ...this.signUpResponse,
                loading: true,
            };
            let { data } = await apiUser.signUp({ email, password });
            Toast.show({
                text: i18n.t(BACKEND_MESSAGES_DICTIONARY[data.message]),
                type: data.status,
                textStyle: { textAlign: 'center' },
            });
            this.signUpResponse = {
                ...this.signUpResponse,
                loading: false,
            };
        } catch (err) {
            this.signUpResponse = {
                err,
                loading: false,
            };
        }
    }
    @action
    logOut = async () => {
        await AsyncStorage.multiRemove([
            'accessToken',
            'refreshToken',
            'expiresIn',
        ]);
        this.setUser({ email: null, id: null });
    };
    @action
    async setIsActivePushNotificationsDefault() {
        let value =
            JSON.parse(
                await AsyncStorage.getItem('isActivePushNotifications')
            ) || false;

        this.setIsActivePushNotifications(value);
    }
    async setDefaultFromAsyncStorage() {
        let [
            [, pushNotificationsTextLang],
            [, pushNotificationsTranslateLang],
            [, date],
            [, isActivePushNotifications],
            [, locale],
        ] = await AsyncStorage.multiGet([
            'pushNotificationsTextLang',
            'pushNotificationsTranslateLang',
            'dateForNotifications',
            'isActivePushNotifications',
            'locale',
        ]);

        this.setPushNotificationsTextLang(
            pushNotificationsTextLang || LANGUAGES[0].abbr
        );
        this.setPushNotificationsTranslateLang(
            pushNotificationsTranslateLang || LANGUAGES[1].abbr
        );
        this.setDateForNotifications(
            JSON.parse(date) || {
                days: '0',
                hours: '0',
                minutes: '0',
            }
        );
        this.setIsActivePushNotifications(
            JSON.parse(isActivePushNotifications) || false
        );
        this.setLocale(locale || Localization.locale);
    }
    setDateForNotifications(data) {
        this.dateForNotifications = data;
        AsyncStorage.setItem('dateForNotifications', JSON.stringify(data));
    }
    setIsActivePushNotifications(value) {
        this.isActivePushNotifications = value;
        AsyncStorage.setItem('isActivePushNotifications', value.toString());
    }
    setLocale = async (locale) => {
        this.locale = locale;
        i18n.locale = locale;
        AsyncStorage.setItem('locale', locale);
    };

    setPushNotificationsTextLang(lang) {
        this.pushNotificationsTextLang = lang;
        AsyncStorage.setItem('pushNotificationsTextLang', lang);
    }

    setPushNotificationsTranslateLang(lang) {
        this.pushNotificationsTranslateLang = lang;
        AsyncStorage.setItem('pushNotificationsTranslateLang', lang);
    }

    setUser({ email, id }) {
        this.email = email;
        this.id = id;
    }
}

export default UserStore;
