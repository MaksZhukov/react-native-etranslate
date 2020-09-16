import AsyncStorage from "@react-native-community/async-storage";

export const setItemsToLocalStorage = (data) => {
    Object.keys(data).forEach((name) => {
        AsyncStorage.setItem(name, data[name]);
    });
};
