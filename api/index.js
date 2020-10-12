import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

let debug = 'http://localhost:3000';
let remote = 'https://e-translate.herokuapp.com/api';

const api = axios.create({
    baseURL: remote,
});

api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${await AsyncStorage.getItem(
        'accessToken'
    )}`;
    return config;
});

export default api;
