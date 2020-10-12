import React, { useLayoutEffect } from "react";
import { inject, observer } from "mobx-react";
import { Container, Text, Button } from "native-base";

const Dictionary = ({ user, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container>
            <Text>Dictionary</Text>
        </Container>
    );
};

export default inject("user")(observer(Dictionary));
