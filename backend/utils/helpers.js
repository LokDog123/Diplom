const generateId = (prefix) => {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
};

module.exports = { generateId, formatDate };