import React, { useLayoutEffect } from "react";
import { inject, observer } from "mobx-react";
import { Container, Text, Button, Header } from "native-base";

const Welcome = ({ user, navigation }) => {
    return (
        <Container>
            <Text>{user.id}</Text>
            <Text>{user.email}</Text>
        </Container>
    );
};

export default inject("user")(observer(Welcome));
