import api from './index';

const registerPushNotifications = (
    token,
    minutes,
    textLang,
    translateLang,
    userID
) =>
    api.post('push-notification', {
        token,
        minutes,
        textLang,
        translateLang,
        userID,
    });
const unregisterPushNotifications = (userID) =>
    api.delete('push-notification', { userID });

export default {
    registerPushNotifications,
    unregisterPushNotifications,
};
