import { inject, observer } from 'mobx-react';
import { ScrollView } from 'react-native';
import { Button, Text, Header as NativeBaseHeader, Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';

const Header = ({ navigation, user, setOffsetScrollX, offsetScrollX }) => {
    useEffect(() => {
        scrollViewRef.current.scrollTo({ x: offsetScrollX });
    }, [offsetScrollX]);
    const scrollViewRef = useRef(null);
    return (
        <NativeBaseHeader>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                onScrollEndDrag={(e) => {
                    setOffsetScrollX(e.nativeEvent.contentOffset.x);
                }}>
                <Button
                    onPress={() => {
                        navigation.navigate('Dictionary');
                    }}>
                    <Text>Dictionary</Text>
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('Info');
                    }}>
                    <Text>Info</Text>
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('Translator');
                    }}>
                    <Text>Translator</Text>
                </Button>
                <Button
                    onPress={async () => {
                        await user.logOut();
                        navigation.navigate('SignIn');
                    }}>
                    <Icon type='MaterialIcons' name='exit-to-app'></Icon>
                </Button>
            </ScrollView>
        </NativeBaseHeader>
    );
};

export default inject('user')(observer(Header));
