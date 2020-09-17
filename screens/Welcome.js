import React, { useLayoutEffect } from "react";
import { inject, observer } from "mobx-react";
import { Container, Text, Button } from "native-base";

const Welcome = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container>
            <Text>{user.id}</Text>
            <Text>{user.email}</Text>
            <Button
                onPress={() => {
                    user.logOut(navigation);
                }}>
                <Text>log out</Text>
            </Button>
        </Container>
    );
};

export default inject("user")(observer(Welcome));
