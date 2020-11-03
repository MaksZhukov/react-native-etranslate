import React, { useLayoutEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Text, Accordion, View, Icon } from 'native-base';

const Dictionary = ({
    user,
    userDictionary: { items, removeFromUserDictionary },
    navigation,
}) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null,
        });
    }, [navigation]);
    const dataArray = items.map((item) => ({
        id: item.id,
        title: `${item.textLang} | ${item.text} | ${item.translateLang}`,
        content: item.translate,
    }));

    const renderHeader = (item, expanded) => {
        return (
            <View
                key={item.id}
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    alignItems: 'center',
                    backgroundColor: 'lightgray',
                }}>
                <Text style={{ flex: 1 }}> {item.title}</Text>
                <Icon
                    onPress={() => removeFromUserDictionary([item.id])}
                    style={{ fontSize: 20, color: '#e07c40' }}
                    name='trash'
                />
            </View>
        );
    };
    return (
        <Container>
            <Accordion
                icon='add'
                expandedIcon='remove'
                dataArray={dataArray}
                renderHeader={renderHeader}
            />
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(Dictionary));
