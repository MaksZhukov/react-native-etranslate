import { action, observable } from 'mobx';
import { Toast } from 'native-base';
import i18n from '../locale';
import apiDictionary from '../api/dictionary';
import { DEFAULT_API_RESPONSE } from '../config';

class UserDictionaryStore {
    constructor(root) {
        this.root = root;
    }
    @observable items = [];

    @observable getUserDictionaryResponse = DEFAULT_API_RESPONSE;
    @observable addToUserDictionaryResponse = DEFAULT_API_RESPONSE;
    @observable removeFromUserDictionaryResponse = DEFAULT_API_RESPONSE;

    @action
    getUserDictionaryItems = async () => {
        try {
            this.getUserDictionaryResponse = {
                ...this.getUserDictionaryResponse,
                loading: true,
            };
            let { data } = await apiDictionary.getUserDictionary(
                this.root.user.id
            );
            this.items = data;
            this.getUserDictionaryResponse = {
                ...this.getUserDictionaryResponse,
                loading: false,
            };
        } catch (err) {
            this.getUserDictionaryResponse = {
                err,
                loading: false,
            };
        }
    };

    @action
    removeFromUserDictionary = async (ids) => {
        try {
            this.removeFromUserDictionaryResponse = {
                ...this.removeFromUserDictionaryResponse,
                loading: true,
            };
            await apiDictionary.removeFromUserDictionary(ids);
            this.items = this.items.filter((item) => !ids.includes(item.id));
            this.removeFromUserDictionaryResponse = {
                ...this.removeFromUserDictionaryResponse,
                loading: false,
            };
            Toast.show({
                text: i18n.t('removeFromUserDictionary'),
                textStyle: { textAlign: 'center' },
                type: 'success',
            });
        } catch (err) {
            this.removeFromUserDictionaryResponse = {
                err,
                loading: false,
            };
        }
    };

    @action
    addToUserDictionary = async (data) => {
        try {
            this.addToUserDictionaryResponse = {
                ...this.addToUserDictionaryResponse,
                loading: true,
            };
            const response = await apiDictionary.addToUserDictionary({
                userId: this.root.user.id,
                ...data,
            });
            this.items.push(response.data.data);
            this.addToUserDictionaryResponse = {
                ...this.addToUserDictionaryResponse,
                loading: false,
            };
            Toast.show({
                text: i18n.t('addToUserDictionary'),
                textStyle: { textAlign: 'center' },
                type: 'success',
            });
        } catch (err) {
            this.addToUserDictionaryResponse = {
                err,
                loading: false,
            };
        }
    };
}

export default UserDictionaryStore;
