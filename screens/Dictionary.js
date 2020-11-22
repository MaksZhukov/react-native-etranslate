import React, { useLayoutEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
    Container,
    Text,
    Accordion,
    View,
    Icon,
    Input,
    Picker,
    Item,
    Label,
} from 'native-base';
import i18n from '../locale';
import { LANGUAGES, NONE_LANGUAGE } from '../constants';

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
    const [searchTerm, setSearchTerm] = useState('');
    let [selectedTextLang, setSelectedTextLang] = useState(NONE_LANGUAGE.abbr);
    let [selectedTranslateLang, setSelectedTranslateLang] = useState(
        NONE_LANGUAGE.abbr
    );
    const renderPickerItems = [NONE_LANGUAGE, ...LANGUAGES].map((item) => (
        <Picker.Item
            key={item.abbr}
            label={i18n.t(item.name)}
            value={item.abbr}></Picker.Item>
    ));

    const mapItemsToDataArray = (array) =>
        array.map((item) => ({
            id: item.id,
            title: `${item.textLang} | ${item.text} | ${item.translateLang}`,
            content: item.translate,
        }));
    const getDataArray = () => {
        let newItems = items;
        if (searchTerm) {
            let filteredSearchTerm = searchTerm.toLowerCase();
            newItems = newItems.filter(
                ({ text, textLang, translate, translateLang }) =>
                    text.toLowerCase().includes(filteredSearchTerm) ||
                    textLang.toLowerCase().includes(filteredSearchTerm) ||
                    translate.toLowerCase().includes(filteredSearchTerm) ||
                    translateLang.toLowerCase().includes(filteredSearchTerm)
            );
        }
        if (selectedTextLang !== NONE_LANGUAGE.abbr) {
            newItems = newItems.filter(
                ({ textLang }) => textLang === selectedTextLang
            );
        }
        if (selectedTranslateLang !== NONE_LANGUAGE.abbr) {
            newItems = newItems.filter(
                ({ translateLang }) => translateLang === selectedTranslateLang
            );
        }
        return mapItemsToDataArray(newItems);
    };
    const dataArray = getDataArray();

    const renderFilterContent = (item) => {
        return (
            <View>
                <Input
                    style={{ marginHorizontal: 10 }}
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                    placeholder={i18n.t('Search')}></Input>
                <Item style={{ paddingHorizontal: 15 }}>
                    <Label style={{ width: '50%' }}>
                        {i18n.t('languageForText')}
                    </Label>
                    <Picker
                        style={{ width: '50%' }}
                        note
                        onValueChange={setSelectedTextLang}
                        selectedValue={selectedTextLang}
                        mode='dropdown'>
                        {renderPickerItems}
                    </Picker>
                </Item>
                <Item style={{ paddingHorizontal: 15 }}>
                    <Label style={{ width: '50%' }}>
                        {i18n.t('languageForTranslate')}
                    </Label>
                    <Picker
                        style={{ width: '50%' }}
                        note
                        onValueChange={setSelectedTranslateLang}
                        selectedValue={selectedTranslateLang}
                        mode='dropdown'>
                        {renderPickerItems}
                    </Picker>
                </Item>
            </View>
        );
    };

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
            <View>
                <Accordion
                    renderContent={renderFilterContent}
                    dataArray={[
                        {
                            title: i18n.t('Filter'),
                        },
                    ]}></Accordion>
                <Accordion
                    icon='add'
                    expandedIcon='remove'
                    dataArray={dataArray}
                    renderHeader={renderHeader}
                />
            </View>
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(Dictionary));
