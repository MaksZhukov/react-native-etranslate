import React from "react";
import { inject, observer } from "mobx-react";
import { Container, Text } from "native-base";

const Welcome = ({ user }) => {
    return (
        <Container>
            <Text>{user.id}</Text>
            <Text>{user.email}</Text>
        </Container>
    );
};

export default inject("user")(observer(Welcome));
