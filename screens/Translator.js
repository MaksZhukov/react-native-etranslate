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
} from 'native-base';
import * as Speech from 'expo-speech';
import apiTranslator from '../api/translator';
import { debounce } from '../helpers';
import { LANGUAGES } from '../constants';

const Translator = ({ user, navigation }) => {
    let [text, setText] = useState('');
    let [selectedTextLang, setSelectedTextLang] = useState(LANGUAGES[0].abbr);
    let [selectedTranslateLang, setSelectedTranslateLang] = useState(
        LANGUAGES[1].abbr
    );
    let [loading, setLoading] = useState(false);
    let [translation, setTranslation] = useState('');
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
    const handleChangeText = (e) => {
        setLoading(true);
        setText(e);
        debouncedTranslate(e, selectedTextLang, selectedTranslateLang);
    };
    const handlePressPronounce = async () => {
        Speech.speak(translation, { language: selectedTranslateLang });
        let res = await Speech.getAvailableVoicesAsync();
        console.log(res);
    };

    return (
        <Container>
            <Picker
                note
                style={{
                    width: '50%',
                    height: 1,
                }}
                onValueChange={setSelectedTextLang}
                selectedValue={selectedTextLang}
                mode='dropdown'>
                {LANGUAGES.map((item) => (
                    <Picker.Item
                        label={item.name}
                        value={item.abbr}></Picker.Item>
                ))}
            </Picker>
            <Textarea
                style={{ flex: 4 }}
                value={text}
                onChangeText={handleChangeText}
                bordered
                placeholder={'Текст'}></Textarea>
            <Picker
                note
                style={{ width: '50%', height: 1 }}
                onValueChange={setSelectedTranslateLang}
                selectedValue={selectedTranslateLang}
                mode='dropdown'>
                {LANGUAGES.map((item) => (
                    <Picker.Item
                        label={item.name}
                        value={item.abbr}></Picker.Item>
                ))}
            </Picker>
            <Button
                onPress={handlePressPronounce}
                style={{ margin: 5 }}
                rounded
                transparent
                bordered>
                <Icon name='volume-high' />
            </Button>
            <Textarea
                style={{ flex: 4 }}
                value={loading ? `${translation}...` : translation}
                bordered
                disabled
                placeholder={'Перевод'}></Textarea>
        </Container>
    );
};

export default inject('user')(observer(Translator));
