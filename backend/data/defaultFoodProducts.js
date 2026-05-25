const defaultFoodProducts = [
    { 
        name: 'Грудное молоко', 
        category: 'milk', 
        recommended_age_months: 0,
        is_allergen: false,
        description: 'Естественное вскармливание',
        notes: 'Основное питание для новорожденных'
    },
    { 
        name: 'Смесь', 
        category: 'milk', 
        recommended_age_months: 0,
        is_allergen: false,
        description: 'Искусственное вскармливание',
        notes: 'Адаптированные молочные смеси'
    },
    { 
        name: 'Овощное пюре', 
        category: 'vegetable', 
        recommended_age_months: 4,
        is_allergen: false,
        description: 'Пюре из овощей',
        notes: 'Кабачок, цветная капуста, брокколи'
    },
    { 
        name: 'Фруктовое пюре', 
        category: 'fruit', 
        recommended_age_months: 4,
        is_allergen: false,
        description: 'Пюре из фруктов',
        notes: 'Яблоко, груша, банан'
    },
    { 
        name: 'Каша', 
        category: 'cereal', 
        recommended_age_months: 4,
        is_allergen: false,
        description: 'Злаковые каши',
        notes: 'Рисовая, гречневая, кукурузная'
    },
    { 
        name: 'Мясное пюре', 
        category: 'meat', 
        recommended_age_months: 6,
        is_allergen: false,
        description: 'Пюре из мяса',
        notes: 'Кролик, индейка, говядина'
    },
    { 
        name: 'Рыбное пюре', 
        category: 'fish', 
        recommended_age_months: 8,
        is_allergen: true,
        description: 'Пюре из рыбы',
        notes: 'Треска, хек, минтай'
    },
    { 
        name: 'Творог', 
        category: 'dairy', 
        recommended_age_months: 8, 
        is_allergen: true,
        description: 'Кисломолочный продукт',
        notes: 'Детский творожок'
    },
    { 
        name: 'Кефир/йогурт', 
        category: 'dairy', 
        recommended_age_months: 8,
        is_allergen: false,
        description: 'Кисломолочные напитки',
        notes: 'Детский кефир, йогурт'
    },
    { 
        name: 'Яичный желток', 
        category: 'egg', 
        recommended_age_months: 7, 
        is_allergen: true,
        description: 'Желток куриного яйца',
        notes: 'Начинать с 1/4 желтка'
    },
    { 
        name: 'Сок', 
        category: 'drink', 
        recommended_age_months: 6,
        is_allergen: false,
        description: 'Фруктовые соки',
        notes: 'Яблочный, грушевый сок'
    },
    { 
        name: 'Мед', 
        category: 'other', 
        recommended_age_months: 12, 
        is_allergen: true,
        description: 'Натуральный мед',
        notes: 'Сильный аллерген'
    },
    { 
        name: 'Орехи', 
        category: 'nuts', 
        recommended_age_months: 18, 
        is_allergen: true,
        description: 'Различные орехи',
        notes: 'Грецкие, миндаль, фундук'
    },
    { 
        name: 'Клубника', 
        category: 'fruit', 
        recommended_age_months: 12, 
        is_allergen: true,
        description: 'Свежая клубника',
        notes: 'Ягода-аллерген'
    },
    { 
        name: 'Цитрусовые', 
        category: 'fruit', 
        recommended_age_months: 12, 
        is_allergen: true,
        description: 'Апельсины, мандарины, лимоны',
        notes: 'Сильные аллергены'
    },
    { 
        name: 'Шоколад', 
        category: 'other', 
        recommended_age_months: 24, 
        is_allergen: true,
        description: 'Шоколад и шоколадные изделия',
        notes: 'Сильный аллерген'
    }
];

module.exports = defaultFoodProducts;