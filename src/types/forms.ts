export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  file: File;
}

export interface CreatePostFormData {
  title: string;
  body: string;
  file: File;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}
