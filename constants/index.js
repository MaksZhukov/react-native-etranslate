export const LANGUAGES = [
    { name: 'russian', abbr: 'ru' },
    { name: 'english', abbr: 'en' },
    { name: 'chinese', abbr: 'zh' },
    { name: 'german', abbr: 'de' },
    { name: 'french', abbr: 'fr' },
    { name: 'danish', abbr: 'da' },
    { name: 'spanish', abbr: 'es' },
    { name: 'latvian', abbr: 'lv' },
    { name: 'polish', abbr: 'pl' },
];

export const NONE_LANGUAGE = {
    name: 'none',
    abbr: 'none',
};

export const BACKEND_MESSAGES_DICTIONARY = {
    'Пользователь уже существует': 'userIsExist',
    'Пользователь не найден': "userIsn'tExist",
    'Подтвердите вашу почту': 'confirmEmail',
    'Почта не была верифицирована': "emailIsn'tVerify",
    'Успешный вход': 'entrySuccess',
};

export const TIME_OFFSET_EXPIRES_IN = 10000;
