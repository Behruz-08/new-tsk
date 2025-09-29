'use client';

import React from 'react';
import { useValidatedForm, useFormSubmission } from '@/hooks/useForm';
import { useCacheInvalidation } from '@/hooks/useApi';
import { contactFormSchema, type ContactFormData } from '@/lib/utils/validations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formsService } from '@/lib/data/services';
import { toast } from 'sonner';
import { Upload, User, Mail, MessageSquare } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/utils';
import styles from './ContactForm.module.scss';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  onSuccess?: () => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onSuccess, className }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useValidatedForm(contactFormSchema, {
    name: '',
    email: '',
    message: '',
    file: undefined,
  });

  const { isSubmitting, submitError, submitSuccess, submit, resetSubmission } = useFormSubmission();
  const { invalidatePosts } = useCacheInvalidation();

  const uploadedFileUrl = watch('file');

  const [localFile, setLocalFile] = React.useState<File | undefined>(undefined);
  const [isFileUploading, setIsFileUploading] = React.useState<boolean>(false);
  const [fileUploadError, setFileUploadError] = React.useState<string | undefined>(undefined);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setLocalFile(file);
    setFileUploadError(undefined);
    if (file) {
      setIsFileUploading(true);
      try {
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const fileResponse = await formsService.uploadFileToBlob(fileFormData);
        if (fileResponse && fileResponse.url) {
          setValue('file', fileResponse.url, { shouldValidate: true });
        } else {
          setFileUploadError('Ошибка загрузки файла: не получен URL.');
          setValue('file', undefined, { shouldValidate: true });
          setLocalFile(undefined);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setFileUploadError('Ошибка при загрузке файла.');
        setValue('file', undefined, { shouldValidate: true });
        setLocalFile(undefined);
      } finally {
        setIsFileUploading(false);
      }
    } else {
      setValue('file', undefined, { shouldValidate: true });
      setLocalFile(undefined);
    }
  };

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      console.log('ContactForm: Starting form submission', { data });

      if (onSubmit) {
        onSubmit(data);
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      if (data.file) {
        formData.append('fileUrl', data.file);
      }

      const result = await submit(
        (data: unknown) => formsService.submitContactForm(data as FormData),
        formData,
      );

      if (result) {
        console.log('ContactForm: Form submitted successfully', { result });
        toast.success('Форма успешно отправлена!');
        reset();
        resetSubmission();
        invalidatePosts();
        console.log('ContactForm: Calling onSuccess callback');
        onSuccess?.();
        setLocalFile(undefined);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className={styles.form}>
        <Input
          {...register('name')}
          label="Имя"
          placeholder="Введите ваше имя"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          required
          disabled={isSubmitting}
        />

        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="Введите ваш email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          required
          disabled={isSubmitting}
        />

        <div className={styles.messageField}>
          <label htmlFor="message" className={styles.label}>
            Сообщение
            <span className={styles.required}>*</span>
          </label>
          <textarea
            {...register('message')}
            id="message"
            placeholder="Введите ваше сообщение"
            className={`${styles.textarea} ${errors.message ? styles.textareaError : ''}`}
            rows={4}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className={styles.errorText} role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className={styles.fileField}>
          <Input
            type="file"
            label="Файл"
            onChange={handleFileChange}
            leftIcon={<Upload size={18} />}
            error={errors.file?.message}
            disabled={isSubmitting}
            accept="image/*,.pdf,.txt"
          />

          {uploadedFileUrl && (
            <div className={styles.fileInfo}>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{uploadedFileUrl.split('/').pop()}</span>
                {isFileUploading && <span className={styles.fileSize}>Загрузка...</span>}
              </div>
              <div className={styles.fileType}>
                {uploadedFileUrl.split('.').pop() || 'Неизвестный тип'}
              </div>
              {fileUploadError && <span className={styles.errorText}>{fileUploadError}</span>}
            </div>
          )}
          {localFile && !uploadedFileUrl && (
            <div className={styles.fileInfo}>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{localFile.name}</span>
                <span className={styles.fileSize}>{formatFileSize(localFile.size)}</span>
              </div>
              <div className={styles.fileType}>{localFile.type || 'Неизвестный тип'}</div>
            </div>
          )}
        </div>

        {submitError && (
          <div className={styles.submitError} role="alert">
            <MessageSquare size={16} />
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
          leftIcon={!isSubmitting && <MessageSquare size={18} />}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
        </Button>

        {submitSuccess && (
          <div className={styles.successMessage}>
            <MessageSquare size={16} />
            <span>Сообщение успешно отправлено!</span>
          </div>
        )}
      </div>
    </form>
  );
};
