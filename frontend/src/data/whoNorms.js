// Нормативные данные ВОЗ для детей
export const whoNorms = {
    height: {
        male: [
            { age: 0, min: 46.3, max: 53.4, median: 49.9 },
            { age: 1, min: 51.8, max: 59.2, median: 55.5 },
            { age: 2, min: 56.5, max: 64.0, median: 60.2 },
            { age: 3, min: 60.5, max: 68.0, median: 64.2 },
            { age: 4, min: 63.9, max: 71.5, median: 67.6 },
            { age: 5, min: 66.9, max: 74.6, median: 70.7 },
            { age: 6, min: 69.6, max: 77.5, median: 73.5 },
            // ... можно добавить больше данных
        ],
        female: [
            { age: 0, min: 45.8, max: 52.7, median: 49.1 },
            { age: 1, min: 51.2, max: 58.6, median: 54.9 },
            { age: 2, min: 55.9, max: 63.3, median: 59.6 },
            { age: 3, min: 59.9, max: 67.3, median: 63.5 },
            { age: 4, min: 63.3, max: 70.8, median: 66.9 },
            { age: 5, min: 66.3, max: 73.9, median: 70.0 },
            { age: 6, min: 69.0, max: 76.8, median: 72.8 },
        ]
    },
    weight: {
        male: [
            { age: 0, min: 2.5, max: 4.3, median: 3.3 },
            { age: 1, min: 3.8, max: 6.0, median: 4.8 },
            { age: 2, min: 4.8, max: 7.3, median: 5.9 },
            { age: 3, min: 5.6, max: 8.3, median: 6.8 },
            { age: 4, min: 6.2, max: 9.2, median: 7.5 },
            { age: 5, min: 6.8, max: 10.0, median: 8.2 },
            { age: 6, min: 7.3, max: 10.7, median: 8.8 },
        ],
        female: [
            { age: 0, min: 2.4, max: 4.2, median: 3.2 },
            { age: 1, min: 3.6, max: 5.8, median: 4.5 },
            { age: 2, min: 4.5, max: 7.0, median: 5.6 },
            { age: 3, min: 5.3, max: 8.0, median: 6.4 },
            { age: 4, min: 5.9, max: 8.8, median: 7.1 },
            { age: 5, min: 6.5, max: 9.5, median: 7.7 },
            { age: 6, min: 7.0, max: 10.2, median: 8.3 },
        ]
    },
    head: {
        male: [
            { age: 0, min: 32.1, max: 36.9, median: 34.5 },
            { age: 1, min: 36.5, max: 41.2, median: 38.8 },
            { age: 2, min: 39.0, max: 43.7, median: 41.4 },
            { age: 3, min: 40.7, max: 45.3, median: 43.0 },
            { age: 4, min: 42.0, max: 46.5, median: 44.3 },
            { age: 5, min: 43.0, max: 47.5, median: 45.3 },
            { age: 6, min: 43.9, max: 48.3, median: 46.2 },
        ],
        female: [
            { age: 0, min: 31.7, max: 36.2, median: 34.0 },
            { age: 1, min: 35.9, max: 40.4, median: 38.1 },
            { age: 2, min: 38.4, max: 42.9, median: 40.7 },
            { age: 3, min: 40.1, max: 44.5, median: 42.3 },
            { age: 4, min: 41.4, max: 45.7, median: 43.6 },
            { age: 5, min: 42.4, max: 46.7, median: 44.6 },
            { age: 6, min: 43.3, max: 47.6, median: 45.5 },
        ]
    }
};