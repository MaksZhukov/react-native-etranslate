import AsyncStorage from "@react-native-community/async-storage";
import api from "./index";

const checkToken = async (accessToken) =>
    api.post(
        "check-token",
        {},
        {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem(
                    "accessToken"
                )}`,
            },
        }
    );

const signIn = (data) => api.post("sign-in", data);

export default {
    checkToken,
    signIn,
};
