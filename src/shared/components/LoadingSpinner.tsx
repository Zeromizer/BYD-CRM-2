import React from 'react';
import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  label = 'Loading...'
}) => {
  const spinner = (
    <div className={`spinner spinner--${size} spinner--${color}`} role="status">
      <svg className="spinner__svg" viewBox="0 0 50 50">
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
      </svg>
      <span className="spinner__label">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-container spinner-container--fullscreen">
        {spinner}
      </div>
    );
  }

  return spinner;
};
