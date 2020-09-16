import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Provider } from "mobx-react";
import { Root } from "native-base";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import store from "./store";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Welcome from "./screens/Welcome";

const Stack = createStackNavigator();

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let fetchFonts = async () => {
            await Font.loadAsync({
                Roboto: require("native-base/Fonts/Roboto.ttf"),
                Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            });
            setLoading(false);
        };
        fetchFonts();
    }, []);
    if (loading) {
        return (
            <Root>
                <AppLoading />
            </Root>
        );
    } else {
        return (
            <Root>
                <Provider {...store}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="SignIn">
                            <Stack.Screen name="SignIn" component={SignIn} />
                            <Stack.Screen name="SignUp" component={SignUp} />
                            <Stack.Screen
                                name="Welcome"
                                component={Welcome}></Stack.Screen>
                        </Stack.Navigator>
                    </NavigationContainer>
                </Provider>
            </Root>
        );
    }
}

export default App;
