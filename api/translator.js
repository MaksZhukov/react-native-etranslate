import api from './index';
const translate = (query) => api(`translate`, { params: query });

export default {
    translate,
};
