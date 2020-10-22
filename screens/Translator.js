import React, { useEffect, useMemo, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Form,
    Input,
    Button,
    Item,
    Icon,
    Textarea,
    Picker,
    View,
} from 'native-base';
import * as Speech from 'expo-speech';
import apiTranslator from '../api/translator';
import i18n from '../locale';
import { debounce } from '../helpers';
import { LANGUAGES } from '../constants';

const Translator = ({ user: { locale }, navigation }) => {
    let [text, setText] = useState('');
    let [selectedTextLang, setSelectedTextLang] = useState(LANGUAGES[1].abbr);
    let [selectedTranslateLang, setSelectedTranslateLang] = useState(
        LANGUAGES[0].abbr
    );
    let [loading, setLoading] = useState(false);
    let [translation, setTranslation] = useState('');
    let [availableVoices, setAvailableVoices] = useState([]);

    useEffect(() => {
        const fetchAvailableVoices = async () => {
            let res = await Speech.getAvailableVoicesAsync();
            let languages = res.filter((item) =>
                LANGUAGES.some((el) => item.language.includes(el.abbr))
            );
            setAvailableVoices(languages);
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
        let objectVoice = availableVoices.find((item) =>
            item.language.toLowerCase().includes(language)
        );
        Speech.speak(text, { voice: objectVoice.identifier });
    };

    return (
        <Container>
            <View style={{ flexDirection: 'row' }}>
                <Picker
                    note
                    style={{
                        width: '50%',
                    }}
                    onValueChange={setSelectedTextLang}
                    selectedValue={selectedTextLang}
                    mode='dropdown'>
                    {LANGUAGES.map((item) => (
                        <Picker.Item
                            key={item.abbr}
                            label={i18n.t(item.name)}
                            value={item.abbr}></Picker.Item>
                    ))}
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
            </View>
            <Textarea
                style={{ flex: 4 }}
                value={text}
                onChangeText={handleChangeText}
                bordered
                placeholder={i18n.t('text')}></Textarea>
            <View style={{ flexDirection: 'row' }}>
                <Picker
                    note
                    style={{ width: '50%' }}
                    onValueChange={setSelectedTranslateLang}
                    selectedValue={selectedTranslateLang}
                    mode='dropdown'>
                    {LANGUAGES.map((item) => (
                        <Picker.Item
                            key={item.abbr}
                            label={i18n.t(item.name)}
                            value={item.abbr}></Picker.Item>
                    ))}
                </Picker>
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
                value={loading ? `${translation}...` : translation}
                bordered
                disabled
                placeholder={i18n.t('translation')}></Textarea>
        </Container>
    );
};

export default inject('user')(observer(Translator));
