/**
 * Application configuration
 * Централизованная конфигурация приложения
 */

export const APP_CONFIG = {
  name: 'Next.js Test Task',
  version: '1.0.0',
  description: 'Тестовое задание для демонстрации навыков разработки на Next.js',
  author: 'Frontend Developer',

  // Environment configuration
  environment: process.env.NODE_ENV || 'development',

  // API configuration
  api: {
    jsonPlaceholder: {
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      retries: 3,
    },
    local: {
      baseUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      retries: 3,
    },
  },

  // Routes configuration
  routes: [
    {
      path: '/',
      name: 'Главная',
      description: 'Главная страница с навигацией по всем типам рендеринга',
      renderType: 'SSG' as const,
    },
    {
      path: '/ssg',
      name: 'SSG',
      description: 'Static Site Generation - статическая генерация сайта',
      renderType: 'SSG' as const,
    },
    {
      path: '/ssr',
      name: 'SSR',
      description: 'Server-Side Rendering - серверный рендеринг',
      renderType: 'SSR' as const,
    },
    {
      path: '/isr',
      name: 'ISR',
      description: 'Incremental Static Regeneration - инкрементальная статическая регенерация',
      renderType: 'ISR' as const,
    },
    {
      path: '/csr',
      name: 'CSR',
      description: 'Client-Side Rendering - клиентский рендеринг',
      renderType: 'CSR' as const,
    },
  ],

  // Feature flags
  features: {
    enableFileUpload: true,
    enableRealTimeUpdates: true,
    enableAnimations: true,
    enableDarkTheme: true,
    enableAPIErrorRetry: true,
  },

  // UI configuration
  ui: {
    theme: 'dark',
    animations: {
      duration: {
        fast: 150,
        normal: 250,
        slow: 350,
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  // Form configuration
  forms: {
    contactForm: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedFileTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/json',
        'application/octet-stream',
      ],
      validation: {
        name: {
          minLength: 2,
          maxLength: 50,
          pattern: /^[а-яА-Яa-zA-Z\s]+$/,
        },
        email: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          minLength: 5,
        },
        message: {
          minLength: 10,
          maxLength: 500,
        },
      },
    },
  },

  // Performance configuration
  performance: {
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enablePrefetching: true,
    enableServiceWorker: false,
  },
} as const;

// Type inference for better type safety
export type AppConfig = typeof APP_CONFIG;
export type RouteConfig = (typeof APP_CONFIG.routes)[0];
export type FeatureFlag = keyof typeof APP_CONFIG.features;
