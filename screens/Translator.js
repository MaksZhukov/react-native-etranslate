import React, { useEffect, useMemo, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Icon, Textarea, Picker, View } from 'native-base';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import apiTranslator from '../api/translator';
import i18n from '../locale';
import { debounce } from '../helpers';
import { LANGUAGES } from '../constants';

const recordingOptions = {
    android: {
        extension: '.mp4',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};

const Translator = ({ user: { locale }, navigation, userDictionary }) => {
    let [text, setText] = useState('');
    let [selectedTextLang, setSelectedTextLang] = useState(LANGUAGES[1].abbr);
    let [selectedTranslateLang, setSelectedTranslateLang] = useState(
        LANGUAGES[0].abbr
    );
    let [loading, setLoading] = useState(false);
    let [translation, setTranslation] = useState('');
    let [availableVoices, setAvailableVoices] = useState([]);
    let [isRecording, setIsRecording] = useState(false);
    const recording = useRef(null);
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
            }, 0);
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
        Speech.speak(text);
    };

    const getRecordingTranscription = async () => {
        try {
            const { uri } = await FileSystem.getInfoAsync(
                recording.current.getURI()
            );
            const formData = new FormData();
            formData.append('file', {
                uri,
                type: 'audio/m4a',
                name: `${Date.now()}.m4a`,
            });
            formData.append('textLang', selectedTextLang);
            formData.append('translateLang', selectedTranslateLang);
            const { data } = await apiTranslator.speechToText(formData);
            FileSystem.deleteAsync(uri);
        } catch (error) {
            console.log('getRecording transcription', error);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        try {
            await recording.current.stopAndUnloadAsync();
            getRecordingTranscription();
        } catch (error) {
            console.log(error);
        }
    };

    const startRecording = async () => {
        setIsRecording(true);
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,
        });
        const record = new Audio.Recording();
        try {
            await record.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            await record.startAsync();
        } catch (error) {
            stopRecording();
        }
        recording.current = record;
    };

    const handlePressRecordVoice = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.AUDIO_RECORDING
        );
        if (status !== 'granted') return;
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleTextValuePickerChange = (val) => {
        setSelectedTextLang(val);
        setSelectedTranslateLang(selectedTextLang);
    };
    const handleTranslateValuePickerChange = (val) => {
        setSelectedTranslateLang(val);
        setSelectedTextLang(selectedTranslateLang);
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
                <Button
                    onPress={handlePressRecordVoice}
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
                    <Icon name={isRecording ? 'mic' : 'mic-off'} />
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
                    onValueChange={handleTranslateValuePickerChange}
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
                value={loading ? `${translation}...` : translation}
                bordered
                disabled
                placeholder={i18n.t('translation')}></Textarea>
        </Container>
    );
};

export default inject('user', 'userDictionary')(observer(Translator));
