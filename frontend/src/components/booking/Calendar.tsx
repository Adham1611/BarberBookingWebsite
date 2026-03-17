import { useMemo } from 'react';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function Calendar({ selectedDate, onSelectDate }: Props) {
  const dates = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }).map((_, idx) => {
      const date = new Date(now);
      date.setDate(now.getDate() + idx);
      return {
        key: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
      };
    });
  }, []);

  return (
    <div className="calendar-grid">
      {dates.map((d) => (
        <button
          key={d.key}
          className={`date-pill ${selectedDate === d.key ? 'active' : ''}`}
          onClick={() => onSelectDate(d.key)}
        >
          <span>{d.day}</span>
          <strong>{d.date}</strong>
        </button>
      ))}
    </div>
  );
}
