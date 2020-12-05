import api from './index';
const translate = (query) =>
    api(`translate`, { params: query, cache: { exclude: { query: false } } });
const translateByImage = (data) => api.post('translate/image', data);

export default {
    translate,
    translateByImage,
};
