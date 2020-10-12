import React, { useEffect, useLayoutEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { checkItemsInAsyncStorage } from '../helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { TIME_OFFSET_EXPIRES_IN } from '../constants';

const Root = ({ user, navigation }) => {
    useEffect(() => {
        let checkToken = async () => {
            await user.checkToken();
            if (user.id === null) {
                const isTokensAndExpiresIn = await checkItemsInAsyncStorage([
                    'refreshToken',
                    'accessToken',
                    'expiresIn',
                ]);
                if (
                    isTokensAndExpiresIn &&
                    (await AsyncStorage.getItem('expiresIn')) <
                        (new Date().getTime() + TIME_OFFSET_EXPIRES_IN) / 1000
                ) {
                    await user.updateTokens();
                    await user.checkToken();
                    if (user.id === null) {
                        navigation.navigate('SignIn');
                    } else {
                        navigation.navigate('Translator');
                    }
                } else {
                    navigation.navigate('SignIn');
                }
            } else {
                navigation.navigate('Translator');
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

export default inject('user')(observer(Root));
