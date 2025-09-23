/**
 * Contact form component with validation and file upload
 */

"use client";

import React from "react";
import { useValidatedForm } from "@/hooks/useForm";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFormSubmission } from "@/hooks/useForm";
import { formApi } from "@/lib/api";
import { toast } from "sonner";
import { Upload, User, Mail, MessageSquare } from "lucide-react";
import styles from "./ContactForm.module.scss";

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  onSuccess?: () => void;
  className?: string;
}

/**
 * Contact form with text and file inputs, validation, and submission
 */
export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  onSuccess,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useValidatedForm(contactFormSchema, {
    name: "",
    email: "",
    message: "",
    file: undefined,
  });

  const { isSubmitting, submitError, submitSuccess, submit, resetSubmission } =
    useFormSubmission();

  // Watch file input for display purposes
  const selectedFile = watch("file");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(data);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("file", data.file);

      // Submit to API
      const result = await submit(
        (data: unknown) => formApi.submitContactForm(data as FormData),
        formData,
      );

      if (result) {
        toast.success("Форма успешно отправлена!");
        reset();
        resetSubmission();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className={styles.form}>
        {/* Name Field */}
        <Input
          {...register("name")}
          label="Имя"
          placeholder="Введите ваше имя"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          required
          disabled={isSubmitting}
        />

        {/* Email Field */}
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder="Введите ваш email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          required
          disabled={isSubmitting}
        />

        {/* Message Field */}
        <div className={styles.messageField}>
          <label htmlFor="message" className={styles.label}>
            Сообщение
            <span className={styles.required}>*</span>
          </label>
          <textarea
            {...register("message")}
            id="message"
            placeholder="Введите ваше сообщение"
            className={`${styles.textarea} ${
              errors.message ? styles.textareaError : ""
            }`}
            rows={4}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className={styles.errorText} role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* File Upload Field */}
        <div className={styles.fileField}>
          <Input
            type="file"
            label="Файл"
            onChange={handleFileChange}
            leftIcon={<Upload size={18} />}
            error={errors.file?.message}
            required
            disabled={isSubmitting}
            accept="image/*,.pdf,.txt"
          />

          {selectedFile && (
            <div className={styles.fileInfo}>
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <span className={styles.fileSize}>
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
              <div className={styles.fileType}>
                {selectedFile.type || "Неизвестный тип"}
              </div>
            </div>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className={styles.submitError} role="alert">
            <MessageSquare size={16} />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          leftIcon={!isSubmitting && <MessageSquare size={18} />}
        >
          {isSubmitting ? "Отправка..." : "Отправить сообщение"}
        </Button>

        {/* Success Message */}
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
