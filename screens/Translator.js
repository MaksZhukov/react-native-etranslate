import React, { useEffect, useMemo, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Form, Input, Item, Textarea, View } from 'native-base';
import apiTranslator from '../api/translator';
import { debounce } from '../helpers';

const Translator = ({ user, navigation }) => {
    let [text, setText] = useState('');
    let [loading, setLoading] = useState(false);
    let [translation, setTranslation] = useState('');
    const translate = async (text) => {
        if (!text) {
            setTranslation('');
            setLoading(false);
            return;
        }
        const response = await apiTranslator.translate({
            textLang: 'en',
            translateLang: 'ru',
            text,
        });
        setTranslation(response.data);
        setLoading(false);
    };
    const debouncedTranslate = useMemo(() => debounce(translate, 400), []);
    const handleChangeText = (e) => {
        setLoading(true);
        setText(e);
        debouncedTranslate(e);
    };

    return (
        <Container>
            <Item>
                <Input
                    value={text}
                    onChangeText={handleChangeText}
                    placeholder='Текст'
                />
            </Item>
            <Textarea
                value={loading ? `${translation}...` : translation}
                bordered
                disabled
                placeholder={'Перевод'}></Textarea>
        </Container>
    );
};

export default inject('user')(observer(Translator));
