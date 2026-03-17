import type { Barber } from '../../types';
import Button from '../ui/Button';
import { useTranslation } from '../../context/LanguageContext';

type Props = {
  barber: Barber;
};

export default function BarberCard({ barber }: Props) {
  const t = useTranslation();

  return (
    <article className="card barber-card">
      <img src={barber.image} alt={barber.name} loading="lazy" />
      <div className="barber-meta">
        <h3>{barber.name}</h3>
        <p>{barber.specialty}</p>
        <p className="stars">★ {barber.rating.toFixed(1)}</p>
      </div>
      <Button full>{t('service', 'book')}</Button>
    </article>
  );
}
