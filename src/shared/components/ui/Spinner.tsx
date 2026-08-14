export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-[#0064D2] border-t-transparent ${className}`} />
  );
}
