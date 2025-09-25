/**
 * Form-related type definitions
 */

/**
 * Represents the data structure for the contact form.
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  file: File;
}

/**
 * Represents the data structure for creating a new post form.
 */
export interface CreatePostFormData {
  title: string;
  body: string;
  file: File;
}

/**
 * Props for a generic form field component.
 */
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Represents an error associated with a specific form field.
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Represents the overall state of a form.
 * @template T The type of the form data.
 */
export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}
