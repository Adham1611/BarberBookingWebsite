import type { StatCard } from '../../types';

type Props = {
  item: StatCard;
};

export default function AnalyticsCard({ item }: Props) {
  return (
    <article className="card analytics-card">
      <p>{item.label}</p>
      <h3>{item.value}</h3>
      <span>{item.delta}</span>
    </article>
  );
}
