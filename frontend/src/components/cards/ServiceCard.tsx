import type { Service } from '../../types';
import Button from '../ui/Button';
import { useTranslation } from '../../context/LanguageContext';

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  const t = useTranslation();

  return (
    <article className="card service-card">
      <div className="service-top">
        <span className="service-icon" aria-hidden="true">
          {service.icon}
        </span>
        <span className="service-duration">{service.duration} {t('service', 'duration')}</span>
      </div>
      <h3>{service.name}</h3>
      <p className="price">${service.price}</p>
      <Button variant="secondary" full>
        {t('service', 'book')}
      </Button>
    </article>
  );
}
