import api from './index';
const getUserDictionary = (userId) =>
    api.post('get-user-dictionary', { userId });

const addToUserDictionary = (data) => api.post('add-to-user-dictionary', data);

const removeFromUserDictionary = (ids) =>
    api.post('remove-from-user-dictionary', { ids });

export default {
    getUserDictionary,
    addToUserDictionary,
    removeFromUserDictionary,
};
