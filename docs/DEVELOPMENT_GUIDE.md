# Руководство по разработке

Краткое руководство для разработчиков, работающих с проектом на базе **Feature-Sliced Design**.

## 🚀 Быстрый старт

### 1. Настройка окружения

```bash
# Клонирование и установка
git clone <repository-url>
cd test-task
npm install

# Настройка переменных окружения
cp env.example .env.local
# Заполните необходимые переменные

# Запуск разработки
npm run dev
```

### 2. Структура команд

```bash
# Разработка
npm run dev              # Запуск с hot reload
npm run build            # Сборка продакшена
npm run start            # Запуск продакшен сервера

# Проверка качества
npm run lint             # Проверка ESLint
npm run type-check       # Проверка TypeScript
npm run format           # Форматирование кода
npm run pre-deploy       # Полная проверка
```

## 📁 Где размещать код

### Новый UI компонент

```
🎯 Цель: Создать переиспользуемую кнопку

📍 Место: src/shared/ui/Button/
└── Button.tsx
└── Button.module.scss
└── index.ts
```

### Новая бизнес-сущность

```
🎯 Цель: Добавить сущность "Товар"

📍 Место: src/entities/product/
├── index.ts
├── model/
│   ├── product.types.ts
│   └── product.schemas.ts
└── ui/
    └── ProductCard/
```

### Новая функциональность

```
🎯 Цель: Добавить корзину покупок

📍 Место: src/features/shopping-cart/
├── index.ts
├── model/
│   └── cart.types.ts
├── services/
│   └── cart.service.ts
├── api/
│   └── cart.queries.ts
└── ui/
    ├── CartButton/
    └── CartModal/
```

### Новая страница

```
🎯 Цель: Страница профиля пользователя

📍 Место:
src/page-components/profile/    # FSD компонент
├── index.ts
└── ui/
    ├── ProfilePage.tsx
    └── ProfilePage.module.scss

src/app/profile/page.tsx        # Next.js роут
└── import ProfilePage from '@/page-components/profile'
```

### Сложная форма

```
🎯 Цель: Форма оформления заказа

📍 Место: src/widgets/forms/OrderForm/
└── OrderForm.tsx               # Использует фичи
└── OrderForm.module.scss       # и сущности
└── index.ts
```

## 🔄 Типичные сценарии разработки

### Сценарий 1: Добавление новой API интеграции

```typescript
// 1. Определяем типы в entities
// src/entities/order/model/order.types.ts
export interface Order {
  id: string;
  total: number;
  items: OrderItem[];
}

// 2. Создаем API клиент в features
// src/features/orders-api/api/orders.queries.ts
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.getAll(),
  });
};

// 3. Создаем сервис в features
// src/features/orders/services/orders.service.ts
export const ordersService = {
  async getAll(): Promise<Order[]> {
    return apiClient.get('/orders');
  },
};

// 4. Используем в компонентах
// src/page-components/orders/ui/OrdersPage.tsx
const { data: orders } = useOrdersQuery();
```

### Сценарий 2: Создание переиспользуемого хука

```typescript
// 1. Размещаем в shared/hooks
// src/shared/hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // Логика хука
};

// 2. Экспортируем из shared
// src/shared/hooks/index.ts
export { useLocalStorage } from './useLocalStorage';

// 3. Используем где угодно
import { useLocalStorage } from '@/shared/hooks';
```

### Сценарий 3: Добавление валидации формы

```typescript
// 1. Схема в entities (если связана с сущностью)
// src/entities/user/model/user.schemas.ts
export const userProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// 2. Или в features (если специфична для фичи)
// src/features/auth/model/validations.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// 3. Используем в формах
const { control, handleSubmit } = useForm({
  resolver: zodResolver(userProfileSchema),
});
```

## 🛡️ Правила импортов

### ✅ Правильные импорты

```typescript
// Абсолютные пути через алиасы
import { Button } from '@/shared/ui';
import { Post } from '@/entities/post';
import { usePostsQuery } from '@/features/posts-api';

// Относительные только внутри одной папки
import { PostCard } from './PostCard';
import { formatDate } from '../lib/utils';
```

### ❌ Неправильные импорты

```typescript
// Относительные пути между слоями
import { Button } from '../../../shared/ui/Button';

// Импорты "вверх" по иерархии
import { HomePage } from '@/pages/home'; // из features

// Прямые импорты между фичами
import { postsService } from '@/features/posts'; // из features/comments
```

## 🎨 Соглашения по стилям

### CSS Modules

```scss
// ComponentName.module.scss
.container {
  display: flex;
  flex-direction: column;
}

.title {
  @include font-heading();
  color: var(--color-primary);
}

// Используем БЭМ подход внутри модуля
.button {
  &__icon {
    margin-right: 8px;
  }

  &--primary {
    background: var(--color-primary);
  }
}
```

### CSS Variables

```scss
// Используем CSS переменные для динамических значений
.card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}
```

### Responsive Design

```scss
// Используем миксины для адаптивности
.container {
  @include respond-to(mobile) {
    padding: 16px;
  }

  @include respond-to(desktop) {
    padding: 32px;
  }
}
```

## 🧪 Тестирование (готовность к расширению)

### Структура тестов

```
src/shared/ui/Button/
├── Button.tsx
├── Button.module.scss
├── Button.test.tsx          # Unit тесты
└── index.ts

src/features/posts/
├── services/
│   ├── posts.service.ts
│   └── posts.service.test.ts # Service тесты
└── api/
    ├── posts.queries.ts
    └── posts.queries.test.ts  # Hook тесты
```

### Примеры тестов

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})

// posts.service.test.ts
import { postsService } from './posts.service'

describe('postsService', () => {
  it('fetches posts', async () => {
    const posts = await postsService.getAll()
    expect(posts).toHaveLength(10)
  })
})
```

## 🔧 Отладка и инструменты

### React DevTools

- Установите расширение React Developer Tools
- Используйте для отладки состояния компонентов

### React Query DevTools

```typescript
// Уже настроены в app/providers/QueryProvider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

### Redux DevTools (для Zustand)

```typescript
// Настроены в app/store/appStore.ts
import { devtools } from 'zustand/middleware';
```

### VS Code Extensions

Рекомендуемые расширения:

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

## 📋 Чек-лист перед коммитом

```bash
# Автоматически запускается pre-commit хук, но можно проверить вручную:

✅ npm run type-check     # Проверка типов
✅ npm run lint           # Проверка ESLint
✅ npm run format         # Форматирование
✅ npm run build          # Сборка без ошибок

# Или одной командой:
✅ npm run pre-deploy
```

## 🤝 Code Review Guidelines

### При создании PR проверяйте:

- [ ] Правильное размещение кода по слоям FSD
- [ ] Использование абсолютных импортов
- [ ] Соблюдение правил импортов между слоями
- [ ] Наличие типов TypeScript
- [ ] Покрытие тестами (при наличии)
- [ ] Соответствие соглашениям по именованию

### Размер PR:

- **Идеально**: < 400 строк изменений
- **Хорошо**: 400-800 строк
- **Требует разбивки**: > 800 строк

## 🆘 Часто задаваемые вопросы

### В какой слой поместить код?

1. **Переиспользуется везде** → `shared`
2. **Бизнес-сущность** → `entities`
3. **Конкретная функциональность** → `features`
4. **Композиция функций** → `widgets`
5. **Соответствует роуту** → `pages`
6. **Глобальная настройка** → `app`

### Как обращаться между фичами?

- **Напрямую** - нельзя
- **Через shared** - можно
- **Через processes** - для сложных случаев
- **Через widgets/pages** - композиция

### Где размещать общие типы?

- **Типы API** → `shared/types`
- **Типы сущностей** → `entities/*/model`
- **Типы фич** → `features/*/model`

---

**Удачной разработки!** 🚀

При вопросах обращайтесь к [FSD_ARCHITECTURE.md](./FSD_ARCHITECTURE.md) для детального понимания архитектуры.
