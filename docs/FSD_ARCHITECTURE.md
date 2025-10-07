# Feature-Sliced Design Architecture Guide

Этот документ описывает архитектурные решения и принципы, используемые в проекте на основе **Feature-Sliced Design (FSD)**.

## 🎯 Философия FSD

Feature-Sliced Design - это архитектурная методология, основанная на принципах:

- **🧩 Модульность** - четкое разделение ответственности между компонентами
- **🔄 Переиспользование** - максимальное переиспользование кода между фичами
- **📈 Масштабируемость** - легкое добавление новых функций без рефакторинга
- **🤝 Командная работа** - понятная структура для всех разработчиков

## 📊 Диаграмма зависимостей FSD

```
     ┌─────────────────────────────────────────────┐
     │                   app                       │ ← Точка входа
     └─────────────────────────────────────────────┘
                              │
     ┌─────────────────────────────────────────────┐
     │                  pages                      │ ← Страницы роутов
     └─────────────────────────────────────────────┘
                              │
     ┌─────────────────────────────────────────────┐
     │                 widgets                     │ ← Композитные компоненты
     └─────────────────────────────────────────────┘
                              │
     ┌─────────────────────────────────────────────┐
     │                features                     │ ← Бизнес-логика
     └─────────────────────────────────────────────┘
                              │
     ┌─────────────────────────────────────────────┐
     │                entities                     │ ← Бизнес-сущности
     └─────────────────────────────────────────────┘
                              │
     ┌─────────────────────────────────────────────┐
     │                 shared                      │ ← Общие ресурсы
     └─────────────────────────────────────────────┘
```

**Правило**: Импорты разрешены только "вниз" по диаграмме!

## 🗂️ Детальная структура слоев

### 1. App Layer (`src/app/`)

**Назначение**: Инициализация приложения и глобальные настройки

```
app/
├── layout.tsx              # Root Layout для Next.js
├── page.tsx                # Главная страница (перенаправляет на pages/home)
├── globals.css             # Глобальные стили (только импорт)
├── providers/
│   └── QueryProvider.tsx   # Настройка React Query
├── store/
│   ├── appStore.ts         # Zustand store
│   └── index.ts
└── api/                    # Next.js API Routes
    ├── posts/route.ts
    ├── comments/route.ts
    ├── files/route.ts
    └── submit/route.ts
```

**Принципы**:

- Только конфигурация и инициализация
- Минимум бизнес-логики
- Точка сборки всего приложения

### 2. Page Components Layer (`src/page-components/`)

**Назначение**: Компоненты страниц, соответствующие роутам
**Примечание**: Переименовано из `pages` во избежание конфликта с Next.js Pages Router

```
page-components/
├── home/
│   ├── index.ts
│   └── ui/
│       ├── HomePage.tsx
│       └── HomePage.module.scss
├── create-post/
│   └── ui/
│       ├── CreatePostPage.tsx
│       └── CreatePostPage.module.scss
└── [ssg|ssr|isr|csr]/
    └── ui/
        ├── [Page].tsx
        └── [Page].module.scss
```

**Принципы**:

- Один компонент = одна страница
- Композиция из widgets и features
- Обработка роут-специфичной логики

### 3. Widgets Layer (`src/widgets/`)

**Назначение**: Сложные композитные компоненты

```
widgets/
├── layout/
│   ├── Navigation/
│   │   ├── index.ts
│   │   ├── Navigation.tsx
│   │   └── Navigation.module.scss
│   └── MainLayout/
│       ├── index.ts
│       ├── MainLayout.tsx
│       └── MainLayout.module.scss
└── forms/
    ├── ContactForm/
    │   ├── index.ts
    │   ├── ContactForm.tsx
    │   └── ContactForm.module.scss
    └── PostForm/
        ├── index.ts
        ├── PostForm.tsx
        └── PostForm.module.scss
```

**Принципы**:

- Композиция из features и entities
- Переиспользуемые на разных страницах
- Содержат UI логику, но не бизнес-логику

### 4. Features Layer (`src/features/`)

**Назначение**: Бизнес-функциональность приложения

```
features/
├── posts/
│   ├── index.ts
│   ├── services/
│   │   └── posts.service.ts     # Бизнес-логика постов
│   └── ui/
│       └── PostCard/            # UI компонент фичи
├── posts-api/
│   ├── index.ts
│   └── api/
│       └── posts.queries.ts     # React Query хуки
├── comments/
│   ├── index.ts
│   └── services/
│       └── comments.service.ts
├── comments-api/
│   ├── index.ts
│   └── api/
│       └── comments.queries.ts
└── forms/
    ├── index.ts
    ├── model/
    │   └── validations.ts       # Схемы валидации форм
    └── services/
        └── forms.service.ts     # Логика отправки форм
```

**Принципы**:

- Одна фича = один домен/функциональность
- Может содержать services, api, ui, model
- Не зависит от других фич (кроме shared и entities)

### 5. Entities Layer (`src/entities/`)

**Назначение**: Бизнес-сущности предметной области

```
entities/
├── post/
│   ├── index.ts
│   ├── model/
│   │   ├── post.types.ts        # Типы сущности
│   │   └── post.schemas.ts      # Zod схемы
│   └── ui/
│       └── PostCard/            # UI представление сущности
├── comment/
│   ├── index.ts
│   ├── model/
│   │   ├── comment.types.ts
│   │   └── comment.schemas.ts
│   └── ui/
│       └── CommentCard/
└── user/
    ├── index.ts
    ├── model/
    │   ├── user.types.ts
    │   └── user.schemas.ts
    └── ui/
        └── UserCard/
```

**Принципы**:

- Модель данных + UI представление
- Без бизнес-логики (только типы и схемы)
- Переиспользуется в разных фичах

### 6. Shared Layer (`src/shared/`)

**Назначение**: Переиспользуемые ресурсы без бизнес-логики

```
shared/
├── ui/                          # UI Kit
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   └── ...
├── hooks/                       # Переиспользуемые хуки
│   ├── useApi.ts
│   ├── useForm.ts
│   └── useModal.ts
├── lib/                         # Утилиты
│   ├── utils.ts
│   ├── queryClient.ts
│   └── localPosts.ts
├── api/                         # Базовая конфигурация API
│   ├── client.ts
│   └── helpers.ts
├── config/                      # Конфигурация
│   ├── api.ts
│   └── env.ts
├── constants/                   # Константы
│   └── index.ts
├── schemas/                     # Общие схемы
│   └── validations.ts
└── types/                       # Общие типы
    └── api.types.ts
```

**Принципы**:

- Никаких импортов из других слоев
- Максимальная переиспользуемость
- Отсутствие бизнес-логики

### 7. Processes Layer (`src/processes/`)

**Назначение**: Сложные межфичевые процессы

```
processes/
└── form-submission/
    ├── index.ts
    └── lib/
        ├── submit-contact-form.ts
        └── create-post-with-file.ts
```

**Принципы**:

- Оркестрация нескольких фич
- Сложная бизнес-логика
- Используется редко, только для комплексных процессов

## 🔄 Потоки данных в FSD

### 1. Пользовательские действия

```
User Input → Widget → Feature → Process → API → Store → UI Update
```

### 2. Загрузка данных

```
Page Mount → Feature Hook → API Call → Cache Update → UI Render
```

### 3. Обновление состояния

```
User Action → Feature Service → Store Update → Reactive UI Update
```

## 📝 Лучшие практики

### Именование

```typescript
// Файлы и папки - PascalCase для компонентов
Button/
├── Button.tsx
├── Button.module.scss
└── index.ts

// Хуки и утилиты - camelCase
useApi.ts
formatDate.ts

// Константы - UPPER_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com'
```

### Структура компонента

```typescript
// 1. Импорты (React → библиотеки → внутренние → стили)
import React from 'react'
import { clsx } from 'clsx'

import { useApi } from '@/shared/hooks'
import { Button } from '@/shared/ui'

import styles from './ComponentName.module.scss'

// 2. Типы
interface ComponentNameProps {
  title: string
  onClick?: () => void
}

// 3. Компонент
export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onClick
}) => {
  // Логика компонента

  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  )
}
```

### Экспорты

```typescript
// index.ts - точка входа в каждой папке
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';

// Именованные экспорты предпочтительнее default
export const ComponentName = () => {
  /* */
};

// Исключение: страницы Next.js используют default export
export default function HomePage() {
  /* */
}
```

## 🚫 Антипаттерны

### ❌ Неправильно

```typescript
// Импорт "вверх" по иерархии
import { HomePage } from '@/pages/home'; // из feature

// Относительные импорты между слоями
import { Button } from '../../../shared/ui/Button';

// Бизнес-логика в shared
// shared/lib/postsLogic.ts
export const createPost = (data) => {
  /* бизнес-логика */
};

// Прямые импорты из других фич
import { postsService } from '@/features/posts'; // из features/comments
```

### ✅ Правильно

```typescript
// Абсолютные импорты
import { Button } from '@/shared/ui';
import { Post } from '@/entities/post';

// Переиспользование через shared
import { apiClient } from '@/shared/api';

// Композиция в widgets
import { PostList } from '@/features/posts';
import { CommentForm } from '@/features/comments';
```

## 🔍 Отладка архитектуры

### Проверка правильности слоя

1. **Можно ли переиспользовать в другом проекте?** → `shared`
2. **Специфично для бизнес-домена?** → `entities`
3. **Реализует конкретную функциональность?** → `features`
4. **Композиция нескольких фич?** → `widgets`
5. **Соответствует роуту?** → `pages`
6. **Глобальная конфигурация?** → `app`

### ESLint правила

Проект включает правила для контроля импортов между слоями:

```json
{
  "@typescript-eslint/no-restricted-imports": [
    "error",
    {
      "patterns": [
        {
          "group": ["@/app/*"],
          "importNames": ["*"],
          "message": "Импорты из app слоя запрещены"
        }
      ]
    }
  ]
}
```

## 📚 Полезные ресурсы

- [Официальная документация FSD](https://feature-sliced.design/)
- [Примеры FSD проектов](https://github.com/feature-sliced/examples)
- [Лучшие практики FSD](https://feature-sliced.design/docs/guides/tech/with-react)

---

**Помните**: FSD - это не догма, а инструмент для создания поддерживаемых приложений! 🚀
