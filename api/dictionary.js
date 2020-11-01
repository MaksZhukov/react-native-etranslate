import api from './index';
const getUserDictionary = (userId) =>
    api.post('get-user-dictionary', { userId });

export default {
    getUserDictionary,
};
