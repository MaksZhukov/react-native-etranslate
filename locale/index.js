import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './translations/en.json';
import ru from './translations/ru.json';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
    en,
    ru,
};

i18n.fallbacks = true;

export default i18n;
