import api from './index';
const translate = (query) =>
    api(`translate`, { params: query, cache: { exclude: { query: false } } });
const speechToText = (data) =>
    api.post(`speech`, data, {
        headers: {
            // 'Content-Type': 'multipart/form-data',
        },
    });

export default {
    translate,
    speechToText,
};
