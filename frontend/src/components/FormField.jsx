import React from 'react';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows,
  as = 'input',
  children,
  className = '',
  ...props
}) => {
  const Component = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <Component
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={as === 'textarea' ? 'form-textarea' : as === 'select' ? 'form-select' : 'form-input'}
        {...props}
      >
        {children}
      </Component>

      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
