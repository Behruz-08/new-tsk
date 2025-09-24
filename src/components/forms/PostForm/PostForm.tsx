/**
 * Post creation form component with validation and file upload
 */

"use client";

import React from "react";
import { useValidatedForm } from "@/hooks/useForm";
import { postFormSchema, type PostFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFormSubmission } from "@/hooks/useForm";
import { formApi } from "@/lib/api";
import { Post } from "@/types";
import { toast } from "sonner";
import { Upload, FileText, Edit3 } from "lucide-react";
import styles from "./PostForm.module.scss";

interface PostFormProps {
  onSubmit?: (data: PostFormData) => void;
  onSuccess?: (post: Post) => void;
  className?: string;
}

/**
 * Post creation form with title, body and file inputs, validation, and submission
 */
export const PostForm: React.FC<PostFormProps> = ({
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
  } = useValidatedForm(postFormSchema, {
    title: "",
    body: "",
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
  const handleFormSubmit = async (data: PostFormData) => {
    try {
      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(data);
        return;
      }

      // Submit to API using the new function
      const result = await submit(async () => {
        const postData = {
          title: data.title,
          body: data.body,
          userId: 1, // Default user ID
        };

        return await formApi.createPostWithFile(postData, data.file);
      }, null);

      if (
        result &&
        typeof result === "object" &&
        result !== null &&
        "post" in result
      ) {
        toast.success("Пост успешно создан!");
        reset();
        resetSubmission();
        onSuccess?.(result.post as Post);
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
        {/* Title Field */}
        <Input
          {...register("title")}
          label="Заголовок поста"
          placeholder="Введите заголовок поста"
          leftIcon={<Edit3 size={18} />}
          error={errors.title?.message}
          required
          disabled={isSubmitting}
        />

        {/* Body Field */}
        <div className={styles.bodyField}>
          <label htmlFor="body" className={styles.label}>
            Содержимое поста
            <span className={styles.required}>*</span>
          </label>
          <textarea
            {...register("body")}
            id="body"
            placeholder="Введите содержимое поста"
            className={`${styles.textarea} ${
              errors.body ? styles.textareaError : ""
            }`}
            rows={6}
            disabled={isSubmitting}
          />
          {errors.body && (
            <p className={styles.errorText} role="alert">
              {errors.body.message}
            </p>
          )}
        </div>

        {/* File Upload Field */}
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
            <FileText size={16} />
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
          leftIcon={!isSubmitting && <FileText size={18} />}
        >
          {isSubmitting ? "Создание поста..." : "Создать пост"}
        </Button>

        {/* Success Message */}
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
