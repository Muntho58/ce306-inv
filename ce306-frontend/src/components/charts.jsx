export function Bars({ data, height = 180, highlight }) {
  const max = Math.max(1, ...data.map(([, v]) => v));
  const top = highlight ?? data.findIndex(([, v]) => v === max);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map(([label, value], i) => (
        <div key={label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <span className="text-xs font-medium">{value}</span>
          <div className={`w-full rounded-t-xl ${i === top ? "bg-brand" : "bg-neutral-200"}`} style={{ height: `${(value / max) * 75}%` }} />
          <span className="text-xs text-neutral-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ data, center, sub }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 70, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-48" role="img" aria-label="Category share">
      {data.map((d) => {
        const len = (d.value / total) * c;
        const el = <circle key={d.label} cx="100" cy="100" r={r} fill="none" stroke={d.color} strokeWidth="26"
          strokeDasharray={`${len - 3} ${c - len + 3}`} strokeDashoffset={-offset} transform="rotate(-90 100 100)" />;
        offset += len;
        return el;
      })}
      <text x="100" y="100" textAnchor="middle" fontSize="26" fontWeight="700">{center}</text>
      <text x="100" y="122" textAnchor="middle" fontSize="13">{sub}</text>
    </svg>
  );
}

export function GroupedBars({ data }) {
  return (
    <div className="flex h-48 items-end justify-around border-b-2 border-l-2 border-neutral-500 px-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1">
          <div className="flex h-40 items-end gap-1">
            <div className="w-5 rounded-t bg-green-500" style={{ height: `${(d.a / 105) * 100}%` }} />
            <div className="w-5 rounded-t bg-blue-500" style={{ height: `${(d.b / 105) * 100}%` }} />
          </div>
          <span className="text-xs text-neutral-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
