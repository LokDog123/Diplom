import { z } from 'zod';

// Схема регистрации
export const registerSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(50, 'Имя слишком длинное'),
    lastname: z.string().min(2, 'Фамилия должна содержать минимум 2 символа').max(50, 'Фамилия слишком длинная'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
});

// Схема замера
export const measurementSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    height: z.number()
        .min(20, 'Рост не может быть меньше 20 см')
        .max(250, 'Рост не может быть больше 250 см')
        .nullable(),
    weight: z.number()
        .min(0.5, 'Вес не может быть меньше 0.5 кг')
        .max(200, 'Вес не может быть больше 200 кг')
        .nullable(),
    head_circumference: z.number()
        .min(20, 'Окружность головы не может быть меньше 20 см')
        .max(100, 'Окружность головы не может быть больше 100 см')
        .nullable()
        .optional(),
    notes: z.string().max(500, 'Заметки не могут быть длиннее 500 символов').optional()
});

// Схема добавления ребенка
export const childSchema = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(50, 'Имя слишком длинное'),
    birth_date: z.string().min(1, 'Дата рождения обязательна'),
    gender: z.enum(['male', 'female'], { message: 'Выберите пол' })
});

// Схема питания
export const feedingSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    foodType: z.string().min(1, 'Выберите продукт'),
    reaction: z.string().default('normal'),
    notes: z.string().max(500, 'Заметки не могут быть длиннее 500 символов').optional()
});

// Схема здоровья
export const healthSchema = z.object({
    date: z.string().min(1, 'Дата обязательна'),
    type: z.string().min(1, 'Выберите тип записи'),
    value: z.union([z.string(), z.number()]).optional(),
    notes: z.string().max(500, 'Заметки не могут быть длиннее 500 символов').optional()
});