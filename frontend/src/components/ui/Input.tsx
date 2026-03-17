import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, id, className = '', ...props }: Props) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label htmlFor={inputId} className="input-group">
      <span>{label}</span>
      <input id={inputId} className={`input ${className}`.trim()} {...props} />
    </label>
  );
}
