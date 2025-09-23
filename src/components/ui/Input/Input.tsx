/**
 * Reusable Input component with validation and error states
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./Input.module.scss";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  type?: "text" | "email" | "file" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Input component with validation, icons, and accessibility features
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      label,
      helperText,
      className,
      id,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div
        className={cn(styles.inputWrapper, {
          [styles["inputWrapper--full-width"]]: fullWidth,
        })}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.inputContainer}>
          {leftIcon && (
            <span className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              styles.input,
              styles[`input--${size}`],
              {
                [styles["input--error"]]: error,
                [styles["input--with-left-icon"]]: leftIcon,
                [styles["input--with-right-icon"]]: rightIcon,
              },
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(
              error ? errorId : undefined,
              helperText ? helperId : undefined,
            )}
            {...props}
          />

          {rightIcon && (
            <span className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && !error && (
          <p id={helperId} className={styles.helperText}>
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
