import './Pad.css';

type PadProps = {
  color: string;
  active: boolean;
  onClick: () => void;
};

export function Pad({ color, active, onClick }: PadProps) {
  return (
    <button
      className={`pad ${active ? 'active' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}
