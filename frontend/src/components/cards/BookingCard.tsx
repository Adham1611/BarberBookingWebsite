type Props = {
  title: string;
  value: string;
};

export default function BookingCard({ title, value }: Props) {
  return (
    <article className="card booking-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </article>
  );
}
