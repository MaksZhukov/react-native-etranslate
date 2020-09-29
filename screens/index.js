import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { inject, observer } from "mobx-react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Welcome from "./Welcome";
import Translator from "./Translator";
import Root from "./Root";
import Header from "../layouts/Header";

const Stack = createStackNavigator();

const Screens = (prop) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Root"}>
                {<Stack.Screen name="Root" component={Root} />}
                {!prop.user.id && (
                    <Stack.Screen name="SignIn" component={SignIn} />
                )}
                {!prop.user.id && (
                    <Stack.Screen name="SignUp" component={SignUp} />
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name="Welcome"
                        component={Welcome}
                        options={{
                            header: (props) => <Header {...props}></Header>,
                        }}></Stack.Screen>
                )}
                {prop.user.id && (
                    <Stack.Screen
                        name="Translator"
                        component={Translator}
                        options={{
                            header: (props) => <Header {...props}></Header>,
                        }}></Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default inject("user")(observer(Screens));
