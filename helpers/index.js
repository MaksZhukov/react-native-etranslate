import AsyncStorage from '@react-native-community/async-storage';

export const setItemsToAsyncStorage = (data) => {
    Object.keys(data).forEach((name) => {
        AsyncStorage.setItem(name, data[name].toString());
    });
};

export const checkItemsInAsyncStorage = async (arrItems) => {
    let response = await AsyncStorage.multiGet(arrItems);
    return response.every(([key, val]) => key && val);
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
