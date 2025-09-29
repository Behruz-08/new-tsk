'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QUERY_KEYS } from '@/constants';
import { formsService } from '@/features/forms/services/forms.service';
import { useValidatedForm, useFormSubmission } from '@/hooks/useForm';
import { formatFileSize } from '@/lib/utils/utils';
import { postFormSchema, type PostFormData } from '@/lib/utils/validations';
import type { Post } from '@/types';

import styles from './PostForm.module.scss';

interface PostFormProps {
  onSubmit?: (data: PostFormData) => void;
  onSuccess?: (post: Post) => void;
  className?: string;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, onSuccess, className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useValidatedForm(postFormSchema, {
    title: '',
    body: '',
    file: undefined,
  });

  const { isSubmitting, submitError, submitSuccess, submit, resetSubmission } = useFormSubmission();
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedFile = watch('file');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
    }
  };

  const handleFormSubmit = async (data: PostFormData) => {
    try {
      if (onSubmit) {
        onSubmit(data);
        return;
      }

      const result = await submit(async () => {
        const postData = {
          title: data.title,
          body: data.body,
          userId: 1,
        };

        return await formsService.createPostWithFile(postData, data.file);
      }, null);

      if (result && typeof result === 'object' && result !== null && 'post' in result) {
        toast.success('Пост успешно создан!');
        reset();
        resetSubmission();
        onSuccess?.(result.post as Post);

        queryClient.setQueryData(QUERY_KEYS.POSTS.LISTS(), (oldData: Post[] | undefined) => {
          return oldData ? [result.post as Post, ...oldData] : [result.post as Post];
        });
        router.push('/csr');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className={styles.form}>
        <Input
          {...register('title')}
          label="Заголовок поста"
          placeholder="Введите заголовок поста"
          leftIcon={<Edit3 size={18} />}
          error={errors.title?.message}
          required
          disabled={isSubmitting}
        />

        <div className={styles.bodyField}>
          <label htmlFor="body" className={styles.label}>
            Содержимое поста
            <span className={styles.required}>*</span>
          </label>
          <textarea
            {...register('body')}
            id="body"
            placeholder="Введите содержимое поста"
            className={`${styles.textarea} ${errors.body ? styles.textareaError : ''}`}
            rows={6}
            disabled={isSubmitting}
          />
          {errors.body && (
            <p className={styles.errorText} role="alert">
              {errors.body.message}
            </p>
          )}
        </div>

        <div className={styles.fileField}>
          <Input
            type="file"
            label="Прикрепить файл"
            onChange={handleFileChange}
            leftIcon={<Upload size={18} />}
            error={errors.file?.message}
            disabled={isSubmitting}
            accept="image/*,.pdf,.txt"
          />

          {selectedFile && (
            <div className={styles.fileInfo}>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
              </div>
              <div className={styles.fileType}>{selectedFile.type || 'Неизвестный тип'}</div>
            </div>
          )}
        </div>

        {submitError && (
          <div className={styles.submitError} role="alert">
            <FileText size={16} />
            <span>{submitError}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          leftIcon={!isSubmitting && <FileText size={18} />}
        >
          {isSubmitting ? 'Создание поста...' : 'Создать пост'}
        </Button>

        {submitSuccess && (
          <div className={styles.successMessage}>
            <FileText size={16} />
            <span>Пост успешно создан!</span>
          </div>
        )}
      </div>
    </form>
  );
};
