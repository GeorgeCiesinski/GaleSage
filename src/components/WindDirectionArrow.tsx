type WindDirectionArrowProps = {
  degrees: number;
  className?: string;
};

export default function WindDirectionArrow({ degrees, className }: WindDirectionArrowProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      style={{ transform: `rotate(${degrees + 180}deg)` }}
    >
      <path
        d="M12 4 L12 20 M12 4 L8 10 M12 4 L16 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
