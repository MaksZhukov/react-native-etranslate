import React, { useLayoutEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Text, Button } from 'native-base';

const Dictionary = ({ user, userDictionary: { items }, navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    return (
        <Container>
            {items.map((item) => (
                <>
                    <Text>{item.text}</Text>
                    <Text>{item.translate}</Text>
                </>
            ))}
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(Dictionary));
