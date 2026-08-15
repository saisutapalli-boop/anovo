export default function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
}) {
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-brand-green' : 'bg-[#dddddd]'
      }`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  if (!label) return toggle

  return (
    <label className="flex w-full cursor-pointer items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-[#383838]">{label}</span>
        {description && <span className="text-xs text-[#666666]">{description}</span>}
      </div>
      {toggle}
    </label>
  )
}
