import React, { useEffect, useLayoutEffect } from "react";
import { inject, observer } from "mobx-react";

const Root = ({ user, navigation }) => {
    useEffect(() => {
        let checkToken = async () => {
            await user.checkToken();
            if (user.id === null) {
                navigation.navigate("SignIn");
            } else {
                navigation.navigate("Welcome");
            }
        };
        checkToken();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    return null;
};

export default inject("user")(observer(Root));
