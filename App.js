import React, { useState, useEffect } from 'react';
import { Provider } from 'mobx-react';
import { Root, Toast } from 'native-base';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import store from './store';
import Screens from './screens';

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let fetchFonts = async () => {
            await Font.loadAsync({
                Roboto: require('native-base/Fonts/Roboto.ttf'),
                Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            });
            setLoading(false);
        };
        fetchFonts();
    }, []);
    if (loading) {
        return (
            <Root>
                <AppLoading />
            </Root>
        );
    } else {
        return (
            <Root>
                <Provider {...store}>
                    <Screens />
                </Provider>
            </Root>
        );
    }
}

export default App;
