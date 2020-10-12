import AsyncStorage from '@react-native-community/async-storage';
import api from './index';

const checkToken = async () => await api.post('check-token');

const signIn = (data) => api.post('sign-in', data);

const updateTokens = async () =>
    api.post(
        'update-tokens',
        {},
        {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem(
                    'refreshToken'
                )}`,
            },
        }
    );

export default {
    checkToken,
    updateTokens,
    signIn,
};
