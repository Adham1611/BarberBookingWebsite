import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

export default function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
