export function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/90 backdrop-blur px-4 py-2 shadow-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}