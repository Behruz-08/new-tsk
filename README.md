# Next.js 15 + FSD Architecture

Проект, демонстрирующий современную архитектуру фронтенд-приложения с использованием **Feature-Sliced Design (FSD)** и передовых технологий React экосистемы.

## 🏗️ Архитектура: Feature-Sliced Design (FSD)

Проект полностью соответствует методологии **Feature-Sliced Design** - современному подходу к архитектуре фронтенд-приложений, обеспечивающему масштабируемость, поддерживаемость и модульность.

### 📁 Структура проекта по слоям FSD

```
src/
├── app/                    # 🚀 Конфигурация приложения
│   ├── layout.tsx         # Корневой лейаут
│   ├── page.tsx           # Главная страница (роутинг)
│   ├── providers/         # Провайдеры (React Query, etc.)
│   ├── store/             # Глобальное состояние (Zustand)
│   └── api/               # API маршруты Next.js
│
├── page-components/        # 📄 Страничные компоненты
│   ├── home/              # Главная страница
│   ├── create-post/       # Создание поста
│   ├── ssg/               # SSG демонстрация
│   ├── ssr/               # SSR демонстрация
│   ├── isr/               # ISR демонстрация
│   └── csr/               # CSR демонстрация
│
├── widgets/               # 🧩 Композитные компоненты
│   ├── layout/            # Компоненты лейаута
│   │   ├── Navigation/    # Навигация
│   │   └── MainLayout/    # Основной лейаут
│   └── forms/             # Формы
│       ├── ContactForm/   # Форма обратной связи
│       └── PostForm/      # Форма создания поста
│
├── features/              # ⚙️ Бизнес-логика
│   ├── posts/             # Функциональность постов
│   ├── comments/          # Функциональность комментариев
│   ├── posts-api/         # API для постов (React Query)
│   ├── comments-api/      # API для комментариев
│   └── forms/             # Логика форм
│
├── entities/              # 📦 Бизнес-сущности
│   ├── post/              # Сущность "Пост"
│   ├── comment/           # Сущность "Комментарий"
│   └── user/              # Сущность "Пользователь"
│
├── shared/                # 🔧 Переиспользуемые ресурсы
│   ├── ui/                # UI Kit компоненты
│   ├── hooks/             # Переиспользуемые хуки
│   ├── lib/               # Утилиты и хелперы
│   ├── api/               # Базовая конфигурация API
│   ├── config/            # Конфигурация
│   ├── constants/         # Константы
│   ├── schemas/           # Схемы валидации
│   └── types/             # Общие типы
│
├── processes/             # 🔄 Сложные бизнес-процессы
│   └── form-submission/   # Процессы отправки форм
│
└── styles/                # 🎨 Глобальные стили
    ├── globals.scss       # Глобальные стили
    ├── variables.scss     # SCSS переменные
    ├── mixins.scss        # SCSS миксины
    └── components/        # Стили компонентов
```

## 🎯 Описание слоев FSD

### 1. **App Layer** (`app/`)

- **Назначение**: Конфигурация и инициализация приложения
- **Содержит**: Провайдеры, роуты Next.js, глобальные настройки
- **Правило**: Может импортировать из любых слоев

### 2. **Page Components Layer** (`page-components/`)

- **Назначение**: Страничные компоненты, соответствующие роутам
- **Содержит**: Компоненты страниц и их логику
- **Правило**: Может импортировать: `widgets`, `features`, `entities`, `shared`, `processes`
- **Примечание**: Переименовано из `pages` во избежание конфликта с Next.js Pages Router

### 3. **Widgets Layer** (`widgets/`)

- **Назначение**: Композитные UI компоненты, используемые на страницах
- **Содержит**: Сложные компоненты (формы, навигация, лейауты)
- **Правило**: Может импортировать: `features`, `entities`, `shared`

### 4. **Features Layer** (`features/`)

- **Назначение**: Бизнес-логика и функциональности приложения
- **Содержит**: Логику постов, комментариев, API запросы
- **Правило**: Может импортировать: `entities`, `shared`

### 5. **Entities Layer** (`entities/`)

- **Назначение**: Бизнес-сущности предметной области
- **Содержит**: Модели данных, типы, схемы, UI компоненты сущностей
- **Правило**: Может импортировать: `shared`

### 6. **Shared Layer** (`shared/`)

- **Назначение**: Переиспользуемые ресурсы без привязки к бизнес-логике
- **Содержит**: UI Kit, утилиты, хуки, константы
- **Правило**: Не может импортировать из других слоев

### 7. **Processes Layer** (`processes/`)

- **Назначение**: Сложные межфичевые бизнес-процессы
- **Содержит**: Процессы, требующие взаимодействия нескольких features
- **Правило**: Может импортировать: `features`, `entities`, `shared`

## 🛡️ Правила импортов FSD

### ✅ Разрешенные импорты:

```typescript
// Абсолютные импорты через алиасы
import { Button } from '@/shared/ui';
import { PostCard } from '@/entities/post';
import { HomePage } from '@/page-components/home';

// Импорты внутри слоя
import { PostService } from './services/posts.service';
```

### ❌ Запрещенные импорты:

```typescript
// Относительные импорты между слоями
import { Button } from '../../../shared/ui/Button';

// Импорты "вверх" по иерархии
import { HomePage } from '@/page-components/home'; // из features
import { PostsFeature } from '@/features/posts'; // из entities
```

## 🚀 Технологический стек

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **File Upload**: Vercel Blob
- **Code Quality**: ESLint + Prettier + Husky

## 📋 Доступные скрипты

```bash
# Разработка
npm run dev              # Запуск dev сервера с Turbopack
npm run build            # Сборка для продакшена
npm run start            # Запуск продакшен сервера

# Качество кода
npm run lint             # Проверка ESLint
npm run lint:fix         # Исправление ESLint ошибок
npm run type-check       # Проверка типов TypeScript
npm run format           # Форматирование Prettier

# Комплексная проверка
npm run pre-deploy       # Полная проверка перед деплоем
```

## 🛠️ Начало работы

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

```bash
cp env.example .env.local
# Заполните необходимые переменные в .env.local
```

### 3. Запуск разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 🎨 Особенности реализации

### Стратегии рендеринга Next.js

- **SSR** (`/ssr`) - Server-Side Rendering для динамического контента
- **SSG** (`/ssg`) - Static Site Generation для статичных страниц
- **ISR** (`/isr`) - Incremental Static Regeneration для обновления статики
- **CSR** (`/csr`) - Client-Side Rendering для интерактивных интерфейсов

### Управление состоянием

- **React Query** - серверное состояние, кеширование, синхронизация
- **Zustand** - глобальное клиентское состояние
- **React Hook Form** - состояние форм с валидацией

### Стилизация

- **SCSS Modules** для изоляции стилей компонентов
- **CSS Variables** для динамического управления темой
- **Responsive Design** с миксинами для адаптивности

## 📚 Соглашения по разработке

### Именование файлов

```
ComponentName/
├── index.ts              # Точка входа
├── ComponentName.tsx     # Основной компонент
├── ComponentName.module.scss # Стили
└── ComponentName.test.ts # Тесты (при наличии)
```

### Структура компонента

```typescript
// Импорты в порядке: React → библиотеки → внутренние
import React from 'react';
import { SomeLibrary } from 'some-library';

import { SomeEntity } from '@/entities/some-entity';
import { SomeSharedComponent } from '@/shared/ui';

import styles from './ComponentName.module.scss';

// Типы props
interface ComponentNameProps {
  // props definition
}

// Экспорт компонента
export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  // component logic
};
```

### Организация API

```typescript
// features/posts/api/posts.queries.ts
export const usePostsQuery = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: postsService.getAll,
  });

// entities/post/model/post.types.ts
export interface Post {
  id: number;
  title: string;
  body: string;
}
```

## 🔧 TypeScript конфигурация

Проект использует умную конфигурацию TypeScript:

- **В разработке** - полная проверка типов
- **В продакшене** - игнорирование внутренних ошибок Next.js
- **В CI/CD** - отдельная команда `type-check` для проверки

## 📦 Деплой

Перед деплоем выполните полную проверку:

```bash
npm run pre-deploy
```

Эта команда выполнит:

1. Проверку типов TypeScript
2. Проверку ESLint
3. Сборку проекта

## 🤝 Вклад в проект

При добавлении новой функциональности следуйте принципам FSD:

1. Определите подходящий слой для новой логики
2. Соблюдайте правила импортов между слоями
3. Используйте абсолютные импорты через алиасы
4. Следуйте соглашениям по именованию и структуре

---

**Feature-Sliced Design** делает проект масштабируемым, понятным и легким в поддержке! 🚀
