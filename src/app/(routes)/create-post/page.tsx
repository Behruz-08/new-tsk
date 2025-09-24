/**
 * Create Post Page - Client-Side Rendering with form
 * Страница для создания новых постов
 */

"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PostForm } from "@/components/forms/PostForm";
import { Post } from "@/types";
import { Plus, ArrowLeft, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

export default function CreatePostPage() {
  const [createdPost, setCreatedPost] = useState<Post | null>(null);
  const router = useRouter();

  const handlePostCreated = (post: Post) => {
    setCreatedPost(post);

    // Redirect to posts list after a short delay
    setTimeout(() => {
      router.push("/ssr");
    }, 2000);
  };

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>
                  <Plus size={32} />
                  Создать новый пост
                </h1>
                <p className={styles.description}>
                  Создайте новый пост с заголовком, содержимым и прикрепленным
                  файлом. Пост будет добавлен в общий список и отображен на всех
                  страницах.
                </p>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>
                    <FileText size={16} />
                  </span>
                  Создание поста
                </div>
              </div>

              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft size={18} />
                  На главную
                </Link>
              </Button>
            </div>
          </div>

          {/* Create Post Section */}
          <Card className={styles.createSection}>
            <div className={styles.createContent}>
              <div className={styles.createInfo}>
                <h2 className={styles.createTitle}>
                  <Upload size={24} />
                  Форма создания поста
                </h2>
                <p className={styles.createDescription}>
                  Заполните форму ниже для создания нового поста. Все поля
                  обязательны для заполнения.
                </p>

                <div className={styles.features}>
                  <div className={styles.feature}>
                    <FileText size={16} />
                    <span>Заголовок и содержимое</span>
                  </div>
                  <div className={styles.feature}>
                    <Upload size={16} />
                    <span>Прикрепление файла</span>
                  </div>
                  <div className={styles.feature}>
                    <Plus size={16} />
                    <span>Мгновенное добавление</span>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <PostForm
                  onSuccess={handlePostCreated}
                  className={styles.postForm}
                />
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className={styles.instructions}>
            <h3>Инструкции по созданию поста</h3>
            <div className={styles.instructionSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>Заголовок</h4>
                  <p>
                    Введите краткий и информативный заголовок поста (5-100
                    символов)
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>Содержимое</h4>
                  <p>Опишите детали поста (10-1000 символов)</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>Файл (опционально)</h4>
                  <p>Прикрепите изображение, PDF или текстовый файл (до 5MB)</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h4>Отправка</h4>
                  <p>
                    Нажмите &quot;Создать пост&quot; для добавления в общий
                    список
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Success Message */}
          {createdPost && (
            <Card className={styles.successCard}>
              <div className={styles.successContent}>
                <div className={styles.successIcon}>
                  <Plus size={24} />
                </div>
                <div className={styles.successText}>
                  <h3>Пост успешно создан!</h3>
                  <p>
                    Ваш пост &quot;{createdPost.title}&quot; был добавлен в
                    список. Перенаправление на страницу с постами...
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
