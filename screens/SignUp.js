import React, { useLayoutEffect, useState } from "react";
import { TextInput } from "react-native";
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

const SignUp = ({ navigation }) => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate("SignIn");
                    }}>
                    <Text>Go to SignIn</Text>
                </Button>
            ),
        });
    }, [navigation]);
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
            navigation.navigate("Welcome");
        } catch (err) {
            console.log("ERROR:", err);
        }
    };
    return (
        <Container>
            <Form>
                <Item>
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                    />
                </Item>
                <Item last>
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Password"
                    />
                </Item>
                <Button
                    onPress={() => {
                        user.signIn(email, password);
                    }}
                    primary
                    block>
                    <Text>Sign up</Text>
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
                <Text style={{ margin: 5 }}>Sign up with</Text>
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

export default SignUp;
