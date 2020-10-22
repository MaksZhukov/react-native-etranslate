import { inject, observer } from 'mobx-react';
import { ScrollView } from 'react-native';
import { Button, Text, Header as NativeBaseHeader, Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import i18n from '../locale';

const Header = ({
    navigation,
    user: { locale, logOut },
    setOffsetScrollX,
    offsetScrollX,
}) => {
    const scrollViewRef = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current.scrollTo({ x: offsetScrollX });
        }, 0);
    }, [offsetScrollX]);
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
                    <Text>{i18n.t('dictionary')}</Text>
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('Info');
                    }}>
                    <Text>{i18n.t('info')}</Text>
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('Translator');
                    }}>
                    <Text>{i18n.t('translator')}</Text>
                </Button>
                <Button
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}>
                    <Icon name='settings'></Icon>
                </Button>
                <Button
                    onPress={async () => {
                        await logOut();
                        navigation.navigate('SignIn');
                    }}>
                    <Icon type='MaterialIcons' name='exit-to-app'></Icon>
                </Button>
            </ScrollView>
        </NativeBaseHeader>
    );
};

export default inject('user')(observer(Header));
