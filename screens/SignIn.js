import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { inject, observer } from "mobx-react";
import {
    Container,
    Text,
    Button,
    Form,
    Item,
    Input,
    Icon,
    View,
    Content,
} from "native-base";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import api from "../api";
import apiUser from "../api/user";
import { setItemsToLocalStorage } from "../helpers";

const SignIn = ({ user, navigation }) => {
    const handlePressSignInWith = (site) => async () => {
        let redirectUrl = await Linking.getInitialURL();
        let authUrl = `${api.defaults.baseURL}/auth/${site}`;
        try {
            let authResult = await WebBrowser.openAuthSessionAsync(
                authUrl,
                redirectUrl
            );
            let {
                queryParams: { accessToken, expiresIn, refreshToken },
            } = Linking.parse(authResult.url);
            setItemsToLocalStorage({ accessToken, expiresIn, refreshToken });
            await user.checkToken();
            console.log(user.checkTokenResponse);
            navigation.navigate("Welcome");
        } catch (err) {
            console.log("ERROR:", err);
        }
    };
    return (
        <Container>
            <Form>
                <Item>
                    <Input placeholder="Username" />
                </Item>
                <Item last>
                    <Input secureTextEntry placeholder="Password" />
                </Item>
                <Button primary block>
                    <Text>Sign In</Text>
                </Button>
            </Form>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                }}>
                <Text style={{ margin: 5 }}>Sign in with</Text>
                <Button
                    onPress={handlePressSignInWith("google")}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name="logo-google" />
                </Button>
                <Button
                    onPress={handlePressSignInWith("yandex")}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name="logo-yen" />
                </Button>
            </View>
        </Container>
    );
};

export default inject("user")(observer(SignIn));
