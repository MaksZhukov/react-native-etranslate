import React, { useEffect, useMemo, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Icon, Textarea, Picker, View } from 'native-base';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import apiTranslator from '../api/translator';
import i18n from '../locale';
import { debounce } from '../helpers';
import { LANGUAGES } from '../constants';

const Translator = ({ user: { locale }, navigation, userDictionary }) => {
    let [text, setText] = useState('');
    let [loadingImageRecognition, setLoadingImageRecognition] = useState(false);
    let [selectedTextLang, setSelectedTextLang] = useState(LANGUAGES[1].abbr);
    let [selectedTranslateLang, setSelectedTranslateLang] = useState(
        LANGUAGES[0].abbr
    );
    let [loading, setLoading] = useState(false);
    let [translation, setTranslation] = useState('');
    let [availableVoices, setAvailableVoices] = useState([]);
    let userDirectoryItemByCurrentTranslation = userDictionary.items.find(
        (item) =>
            item.text === text &&
            item.translate === translation &&
            item.textLang === selectedTextLang &&
            item.translateLang === selectedTranslateLang
    );
    useEffect(() => {
        const fetchAvailableVoices = async () => {
            await Speech.getAvailableVoicesAsync();
            // A little hack to get voices, because they doesn't come the first time
            setTimeout(async () => {
                let res = await Speech.getAvailableVoicesAsync();
                let languages = LANGUAGES.map((el) =>
                    res.find((item) =>
                        item.language.toLowerCase().includes(el.abbr)
                    )
                );
                setAvailableVoices(languages);
            }, 100);
        };
        fetchAvailableVoices();
    }, []);

    const translate = async (text, textLang, translateLang) => {
        if (!text) {
            setTranslation('');
            setLoading(false);
            return;
        }
        const response = await apiTranslator.translate({
            textLang,
            translateLang,
            text,
        });
        setTranslation(response.data);
        setLoading(false);
    };
    const debouncedTranslate = useMemo(() => debounce(translate, 400), []);

    useEffect(() => {
        if (text) {
            setLoading(true);
            debouncedTranslate(text, selectedTextLang, selectedTranslateLang);
        }
    }, [selectedTextLang, selectedTranslateLang, text]);

    const handleChangeText = (e) => {
        setText(e);
    };
    const handlePressPronounce = (text, language) => async () => {
        // let objectVoice = availableVoices.find((item) =>
        //     item.language.toLowerCase().includes(language)
        // );
        Speech.speak(text);
    };

    const handlePressImageRecognition = async () => {
        const {
            status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                const formData = new FormData();
                let nameArray = result.uri.split('/');
                formData.append('image', {
                    uri: result.uri,
                    type: 'multipart/form-data',
                    name: nameArray[nameArray.length - 1],
                });
                formData.append('textLang', selectedTextLang);
                formData.append('translateLang', selectedTranslateLang);
                setLoadingImageRecognition(true);
                const { data } = await apiTranslator.translateByImage(formData);
                setText(data.text);
                setTranslation(data.translation);
                setLoadingImageRecognition(false);
            }
        }
    };

    const handleTextValuePickerChange = (val) => {
        setSelectedTextLang(val);
        if (val === selectedTranslateLang) {
            setSelectedTranslateLang(selectedTextLang);
        }
    };
    const handleTranslateValuePickerChange = (val) => {
        setSelectedTranslateLang(val);
        if (val === selectedTextLang) {
            setSelectedTextLang(selectedTranslateLang);
        }
    };
    const handlePressFavorite = () => {
        if (userDirectoryItemByCurrentTranslation) {
            userDictionary.removeFromUserDictionary([
                userDirectoryItemByCurrentTranslation.id,
            ]);
        } else {
            userDictionary.addToUserDictionary({
                text,
                translate: translation,
                textLang: selectedTextLang,
                translateLang: selectedTranslateLang,
            });
        }
    };

    const renderPickerItems = LANGUAGES.map((item) => (
        <Picker.Item
            key={item.abbr}
            label={i18n.t(item.name)}
            value={item.abbr}></Picker.Item>
    ));

    return (
        <Container>
            <View style={{ flexDirection: 'row' }}>
                <Picker
                    note
                    style={{
                        width: '50%',
                    }}
                    onValueChange={handleTextValuePickerChange}
                    selectedValue={selectedTextLang}
                    mode='dropdown'>
                    {renderPickerItems}
                </Picker>
                <Button
                    disabled={!text}
                    onPress={handlePressPronounce(text, selectedTextLang)}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='volume-high' />
                </Button>
                <Button
                    onPress={handlePressImageRecognition}
                    style={{
                        margin: 5,
                        width: 52,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='image' />
                </Button>
            </View>
            <Textarea
                style={{ flex: 4 }}
                disabled={loadingImageRecognition}
                value={loadingImageRecognition ? '...' : text}
                onChangeText={handleChangeText}
                bordered
                placeholder={i18n.t('text')}></Textarea>
            <View style={{ flexDirection: 'row' }}>
                <Picker
                    note
                    style={{ width: '50%' }}
                    onValueChange={handleTranslateValuePickerChange}
                    selectedValue={selectedTranslateLang}
                    mode='dropdown'>
                    {renderPickerItems}
                </Picker>
                <Button
                    style={{ margin: 5 }}
                    onPress={handlePressFavorite}
                    rounded
                    transparent
                    bordered
                    disabled={!text || loading}>
                    <Icon
                        name={
                            userDirectoryItemByCurrentTranslation
                                ? 'star'
                                : 'star-outline'
                        }
                        style={
                            userDirectoryItemByCurrentTranslation
                                ? { color: 'orange' }
                                : null
                        }
                    />
                </Button>
                <Button
                    onPress={handlePressPronounce(
                        translation,
                        selectedTranslateLang
                    )}
                    disabled={!translation}
                    style={{ margin: 5 }}
                    rounded
                    transparent
                    bordered>
                    <Icon name='volume-high' />
                </Button>
            </View>
            <Textarea
                style={{ flex: 4 }}
                value={
                    loadingImageRecognition
                        ? '...'
                        : loading
                        ? `${translation}...`
                        : translation
                }
                bordered
                disabled
                placeholder={i18n.t('translation')}></Textarea>
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(Translator));
