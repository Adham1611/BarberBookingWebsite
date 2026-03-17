import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    full?: boolean;
  }
>;

export default function Button({ children, variant = 'primary', full, className = '', ...props }: Props) {
  const classes = `btn btn-${variant} ${full ? 'btn-full' : ''} ${className}`.trim();
  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
