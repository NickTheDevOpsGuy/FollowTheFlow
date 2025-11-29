type ControlsProps = {
  label: string;
  onStart: () => void;
};

export function Controls({ label, onStart }: ControlsProps) {
  return (
    <div className='controls'>
      <button onClick={onStart}>{label}</button>
    </div>
  );
}
