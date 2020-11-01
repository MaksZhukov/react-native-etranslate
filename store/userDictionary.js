import { action, observable } from 'mobx';
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
    removeFromUserDictionary = async () => {};

    @action
    addToUserDictionary = async () => {};
}

export default UserDictionaryStore;
