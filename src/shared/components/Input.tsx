import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const wrapperClasses = [
      'input-wrapper',
      fullWidth && 'input-wrapper--full-width',
      disabled && 'input-wrapper--disabled'
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'input',
      hasError && 'input--error',
      leftIcon && 'input--has-left-icon',
      rightIcon && 'input--has-right-icon',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-label__required">*</span>}
          </label>
        )}
        <div className="input-container">
          {leftIcon && <span className="input-icon input-icon--left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="input-message input-message--error">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="input-message input-message--helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
