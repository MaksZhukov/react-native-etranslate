import { action, observable } from 'mobx';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import apiUser from '../api/user';
import * as Localization from 'expo-localization';
import i18n from '../locale';
import { DEFAULT_API_RESPONSE } from '../config';
import { setItemsToAsyncStorage } from '../helpers';

class UserStore {
    @observable email = null;
    @observable id = null;
    @observable locale = Localization.locale;

    @observable checkTokenResponse = DEFAULT_API_RESPONSE;
    @observable updateTokenResponse = DEFAULT_API_RESPONSE;
    @observable signInResponse = DEFAULT_API_RESPONSE;

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
                text: data.message,
                type: data.status,
                textStyle: { textAlign: 'center' },
            });
            this.signInResponse = {
                ...this.signInResponse,
                loading: false,
            };
        } catch (err) {
            this.signInResponse = {
                err,
                loading: false,
            };
        }
    }
    @action
    async logOut() {
        await AsyncStorage.clear();
        this.setUser({ email: null, id: null });
    }
    @action
    async setLocaleDefault() {
        let locale =
            (await AsyncStorage.getItem('locale')) || Localization.locale;
        this.setLocale(locale);
    }
    setLocale = async (locale) => {
        this.locale = locale;
        i18n.locale = locale;
        AsyncStorage.setItem('locale', locale);
    };

    setUser = ({ email, id }) => {
        this.email = email;
        this.id = id;
    };
}

export default new UserStore();
